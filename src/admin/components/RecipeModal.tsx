import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, BookOpen, Sparkles, Image as ImageIcon, FileText, Timer } from 'lucide-react';
import { supabase } from '../../supabase/supabase-config';
import toast from 'react-hot-toast';

interface RecipeModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (payload: any) => Promise<void>;
    // Accept BOTH "item" (used by RecipesDashboard) and "initial" for flexibility
    item?: any;
    initial?: any;
}

const defaultForm = {
    title_ar: '',
    content_ar: '',
    cooking_time_ar: '',
    image_url: '',
    type: 'blog' as 'blog' | 'recipe',
    publisher: '',   // ← was missing, caused blog saves to fail
};

const RecipeModal: React.FC<RecipeModalProps> = ({ open, onClose, onSave, item, initial }) => {
    // Support both prop names: "item" (RecipesDashboard) and "initial" (standalone usage)
    const source = item ?? initial ?? null;

    const [formData, setFormData] = useState(defaultForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

    // Reset / populate form whenever the modal opens or source changes
    useEffect(() => {
        if (source) {
            setFormData({
                title_ar:        source.title_ar        || '',
                content_ar:      source.content_ar      || '',
                cooking_time_ar: source.cooking_time_ar || '',
                image_url:       source.image_url       || '',
                type:            source.type            || 'blog',
                publisher:       source.publisher       || '',  // ← populate on edit
            });
            setImagePreview(source.image_url || '');
            setImageFile(null);
            // If the existing record has an image URL (not a blob), default to URL mode
            setImageMode(source.image_url ? 'url' : 'upload');
        } else {
            setFormData(defaultForm);
            setImagePreview('');
            setImageFile(null);
            setImageMode('upload');
        }
    }, [source, open]);

    const set = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('❌ اختر صورة فقط'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('❌ حجم الصورة أكبر من 5MB'); return; }
        setImageFile(file);
        setImageMode('upload'); // switch back to upload mode when file selected
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
        toast.success('✓ تم اختيار الصورة');
    };

    const uploadImage = async (): Promise<string> => {
        // URL mode — return the typed URL directly
        if (imageMode === 'url') return formData.image_url;
        // Upload mode but no new file selected — keep existing URL (edit case)
        if (!imageFile) return formData.image_url;

        setUploading(true);
        try {
            const ext = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const path = `recipes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(path, imageFile, { cacheControl: '3600', upsert: false });

            if (uploadError) {
                toast.error(`❌ فشل رفع الصورة: ${uploadError.message}`);
                throw uploadError;
            }

            const { data } = supabase.storage.from('images').getPublicUrl(path);
            toast.success('✓ تم رفع الصورة');
            return data.publicUrl;
        } catch (err: any) {
            toast.error('❌ فشل رفع الصورة: ' + (err?.message || 'خطأ غير معروف'));
            throw err;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ── Validation ──
        if (!formData.title_ar.trim()) { toast.error('❌ العنوان مطلوب'); return; }
        if (!formData.content_ar.trim()) { toast.error('❌ المحتوى مطلوب'); return; }
        if (formData.type === 'blog' && !formData.publisher.trim()) {
            toast.error('❌ اسم الناشر مطلوب للتدوينات');
            return;
        }
        if (imageMode === 'url' && !formData.image_url.trim()) { toast.error('❌ رابط الصورة مطلوب'); return; }
        if (imageMode === 'upload' && !imageFile && !formData.image_url) { toast.error('❌ الصورة مطلوبة'); return; }

        setSaving(true);
        try {
            const image_url = await uploadImage();
            // Pass the full payload including publisher and the original id (for edits)
            await onSave({
                ...formData,
                image_url,
                // Carry over the original record id so RecipesDashboard knows it's an UPDATE
                ...(source?.id ? { id: source.id } : {}),
                // Clear publisher for recipes
                publisher: formData.type === 'blog' ? formData.publisher : null,
            });
        } catch {
            // Errors already toasted above
        } finally {
            setSaving(false);
        }
    };

    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <>
            <style>{`
                @keyframes _rm_fadeUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                ._rm_modal { animation: _rm_fadeUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
                ._rm_spin  { animation: _rm_spin2 0.8s linear infinite; }
                @keyframes _rm_spin2 { to { transform: rotate(360deg); } }
            `}</style>

            <div
                dir="rtl"
                style={{
                    position: 'fixed', inset: 0,
                    zIndex: 2147483647,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                    fontFamily: 'Tajawal, sans-serif',
                }}
            >
                {/* Backdrop */}
                <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(14px)' }}
                    onClick={onClose}
                />

                {/* Modal panel */}
                <div
                    className="_rm_modal"
                    style={{
                        position: 'relative',
                        width: '100%', maxWidth: 680,
                        maxHeight: '90vh', overflowY: 'auto',
                        background: 'linear-gradient(145deg, #161616 0%, #0d0d0d 100%)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 28,
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,186,0,0.07)',
                    }}
                >
                    {/* Ambient glow */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 260, height: 260, background: 'radial-gradient(circle, rgba(255,186,0,0.07) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

                    {/* ── Header ── */}
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 10,
                        background: 'rgba(8,8,8,0.96)', backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        padding: '1.1rem 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        borderRadius: '28px 28px 0 0',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#ffba00,#f97316)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={18} color="#000" />
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 900, fontSize: 17 }}>
                                    {source ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    {source ? 'Edit Content' : 'New Content'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={saving || uploading}
                            style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                            {/* Type selector */}
                            <Field label="نوع المحتوى" icon={<FileText size={13} />}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {(['blog', 'recipe'] as const).map(t => (
                                        <button key={t} type="button" onClick={() => set('type', t)}
                                            style={{
                                                padding: '13px 18px', borderRadius: 14, fontWeight: 900, fontSize: 15,
                                                cursor: 'pointer', border: 'none',
                                                background: formData.type === t
                                                    ? t === 'blog' ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'linear-gradient(135deg,#ffba00,#ca8a04)'
                                                    : 'rgba(255,255,255,0.05)',
                                                color: formData.type === t ? (t === 'blog' ? '#fff' : '#000') : 'rgba(255,255,255,0.45)',
                                                transform: formData.type === t ? 'scale(1.03)' : 'scale(1)',
                                                transition: 'all 0.2s',
                                            }}
                                        >{t === 'blog' ? '📝 تدوينة' : '🍳 وصفة'}</button>
                                    ))}
                                </div>
                            </Field>

                            {/* Image */}
                            <Field label="صورة الغلاف *" icon={<ImageIcon size={13} />}>
                                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                                    {(['upload', 'url'] as const).map(mode => (
                                        <button key={mode} type="button"
                                            onClick={() => { setImageMode(mode); if (mode === 'url') setImageFile(null); }}
                                            style={{
                                                flex: 1, padding: '8px', borderRadius: 10, fontWeight: 700, fontSize: 12,
                                                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                                                background: imageMode === mode ? 'rgba(255,186,0,0.15)' : 'rgba(255,255,255,0.04)',
                                                color: imageMode === mode ? '#ffba00' : 'rgba(255,255,255,0.4)',
                                                outline: imageMode === mode ? '1px solid rgba(255,186,0,0.35)' : '1px solid rgba(255,255,255,0.08)',
                                            }}>
                                            {mode === 'upload' ? '📁 رفع ملف' : '🔗 رابط URL'}
                                        </button>
                                    ))}
                                </div>

                                {imageMode === 'url' ? (
                                    <div>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={e => { set('image_url', e.target.value); setImagePreview(e.target.value); }}
                                            placeholder="https://example.com/image.jpg"
                                            style={{ ...inputSt, marginBottom: imagePreview ? 8 : 0 }}
                                            onFocus={focusSt} onBlur={blurSt}
                                            disabled={saving}
                                        />
                                        {imagePreview && (
                                            <img src={imagePreview} alt="preview"
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)', display: 'block' }}
                                            />
                                        )}
                                    </div>
                                ) : imagePreview ? (
                                    <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.09)' }}>
                                        <img src={imagePreview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                                        <label style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.85),rgba(0,0,0,0.35))', opacity: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                                        >
                                            <span style={{ padding: '9px 22px', background: '#ffba00', color: '#000', borderRadius: 11, fontWeight: 900, fontSize: 13 }}>تغيير الصورة</span>
                                            <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} disabled={uploading || saving} />
                                        </label>
                                        {uploading && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexDirection: 'column' }}>
                                                <div className="_rm_spin" style={{ width: 36, height: 36, border: '3px solid rgba(255,186,0,0.25)', borderTopColor: '#ffba00', borderRadius: '50%' }} />
                                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>جاري الرفع...</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <label style={{ display: 'block', border: '2px dashed rgba(255,255,255,0.11)', borderRadius: 14, cursor: 'pointer', transition: 'border-color 0.2s' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,186,0,0.38)')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)')}
                                    >
                                        <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 56, height: 56, background: 'rgba(255,186,0,0.09)', border: '1px solid rgba(255,186,0,0.22)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Upload size={28} color="#ffba00" />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 700, marginBottom: 3 }}>اضغط لاختيار صورة</div>
                                                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>JPG, PNG أو GIF — أقصى 5MB</div>
                                            </div>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} disabled={uploading || saving} />
                                    </label>
                                )}
                            </Field>

                            {/* Title */}
                            <Field label="العنوان *" icon={<FileText size={13} />}>
                                <input type="text" value={formData.title_ar}
                                    onChange={e => set('title_ar', e.target.value)}
                                    required disabled={saving || uploading}
                                    placeholder="أدخل عنواناً جذاباً..."
                                    style={inputSt} onFocus={focusSt} onBlur={blurSt} />
                            </Field>

                            {/* Time */}
                            <Field label={formData.type === 'blog' ? 'وقت القراءة' : 'وقت التحضير'} icon={<Timer size={13} />}>
                                <input type="text" value={formData.cooking_time_ar}
                                    onChange={e => set('cooking_time_ar', e.target.value)}
                                    disabled={saving || uploading}
                                    placeholder="مثال: 15 دقيقة"
                                    style={inputSt} onFocus={focusSt} onBlur={blurSt} />
                            </Field>

                            {/* Publisher — only visible for blogs */}
                            {formData.type === 'blog' && (
                                <Field label="اسم الناشر *" icon={<FileText size={13} />}>
                                    <input
                                        type="text"
                                        value={formData.publisher}
                                        onChange={e => set('publisher', e.target.value)}
                                        required
                                        disabled={saving || uploading}
                                        placeholder="مثال: إدارة المحتوى أو اسم الكاتب"
                                        style={inputSt} onFocus={focusSt} onBlur={blurSt}
                                    />
                                </Field>
                            )}

                            {/* Content */}
                            <Field label="المحتوى *" icon={<BookOpen size={13} />}>
                                <textarea value={formData.content_ar}
                                    onChange={e => set('content_ar', e.target.value)}
                                    required disabled={saving || uploading}
                                    placeholder="اكتب محتوى مفيد وجذاب..."
                                    rows={7}
                                    style={{ ...inputSt, resize: 'vertical', lineHeight: 1.75 }}
                                    onFocus={focusSt} onBlur={blurSt} />
                            </Field>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <button type="button" onClick={onClose} disabled={saving || uploading}
                                style={{ flex: 1, padding: '13px', borderRadius: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.65)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                                إلغاء
                            </button>
                            <button type="submit" disabled={saving || uploading}
                                style={{ flex: 2, padding: '13px', borderRadius: 13, background: 'linear-gradient(135deg,#ffba00,#f97316)', border: 'none', color: '#000', fontWeight: 900, fontSize: 15, cursor: saving || uploading ? 'not-allowed' : 'pointer', opacity: saving || uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                {saving || uploading
                                    ? <><div className="_rm_spin" style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#000', borderRadius: '50%' }} />{uploading ? 'جاري الرفع...' : 'جاري الحفظ...'}</>
                                    : source ? 'حفظ التعديلات' : 'نشر المحتوى'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        document.body
    );
};

// ── Tiny helpers ──────────────────────────────────────────────────────────

const Field: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.38)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }}>
            {icon}{label}
        </div>
        {children}
    </div>
);

const inputSt: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 13, color: '#fff', fontSize: 14, fontWeight: 600,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Tajawal, sans-serif', transition: 'border-color 0.2s, background 0.2s',
};
const focusSt = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,186,0,0.5)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
};
const blurSt = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
};

export default RecipeModal;