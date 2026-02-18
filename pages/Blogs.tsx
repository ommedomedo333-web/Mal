import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService, Recipe } from '../src/supabase/recipe-service';
import { useAppContext } from '../contexts/AppContext';
import { ArrowLeft, Clock } from 'lucide-react';

const Blogs: React.FC = () => {
  const { language } = useAppContext();
  const [blogs, setBlogs] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📚 Fetching blogs...');
        const res = await recipeService.getRecipesByType('blog');
        console.log('📖 Recipe service response:', res);
        
        if (res.success) {
          setBlogs(res.data || []);
        } else {
          setError(res.error || (language === 'ar' ? 'فشل تحميل المقالات' : 'Failed to load blogs'));
        }
      } catch (err: any) {
        console.error('❌ Error in Blogs:', err);
        setError(err.message || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'));
      } finally {
        setLoading(false);
      }
    })();
  }, [language]);

  return (
    <div className="min-h-screen bg-fruit-bg py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-fruit-primary hover:text-fruit-primary/80 flex items-center gap-2 font-bold transition-all"
        >
          <ArrowLeft size={20} />
          {language === 'ar' ? 'رجوع' : 'Back'}
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-black mb-3">{language === 'ar' ? 'التدوينات' : 'Our Blogs'}</h1>
          <p className="text-white/40 text-xl">
            {language === 'ar'
              ? 'اكتشف أحدث المقالات والنصائح حول الصحة والتغذية'
              : 'Discover the latest articles and tips about health and nutrition'}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-fruit-primary"></div>
            <p className="mt-4 text-white/60">{language === 'ar' ? 'جارٍ التحميل...' : 'Loading blogs...'}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 mb-6">
            {error}
          </div>
        )}

        {!loading && blogs.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {language === 'ar' ? 'لا توجد مقالات متاحة حالياً' : 'No blogs available at the moment'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <article
              key={blog.id}
              onClick={() => navigate(`/blogs/${blog.id}`)}
              className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-fruit-primary/30 transition-all hover:bg-white/10"
            >
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={language === 'ar' ? blog.title_ar : blog.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-black text-white mb-3 line-clamp-2 group-hover:text-fruit-primary transition-colors">
                  {language === 'ar' ? blog.title_ar : blog.title_en}
                </h2>
                <p className="text-white/60 text-sm line-clamp-3 mb-4">
                  {language === 'ar' ? blog.content_ar?.replace(/<[^>]*>/g, '').substring(0, 100) : blog.content_en?.replace(/<[^>]*>/g, '').substring(0, 100)}
                </p>
                {blog.cooking_time_en && (
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Clock size={14} />
                    <span>{blog.cooking_time_en}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
