"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, Leaf, Plus, Minus, Globe } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { productService } from '../src/supabase/supabase-service';
import { Product } from '../src/utils/dataLoader';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { t, language, addToCart, removeFromCart, cart } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      setLoading(true);
      // سنستخدم الخدمة التي تدعم الـ Fallback للبيانات المحلية تلقائياً
      const res = await productService.getProductsByCategory(''); // محاكاة لجلب البيانات
      // في الواقع سنحتاج دالة getProductById في الخدمة، سأقوم بتحديث الخدمة لاحقاً
      // حالياً سنبحث في البيانات المحلية مباشرة لضمان السرعة
      const allProducts = (await import('../src/data/products.json')).products;
      const found = allProducts.find((p: any) => p.id === productId);
      
      if (found) {
        setProduct(found as Product);
      }
      setLoading(false);
    };
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-fruit-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fruit-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-fruit-bg flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-black mb-4">{language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</h2>
        <button onClick={() => navigate(-1)} className="text-fruit-primary font-bold flex items-center gap-2">
          <ArrowLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
          {language === 'ar' ? 'العودة' : 'Go Back'}
        </button>
      </div>
    );
  }

  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="min-h-screen bg-fruit-bg pb-32 pt-6 px-4 md:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold"
        >
          <ArrowLeft size={24} className={language === 'ar' ? 'rotate-180' : ''} />
          {language === 'ar' ? 'العودة' : 'Back'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative group">
            <div className="aspect-square rounded-[48px] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
              <img 
                src={product.images[0]} 
                alt={product.name_en} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {product.discount_percent > 0 && (
              <div className="absolute top-8 right-8 bg-fruit-accent text-white px-4 py-2 rounded-2xl font-black text-lg shadow-xl animate-bounce">
                {product.discount_percent}% {t.off}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1 bg-fruit-primary/20 text-fruit-primary rounded-full text-xs font-black uppercase tracking-widest border border-fruit-primary/20">
                  {product.category.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 font-black">
                  <Star size={18} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="text-white/20 text-sm font-medium">({product.reviews_count})</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {language === 'ar' ? product.name_ar : product.name_en}
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                {language === 'ar' ? product.description_ar : product.description_en}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-fruit-primary/20 rounded-xl flex items-center justify-center text-fruit-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase">{language === 'ar' ? 'المنشأ' : 'Origin'}</p>
                  <p className="text-white font-black">{language === 'ar' ? product.origin_ar : product.origin_en}</p>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 bg-fruit-orange/20 rounded-xl flex items-center justify-center text-fruit-orange">
                  <Leaf size={20} />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase">{language === 'ar' ? 'الوزن' : 'Weight'}</p>
                  <p className="text-white font-black">{product.weight}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-white/80 font-bold">
                <ShieldCheck className="text-fruit-primary" size={20} />
                <span>{language === 'ar' ? 'ضمان الجودة والطزاجة' : 'Quality & Freshness Guaranteed'}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80 font-bold">
                <Truck className="text-fruit-primary" size={20} />
                <span>{language === 'ar' ? 'توصيل سريع خلال 6 ساعات' : 'Express Delivery within 6 Hours'}</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="mt-auto bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-white/40 text-sm font-bold mb-1">{language === 'ar' ? 'السعر' : 'Price'}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-white">{product.price} <span className="text-lg">{t.egp}</span></span>
                    {product.old_price > product.price && (
                      <span className="text-white/20 line-through text-xl">{product.old_price}</span>
                    )}
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl border border-white/10">
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-black text-white w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: { ar: product.name_ar, en: product.name_en },
                      price: product.price,
                      image: product.images[0]
                    })}
                    className="w-10 h-10 bg-fruit-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-fruit-primary/20 hover:scale-105 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (quantity === 0) {
                    addToCart({
                      id: product.id,
                      name: { ar: product.name_ar, en: product.name_en },
                      price: product.price,
                      image: product.images[0]
                    });
                  }
                  navigate('/');
                  // هنا يمكن إضافة منطق الانتقال للسلة مباشرة
                }}
                className="w-full py-5 bg-fruit-primary text-white rounded-[24px] font-black text-xl shadow-2xl shadow-fruit-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;