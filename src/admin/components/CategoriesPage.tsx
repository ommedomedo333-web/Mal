import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, LayoutGrid, AlertCircle, X, Save, Box, Type, Hash, Palette, Info, Edit, Trash2, Package } from 'lucide-react';
import { supabase } from '../../supabase/supabase-config';

// ═════════════════════════════════════════════════════════════════════════════
// ALL-IN-ONE Categories Management Page
// Everything in one file - modal, card, page logic
// ═════════════════════════════════════════════════════════════════════════════

interface Category {
    id?: string;
    name_ar: string;
    name_en: string;
    description?: string;
    icon_name?: string;
    color?: string;
    accent?: string;
    dark?: string;
    display_order?: number;
    is_active?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL COMPONENT (embedded)
// ─────────────────────────────────────────────────────────────────────────────
const CategoryModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initial?: Category | null;
}> = ({ open, onClose, onSuccess, initial }) => {

    const EMPTY: Category = {
        name_ar: '', name_en: '', description: '', icon_name: '',
        color: '#003e31', accent: '#db6a28', dark: '#001a14',
        display_order: 0, is_active: true,
    };

    const [formData, setFormData] = useState<Category>(EMPTY);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setError(null);
            setFormData(initial || EMPTY);
        }
    }, [open, initial]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (initial?.id) {
                const { error: supaErr } = await supabase
                    .from('categories')
                    .update(formData)
                    .eq('id', initial.id);
                if (supaErr) throw supaErr;
            } else {
                const { error: supaErr } = await supabase
                    .from('categories')
                    .insert([formData]);
                if (supaErr) throw supaErr;
            }
            await onSuccess();
            setTimeout(() => onClose(), 100);
        } catch (err: any) {
            setError(err.message || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%', maxWidth: 540, background: '#002a1e',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
                    overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
                    fontFamily: 'Tajawal, sans-serif',
                }}
                dir="rtl"
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.03)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(219,106,40,0.15)', border: '1px solid rgba(219,106,40,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db6a28',
                        }}>
                            <Box size={20} />
                        </div>
                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>
                            {initial?.id ? 'تعديل القسم' : 'إضافة قسم جديد'}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} style={{
                        width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: 24, maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 12, padding: '12px 16px', color: '#f87171', fontSize: 14, fontWeight: 600,
                            }}>⚠️ {error}</div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={labelStyle}><Type size={13} /> الاسم (عربي)</label>
                                <input required value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                    placeholder="مثلاً: فواكه" style={inputStyle} />
                            </div>
                            <div dir="ltr">
                                <label style={labelStyle}><Type size={13} /> Name (EN)</label>
                                <input required value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                    placeholder="e.g. Fruits" style={{ ...inputStyle, textAlign: 'left' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={labelStyle}><Hash size={13} /> الأيقونة</label>
                                <input required value={formData.icon_name || ''} onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                                    placeholder="🍎" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}><Palette size={13} /> الترتيب</label>
                                <input type="number" required value={formData.display_order || 0}
                                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                            {[
                                { key: 'color', label: 'اللون الأساسي' },
                                { key: 'accent', label: 'لون التمييز' },
                                { key: 'dark', label: 'اللون الداكن' },
                            ].map(({ key, label }) => (
                                <div key={key}>
                                    <label style={labelStyle}>{label}</label>
                                    <input type="color" value={(formData as any)[key] || '#003e31'}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        style={{ width: '100%', height: 48, borderRadius: 12, padding: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label style={labelStyle}><Info size={13} /> الوصف</label>
                            <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="وصف مختصر..." rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 85 }} />
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'rgba(255,255,255,0.03)',
                            borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                        }} onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
                            <div style={{
                                width: 46, height: 26, borderRadius: 13, background: formData.is_active ? '#db6a28' : 'rgba(255,255,255,0.15)',
                                transition: 'background 0.2s', position: 'relative', flexShrink: 0,
                            }}>
                                <div style={{
                                    position: 'absolute', top: 3, left: formData.is_active ? 23 : 3, width: 20, height: 20, borderRadius: '50%',
                                    background: '#fff', transition: 'left 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                }} />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>القسم نشط ويظهر للمستخدمين</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{
                            flex: 1, padding: 14, borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 15, fontFamily: 'Tajawal, sans-serif',
                        }}>إلغاء</button>
                        <button type="submit" disabled={loading} style={{
                            flex: 2, padding: 14, borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? 'rgba(219,106,40,0.5)' : '#db6a28', border: 'none', color: '#000',
                            fontWeight: 900, fontSize: 15, fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        }}>
                            {loading ? <>جاري الحفظ...</> : <><Save size={17} />{initial?.id ? 'تحديث' : 'حفظ'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7,
};

const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 11,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 15, fontFamily: 'Tajawal, sans-serif', outline: 'none',
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: supaErr } = await supabase
                .from('categories')
                .select('*')
                .order('display_order', { ascending: true });
            if (supaErr) throw supaErr;
            setCategories(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleDelete = async (id: string) => {
        const { error: supaErr } = await supabase.from('categories').delete().eq('id', id);
        if (supaErr) {
            alert('فشل الحذف: ' + supaErr.message);
            return;
        }
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div dir="rtl" style={{ minHeight: '100vh', background: '#001a14', padding: '32px 24px', fontFamily: 'Tajawal, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, marginBottom: 6 }}>إدارة الأقسام</h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                        {categories.length} قسم مسجّل
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={fetchCategories} disabled={loading} style={{
                        height: 44, padding: '0 16px', borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, fontFamily: 'Tajawal, sans-serif',
                    }}>
                        <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        تحديث
                    </button>
                    <button onClick={() => { setEditingCategory(null); setModalOpen(true); }} style={{
                        height: 44, padding: '0 20px', borderRadius: 12, background: '#db6a28', border: 'none',
                        color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: 15, fontWeight: 900, fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 20px rgba(219,106,40,0.3)',
                    }}>
                        <Plus size={18} strokeWidth={3} />
                        إضافة قسم جديد
                    </button>
                </div>
            </div>

            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '14px 18px',
                    color: '#f87171', fontSize: 14, fontWeight: 600, marginBottom: 28,
                }}>
                    <AlertCircle size={18} />{error}
                </div>
            )}

            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{
                            height: 200, borderRadius: 22, background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.05)', animation: 'pulse 1.6s ease-in-out infinite',
                        }} />
                    ))}
                </div>
            )}

            {!loading && !error && categories.length === 0 && (
                <div style={{ textAlign: 'center', padding: '90px 20px', color: 'rgba(255,255,255,0.25)' }}>
                    <LayoutGrid size={56} style={{ marginBottom: 18, opacity: 0.3 }} />
                    <p style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>لا توجد أقسام بعد</p>
                    <p style={{ fontSize: 14, marginBottom: 28 }}>ابدأ بإضافة قسمك الأول الآن</p>
                    <button onClick={() => { setEditingCategory(null); setModalOpen(true); }} style={{
                        padding: '14px 32px', borderRadius: 14, background: '#db6a28', border: 'none',
                        color: '#000', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                    }}>+ إضافة أول قسم</button>
                </div>
            )}

            {!loading && !error && categories.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
                    {categories.map(cat => (
                        <MiniCard key={cat.id} category={cat}
                            onEdit={() => { setEditingCategory(cat); setModalOpen(true); }}
                            onDelete={() => cat.id && handleDelete(cat.id)} />
                    ))}
                </div>
            )}

            <CategoryModal open={modalOpen} onClose={() => setModalOpen(false)}
                onSuccess={fetchCategories} initial={editingCategory} />

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.2; } }
            `}</style>
        </div>
    );
};

// Mini card component
const MiniCard: React.FC<{ category: Category; onEdit: () => void; onDelete: () => void }> = ({ category, onEdit, onDelete }) => {
    const [hovered, setHovered] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setDeleteConfirm(false); }}
            style={{
                position: 'relative', borderRadius: 22, overflow: 'hidden',
                background: `linear-gradient(145deg, ${category.color || '#003e31'}cc, ${category.dark || '#001a14'}ee)`,
                border: `1px solid ${hovered ? (category.accent || '#db6a28') + '60' : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.35s', transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                boxShadow: hovered ? `0 22px 55px ${(category.accent || '#db6a28')}25` : '0 4px 20px rgba(0,0,0,0.3)', cursor: 'default',
            }}>
            <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10, opacity: hovered ? 1 : 0, transition: 'all 0.25s' }}>
                <button onClick={onEdit} style={{
                    width: 38, height: 38, borderRadius: 11, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
                    border: `1px solid ${(category.accent || '#db6a28')}50`, color: category.accent || '#db6a28', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Edit size={16} /></button>
                <button onClick={() => deleteConfirm ? onDelete() : setDeleteConfirm(true)} style={{
                    width: 38, height: 38, borderRadius: 11, background: deleteConfirm ? '#ef4444' : 'rgba(0,0,0,0.7)',
                    border: `1px solid ${deleteConfirm ? '#ef4444' : 'rgba(239,68,68,0.4)'}`, color: deleteConfirm ? '#fff' : '#f87171',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><Trash2 size={16} /></button>
            </div>
            <div style={{ padding: 24 }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>{category.icon_name || '📦'}</div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{category.name_ar}</h3>
                <p style={{ fontSize: 12, fontWeight: 600, color: `${category.accent || '#db6a28'}cc`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category.name_en}</p>
                {category.description && (
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 10, lineHeight: 1.5 }}>{category.description}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                    <span style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800,
                        background: category.is_active !== false ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                        color: category.is_active !== false ? '#4ade80' : '#f87171',
                        border: `1px solid ${category.is_active !== false ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    }}>{category.is_active !== false ? 'نشط' : 'مخفي'}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>#{category.display_order}</span>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;