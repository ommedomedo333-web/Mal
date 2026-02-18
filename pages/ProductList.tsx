import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { productService, categoryService } from '../src/supabase/supabase-service';
import { Product } from '../src/utils/dataLoader';
import { ShoppingCart, ArrowLeft, Star, Plus, Minus } from 'lucide-react';

const ProductList: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t, language, addToCart, cart, updateQuantity } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) return;
      setLoading(true);
      
      const catRes = await categoryService.getCategories();
      if (catRes.success) {
        const current = catRes.data.find((c: any) => c.id === categoryId);
        if (current) setCategoryName(language === 'ar' ? current.name_ar : current.name_en);
      }

      const prodRes = await productService.getProductsByCategory(categoryId);
      if (prodRes.success) {
        setProducts(prodRes.data);
      }
      setLoading(false);
    };
    loadData();
  }, [categoryId, language]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: { ar: product.name_ar, en: product.name_en },
      price: product.price,
      image: product.images && product.images[0] ? product.images[0] : '🍎'
    });
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const cartItem = cart.find(item => item.product_id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-4 text-center hover:border-fruit-primary/50 transition-all group relative overflow-hidden flex flex-col h-full">
        {product.discount_percent > 0 && (
          <div className="absolute top-4 right-4 bg-fruit-accent text-white text-[10px] font-black px-2 py-1 rounded-lg z-10">
            {product.discount_percent}% {t.off}
          </div>
        )}
        
        <div 
          className="h-40 w-full overflow-hidden rounded-2xl mb-4 bg-white/5 flex items-center justify-center cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name_en} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-6xl">🍎</span>
          )}
        </div>
        
        <h3 
          className="text-white font-black text-lg mb-1 flex-grow text-right cursor-pointer hover:text-fruit-primary transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {language === 'ar' ? product.name_ar : product.name_en}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <Star size={14} fill="currentColor" />
            <span>{(product.rating || 0).toFixed(1)}</span>
          </div>
          <span className="text-white/40 text-xs">{product.weight}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-fruit-primary font-black text-xl">{product.price} <span className="text-xs">{t.egp}</span></span>
          
          {quantity === 0 ? (
            <button 
              onClick={() => handleAddToCart(product)}
              className="p-2 bg-fruit-primary/10 border border-fruit-primary/20 rounded-full text-white hover:bg-fruit-primary transition-all active:scale-95"
            >
              <Plus size={20} />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-fruit-primary/10 rounded-full border border-fruit-primary/20 p-1">
              <button 
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-1 text-white/80 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-white font-black text-sm w-4 text-center">{quantity}</span>
              <button 
                onClick={() => handleAddToCart(product)}
                className="p-1 bg-fruit-primary rounded-full text-white hover:scale-105 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 bg-fruit-bg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-white/60 font-bold mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
          {language === 'ar' ? 'العودة للأقسام' : 'Back to Categories'}
        </button>
        
        <h1 className="text-4xl font-black text-white mb-12">{categoryName}</h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/5 rounded-[32px] animate-pulse" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 font-bold">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
