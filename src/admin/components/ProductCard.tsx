import React, { useState } from 'react';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
    product: any;
    accent?: string;
    onEdit: (product: any) => void;
    onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    accent = '#ffba00',
    onEdit,
    onDelete,
}) => {
    const [hovered, setHovered] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const isLowStock = product.stock_quantity !== undefined && product.stock_quantity < 10;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (deleteConfirm) {
            onDelete(product.id);
        } else {
            setDeleteConfirm(true);
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
                background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                border: `1px solid ${hovered ? accent + '45' : 'rgba(255,255,255,0.09)'}`,
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                boxShadow: hovered
                    ? `0 20px 50px ${accent}20, 0 0 0 1px ${accent}15`
                    : '0 4px 20px rgba(0,0,0,0.25)',
            }}
            dir="rtl"
        >
            {/* ── Floating Action Buttons ── */}
            <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 20,
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateX(0)' : 'translateX(8px)',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}>
                {/* Edit */}
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                    title="تعديل المنتج"
                    style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${accent}50`,
                        color: accent,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    }}
                    onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.background = accent;
                        b.style.color = '#000';
                        b.style.transform = 'scale(1.12)';
                    }}
                    onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.background = 'rgba(0,0,0,0.7)';
                        b.style.color = accent;
                        b.style.transform = 'scale(1)';
                    }}
                >
                    <Edit size={15} strokeWidth={2.5} />
                </button>

                {/* Delete — confirm on second click */}
                <button
                    onClick={handleDeleteClick}
                    title={deleteConfirm ? 'اضغط للتأكيد' : 'حذف المنتج'}
                    style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: deleteConfirm ? '#ef4444' : 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${deleteConfirm ? '#ef4444' : 'rgba(239,68,68,0.4)'}`,
                        color: deleteConfirm ? '#fff' : '#f87171',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                        boxShadow: deleteConfirm ? '0 4px 14px rgba(239,68,68,0.5)' : '0 4px 14px rgba(0,0,0,0.4)',
                        animation: deleteConfirm ? 'wiggle 0.4s ease' : 'none',
                    }}
                    onMouseEnter={e => {
                        if (!deleteConfirm) {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.background = '#ef4444';
                            b.style.color = '#fff';
                            b.style.transform = 'scale(1.12)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!deleteConfirm) {
                            const b = e.currentTarget as HTMLButtonElement;
                            b.style.background = 'rgba(0,0,0,0.7)';
                            b.style.color = '#f87171';
                            b.style.transform = 'scale(1)';
                        }
                    }}
                >
                    <Trash2 size={15} strokeWidth={2.5} />
                </button>

                {/* Confirm tooltip */}
                {deleteConfirm && (
                    <div style={{
                        position: 'absolute',
                        top: 44, right: 40,
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: 10, fontWeight: 800,
                        padding: '4px 8px', borderRadius: 6,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
                        fontFamily: 'Tajawal, sans-serif',
                        animation: 'fadeIn 0.2s ease',
                        zIndex: 30,
                    }}>
                        اضغط للتأكيد
                    </div>
                )}
            </div>

            {/* ── Product Image ── */}
            <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name_ar}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                            transition: 'transform 0.7s ease',
                            transform: hovered ? 'scale(1.08)' : 'scale(1)',
                        }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
                    </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

                {/* Low stock warning badge */}
                {isLowStock && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 8,
                        background: 'rgba(251,146,60,0.9)',
                        backdropFilter: 'blur(8px)',
                        color: '#000', fontSize: 11, fontWeight: 800,
                        fontFamily: 'Tajawal, sans-serif',
                    }}>
                        <AlertTriangle size={11} />
                        مخزون منخفض
                    </div>
                )}

                {/* Price badge */}
                <div style={{
                    position: 'absolute', bottom: 10, left: 10,
                    padding: '5px 12px', borderRadius: 10,
                    background: `${accent}ee`,
                    color: '#000',
                    fontSize: 15, fontWeight: 900,
                    fontFamily: 'Tajawal, sans-serif',
                    backdropFilter: 'blur(8px)',
                }}>
                    {product.price} جم
                </div>
            </div>

            {/* ── Card Body ── */}
            <div style={{ padding: '14px 16px 16px' }}>
                {/* Unit tag */}
                <span style={{
                    display: 'inline-block',
                    padding: '2px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 700,
                    background: `${accent}18`,
                    color: accent,
                    border: `1px solid ${accent}30`,
                    marginBottom: 8,
                    fontFamily: 'Tajawal, sans-serif',
                }}>
                    {product.unit || 'كيلو'}
                </span>

                {/* Name */}
                <h3 style={{
                    fontSize: 17, fontWeight: 900, color: '#fff',
                    marginBottom: 5, lineHeight: 1.3,
                    fontFamily: 'Tajawal, sans-serif',
                    transition: 'color 0.2s',
                    ...(hovered ? { color: '#fff' } : {}),
                    display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap'
                }}>
                    {product.name_ar}
                    {product.subtitle_ar && (
                        <span style={{ fontSize: 11, fontWeight: 500, color: accent, opacity: 0.8 }}>
                            ({product.subtitle_ar})
                        </span>
                    )}
                </h3>

                {/* Description */}
                {product.description_ar && (
                    <p style={{
                        fontSize: 12, color: 'rgba(255,255,255,0.38)',
                        lineHeight: 1.5, marginBottom: 10,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'Tajawal, sans-serif',
                    }}>
                        {product.description_ar}
                    </p>
                )}

                {/* Stock */}
                {product.stock_quantity !== undefined && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, marginTop: 8,
                    }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Tajawal, sans-serif', fontWeight: 600 }}>المخزون</span>
                        <span style={{
                            fontSize: 14, fontWeight: 900,
                            color: isLowStock ? '#fb923c' : '#4ade80',
                            fontFamily: 'Tajawal, sans-serif',
                        }}>
                            {product.stock_quantity}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Bottom accent line ── */}
            <div style={{
                height: 3,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                opacity: hovered ? 1 : 0.3,
                transition: 'opacity 0.3s',
            }} />

            <style>{`
                @keyframes wiggle {
                    0%  { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(-8deg) scale(1.1); }
                    50% { transform: rotate(8deg) scale(1.1); }
                    75% { transform: rotate(-4deg) scale(1.05); }
                    100%{ transform: rotate(0deg) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(4px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default ProductCard;
