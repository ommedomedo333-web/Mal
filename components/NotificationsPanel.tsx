import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { notificationService, Notification } from '../../../hooks/useNotifications';
import toast from 'react-hot-toast';
import {
    Bell, Plus, Trash2, Eye, EyeOff, Send, Users, Globe,
    X, ChevronDown, Zap, Package, Tag, Star, AlertTriangle, Settings
} from 'lucide-react';

// ─── Type and icon maps ───────────────────────────────────────────────────────
const TYPE_OPTIONS = [
    { value: 'general', label: 'عام', icon: '📢', color: '#a3a3a3' },
    { value: 'order', label: 'طلب', icon: '📦', color: '#22c55e' },
    { value: 'offer', label: 'عرض', icon: '🔥', color: '#f97316' },
    { value: 'points', label: 'نقاط', icon: '⭐', color: '#eab308' },
    { value: 'system', label: 'نظام', icon: '⚙️', color: '#3b82f6' },
    { value: 'alert', label: 'تنبيه', icon: '🚨', color: '#ef4444' },
];

const ICON_OPTIONS = ['🔔', '📢', '🎉', '🔥', '⭐', '🎁', '📦', '💰', '🚀', '📱', '⚠️', '✅', '❌', '💡', '🛒', '🍎'];

function timeAgoFull(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ─── Send Notification Modal ──────────────────────────────────────────────────
interface SendModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function SendModal({ onClose, onSuccess }: SendModalProps) {
    const [form, setForm] = useState({
        title: '',
        body: '',
        icon: '🔔',
        type: 'general',
        target: 'all',
        target_user_id: '',
        action_url: '',
    });
    const [users, setUsers] = useState<any[]>([]);
    const [sending, setSending] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);

    useEffect(() => {
        notificationService.getUsers().then(({ data }) => setUsers(data));
    }, []);

    const selectedType = TYPE_OPTIONS.find(t => t.value === form.type) || TYPE_OPTIONS[0];

    const handleSend = async () => {
        if (!form.title.trim() || !form.body.trim()) {
            toast.error('يرجى ملء عنوان ومحتوى الإشعار');
            return;
        }
        if (form.target === 'user' && !form.target_user_id) {
            toast.error('يرجى اختيار مستخدم');
            return;
        }
        setSending(true);
        const { error } = await notificationService.create({
            title: form.title,
            body: form.body,
            icon: form.icon,
            type: form.type,
            target: form.target,
            target_user_id: form.target === 'user' ? form.target_user_id : undefined,
            action_url: form.action_url || undefined,
        });
        setSending(false);
        if (error) {
            toast.error('فشل إرسال الإشعار: ' + error.message);
        } else {
            toast.success('✅ تم إرسال الإشعار بنجاح!');
            onSuccess();
            onClose();
        }
    };

    return createPortal(
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 100000, display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '20px',
                fontFamily: 'Tajawal, sans-serif', direction: 'rtl',
            }}
        >
            <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
                onClick={onClose}
            />
            <div
                style={{
                    position: 'relative', width: '100%', maxWidth: '560px',
                    background: 'linear-gradient(135deg, #0d1117 0%, #0a0f0e 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '32px',
                    padding: '32px',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,200,140,0.05)',
                    animation: 'modalIn 0.25s ease',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            background: 'rgba(0,200,140,0.15)', border: '1px solid rgba(0,200,140,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c88c'
                        }}>
                            <Send size={20} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff' }}>إرسال إشعار جديد</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>يظهر فوراً لجميع المستخدمين المتصلين</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Type selector */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>نوع الإشعار</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {TYPE_OPTIONS.map(t => (
                            <button
                                key={t.value}
                                onClick={() => setForm(f => ({ ...f, type: t.value }))}
                                style={{
                                    padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                    background: form.type === t.value ? `${t.color}22` : 'rgba(255,255,255,0.04)',
                                    border: form.type === t.value ? `1px solid ${t.color}55` : '1px solid rgba(255,255,255,0.08)',
                                    color: form.type === t.value ? t.color : 'rgba(255,255,255,0.45)',
                                }}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Icon picker */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>الأيقونة</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ICON_OPTIONS.map(icon => (
                            <button
                                key={icon}
                                onClick={() => setForm(f => ({ ...f, icon }))}
                                style={{
                                    width: '38px', height: '38px', borderRadius: '10px', fontSize: '20px', cursor: 'pointer',
                                    background: form.icon === icon ? 'rgba(0,200,140,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: form.icon === icon ? '1px solid rgba(0,200,140,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.1s ease',
                                }}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>العنوان *</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="مثال: عرض خاص لهذا الأسبوع 🔥"
                        maxLength={100}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '14px', fontSize: '14px', fontWeight: 700,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', outline: 'none', boxSizing: 'border-box',
                            fontFamily: 'Tajawal, sans-serif',
                        }}
                    />
                </div>

                {/* Body */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>المحتوى *</label>
                    <textarea
                        value={form.body}
                        onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                        placeholder="اكتب تفاصيل الإشعار هنا..."
                        rows={3}
                        maxLength={300}
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '14px', fontSize: '13px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box',
                            fontFamily: 'Tajawal, sans-serif', lineHeight: 1.5,
                        }}
                    />
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'left' }}>{form.body.length}/300</p>
                </div>

                {/* Target */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>المستهدف</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: form.target === 'user' ? '12px' : '0' }}>
                        <button
                            onClick={() => setForm(f => ({ ...f, target: 'all' }))}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.15s ease',
                                background: form.target === 'all' ? 'rgba(0,200,140,0.15)' : 'rgba(255,255,255,0.04)',
                                border: form.target === 'all' ? '1px solid rgba(0,200,140,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                color: form.target === 'all' ? '#00c88c' : 'rgba(255,255,255,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800, fontSize: '13px',
                                fontFamily: 'Tajawal, sans-serif',
                            }}
                        >
                            <Globe size={16} /> الكل
                        </button>
                        <button
                            onClick={() => setForm(f => ({ ...f, target: 'user' }))}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.15s ease',
                                background: form.target === 'user' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                                border: form.target === 'user' ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                color: form.target === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800, fontSize: '13px',
                                fontFamily: 'Tajawal, sans-serif',
                            }}
                        >
                            <Users size={16} /> مستخدم محدد
                        </button>
                    </div>
                    {form.target === 'user' && (
                        <select
                            value={form.target_user_id}
                            onChange={e => setForm(f => ({ ...f, target_user_id: e.target.value }))}
                            style={{
                                width: '100%', padding: '12px 16px', borderRadius: '14px', fontSize: '13px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.3)',
                                color: '#fff', outline: 'none', fontFamily: 'Tajawal, sans-serif',
                                appearance: 'none',
                            }}
                        >
                            <option value="">-- اختر مستخدم --</option>
                            {users.map((u: any) => (
                                <option key={u.id} value={u.id} style={{ background: '#111' }}>
                                    {u.full_name || u.email}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Action URL (optional) */}
                <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>رابط الإجراء (اختياري)</label>
                    <input
                        type="url"
                        value={form.action_url}
                        onChange={e => setForm(f => ({ ...f, action_url: e.target.value }))}
                        placeholder="https://..."
                        style={{
                            width: '100%', padding: '12px 16px', borderRadius: '14px', fontSize: '13px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', outline: 'none', boxSizing: 'border-box',
                            fontFamily: 'Tajawal, sans-serif', direction: 'ltr',
                        }}
                    />
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{
                        width: '100%', padding: '16px', borderRadius: '18px', fontSize: '16px', fontWeight: 900,
                        background: sending ? 'rgba(0,200,140,0.3)' : 'linear-gradient(135deg, #00c88c, #00a372)',
                        border: 'none', color: '#fff', cursor: sending ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        fontFamily: 'Tajawal, sans-serif',
                        boxShadow: sending ? 'none' : '0 8px 32px rgba(0,200,140,0.35)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {sending ? (
                        <>
                            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            إرسال الإشعار الآن
                        </>
                    )}
                </button>
            </div>
            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>,
        document.body
    );
}

// ─── Main Notifications Panel ─────────────────────────────────────────────────
const NotificationsPanel: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSendModal, setShowSendModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { data } = await notificationService.getAll();
        setNotifications(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleToggle = async (id: string, current: boolean) => {
        const { error } = await notificationService.toggle(id, !current);
        if (!error) {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_active: !current } : n)
            );
            toast.success(!current ? 'تم تفعيل الإشعار' : 'تم إيقاف الإشعار');
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const { error } = await notificationService.delete(id);
        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('تم حذف الإشعار');
        } else {
            toast.error('فشل الحذف');
        }
        setDeletingId(null);
    };

    const stats = {
        total: notifications.length,
        active: notifications.filter(n => n.is_active).length,
        toAll: notifications.filter(n => n.target === 'all').length,
        toUser: notifications.filter(n => n.target === 'user').length,
    };

    return (
        <div className="max-w-6xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-1">إدارة الإشعارات</h1>
                    <p className="text-white/40 text-sm font-bold">أرسل إشعارات فورية داخل التطبيق للمستخدمين</p>
                </div>
                <button
                    onClick={() => setShowSendModal(true)}
                    className="bg-fruit-primary text-black px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                    style={{ boxShadow: '0 8px 32px rgba(0,200,140,0.35)' }}
                >
                    <Send size={18} />
                    إرسال إشعار جديد
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'إجمالي الإشعارات', value: stats.total, icon: '🔔', color: '#a3a3a3' },
                    { label: 'مفعّل حالياً', value: stats.active, icon: '✅', color: '#22c55e' },
                    { label: 'للجميع', value: stats.toAll, icon: '🌐', color: '#3b82f6' },
                    { label: 'لمستخدم محدد', value: stats.toUser, icon: '👤', color: '#f97316' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                        <div className="text-3xl">{s.icon}</div>
                        <div>
                            <p className="text-white/40 text-[10px] font-black uppercase">{s.label}</p>
                            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="py-32 text-center text-white/20 animate-pulse text-xl">جاري تحميل الإشعارات...</div>
            ) : notifications.length === 0 ? (
                <div className="py-32 text-center bg-white/5 border-2 border-dashed border-white/10 rounded-3xl">
                    <div className="text-7xl mb-4 opacity-20">🔕</div>
                    <p className="text-white/40 mb-6">لم تُرسل أي إشعارات بعد</p>
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="px-8 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-bold"
                    >
                        أرسل أول إشعار
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map(n => {
                        const typeCfg = TYPE_OPTIONS.find(t => t.value === n.type) || TYPE_OPTIONS[0];
                        const isDeleting = deletingId === n.id;
                        return (
                            <div
                                key={n.id}
                                className="group"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '20px',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    opacity: n.is_active ? 1 : 0.5,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                                    background: `${typeCfg.color}18`, border: `1px solid ${typeCfg.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                                }}>
                                    {n.icon}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                        <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: '#fff' }}>{n.title}</p>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                                            background: `${typeCfg.color}18`, border: `1px solid ${typeCfg.color}30`, color: typeCfg.color,
                                        }}>
                                            {typeCfg.icon} {typeCfg.label}
                                        </span>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                                            background: n.target === 'all' ? 'rgba(59,130,246,0.15)' : 'rgba(249,115,22,0.15)',
                                            border: n.target === 'all' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(249,115,22,0.3)',
                                            color: n.target === 'all' ? '#3b82f6' : '#f97316',
                                        }}>
                                            {n.target === 'all' ? '🌐 الكل' : '👤 محدد'}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{n.body}</p>
                                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{timeAgoFull(n.created_at)}</p>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleToggle(n.id, n.is_active)}
                                        title={n.is_active ? 'إيقاف' : 'تفعيل'}
                                        style={{
                                            width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            background: n.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                                            border: n.is_active ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                            color: n.is_active ? '#22c55e' : 'rgba(255,255,255,0.3)',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {n.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(n.id)}
                                        disabled={isDeleting}
                                        title="حذف"
                                        style={{
                                            width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', cursor: isDeleting ? 'not-allowed' : 'pointer',
                                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                            color: '#ef4444', transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showSendModal && (
                <SendModal onClose={() => setShowSendModal(false)} onSuccess={fetchAll} />
            )}
        </div>
    );
};

export default NotificationsPanel;
