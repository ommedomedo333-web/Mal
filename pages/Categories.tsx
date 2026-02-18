import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../contexts/AppContext";
import { categoryService, productService } from "../src/supabase/supabase-service";
import { ArrowRight, RefreshCw, ShoppingCart, Search, Heart } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ─── TINY HELPERS ────────────────────────────────────────────────────────── */
function Stars({ n, size = 13 }: { n: number, size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= n ? "#FFB800" : "#E0E0E0", lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

/* ─── COMPONENTS ──────────────────────────────────────────────────────────── */

function CategoryItemCard({ category, onClick, count = 0, isVisible, delay = 0 }: any) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", background: "#fff", borderRadius: 22,
        padding: "16px 20px 16px 100px",
        marginBottom: 18, cursor: "pointer",
        boxShadow: "0 4px 18px rgba(0,0,0,.08)",
        display: "flex", alignItems: "center",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(28px)", // RTL: loaded from right
        transition: `opacity .4s ease ${delay}s, transform .4s cubic-bezier(.34,1.2,.64,1) ${delay}s`,
        direction: 'rtl'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(-5px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,62,49,.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,.08)"; }}
    >
      {/* Emoji/Icon image overflows right in RTL */}
      <div style={{
        position: "absolute", right: -14, top: "50%",
        transform: "translateY(-50%)",
        width: 88, height: 82,
        background: "#fff", borderRadius: 18,
        boxShadow: "0 4px 16px rgba(0,0,0,.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 46,
        zIndex: 2
      }}>
        {category.icon_name || category.emoji}
      </div>

      <div style={{ flex: 1, marginRight: 60, textAlign: 'right' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          {category.name_ar}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#bbb", marginTop: 2 }}>
          {category.description_ar ? category.description_ar.substring(0, 30) + (category.description_ar.length > 30 ? '...' : '') : 'تسوق الآن'}
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        border: "1px solid #f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#003e31", fontSize: 18, fontWeight: 700,
        flexShrink: 0,
        transform: 'rotate(180deg)' // RTL Arrow
      }}>
        ›
      </div>
    </div>
  );
}

