import React, { useState, useEffect } from 'react';
import { Box, X, Save, Type, Hash, Palette, Info } from 'lucide-react';
import { supabase } from '../../supabase/supabase-config';

export interface Category {
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

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: Category) => Promise<void>;
    initial?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ open, onClose, onSave, initial }) => {

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
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
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

export default CategoryModal;
