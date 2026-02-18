import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService, Recipe } from '../src/supabase/recipe-service';
import { useAppContext } from '../contexts/AppContext';
import { ArrowLeft } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppContext();
  const [blog, setBlog] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError(language === 'ar' ? 'معرف المقالة غير موجود' : 'Blog ID not found');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`🔍 Fetching blog with ID: ${id}`);
        const res = await recipeService.getRecipeById(id);
        console.log('📖 Recipe service response:', res);
        
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError(res.error || (language === 'ar' ? 'فشل تحميل المقالة' : 'Failed to load blog'));
        }
      } catch (err: any) {
        console.error('❌ Error in BlogDetail:', err);
        setError(err.message || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fruit-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fruit-primary"></div>
          <p className="mt-4 text-white/60">{language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fruit-bg p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || (language === 'ar' ? 'لم يتم العثور على المقالة' : 'Blog not found')}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-fruit-primary hover:text-fruit-primary/80 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            {language === 'ar' ? 'رجوع' : 'Go Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fruit-bg py-12">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-fruit-primary hover:text-fruit-primary/80 flex items-center gap-2 font-bold transition-all"
        >
          <ArrowLeft size={20} />
          {language === 'ar' ? 'رجوع' : 'Back'}
        </button>

        <article className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
          <div className="h-96 overflow-hidden">
            <img
              src={blog.image_url}
              alt={language === 'ar' ? blog.title_ar : blog.title_en}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-fruit-orange/20 text-fruit-orange border border-fruit-orange/30 rounded-lg text-sm font-black uppercase">
                {language === 'ar' ? 'تدوينة' : 'BLOG'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {language === 'ar' ? blog.title_ar : blog.title_en}
            </h1>

            {blog.cooking_time_en && (
              <p className="text-white/40 mb-8 text-lg">{blog.cooking_time_en}</p>
            )}

            <div className="prose prose-invert max-w-none text-white/80 leading-relaxed">
              {language === 'ar' ? (
                <div dangerouslySetInnerHTML={{ __html: blog.content_ar || '' }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: blog.content_en || '' }} />
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
