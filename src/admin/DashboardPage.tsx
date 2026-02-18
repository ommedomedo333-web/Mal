
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuthContext } from '../supabase/context-providers';
import { useAdminProducts } from './hooks/useProducts';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CategoryModal from './components/CategoryModal';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBasket, Plus, LogOut, LayoutGrid, List, ChevronLeft, ChevronRight,
    AlertTriangle, Search, Package, TrendingUp, AlertCircle, Edit, Trash2,
    Clock, Bike, CheckCircle, ClipboardList, Store, BookOpen
} from 'lucide-react';
import { categoryService, recipeService } from '../supabase/supabase-service';
import toast from 'react-hot-toast';

interface DashboardProps {
    orderHistory?: any[];
    updateOrderStatus?: (id: string, status: string) => void;
}

const DashboardPage: React.FC<DashboardProps> = ({ orderHistory = [], updateOrderStatus }) => {
    const { user, signOut } = useAuthContext();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'recipes' | 'blogs'>('orders');
    const [view, setView] = useState<'cards' | 'menu'>('cards');
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [categoryModal, setCategoryModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [recipeModal, setRecipeModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleteRecipeConfirm, setDeleteRecipeConfirm] = useState<string | null>(null);

    const { products, loading, error, addProduct, editProduct, removeProduct, refetch } = useAdminProducts();

    // Order status definitions
    const statusMap: any = {
        pending: { label: "انتظار", color: "#F59E0B", icon: <Clock size={16} /> },
        preparing: { label: "تحضير", color: "#3B82F6", icon: <Package size={16} /> },
        shipping: { label: "توصيل", color: "#8B5CF6", icon: <Bike size={16} /> },
        delivered: { label: "تسليم", color: "#22c55e", icon: <CheckCircle size={16} /> },
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const [catRes, recRes] = await Promise.all([
                categoryService.getCategories(),
                recipeService.getRecipes()
            ]);

            if (catRes.success && catRes.data.length > 0) {
                setCategories(catRes.data);
            }
            if (recRes.success) {
                setRecipes(recRes.data);
            }
        };
        loadInitialData();
    }, []);

    const cat = categories[activeIdx] || { id: '', name_ar: 'جاري التحميل...', emoji: '⏳', color: '#333', accent: '#666', dark: '#111' };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = p.category_id === cat.id;
            const matchesSearch = p.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.name_en && p.name_en.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [products, cat.id, searchQuery]);

    const stats = useMemo(() => ({
        total: products.length,
        catTotal: products.filter(p => p.category_id === cat.id).length,
        lowStock: products.filter(p => p.stock_quantity < 10).length,
        revenue: orderHistory.reduce((sum, o) => sum + (o.total || 0), 0),
        orders: {
            pending: orderHistory.filter(o => o.status === 'pending' || !o.status).length,
            preparing: orderHistory.filter(o => o.status === 'preparing').length,
            shipping: orderHistory.filter(o => o.status === 'shipping').length,
            delivered: orderHistory.filter(o => o.status === 'delivered').length,
        }
    }), [products, cat.id, orderHistory]);

    const handleSave = async (payload: any) => {
        try {
            if (modal.item) {
                await editProduct(modal.item.id, payload);
                toast.success('تمت تحديث المنتج بنجاح');
            } else {
                await addProduct({ ...payload, category_id: cat.id });
                toast.success('تمت إضافة المنتج بنجاح');
            }
            setModal({ open: false, item: null });
            refetch();
        } catch (err: any) {
            toast.error('خطأ: ' + err.message);
        }
    };

    };

    const handleSaveRecipe = async (payload: any) => {
        try {
            setLoadingRecipes(true);
            if (recipeModal.item) {
                const res = await recipeService.updateRecipe(recipeModal.item.id, payload);
                if (res.success) toast.success('تم تحديث الوصفة بنجاح');
            } else {
                const res = await recipeService.addRecipe(payload);
                if (res.success) toast.success('تم إضافة الوصفة بنجاح');
            }
            setRecipeModal({ open: false, item: null });
            const res = await recipeService.getRecipes();
            if (res.success) setRecipes(res.data);
        } catch (err: any) {
            toast.error('خطأ: ' + err.message);
        } finally {
            setLoadingRecipes(false);
        }
    };

    const handleDeleteRecipe = async (id: string) => {
        try {
            const res = await recipeService.deleteRecipe(id);
            if (res.success) {
                toast.success('تم حذف الوصفة بنجاح');
                const resRec = await recipeService.getRecipes();
                if (resRec.success) setRecipes(resRec.data);
            }
        } catch (err: any) {
            toast.error('خطأ: ' + err.message);
        } finally {
            setDeleteRecipeConfirm(null);
        }
    };

    const nextCat = () => setActiveIdx((activeIdx + 1) % categories.length);
    const prevCat = () => setActiveIdx((activeIdx - 1 + categories.length) % categories.length);

    return (
        <div dir="rtl" className="min-h-screen bg-[#070707] text-white font-tajawal overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${cat.dark || '#111'}66 0%, transparent 60%)`, transition: 'background 0.8s ease' }} />

            {/* NAVBAR */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-fruit-primary/20 rounded-xl flex items-center justify-center text-fruit-primary">
                            <ShoppingBasket size={24} />
                        </div>
                        <div>
                            <div className="text-lg font-black tracking-tight">لوحة تحكم الأطيب</div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Store Manager</div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                        <button onClick={() => setActiveTab('orders')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-fruit-primary text-black' : 'text-white/60 hover:text-white'}`}>الطلبات</button>
                        <button onClick={() => setActiveTab('products')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-fruit-primary text-black' : 'text-white/60 hover:text-white'}`}>المنتجات</button>
                        <button onClick={() => setActiveTab('categories')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-fruit-primary text-black' : 'text-white/60 hover:text-white'}`}>الأقسام</button>
                        <button onClick={() => setActiveTab('blogs')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-fruit-primary text-black' : 'text-white/60 hover:text-white'}`}>المدونة</button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="بحث..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pr-10 pl-4 text-sm outline-none focus:border-fruit-primary/50 w-64 transition-all"
                        />
                    </div>
                    {activeTab === 'products' && (
                        <button onClick={() => setModal({ open: true, item: null })} className="bg-fruit-primary text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Plus size={18} />
                            <span>إضافة منتج</span>
                        </button>
                    )}
                    {activeTab === 'categories' && (
                        <button onClick={() => setCategoryModal({ open: true, item: null })} className="bg-fruit-primary text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Plus size={18} />
                            <span>إضافة قسم</span>
                        </button>
                    )}
                    {activeTab === 'blogs' && (
                        <button onClick={() => setRecipeModal({ open: true, item: null })} className="bg-fruit-primary text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                            <Plus size={18} />
                            <span>إضافة تدوينة/وصفة</span>
                        </button>
                    )}
                    <button onClick={() => navigate('/categories')} className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-white/10 transition-colors">
                        <Store size={18} />
                    </button>
                    <button onClick={() => signOut()} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <div className="relative z-10 px-6 pt-8 pb-32">
                {activeTab === 'orders' ? (
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center">
                                <p className="text-white/40 text-[10px] font-black uppercase mb-1">إجمالي المبيعات</p>
                                <p className="text-2xl font-black text-fruit-primary">{stats.revenue.toFixed(2)} <span className="text-xs">ج.م</span></p>
                            </div>
                            {['pending', 'preparing', 'shipping', 'delivered'].map(s => (
                                <div key={s} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                                    <p className="text-2xl font-black" style={{ color: (statusMap as any)[s].color }}>{(stats.orders as any)[s]}</p>
                                    <p className="text-white/40 text-[10px] font-bold uppercase mt-1">{(statusMap as any)[s].label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            {orderHistory.length === 0 ? (
                                <div className="py-32 text-center opacity-30">
                                    <ClipboardList size={80} className="mx-auto mb-4" />
                                    <p className="text-xl font-bold">لا توجد طلبات بعد</p>
                                </div>
                            ) : (
                                [...orderHistory].reverse().map(order => {
                                    const currentStatus = order.status || 'pending';
                                    const sInfo = statusMap[currentStatus] || statusMap.pending;
                                    return (
                                        <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-1.5 h-full" style={{ backgroundColor: sInfo.color }} />
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-fruit-primary font-black text-xl">#{order.id}</span>
                                                        <div className="text-white/30 text-xs font-bold">{order.date}</div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {order.items?.map((it: any, idx: number) => (
                                                            <span key={idx} className="bg-white/5 px-2 py-1 rounded text-[10px] border border-white/5">
                                                                {it.qty}x {it.name_ar}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="text-xs text-orange-400 font-bold uppercase tracking-widest">🪙 {order.pts} Points</div>
                                                </div>

                                                <div className="flex flex-col md:items-end gap-4">
                                                    <div className="text-3xl font-black">{order.total?.toFixed(2)} <span className="text-sm font-normal text-white/40">ج.م</span></div>
                                                    <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
                                                        {Object.keys(statusMap).map(statusKey => {
                                                            const info = statusMap[statusKey];
                                                            const active = currentStatus === statusKey;
                                                            return (
                                                                <button
                                                                    key={statusKey}
                                                                    onClick={() => {
                                                                        updateOrderStatus && updateOrderStatus(order.id, statusKey);
                                                                        toast.success(`تم تغيير حالة الطلب #${order.id} إلى ${info.label}`);
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                                                                    style={{ backgroundColor: active ? info.color : '', color: active ? '#fff' : '' }}
                                                                >
                                                                    {info.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ) : activeTab === 'products' ? (
                    <>
                        {/* STATS SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center"><Package size={24} /></div>
                                <div><p className="text-white/40 text-xs font-bold uppercase">إجمالي المنتجات</p><p className="text-2xl font-black">{stats.total}</p></div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-fruit-primary/10 text-fruit-primary rounded-xl flex items-center justify-center"><TrendingUp size={24} /></div>
                                <div><p className="text-white/40 text-xs font-bold uppercase">منتجات القسم الحالي</p><p className="text-2xl font-black">{stats.catTotal}</p></div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center"><AlertCircle size={24} /></div>
                                <div><p className="text-white/40 text-xs font-bold uppercase">نواقص (أقل من 10)</p><p className="text-2xl font-black text-orange-400">{stats.lowStock}</p></div>
                            </div>
                        </div>

                        {/* CATEGORY HEADER */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={prevCat} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"><ChevronRight /></button>
                                    <div className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{cat.icon || cat.emoji || '📦'}</div>
                                    <button onClick={nextCat} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"><ChevronLeft /></button>
                                </div>
                                <h1 className="text-4xl font-black mb-1">{cat.name_ar}</h1>
                                <p className="text-white/40 text-sm tracking-widest uppercase font-bold">{cat.name_en} • {filteredProducts.length} صنف معروض</p>
                            </div>
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                                <button onClick={() => setView('cards')} className={`p-2 rounded-lg transition-all ${view === 'cards' ? 'bg-fruit-primary text-black' : 'text-white/40'}`}><LayoutGrid size={20} /></button>
                                <button onClick={() => setView('menu')} className={`p-2 rounded-lg transition-all ${view === 'menu' ? 'bg-fruit-primary text-black' : 'text-white/40'}`}><List size={20} /></button>
                            </div>
                        </div>

                        {/* PRODUCTS DISPLAY */}
                        {loading ? (
                            <div className="py-20 text-center text-white/20 animate-pulse text-xl">جاري تحميل المنتجات...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                <div className="text-7xl mb-6 opacity-20">🔍</div>
                                <p className="text-white/40 mb-6">{searchQuery ? 'لا توجد نتائج لهذا البحث.' : 'لا يوجد منتجات في هذا القسم بعد.'}</p>
                                {!searchQuery && <button onClick={() => setModal({ open: true, item: null })} className="px-8 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-bold">إضافة أول منتج</button>}
                            </div>
                        ) : view === 'cards' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {filteredProducts.map((p, i) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        accent={cat.accent || '#4ade80'}
                                        onEdit={(item) => setModal({ open: true, item })}
                                        onDelete={(id) => setDeleteConfirm(id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] uppercase font-black text-white/40 border-b border-white/5">
                                            <th className="px-6 py-4">المنتج</th><th className="px-6 py-4">السعر</th><th className="px-6 py-4">المخزون</th><th className="px-6 py-4">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(p => (
                                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover bg-white/5 border border-white/5 group-hover:scale-110 transition-transform" alt="" />
                                                    <span className="font-bold">{p.name_ar}</span>
                                                </td>
                                                <td className="px-6 py-4 font-black text-fruit-primary">{p.price} ج.م</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.stock_quantity < 10 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                        {p.stock_quantity || 0} {p.unit}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setModal({ open: true, item: p })} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"><Edit size={16} /></button>
                                                        <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : activeTab === 'categories' ? (
                    <div className="mb-10 max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div><h1 className="text-4xl font-black mb-1">إدارة الأقسام</h1><p className="text-white/40 text-sm font-bold">يمكنك إضافة أو تعديل أو حذف الأقسام الرئيسية للمتجر</p></div>
                            <button onClick={() => setCategoryModal({ open: true, item: null })} className="bg-fruit-primary text-black px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-fruit-primary/20 hover:scale-105 active:scale-95 transition-all">
                                <Plus size={22} /><span>إضافة قسم جديد</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map(c => (
                                <div key={c.id} className="bg-white/5 border border-white/10 p-6 rounded-[28px] flex items-center justify-between hover:bg-white/[0.07] transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                            {c.icon || c.emoji || '📦'}
                                        </div>
                                        <div>
                                            <div className="text-xl font-black text-white">{c.name_ar}</div>
                                            <div className="text-xs text-white/20 font-bold uppercase tracking-widest">{c.name_en} • {products.filter(p => p.category_id === c.id).length} منتج</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setCategoryModal({ open: true, item: c })} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-fruit-primary/10 text-white/40 hover:text-fruit-primary transition-all"><Edit size={20} /></button>
                                        <button onClick={() => handleDeleteCategory(c.id)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* BLOGS & RECIPES TAB (MERGED) */
                    <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black mb-1">إدارة المحتوى والمدونة</h1>
                                <p className="text-white/40 text-sm font-bold">شارك عملاءك تدوينات صحية وأحدث الأخبار والوصفات</p>
                            </div>
                            <button
                                onClick={() => setRecipeModal({ open: true, item: null })}
                                className="bg-fruit-primary text-black px-8 py-4 rounded-2xl text-lg font-black flex items-center gap-3 shadow-xl shadow-fruit-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus size={24} />
                                <span>إضافة محتوى جديد</span>
                            </button>
                        </div>

                        {loadingRecipes ? (
                            <div className="py-32 text-center text-white/20 animate-pulse text-2xl font-black">جاري تحميل المحتوى...</div>
                        ) : recipes.length === 0 ? (
                            <div className="py-40 text-center bg-white/5 border-2 border-dashed border-white/10 rounded-[60px] backdrop-blur-md">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-white/10">
                                    <BookOpen size={48} />
                                </div>
                                <h3 className="text-2xl font-black mb-4">لا يوجد محتوى بعد</h3>
                                <p className="text-white/30 mb-10 max-w-md mx-auto">ابدأ بكتابة أول تدوينة أو وصفة لتظهر في الصفحة الرئيسية للمتجر.</p>
                                <button
                                    onClick={() => setRecipeModal({ open: true, item: null })}
                                    className="px-10 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-lg"
                                >
                                    أضف أول محتوى
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {recipes.map((blog) => (
                                    <RecipeCard
                                        key={blog.id}
                                        recipe={blog}
                                        onEdit={(item) => setRecipeModal({ open: true, item })}
                                        onDelete={(id) => setDeleteRecipeConfirm(id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* DELETE RECIPE CONFIRMATION PORTAL */}
            {deleteRecipeConfirm && createPortal(
                <div className="fixed inset-0 flex items-center justify-center p-6" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', zIndex: 1000000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setDeleteRecipeConfirm(null)} style={{ zIndex: -1 }} />
                    <div className="relative bg-[#111] border border-red-500/40 p-10 rounded-[40px] max-w-md w-full text-center shadow-[0_0_150px_rgba(239,68,68,0.3)] animate-in zoom-in duration-300" style={{ zIndex: 1000001 }}>
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <Trash2 size={48} />
                        </div>
                        <h3 className="text-3xl font-black mb-4 text-white">حذف التدوينة؟</h3>
                        <p className="text-white/60 mb-12 text-lg leading-relaxed">هل أنت متأكد من حذف هذه التدوينة؟ <br /><span className="text-red-400 font-bold">سيتم إزالتها نهائياً من المتجر.</span></p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <button onClick={() => setDeleteRecipeConfirm(null)} className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-white hover:bg-white/10 transition-all text-lg">تراجع</button>
                            <button onClick={() => deleteRecipeConfirm && handleDeleteRecipe(deleteRecipeConfirm)} className="flex-1 py-5 rounded-2xl bg-red-600 text-white font-black shadow-2xl shadow-red-600/40 hover:bg-red-700 active:scale-95 transition-all text-lg">نعم، احذف</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            {/* DELETE CONFIRMATION PORTAL (FROM OLD DASHBOARD) */}
            {deleteConfirm && createPortal(
                <div className="fixed inset-0 flex items-center justify-center p-6" style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', zIndex: 1000000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setDeleteConfirm(null)} style={{ zIndex: -1 }} />
                    <div className="relative bg-[#111] border border-red-500/40 p-10 rounded-[40px] max-w-md w-full text-center shadow-[0_0_150px_rgba(239,68,68,0.3)] animate-in zoom-in duration-300" style={{ zIndex: 1000001 }}>
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <AlertTriangle size={48} />
                        </div>
                        <h3 className="text-3xl font-black mb-4 text-white">تأكيد الحذف النهائي</h3>
                        <p className="text-white/60 mb-12 text-lg leading-relaxed">أنت على وشك حذف هذا العنصر. <br /><span className="text-red-400 font-bold">هذا الإجراء لا يمكن التراجع عنه.</span></p>
                        <div className="flex flex-col sm:flex-row gap-5">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-white hover:bg-white/10 transition-all text-lg">تراجع</button>
                            <button onClick={async () => {
                                if (deleteConfirm) {
                                    const toastId = toast.loading('جاري الحذف...');
                                    try {
                                        await removeProduct(deleteConfirm);
                                        toast.success('تم الحذف بنجاح', { id: toastId });
                                        setDeleteConfirm(null);
                                        refetch();
                                    } catch (err: any) { toast.error('فشل الحذف: ' + err.message, { id: toastId }); }
                                }
                            }} className="flex-1 py-5 rounded-2xl bg-red-600 text-white font-black shadow-2xl shadow-red-600/40 hover:bg-red-700 active:scale-95 transition-all text-lg">نعم، احذف الآن</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            <ProductModal open={modal.open} onClose={() => setModal({ open: false, item: null })} onSave={handleSave} initial={modal.item} accent={cat.accent || '#4ade80'} categories={categories} />
            <CategoryModal open={categoryModal.open} onClose={() => setCategoryModal({ open: false, item: null })} onSave={handleSaveCategory} initial={categoryModal.item} />
            <RecipeModal open={recipeModal.open} onClose={() => setRecipeModal({ open: false, item: null })} onSave={handleSaveRecipe} initial={recipeModal.item} />
        </div>
    );
};

export default DashboardPage;