function ExpandableProductCard({ item, accent = "#003e31", onAddToCart, cartItem, isExpanded, onToggle, setCart, setTotalPoints }: any) {
  const [pop, setPop] = useState(false);
  const hasInCart = !!cartItem;
  const points = item.points || Math.round((item.price || 0) * 10);

  function handleAdd(e: any) {
    e.stopPropagation();
    setPop(true); setTimeout(() => setPop(false), 350);
    onAddToCart(item);
  }

  return (
    <div
      onClick={onToggle}
      style={{
        position: "relative",
        background: "#fff",
        borderRadius: 22,
        marginBottom: 18,
        cursor: "pointer",
        boxShadow: isExpanded
          ? `0 12px 40px ${accent}30` // using hex opacity
          : "0 4px 18px rgba(0,0,0,.09)",
        transition: "box-shadow .3s, transform .25s",
        transform: isExpanded ? "translateY(-2px)" : "translateY(0)",
        overflow: "visible",
        direction: 'rtl'
      }}
    >
      {/* Food image — overlaps RIGHT edge for RTL */}
      <div style={{
        position: "absolute",
        right: -14, top: "50%",
        transform: isExpanded ? "translateY(-50%) scale(1.06)" : "translateY(-50%)",
        width: 90, height: 86,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 6px 20px rgba(0,0,0,.13)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44,
        transition: "transform .3s cubic-bezier(.34,1.3,.64,1)",
        zIndex: 3,
        overflow: "hidden"
      }}>
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
          alt={item.name_ar}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ paddingRight: 90, paddingLeft: isExpanded ? 18 : 56, paddingTop: 16, paddingBottom: 16 }}>
        {/* Name */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 4, textAlign: 'right' }}>
          {item.name_ar}
        </div>

        {isExpanded && (
          <div style={{ marginBottom: 10, animation: 'fadeIn .3s ease' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#777", lineHeight: 1.7, marginBottom: 10, marginTop: 2, textAlign: 'right' }}>
              {item.description_ar || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#aaa', background: '#f5f5f5', padding: '2px 8px', borderRadius: 10 }}>{item.unit}</span>
              {item.calories && <span style={{ fontSize: 12, color: '#aaa' }}>🔥 {item.calories} cal</span>}
            </div>
          </div>
        )}

        {/* Stars */}
        <div style={{ textAlign: 'right' }}>
          <Stars n={item.rating || 5} size={13} />
        </div>

        {/* Weight + Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
          {!isExpanded && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#bbb" }}>{item.unit}</span>}
          {isExpanded && (
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: accent }}>{item.price} ج.م</span>
          )}

          {/* Points Badge */}
          <div style={{
            display: "inline-flex", background: "#FFF8E1", color: "#F59E0B",
            border: "1px solid #FDE68A", fontSize: "10px", borderRadius: "20px",
            padding: "1px 6px", fontWeight: 700,
          }}>
            🪙 {points}
          </div>
        </div>

        {!isExpanded && (
          <div style={{ position: "absolute", bottom: 16, left: 18 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: accent }}>{item.price} ج.م</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {!hasInCart ? (
        <button
          onClick={handleAdd}
          style={{
            position: "absolute",
            left: isExpanded ? 18 : -14,
            top: "50%",
            transform: `translateY(-50%) ${pop ? "rotate(45deg) scale(1.3)" : "scale(1)"}`,
            width: 40, height: 40,
            borderRadius: "50%",
            background: isExpanded ? accent : "#fff",
            border: isExpanded ? "none" : "1px solid #f0f0f0",
            color: isExpanded ? "#fff" : accent,
            fontSize: 24, fontWeight: 300,
            cursor: "pointer",
            boxShadow: isExpanded ? `0 4px 14px ${accent}66` : "0 3px 12px rgba(0,0,0,.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
            zIndex: 4,
          }}
        >
          +
        </button>
      ) : (
        <div style={{
          position: "absolute",
          left: isExpanded ? 18 : -14,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          display: 'flex', flexDirection: isExpanded ? 'row' : 'column', alignItems: 'center', gap: 4,
          background: '#fff', padding: '4px', borderRadius: '20px',
          boxShadow: "0 4px 14px rgba(0,0,0,.15)"
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCart((prev: any[]) => prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
              setTotalPoints((prev: number) => prev + points);
            }}
            style={{ width: 28, height: 28, borderRadius: '50%', background: accent, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          <span style={{ fontWeight: 'bold', fontSize: 13, color: '#333' }}>{cartItem.qty}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCart((prev: any[]) => {
                const existing = prev.find(c => c.id === item.id);
                if (existing?.qty === 1) return prev.filter(c => c.id !== item.id);
                return prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
              });
              setTotalPoints((prev: number) => prev - points);
            }}
            style={{ width: 28, height: 28, borderRadius: '50%', background: '#f5f5f5', color: '#555', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────────────────────── */

export default function CategoriesPage({ cart, setCart }: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTotalPoints, totalPoints, pointsPop } = useAppContext() as any;

  // State
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  // Navigation State
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search State

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        categoryService.getCategories(),
        productService.getAllProducts()
      ]);

      if (catRes.success) {
        setCategories(catRes.data);

        // Handle URL param
        const catId = searchParams.get('category');
        if (catId) {
          const found = catRes.data.find((c: any) => c.id === catId);
          if (found) {
            setActiveCategory(found);
          }
        }
      }

      if (prodRes.success) {
        setProducts(prodRes.data);
      }

      setLoading(false);
      setTimeout(() => setViewVisible(true), 100);
    };
    loadData();
  }, []);

  // Fetch Products when Category Selected
  useEffect(() => {
    if (activeCategory) {
      const loadProducts = async () => {
        setProductsLoading(true);
        // reset list
        setProducts([]);
        const res = await productService.getProductsByCategory(activeCategory.id);
        if (res.success) {
          // Simulate slight delay for effect if needed, or set immediately
          setProducts(res.data);
        }
        setProductsLoading(false);
      };
      loadProducts();
      // Update URL
      setSearchParams({ category: activeCategory.id });
    } else {
      setSearchParams({});
    }
  }, [activeCategory]);

  const handleCategoryClick = (cat: any) => {
    setActiveCategory(cat);
    setViewVisible(false); // Reset animation
    setTimeout(() => setViewVisible(true), 50);
  };

  const handleBack = () => {
    setActiveCategory(null);
    setProducts([]);
    setViewVisible(false);
    setTimeout(() => setViewVisible(true), 50);
  };

  const toggleProductExpand = (id: string) => {
    setExpandedProductId(prev => prev === id ? null : id);
  };

  const onAddToCart = (item: any) => {
    setCart((prev: any[]) => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });

    // Points logic
    const pts = item.points || Math.round((item.price || 0) * 10);
    setTotalPoints((prev: number) => prev + pts);

    toast.success(`تمت إضافة ${item.name_ar} للسلة`);
  };

  const filteredCategories = categories.filter(cat =>
    (cat.name_ar && cat.name_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (cat.name_en && cat.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProducts = products.filter(p =>
    (p.name_ar && p.name_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.name_en && p.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Display Products: If activeCategory is set, show its products. If searching, show search results.
  const displayProducts = activeCategory
    ? products.filter(p => p.category === activeCategory.id || p.category_id === activeCategory.id)
    : searchQuery
      ? filteredProducts
      : [];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw className="animate-spin" size={32} color="#003e31" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      paddingBottom: 100,
      fontFamily: "'Tajawal', sans-serif",
      overflowX: 'hidden'
    }}>
      <style>{`
         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&family=Tajawal:wght@400;500;700;800;900&display=swap');
         @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
      `}</style>

      {/* ─── Header ─── */}
      <div style={{
        position: 'relative',
        height: 200, // Increased height
        background: '#003e31',
        marginBottom: -40,
        borderRadius: '0 0 40px 40px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,62,49,0.3)',
        zIndex: 1
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', marginTop: 25 }}>
          {/* Points Pill */}
          <div style={{
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            padding: "6px 14px", borderRadius: "30px",
            fontSize: "13px", fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.2)",
            marginTop: 15,
            animation: pointsPop ? "pointScale 0.4s ease" : "none",
          }}>
            🪙 {totalPoints} pts
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!activeCategory && <div style={{ fontSize: 24, fontWeight: 900, marginTop: 10 }}>الأقسام</div>}
            {activeCategory && (
              <button
                onClick={handleBack}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px',
                  padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'pointer', color: 'white', fontWeight: 'bold'
                }}
              >
                <ArrowRight size={20} className="rtl:rotate-180" />
                <span style={{ fontSize: 13 }}>رجوع</span>
              </button>
            )}
          </div>
        </div>

        {activeCategory ? (
          <div style={{ marginTop: 20, textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 32, marginBottom: 5 }}>{activeCategory.icon_name || activeCategory.emoji}</div>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, margin: 0 }}>{activeCategory.name_ar}</h1>
          </div>
        ) : (
          <div style={{ marginTop: 40, width: '100%', position: 'relative' }}>
            <input
              placeholder="ابحث عن قسم أو منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir="auto"
              style={{
                width: '100%', padding: '14px 45px 14px 20px',
                borderRadius: 20, border: 'none',
                background: 'rgba(255,255,255,0.15)',
                color: 'white', backdropFilter: 'blur(5px)',
                fontSize: 14, outline: 'none'
              }}
            />
            <Search style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} size={18} />
          </div>
        )}
      </div>

      {/* ─── Body ─── */}
      <div style={{ padding: "0 20px", marginTop: 60 }}>

        {/* VIEW: Categories List - Show only if not viewing a specific category */}
        {!activeCategory && (
          <div style={{ marginTop: 20 }}>
            {/* Only show section title if searching */}
            {searchQuery && filteredCategories.length > 0 && (
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#003e31', textAlign: 'right' }}>الأقسام</h3>
            )}

            {filteredCategories.map((cat, i) => (
              <CategoryItemCard
                key={cat.id}
                category={cat}
                isVisible={viewVisible}
                delay={i * 0.07}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}

            {searchQuery && filteredCategories.length === 0 && filteredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                <p>لا توجد نتائج للبحث</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: Products List - Show if activeCategory OR if searching */}
        {(activeCategory || (searchQuery && filteredProducts.length > 0)) && (
          <div style={{ marginTop: 20 }}>
            {searchQuery && !activeCategory && (
              <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#003e31', textAlign: 'right' }}>المنتجات</h3>
            )}

            {displayProducts.map((item, i) => (
              <div
                key={item.id}
                onMouseEnter={() => setExpandedProductId(item.id)}
                onMouseLeave={() => setExpandedProductId(null)}
                style={{
                  animation: `fadeIn 0.5s ease ${i * 0.1}s both`
                }}
              >
                <ExpandableProductCard
                  item={item}
                  accent="#003e31"
                  isExpanded={expandedProductId === item.id}
                  onToggle={() => toggleProductExpand(item.id)}
                  onAddToCart={onAddToCart}
                  cartItem={cart.find((c: any) => c.id === item.id)}
                  setCart={setCart}
                  setTotalPoints={setTotalPoints}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
