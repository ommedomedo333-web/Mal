-- ==========================================
-- SETUP NOTIFICATIONS SYSTEM
-- Run this script in your Supabase SQL Editor
-- ==========================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT DEFAULT '🔔',
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'order', 'offer', 'points', 'system', 'alert')),
    target TEXT DEFAULT 'all' CHECK (target IN ('all', 'user')),
    target_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT,
    action_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Notification Reads Table (Tracks read status per user)
CREATE TABLE IF NOT EXISTS public.notification_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Notifications

-- Users can VIEW notifications if:
-- a) The notification is active AND
-- b) It targets 'all' OR targets them specifically
CREATE POLICY "Users can view relevant notifications"
    ON public.notifications FOR SELECT
    USING (
        is_active = true AND (
            target = 'all' OR
            (target = 'user' AND target_user_id = auth.uid())
        )
    );

-- Admins (or service role) can MANAGE all notifications
-- Adjust this policy based on your specific admin role logic if needed
-- Here we allow authenticated users to INSERT for demonstration, but ideally restrict to admins
CREATE POLICY "Admins can manage notifications"
    ON public.notifications FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. Create Policies for Notification Reads

-- Users can INSERT their own read status
CREATE POLICY "Users can mark as read"
    ON public.notification_reads FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can VIEW their own read status
CREATE POLICY "Users can view their reads"
    ON public.notification_reads FOR SELECT
    USING (user_id = auth.uid());

-- 6. Enable Realtime
-- This is crucial for instant notification delivery
-- You MUST run this command or enable it manually in Dashboard > Database > Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Optional: Create an index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON public.notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
