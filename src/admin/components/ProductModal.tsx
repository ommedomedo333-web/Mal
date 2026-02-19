import React, { useState, useEffect } from 'react';
import { uploadProductImage } from '../services/productService';

const LABEL_OPTIONS = ['فريش', 'خصم', 'مستورد', 'عضوي'];

interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (payload: any) => Promise<void>;
    initial: any;
    accent?: string;
    categories: any[];
}

const EMPTY = {
    name_ar: '',
    name_en: '',
    subtitle_ar: '', // New initial description
    unit: 'كيلو',
    price: '',
    description_ar: '',
    description_en: '',
    image_url: '',
    category_id: '',
    stock_quantity: '',
};

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, onSave, initial, accent = '#4ade80', categories }) => {
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const isEdit = !!initial;

    useEffect(() => {
        if (initial) {
            setForm({ ...EMPTY, ...initial });
        } else {
            setForm({ ...EMPTY, category_id: categories[0]?.id || '', stock_quantity: '' });
        }
        setError('');
    }, [initial, open, categories]);

    if (!open) return null;

    const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadProductImage(file);
            set('image_url', url);
        } catch (err: any) {
            setError('فشل رفع الصورة: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name_ar.trim() || !form.price || !form.category_id) {
            setError('الاسم، السعر، والقسم حقول مطلوبة.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await onSave({ ...form, price: parseFloat(form.price as string) });
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10, color: '#fff',
        fontSize: 14, outline: 'none',
        fontFamily: 'inherit',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 6, fontWeight: 500,
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', backdropFilter: 'blur(6px)',
        }} onClick={onClose}>
            <div style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20, padding: '28px 32px',
                width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto',
                direction: 'rtl',
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        {isEdit ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}
                    </h2>
                    <button onClick={onClose} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                        <div>
                            <label style={labelStyle}>اسم الصنف (عربي) *</label>
                            <input style={inputStyle} value={form.name_ar} onChange={e => set('name_ar', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>وصف أولي قصير (بجانب العنوان)</label>
                            <input style={inputStyle} value={form.subtitle_ar} onChange={e => set('subtitle_ar', e.target.value)} placeholder="مثلاً: طازج يومياً" />
                        </div>
                        <div>
                            <label style={labelStyle}>السعر (جنيه) *</label>
                            <input style={inputStyle} type="number" value={form.price} onChange={e => set('price', e.target.value)} />
                        </div>
                        <div>
                            <label style={labelStyle}>القسم *</label>
                            <select style={inputStyle} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.name_ar}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>الكمية المتاحة (المخزون)</label>
                            <input style={inputStyle} type="number" value={form.stock_quantity} onChange={e => set('stock_quantity', e.target.value)} placeholder="مثلاً: 50" />
                        </div>
                        <div>
                            <label style={labelStyle}>الوحدة</label>
                            <input style={inputStyle} value={form.unit} onChange={e => set('unit', e.target.value)} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>وصف المنتج</label>
                            <textarea style={{ ...inputStyle, height: 80 }} value={form.description_ar} onChange={e => set('description_ar', e.target.value)} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                            <label style={labelStyle}>رابط الصورة</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <input style={{ ...inputStyle, flex: 1 }} value={form.image_url} onChange={e => set('image_url', e.target.value)} />
                                <label style={{ padding: '10px 14px', background: `${accent}22`, border: `1px solid ${accent}55`, color: accent, borderRadius: 10, cursor: 'pointer', fontSize: 12 }}>
                                    {uploading ? '⏳' : '📁 رفع'}
                                    <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {error && <div style={{ marginTop: 16, color: '#fca5a5', fontSize: 13 }}>{error}</div>}

                    <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 22px', color: '#fff', background: 'none', border: '1px solid #333', borderRadius: 10 }}>إلغاء</button>
                        <button type="submit" disabled={saving || uploading} style={{ padding: '10px 28px', background: accent, color: '#000', fontWeight: 700, borderRadius: 10 }}>
                            {saving ? '⏳ جاري الحفظ...' : '✅ حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
