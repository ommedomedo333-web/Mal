import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';
import toast from 'react-hot-toast';

// ─── Type maps ────────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    general: { label: 'عام', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', border: 'rgba(163,163,163,0.2)' },
    order: { label: 'طلب', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
    offer: { label: 'عرض', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
    points: { label: 'نقاط', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
    system: { label: 'نظام', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    alert: { label: 'تنبيه', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
    return `منذ ${Math.floor(diff / 86400)} ي`;
}

// ─── Toast popup for new incoming notifications ───────────────────────────────
function NotificationToast({ n }: { n: Notification }) {
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.general;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(10,10,10,0.95)',
                border: `1px solid ${cfg.border}`,
                borderRadius: '16px',
                padding: '14px 16px',
                backdropFilter: 'blur(20px)',
                direction: 'rtl',
                maxWidth: '340px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${cfg.border}`,
            }}
        >
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: '#fff', lineHeight: 1.3 }}>{n.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{n.body}</p>
            </div>
        </div>
    );
}

// ─── Main Bell Component ──────────────────────────────────────────────────────
const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, onNewNotification } = useNotifications();
    const [open, setOpen] = useState(false);
    const [animBadge, setAnimBadge] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    // Register toast callback for new real-time notifications
    useEffect(() => {
        onNewNotification((n: Notification) => {
            toast.custom(<NotificationToast n={n} />, {
                duration: 5000,
                position: 'top-right',
            });
            setAnimBadge(true);
            setTimeout(() => setAnimBadge(false), 600);
        });
    }, [onNewNotification]);

    // Close panel on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleOpen = () => {
        setOpen(o => !o);
    };

    const handleNotifClick = (n: Notification) => {
        if (!n.is_read) markAsRead(n.id);
        if (n.action_url) window.open(n.action_url, '_blank');
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Bell Button */}
            <button
                ref={btnRef}
                id="notification-bell-btn"
                onClick={handleOpen}
                style={{
                    position: 'relative',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: open ? 'rgba(0,77,62,0.9)' : 'rgba(0,77,62,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                }}
                aria-label="الإشعارات"
            >
                {/* Bell SVG with animation */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        animation: unreadCount > 0 && !open ? 'bellRing 2.5s ease infinite' : 'none',
                        transformOrigin: '12px 4px',
                    }}
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 900,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #004d3e',
                            padding: '0 4px',
                            animation: animBadge ? 'badgePop 0.4s ease' : 'none',
                            boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                        }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {open && (
                <div
                    ref={panelRef}
                    id="notification-panel"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '360px',
                        maxWidth: 'calc(100vw - 32px)',
                        background: 'rgba(8,8,8,0.97)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(30px)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                        direction: 'rtl',
                        zIndex: 99999,
                        overflow: 'hidden',
                        animation: 'slideDown 0.2s ease',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '18px 20px 14px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>🔔</span>
                            <div>
                                <p style={{ margin: 0, fontWeight: 900, fontSize: '15px', color: '#fff' }}>الإشعارات</p>
                                {unreadCount > 0 && (
                                    <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                                        {unreadCount} غير مقروء
                                    </p>
                                )}
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                style={{
                                    background: 'rgba(0,77,62,0.3)',
                                    border: '1px solid rgba(0,200,140,0.2)',
                                    borderRadius: '10px',
                                    color: '#00c88c',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                }}
                            >
                                قراءة الكل
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
                                <p style={{ margin: 0, fontSize: '13px' }}>جاري التحميل...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>🔕</div>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: 700 }}>لا توجد إشعارات</p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.general;
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => handleNotifClick(n)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '14px 20px',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            cursor: 'pointer',
                                            background: n.is_read ? 'transparent' : 'rgba(0,77,62,0.12)',
                                            transition: 'background 0.15s ease',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(0,77,62,0.12)')}
                                    >
                                        {/* Unread dot */}
                                        {!n.is_read && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '7px',
                                                    height: '7px',
                                                    borderRadius: '50%',
                                                    background: '#00c88c',
                                                    boxShadow: '0 0 8px rgba(0,200,140,0.6)',
                                                }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <div
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '14px',
                                                background: cfg.bg,
                                                border: `1px solid ${cfg.border}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '22px',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {n.icon}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontWeight: n.is_read ? 600 : 800,
                                                        fontSize: '13px',
                                                        color: n.is_read ? 'rgba(255,255,255,0.7)' : '#fff',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '180px',
                                                    }}
                                                >
                                                    {n.title}
                                                </p>
                                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, flexShrink: 0, marginRight: '8px' }}>
                                                    {timeAgo(n.created_at)}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: '12px',
                                                    color: 'rgba(255,255,255,0.45)',
                                                    lineHeight: 1.4,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                {n.body}
                                            </p>
                                            {/* Type badge */}
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    marginTop: '6px',
                                                    padding: '2px 8px',
                                                    borderRadius: '6px',
                                                    background: cfg.bg,
                                                    border: `1px solid ${cfg.border}`,
                                                    color: cfg.color,
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {cfg.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div
                            style={{
                                padding: '12px 20px',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                textAlign: 'center',
                            }}
                        >
                            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                                يتم تحديث الإشعارات تلقائياً
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Global Keyframe Styles */}
            <style>{`
        @keyframes bellRing {
          0%, 50%, 100% { transform: rotate(0deg); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-13deg); }
          15% { transform: rotate(10deg); }
          20% { transform: rotate(-8deg); }
          25% { transform: rotate(5deg); }
          30% { transform: rotate(0deg); }
        }
        @keyframes badgePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.5); }
          70% { transform: scale(0.85); }
          100% { transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #notification-panel::-webkit-scrollbar {
          width: 4px;
        }
        #notification-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        #notification-panel::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}</style>
        </div>
    );
};

export default NotificationBell;
