import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../src/supabase/supabase-config';

export interface Notification {
    id: string;
    title: string;
    body: string;
    icon: string;
    type: 'general' | 'order' | 'offer' | 'points' | 'system' | 'alert';
    target: 'all' | 'user';
    target_user_id?: string;
    image_url?: string;
    action_url?: string;
    is_active: boolean;
    created_at: string;
    is_read?: boolean;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const channelRef = useRef<any>(null);
    const toastCallbackRef = useRef<((n: Notification) => void) | null>(null);

    // Fetch current user
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id || null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            setUserId(session?.user?.id || null);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Fetch notifications & read status
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            // Get all active notifications targeted to 'all' or this user
            let query = supabase
                .from('notifications')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(50);

            const { data: notifData, error } = await query;
            if (error) throw error;

            // Filter: show 'all' notifications + notifications for this specific user
            const filtered = (notifData || []).filter((n: any) => {
                if (n.target === 'all') return true;
                if (n.target === 'user' && user && n.target_user_id === user.id) return true;
                return false;
            });

            // Get reads if user is logged in
            let readIds: string[] = [];
            if (user) {
                const { data: reads } = await supabase
                    .from('notification_reads')
                    .select('notification_id')
                    .eq('user_id', user.id);
                readIds = (reads || []).map((r: any) => r.notification_id);
            }

            const enriched = filtered.map((n: any) => ({
                ...n,
                is_read: readIds.includes(n.id),
            }));

            setNotifications(enriched);
            setUnreadCount(enriched.filter((n: Notification) => !n.is_read).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications, userId]);

    // Realtime subscription
    useEffect(() => {
        // Clean up old channel
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current);
        }

        channelRef.current = supabase
            .channel('notifications-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                async (payload) => {
                    const newNotif = payload.new as Notification;
                    // Check if it targets this user
                    const { data: { user } } = await supabase.auth.getUser();
                    const isForMe =
                        newNotif.target === 'all' ||
                        (newNotif.target === 'user' && user && newNotif.target_user_id === user.id);

                    if (isForMe && newNotif.is_active) {
                        const enriched = { ...newNotif, is_read: false };
                        setNotifications(prev => [enriched, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        // Fire toast callback if set
                        if (toastCallbackRef.current) {
                            toastCallbackRef.current(enriched);
                        }
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'notifications' },
                () => {
                    fetchNotifications();
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'notifications' },
                (payload) => {
                    setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            )
            .subscribe();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [fetchNotifications]);

    // Mark a notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('notification_reads')
            .upsert(
                { notification_id: notificationId, user_id: user.id },
                { onConflict: 'notification_id,user_id' }
            );

        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const unread = notifications.filter(n => !n.is_read);
        if (unread.length === 0) return;

        const inserts = unread.map(n => ({
            notification_id: n.id,
            user_id: user.id,
        }));

        await supabase
            .from('notification_reads')
            .upsert(inserts, { onConflict: 'notification_id,user_id' });

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    }, [notifications]);

    // Register a callback for new notification toast
    const onNewNotification = useCallback((cb: (n: Notification) => void) => {
        toastCallbackRef.current = cb;
    }, []);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refetch: fetchNotifications,
        onNewNotification,
    };
}

// ==========================================
// Admin notification service
// ==========================================
export const notificationService = {
    async getAll() {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },

    async create(payload: {
        title: string;
        body: string;
        icon?: string;
        type?: string;
        target?: string;
        target_user_id?: string | null;
        image_url?: string;
        action_url?: string;
    }) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('notifications')
            .insert({ ...payload, created_by: user?.id })
            .select()
            .single();
        return { data, error };
    },

    async toggle(id: string, is_active: boolean) {
        const { data, error } = await supabase
            .from('notifications')
            .update({ is_active })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
        return { error };
    },

    async getUsers() {
        const { data, error } = await supabase
            .from('users')
            .select(`
                id, 
                full_name, 
                email, 
                phone_number,
                created_at,
                wallets (points_balance, balance)
            `)
            .order('created_at', { ascending: false });

        // Flatten the data for easier use in the UI
        const flattened = (data || []).map((u: any) => ({
            ...u,
            points: u.wallets?.[0]?.points_balance || 0,
            balance: u.wallets?.[0]?.balance || 0
        }));

        return { data: flattened, error };
    },
};
