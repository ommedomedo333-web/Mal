import React, { useState } from 'react';
import { Edit, Trash2, Package, Hash } from 'lucide-react';

interface CategoryCardProps {
    category: any;
    productCount?: number;
    onEdit: (category: any) => void;
    onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    category,
    productCount = 0,
    onEdit,
    onDelete,
}) => {
    const [hovered, setHovered] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const accent = category.accent || '#db6a28';
    const color  = category.color  || '#003e31';
    const dark   = category.dark   || '#001a14';

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (deleteConfirm) {
            onDelete(category.id);
        } else {
            setDeleteConfirm(true);
            // Auto-reset after 3s if not confirmed
            setTimeout(() => setDeleteConfirm(false), 3000);
        }
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setDeleteConfirm(false); }}
            style={{
                position: 'relative',
                borderRadius: 24,
                overflow: 'hidden',
                background: `linear-gradient(145deg, ${color}cc, ${dark}ee)`,
                border: `1px solid ${hovered ? accent + '60' : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-3px) scale(1.01)' : 'translateY(0) scale(1)',
                boxShadow: hovered
                    ? `0 20px 50px ${accent}25, 0 0 0 1px ${accent}20`
                    : '0 4px 20px rgba(0,0,0,0.3)',
                cursor: 'default',
            }}
            dir="rtl"
        >
            {/* ── Decorative background circle ── */}
            <div style={{
                position: 'absolute', top: -30, left: -30,
                width: 140, height: 140,
                background: `radial-gradient(circle, ${accent}18, transparent 70%)`,
                borderRadius: '50%',
                transition: 'opacity 0.3s',
                opacity: hovered ? 1 : 0.5,
                pointerEvents: 'none',
            }} />

            {/* ── Floating Action Buttons — appear on hover ── */}
            <div style={{
                position: 'absolute',
                top: 12,
                left: 12,                          // left = لليسار في RTL = edge
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 10,
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                {/* Edit button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(category); }}
                    title="تعديل القسم"
                    style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${accent}50`,
                        color: accent,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: `0 4px 14px rgba(0,0,0,0.4)`,
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = accent;
                        (e.currentTarget as HTMLButtonElement).style.color = '#000';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.65)';
                        (e.currentTarget as HTMLButtonElement).style.color = accent;
                        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                    }}
                >
                    <Edit size={15} strokeWidth={2.5} />
                </button>

                {/* Delete button — requires double-click to confirm */}
                <button
                    onClick={handleDeleteClick}
                    title={deleteConfirm ? 'اضغط مرة أخرى للتأكيد' : 'حذف القسم'}
                    style={{
                        width: 36, height: 36,
                        borderRadius: 10,
                        background: deleteConfirm ? '#ef4444' : 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${deleteConfirm ? '#ef4444' : 'rgba(239,68,68,0.4)'}`,
                        color: deleteConfirm ? '#fff' : '#f87171',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: deleteConfirm ? '0 4px 14px rgba(239,68,68,0.5)' : '0 4px 14px rgba(0,0,0,0.4)',
                        animation: deleteConfirm ? 'deleteWiggle 0.4s ease' : 'none',
                    }}
                    onMouseEnter={e => {
                        if (!deleteConfirm) {
                            (e.currentTarget as HTMLButtonElement).style.background = '#ef4444';
                            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.12)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!deleteConfirm) {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.65)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        }
                    }}
                >
                    <Trash2 size={15} strokeWidth={2.5} />
                </button>

                {/* Confirm label — shows when delete is pending */}
                {deleteConfirm && (
                    <div style={{
                        position: 'absolute',
                        top: 44,
                        left: 40,
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
                        fontFamily: 'Tajawal, sans-serif',
                        animation: 'fadeIn 0.2s ease',
                    }}>
                        اضغط للتأكيد
                    </div>
                )}
            </div>

            {/* ── Card Content ── */}
            <div style={{ padding: '22px 20px 18px', position: 'relative', zIndex: 1 }}>

                {/* Icon + Active badge row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{
                        width: 52, height: 52,
                        borderRadius: 16,
                        background: `${accent}22`,
                        border: `1px solid ${accent}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26,
                        transition: 'transform 0.3s',
                        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0deg)',
                    }}>
                        {category.icon_name || category.icon || '📦'}
                    </div>

                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
                    }}>
                        {/* Active/Inactive badge */}
                        <span style={{
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 800,
                            fontFamily: 'Tajawal, sans-serif',
                            background: category.is_active !== false ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                            color: category.is_active !== false ? '#4ade80' : '#f87171',
                            border: `1px solid ${category.is_active !== false ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                        }}>
                            {category.is_active !== false ? 'نشط' : 'مخفي'}
                        </span>

                        {/* Product count badge */}
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 700,
                            fontFamily: 'Tajawal, sans-serif',
                            background: `${accent}18`,
                            color: accent,
                            border: `1px solid ${accent}30`,
                        }}>
                            <Package size={10} />
                            {productCount} منتج
                        </span>
                    </div>
                </div>

                {/* Names */}
                <h3 style={{
                    fontSize: 20, fontWeight: 900, color: '#fff',
                    marginBottom: 3, lineHeight: 1.2,
                    fontFamily: 'Tajawal, sans-serif',
                    transition: 'color 0.2s',
                    ...(hovered ? { color: '#fff' } : {}),
                }}>
                    {category.name_ar || category.name}
                </h3>
                <p style={{
                    fontSize: 12, fontWeight: 600,
                    color: `${accent}cc`,
                    marginBottom: category.description ? 10 : 0,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: 'Tajawal, sans-serif',
                }}>
                    {category.name_en || category.nameEn}
                </p>

                {/* Description */}
                {category.description && (
                    <p style={{
                        fontSize: 12, color: 'rgba(255,255,255,0.45)',
                        lineHeight: 1.5, marginTop: 8,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'Tajawal, sans-serif',
                    }}>
                        {category.description}
                    </p>
                )}

                {/* Color swatches + order */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {[category.color || '#003e31', category.accent || '#db6a28', category.dark || '#001a14'].map((c, i) => (
                            <div key={i} style={{
                                width: 16, height: 16, borderRadius: '50%',
                                background: c,
                                border: '1.5px solid rgba(255,255,255,0.2)',
                                boxShadow: `0 0 6px ${c}60`,
                                transition: 'transform 0.2s',
                                transform: hovered ? `translateY(${-i}px)` : 'translateY(0)',
                            }} />
                        ))}
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        color: 'rgba(255,255,255,0.3)',
                        fontSize: 11, fontWeight: 700,
                        fontFamily: 'Tajawal, sans-serif',
                    }}>
                        <Hash size={10} />
                        ترتيب {category.display_order ?? 0}
                    </div>
                </div>
            </div>

            {/* ── Bottom accent bar ── */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${accent}, ${color}00)`,
                opacity: hovered ? 1 : 0.4,
                transition: 'opacity 0.3s',
            }} />

            <style>{`
                @keyframes deleteWiggle {
                    0%  { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(-8deg) scale(1.1); }
                    50% { transform: rotate(8deg) scale(1.1); }
                    75% { transform: rotate(-4deg) scale(1.05); }
                    100%{ transform: rotate(0deg) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-4px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default CategoryCard;