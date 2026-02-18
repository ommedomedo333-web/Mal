import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock, User, X, Calendar, Tag } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { recipeService } from '../src/supabase/supabase-service';

interface Blog {
  id: string;
  title_ar: string;
  title_en?: string;
  content_ar: string;
  content_en?: string;
  cooking_time_ar?: string;
  cooking_time_en?: string;
  image_url: string;
  type: 'blog' | 'recipe';
  author?: string;
  created_at?: string;
}

const BlogsPage: React.FC = () => {
  const { language, t } = useAppContext();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      const res = await recipeService.getRecipes();
      if (res.success) {
        setBlogs(res.data);
        
        // إذا كان هناك blogId في الرابط، افتح المودال مباشرة
        if (blogId) {
          const blog = res.data.find((b: Blog) => b.id === blogId);
          if (blog) setSelectedBlog(blog);
        }
      }
      setLoading(false);
    };
    loadBlogs();
  }, [blogId]);

  const openBlogModal = (blog: Blog) => {
    setSelectedBlog(blog);
    // تحديث الرابط بدون إعادة تحميل الصفحة
    window.history.pushState({}, '', `/blogs/${blog.id}`);
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
    window.history.pushState({}, '', '/blogs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a3d2c] via-[#0a5c3d] to-[#0a3d2c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fruit-primary/30 border-t-fruit-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-bold">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a3d2c] via-[#0a5c3d] to-[#0a3d2c]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 font-bold transition-colors"
          >
            <ArrowRight size={20} className={language === 'ar' ? '' : 'rotate-180'} />
            {language === 'ar' ? 'رجوع' : 'Back'}
          </button>

          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              {language === 'ar' ? 'التدوينات' : 'Blogs'}
            </h1>
            <p className="text-lg text-white/60 font-medium">
              {language === 'ar' ? 'اكتشف أحدث المقالات والنصائح حول الصحة والتغذية' : 'Discover the latest articles and tips on health and nutrition'}
            </p>
          </div>

          {/* Blogs Grid */}
          {blogs.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-white/40 text-xl">
                {language === 'ar' ? 'لا توجد مقالات متاحة حالياً' : 'No articles available currently'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <article
                  key={blog.id}
                  onClick={() => openBlogModal(blog)}
                  className="group bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-fruit-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-fruit-primary/10 hover:scale-[1.02] cursor-pointer backdrop-blur-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.image_url}
                      alt={language === 'ar' ? blog.title_ar : blog.title_en || blog.title_ar}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Type Badge */}
                    <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} px-3 py-1.5 rounded-lg font-black text-xs backdrop-blur-md border shadow-lg ${
                      blog.type === 'blog'
                        ? 'bg-orange-500/90 text-white border-orange-400/50'
                        : 'bg-fruit-primary/90 text-black border-fruit-primary/50'
                    }`}>
                      {blog.type === 'blog' 
                        ? (language === 'ar' ? '📝 تدوينة' : '📝 BLOG')
                        : (language === 'ar' ? '🍳 وصفة' : '🍳 RECIPE')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-white font-black text-xl mb-3 line-clamp-2 leading-tight">
                      {language === 'ar' ? blog.title_ar : blog.title_en || blog.title_ar}
                    </h3>
                    
                    <div className="flex items-center justify-between text-white/50 text-sm">
                      {blog.cooking_time_ar && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-fruit-primary" />
                          <span className="font-medium">
                            {language === 'ar' ? blog.cooking_time_ar : blog.cooking_time_en || blog.cooking_time_ar}
                          </span>
                        </div>
                      )}
                      
                      {blog.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span className="font-medium">
                            {new Date(blog.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={closeBlogModal}
        >
          <div
            className="relative bg-gradient-to-br from-[#0a3d2c] to-[#0a5c3d] border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0a3d2c]/95 backdrop-blur-xl px-6 md:px-8 py-5 border-b border-white/10 flex items-center justify-between">
              <div className={`px-4 py-2 rounded-xl font-black text-sm ${
                selectedBlog.type === 'blog'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-fruit-primary/20 text-fruit-primary border border-fruit-primary/30'
              }`}>
                {selectedBlog.type === 'blog'
                  ? (language === 'ar' ? '📝 تدوينة' : '📝 BLOG')
                  : (language === 'ar' ? '🍳 وصفة' : '🍳 RECIPE')}
              </div>
              <button
                onClick={closeBlogModal}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all hover:rotate-90 duration-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 md:p-8">
              {/* Cover Image */}
              <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img
                  src={selectedBlog.image_url}
                  alt={language === 'ar' ? selectedBlog.title_ar : selectedBlog.title_en || selectedBlog.title_ar}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight text-white">
                {language === 'ar' ? selectedBlog.title_ar : selectedBlog.title_en || selectedBlog.title_ar}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/10">
                {selectedBlog.cooking_time_ar && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-fruit-primary/10 rounded-xl border border-fruit-primary/30">
                    <Clock size={18} className="text-fruit-primary" />
                    <span className="text-white/80 font-bold text-sm">
                      {language === 'ar' ? selectedBlog.cooking_time_ar : selectedBlog.cooking_time_en || selectedBlog.cooking_time_ar}
                    </span>
                  </div>
                )}
                
                {selectedBlog.author && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <User size={18} className="text-white/60" />
                    <span className="text-white/80 font-bold text-sm">{selectedBlog.author}</span>
                  </div>
                )}

                {selectedBlog.created_at && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <Calendar size={18} className="text-white/60" />
                    <span className="text-white/80 font-bold text-sm">
                      {new Date(selectedBlog.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <div className="text-white/80 text-lg leading-relaxed whitespace-pre-line font-medium">
                  {language === 'ar' ? selectedBlog.content_ar : selectedBlog.content_en || selectedBlog.content_ar}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BlogsPage;