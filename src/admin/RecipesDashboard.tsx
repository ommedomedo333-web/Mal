import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, BookOpen, X, Upload, Clock, AlertTriangle, Sparkles, Image as ImageIcon, FileText, Timer } from 'lucide-react';
import { supabase } from '../supabase/supabase-config';
import toast from 'react-hot-toast';

interface Recipe {
  id?: string;
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  cooking_time_ar?: string;
  cooking_time_en?: string;
  image_url: string;
  type: 'blog' | 'recipe';
  is_active?: boolean;
  created_at?: string;
}

const RecipesDashboard: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item: Recipe | null }>({ open: false, item: null });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewRecipe, setPreviewRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast.error('فشل تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSave = async (recipe: Recipe) => {
    try {
      if (recipe.id) {
        const { error } = await supabase
          .from('recipes')
          .update({
            title_ar: recipe.title_ar,
            title_en: recipe.title_en,
            content_ar: recipe.content_ar,
            content_en: recipe.content_en,
            cooking_time_ar: recipe.cooking_time_ar,
            cooking_time_en: recipe.cooking_time_en,
            image_url: recipe.image_url,
            type: recipe.type,
            updated_at: new Date().toISOString()
          })
          .eq('id', recipe.id);

        if (error) throw error;
        toast.success('✨ تم التحديث بنجاح');
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('recipes')
          .insert([{
            ...recipe,
            author_id: user?.id,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('🎉 تم الإضافة بنجاح');
      }

      setModal({ open: false, item: null });
      fetchRecipes();
    } catch (error: any) {
      console.error('Error saving recipe:', error);
      toast.error('❌ حدث خطأ: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('🗑️ تم الحذف بنجاح');
      setDeleteConfirm(null);
      fetchRecipes();
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      toast.error('❌ فشل الحذف');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0f0f0f]" dir="rtl">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fruit-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-16 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fruit-primary/20 to-orange-500/20 rounded-full border border-fruit-primary/30 backdrop-blur-sm">
                <Sparkles size={16} className="text-fruit-primary" />
                <span className="text-sm font-bold text-fruit-primary">محرر المحتوى</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-l from-fruit-primary via-white to-orange-500 bg-clip-text text-transparent leading-tight">
                إدارة المدونات والوصفات
              </h1>
              <p className="text-lg text-white/50 font-medium max-w-2xl">
                شارك عملاءك محتوى صحي ووصفات مفيدة من خلال منصة متكاملة
              </p>
            </div>
            
            <button
              onClick={() => setModal({ open: true, item: null })}
              className="group relative px-8 py-4 bg-gradient-to-l from-fruit-primary to-orange-500 text-black rounded-2xl font-black text-lg overflow-hidden shadow-2xl shadow-fruit-primary/30 hover:shadow-fruit-primary/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-3">
                <Plus size={24} strokeWidth={3} />
                <span>إضافة محتوى جديد</span>
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-fruit-primary/30 border-t-fruit-primary rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-fruit-primary animate-pulse" size={32} />
            </div>
            <p className="mt-6 text-white/60 font-bold text-lg">جاري تحميل المحتوى...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border-2 border-dashed border-white/10 rounded-[48px] overflow-hidden backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]" />
            <div className="relative py-32 text-center px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-fruit-primary/20 to-orange-500/20 rounded-3xl mb-8 border border-fruit-primary/30">
                <BookOpen size={48} className="text-fruit-primary" />
              </div>
              <h3 className="text-3xl font-black mb-4 bg-gradient-to-l from-white via-white to-white/60 bg-clip-text text-transparent">
                لا يوجد محتوى بعد
              </h3>
              <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                ابدأ رحلتك في إنشاء محتوى مميز وشاركه مع عملائك
              </p>
              <button
                onClick={() => setModal({ open: true, item: null })}
                className="group relative px-10 py-4 bg-gradient-to-l from-fruit-primary to-orange-500 text-black rounded-2xl font-black text-lg overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative">ابدأ الآن</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {recipes.map((recipe, index) => (
              <article
                key={recipe.id}
                className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-fruit-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-fruit-primary/10 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title_ar}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl font-black text-sm backdrop-blur-md border shadow-lg ${
                    recipe.type === 'blog'
                      ? 'bg-orange-500/90 text-white border-orange-400/50'
                      : 'bg-fruit-primary/90 text-black border-fruit-primary/50'
                  }`}>
                    {recipe.type === 'blog' ? '📝 تدوينة' : '🍳 وصفة'}
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-white font-black text-xl mb-3 line-clamp-2 leading-tight">
                    {recipe.title_ar}
                  </h3>
                  
                  {recipe.cooking_time_ar && (
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-5 font-medium">
                      <Clock size={16} className="text-fruit-primary" />
                      <span>{recipe.cooking_time_ar}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-5 border-t border-white/10">
                    <button
                      onClick={() => setPreviewRecipe(recipe)}
                      className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                    >
                      معاينة
                    </button>
                    <button
                      onClick={() => setModal({ open: true, item: recipe })}
                      className="p-3 bg-fruit-primary/10 hover:bg-fruit-primary/20 text-fruit-primary rounded-xl transition-all hover:scale-110 active:scale-95"
                      aria-label="تعديل"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(recipe.id!)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all hover:scale-110 active:scale-95"
                      aria-label="حذف"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal.open && <RecipeModal {...modal} onClose={() => setModal({ open: false, item: null })} onSave={handleSave} />}
      {deleteConfirm && <DeleteConfirmModal id={deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} />}
      {previewRecipe && <PreviewModal recipe={previewRecipe} onClose={() => setPreviewRecipe(null)} />}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════
// RECIPE MODAL (ADD/EDIT)
// ════════════════════════════════════════════════════════════════════════

interface RecipeModalProps {
  open: boolean;
  item: Recipe | null;
  onClose: () => void;
  onSave: (recipe: Recipe) => Promise<void>;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ open, item, onClose, onSave }) => {
  const [formData, setFormData] = useState<Recipe>({
    title_ar: '',
    content_ar: '',
    cooking_time_ar: '',
    image_url: '',
    type: 'blog'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
      setImagePreview(item.image_url);
    }
  }, [item]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('❌ اختر صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ حجم الصورة أكبر من 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    toast.success('✓ تم اختيار الصورة');
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image_url;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `recipes/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (error) throw error;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      toast.success('✓ تم رفع الصورة');
      return data.publicUrl;
    } catch (error: any) {
      toast.error('❌ فشل رفع الصورة');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_ar.trim()) {
      toast.error('❌ العنوان مطلوب');
      return;
    }

    if (!formData.content_ar.trim()) {
      toast.error('❌ المحتوى مطلوب');
      return;
    }

    if (!imageFile && !formData.image_url) {
      toast.error('❌ الصورة مطلوبة');
      return;
    }

    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      await onSave({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl shadow-fruit-primary/20">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-fruit-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111]/95 backdrop-blur-xl px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fruit-primary to-orange-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-black" />
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-l from-white to-white/80 bg-clip-text text-transparent">
              {item ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:rotate-90 duration-300"
            disabled={saving || uploading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                <FileText size={16} />
                <span>نوع المحتوى *</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'blog' })}
                  className={`relative py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 overflow-hidden ${
                    formData.type === 'blog'
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {formData.type === 'blog' && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                  <span className="relative">📝 تدوينة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'recipe' })}
                  className={`relative py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 overflow-hidden ${
                    formData.type === 'recipe'
                      ? 'bg-gradient-to-br from-fruit-primary to-yellow-500 text-black shadow-lg shadow-fruit-primary/30 scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {formData.type === 'recipe' && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                  <span className="relative">🍳 وصفة</span>
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                <ImageIcon size={16} />
                <span>صورة الغلاف *</span>
              </label>
              {imagePreview ? (
                <div className="relative group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-2xl border border-white/10"
                  />
                  <label className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center cursor-pointer">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                        <Upload size={28} className="text-white" />
                      </div>
                      <span className="px-6 py-3 bg-fruit-primary text-black rounded-xl font-bold inline-block hover:scale-105 transition-transform">
                        تغيير الصورة
                      </span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                      className="hidden" 
                      disabled={uploading || saving}
                    />
                  </label>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-fruit-primary/30 border-t-fruit-primary rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-white font-bold">جاري الرفع...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <label className="block w-full h-64 border-2 border-dashed border-white/20 rounded-2xl hover:border-fruit-primary/50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/5 to-transparent group">
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-fruit-primary/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-fruit-primary/30 group-hover:scale-110 transition-transform duration-300">
                      <Upload size={40} className="text-fruit-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/70 font-bold text-lg mb-1">اضغط لاختيار صورة</p>
                      <p className="text-white/40 text-sm">JPG, PNG أو GIF (أقصى حجم 5MB)</p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageSelect} 
                    className="hidden" 
                    disabled={uploading || saving}
                  />
                </label>
              )}
            </div>

            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                <FileText size={16} />
                <span>العنوان *</span>
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-fruit-primary focus:bg-white/10 focus:outline-none transition-all font-bold text-lg"
                placeholder="أدخل عنواناً جذاباً..."
                disabled={saving || uploading}
                required
              />
            </div>

            {/* Cooking/Reading Time */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                <Timer size={16} />
                <span>{formData.type === 'blog' ? 'وقت القراءة' : 'وقت التحضير'}</span>
              </label>
              <input
                type="text"
                value={formData.cooking_time_ar || ''}
                onChange={(e) => setFormData({ ...formData, cooking_time_ar: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-fruit-primary focus:bg-white/10 focus:outline-none transition-all font-medium"
                placeholder="مثال: 15 دقيقة"
                disabled={saving || uploading}
              />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-white/60">
                <BookOpen size={16} />
                <span>المحتوى *</span>
              </label>
              <textarea
                value={formData.content_ar}
                onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-fruit-primary focus:bg-white/10 focus:outline-none transition-all min-h-[200px] resize-y font-medium leading-relaxed"
                placeholder="اكتب محتوى مفيد وجذاب..."
                disabled={saving || uploading}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-8 mt-8 border-t border-white/10">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={saving || uploading}
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 bg-gradient-to-l from-fruit-primary to-orange-500 text-black rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-fruit-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={saving || uploading}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  جاري الحفظ...
                </span>
              ) : uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  جاري الرفع...
                </span>
              ) : (
                item ? 'حفظ التعديلات' : 'نشر المحتوى'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// ════════════════════════════════════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ════════════════════════════════════════════════════════════════════════

interface DeleteConfirmModalProps {
  id: string;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ id, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(id);
    setDeleting(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-red-500/30 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl shadow-red-500/20">
        {/* Warning Icon */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500/40">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        <h3 className="text-3xl font-black mb-4 text-white">هل أنت متأكد؟</h3>
        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          سيتم حذف هذا المحتوى نهائياً ولن تتمكن من استرجاعه مرة أخرى.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            disabled={deleting}
          >
            إلغاء
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-black hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={deleting}
          >
            {deleting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الحذف...
              </span>
            ) : (
              'حذف نهائياً'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ════════════════════════════════════════════════════════════════════════
// PREVIEW MODAL
// ════════════════════════════════════════════════════════════════════════

interface PreviewModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ recipe, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111]/95 backdrop-blur-xl px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl font-black text-sm ${
              recipe.type === 'blog'
                ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                : 'bg-fruit-primary/20 text-fruit-primary border border-fruit-primary/30'
            }`}>
              {recipe.type === 'blog' ? '📝 تدوينة' : '🍳 وصفة'}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:rotate-90 duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">
          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/10">
            <img 
              src={recipe.image_url} 
              alt={recipe.title_ar} 
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight bg-gradient-to-l from-white via-white to-white/80 bg-clip-text text-transparent">
            {recipe.title_ar}
          </h1>

          {/* Meta */}
          {recipe.cooking_time_ar && (
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-2 px-4 py-2 bg-fruit-primary/10 rounded-xl border border-fruit-primary/30">
                <Clock size={18} className="text-fruit-primary" />
                <span className="text-white/80 font-bold">{recipe.cooking_time_ar}</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-white/80 text-lg leading-relaxed whitespace-pre-line font-medium">
              {recipe.content_ar}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default RecipesDashboard;