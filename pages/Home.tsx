import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from '../components/Slides/ProgressBar.tsx';
import Slide from '../components/Slides/Slide.tsx';
import Buzzer from '../components/Buzzer.tsx';
import { useAppContext } from '../contexts/AppContext.tsx';
import { useAuthContext } from '../src/supabase/context-providers.tsx';

import {
  Wallet, Zap, Leaf, ArrowRight, Star, ShieldCheck, Brain,
  Crown, Utensils, Smartphone, CheckCircle2, Clock, MapPin,
  X, ShoppingBag, Menu, X as CloseIcon, User, LogIn, LogOut,
  Globe, Sun, Moon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import { getFeaturedOffers, Category, getIconComponent } from '../src/utils/dataLoader.tsx';
import { categoryService, recipeService, authService } from '../src/supabase/supabase-service.js';

// --- المكونات الفرعية المساعدة ---
const WalletPlanCard = ({ name, price, members, color }: any) => {
  const { t, language } = useAppContext();
  return (
    <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:border-fruit-primary/40 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-2.5 h-14 ${color} rounded-full shadow-lg`} />
        <div>
          <p className="text-white font-black text-lg">{name}</p>
          <p className="text-xs text-white/40">{t.idealFor} {members} {t.members}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-fruit-primary font-black text-2xl">{price} <span className="text-xs">{t.egp}</span></p>
        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{t.rechargeNow}</p>
      </div>
    </div>
  );
};

const CategoryIcon = ({ icon: Icon, label, categoryId }: any) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center gap-4 group cursor-pointer"
      onClick={() => navigate(`/categories?category=${categoryId}`)}
    >
      <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10 group-hover:bg-fruit-primary group-hover:border-fruit-primary group-hover:rotate-6 transition-all duration-500 shadow-xl">
        <Icon size={36} className="text-white group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-white/60 font-black text-sm group-hover:text-white tracking-tight">{label}</span>
    </div>
  );
};

const Home: React.FC = () => {
  const { t, language, cart, cartTotal, removeFromCart, setLanguage, placeOrder, setUser, totalPoints } = useAppContext();
  const { user } = useAuthContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [homeCategories, setHomeCategories] = useState<Category[]>([]);
  const [homeRecipes, setHomeRecipes] = useState<any[]>([]);
  const [showInstallButton, setShowInstallButton] = useState(!!(window as any).deferredPrompt);
  const navigate = useNavigate();

  // ── Touch / Swipe refs ───────────────────────────────────────
  const touchStartY    = useRef<number | null>(null);
  const touchStartX    = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleLogout = async () => {
    const res = await authService.signOut();
    if (res.success) {
      setUser(null);
      toast.success(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
      setSidebarOpen(false);
      navigate('/login');
    } else {
      toast.error(language === 'ar' ? 'فشل تسجيل الخروج' : 'Logout failed');
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const [catRes, recRes] = await Promise.all([
        categoryService.getCategories(),
        recipeService.getRecipes(),
      ]);
      if (catRes.success) setHomeCategories(catRes.data.slice(0, 10));
      if (recRes.success) setHomeRecipes(recRes.data.slice(0, 3));
    };
    loadInitialData();
  }, []);

  const slidesData = [
    {
      id: 0,
      image: 'https://scontent.fcai19-3.fna.fbcdn.net/v/t39.30808-6/490957208_122157524360562826_547959309317714243_n.png?stp=dst-png_s960x960&_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_ohc=zLf7ixijh3MQ7kNvwGZDJdq&_nc_oc=AdkzdvotuCU6WkD2i_ynEkjXiY4SzcIMP9tb70FMe6I_FQQg5o3E5iUfDbpU-K2_ggg&_nc_zt=23&_nc_ht=scontent.fcai19-3.fna&_nc_gid=DDSgOx-ZcFkVdXjaQqUv1Q&oh=00_AfuBQQk4UOm7548eCA054BukIy3nEeGRF8Mcwlgw2bMiRw&oe=699BCEE7',
      content: (
        <div className="hero-zoom-wrapper">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@800&display=swap');
            * { padding:0; margin:0; box-sizing:border-box; }
            .hero-zoom-wrapper {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
              background: #000;
            }
            .hero-zoom__starship,
            .hero-zoom__scene {
              width: 100%; height: 100%;
              position: absolute;
              left: 50%; top: 50%;
              transform: translate(-50%, -50%);
            }
            @media (min-width: 769px) {
              .hero-zoom__starship, .hero-zoom__scene { object-fit: fill; }
            }
            @media (max-width: 768px) {
              .hero-zoom__starship, .hero-zoom__scene {
                object-fit: cover; object-position: center;
                width: 100vw; height: 100dvh;
              }
            }
            @media (max-width: 480px) {
              .hero-zoom__starship, .hero-zoom__scene {
                object-fit: cover; width: 100%; height: 100%;
                min-width: 100vw; min-height: 100dvh;
              }
            }
            .hero-zoom__title {
              font-family: "Oxanium", sans-serif; font-weight: 800;
              position: absolute;
              font-size: clamp(1.5rem, 8vw, 8rem);
              color: white; left: 50%; top: 50%;
              transform: translate(-50%, -50%);
              z-index: 2;
              animation: zoomContract 8s ease-in-out infinite;
              mix-blend-mode: overlay; text-align: center;
              line-height: 1.1; white-space: nowrap; padding: 0 1rem;
            }
            .hero-zoom__starship { animation: starshipZoom 8s ease-in-out infinite; z-index: 3; pointer-events: none; }
            .hero-zoom__scene    { animation: sceneZoom   8s ease-in-out infinite; z-index: 1; pointer-events: none; }
            .hero-zoom__buttons {
              position: absolute; bottom: 8%; left: 50%;
              transform: translateX(-50%); z-index: 4;
              display: flex; flex-direction: column;
              gap: 0.75rem; align-items: center;
              animation: fadeInButtons 2s ease-out 1s backwards;
              width: 90%; max-width: 500px;
            }
            @media (min-width: 640px) { .hero-zoom__buttons { flex-direction: row; gap: 1.5rem; width: auto; } }
            .hero-zoom__button {
              position: relative; overflow: hidden;
              transition: all 0.3s ease; width: 100%; text-align: center;
              touch-action: manipulation; -webkit-tap-highlight-color: transparent;
            }
            @media (min-width: 640px) { .hero-zoom__button { width: auto; } }
            .hero-zoom__button::before {
              content:''; position:absolute; top:50%; left:50%;
              width:0; height:0; border-radius:50%;
              background:rgba(255,255,255,0.2);
              transform:translate(-50%,-50%);
              transition: width .6s, height .6s;
            }
            .hero-zoom__button:hover::before { width:300px; height:300px; }
            .hero-zoom__button:hover  { transform: translateY(-3px) scale(1.05); box-shadow: 0 15px 50px rgba(0,0,0,0.4); }
            .hero-zoom__button:active { transform: translateY(0) scale(0.98); }
            @media (hover:none) and (pointer:coarse) { .hero-zoom__button:active { transform: scale(0.95); } }
            @keyframes zoomContract {
              0%,100% { letter-spacing:-1.5rem; opacity:.3; transform:translate(-50%,-50%) scale(0.5); }
              15%     { letter-spacing:0;       opacity:1;  transform:translate(-50%,-50%) scale(1);   }
              50%     { letter-spacing:.1rem;   opacity:1;  transform:translate(-50%,-50%) scale(1.1); }
              85%     { letter-spacing:0;       opacity:1;  transform:translate(-50%,-50%) scale(1);   }
            }
            @keyframes sceneZoom {
              0%,100% { filter:blur(20px); transform:translate(-50%,-50%) scale(1);   opacity:.7; }
              15%     { filter:blur(10px); transform:translate(-50%,-50%) scale(1.1); opacity:.9; }
              50%     { filter:blur(0px);  transform:translate(-50%,-50%) scale(1.4); opacity:1;  }
              85%     { filter:blur(8px);  transform:translate(-50%,-50%) scale(1.2); opacity:.9; }
            }
            @keyframes starshipZoom {
              0%,100% { transform:translate(-50%,-50%) scale(1);   opacity:.5; }
              15%     { transform:translate(-50%,-50%) scale(1.5); opacity:.7; }
              50%     { transform:translate(-50%,-50%) scale(5);   opacity:1;  }
              85%     { transform:translate(-50%,-50%) scale(2);   opacity:.8; }
            }
            @keyframes fadeInButtons {
              0%   { opacity:0; transform:translateX(-50%) translateY(30px); }
              100% { opacity:1; transform:translateX(-50%) translateY(0);    }
            }
            @media (max-width: 768px) {
              .hero-zoom__title {
                font-size: clamp(1.2rem,7vw,3rem) !important;
                white-space: normal !important; max-width: 85% !important; line-height: 1.15 !important;
              }
              .hero-zoom__buttons { bottom: 5%; gap: .6rem; }
            }
            @media (max-width: 375px) {
              .hero-zoom__title { font-size: clamp(1rem,6.5vw,2.5rem) !important; max-width: 90% !important; }
              .hero-zoom__buttons { bottom: 4%; }
            }
            @media (max-height: 500px) and (orientation: landscape) {
              .hero-zoom__title { font-size: clamp(1rem,5vh,2rem) !important; top: 45% !important; }
              .hero-zoom__buttons { bottom:3% !important; flex-direction:row !important; gap:.5rem !important; }
            }
            [dir="rtl"] .hero-zoom__title { direction: rtl; }
            .hero-zoom-wrapper::after {
              content:''; position:absolute; inset:0;
              background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
              z-index:2; pointer-events:none;
            }
          `}</style>

          <img
            src="https://scontent.fcai19-3.fna.fbcdn.net/v/t39.30808-6/490957208_122157524360562826_547959309317714243_n.png?stp=dst-png_s960x960&_nc_cat=111&ccb=1-7&_nc_sid=2a1932&_nc_ohc=zLf7ixijh3MQ7kNvwGZDJdq&_nc_oc=AdkzdvotuCU6WkD2i_ynEkjXiY4SzcIMP9tb70FMe6I_FQQg5o3E5iUfDbpU-K2_ggg&_nc_zt=23&_nc_ht=scontent.fcai19-3.fna&_nc_gid=DDSgOx-ZcFkVdXjaQqUv1Q&oh=00_AfuBQQk4UOm7548eCA054BukIy3nEeGRF8Mcwlgw2bMiRw&oe=699BCEE7"
            alt="Elatyab Portal"
            className="hero-zoom__scene"
            loading="eager"
          />
          <img
            src="https://design-fenix.com.ar/codepen/scroll/starship.webp"
            alt="Starship Effect"
            className="hero-zoom__starship"
          />
          <h1 className="hero-zoom__title">
            {language === 'ar' ? (<>المستقبل هنا<br />الأطيب</>) : (<>The Future Is<br />Already Here</>)}
          </h1>
        </div>
      ),
    },
// ══════════════════════════════════════════════════════════════
// استبدل content الـ Slide id=1 في Home.tsx بهذا الكود كاملاً
// نفس المحتوى الأصلي + clamp لكل الأحجام لتناسب الهاتف
// ══════════════════════════════════════════════════════════════

{
  id: 1,
  image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=2000',
  content: (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: 'clamp(56px,9vh,72px) clamp(12px,4vw,40px) clamp(56px,9vh,72px)',
      gap: 'clamp(6px,1.4vh,14px)',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <style>{`
        /* Badge */
        .s1-badge {
          padding: clamp(3px,.7vh,7px) clamp(10px,3vw,20px);
          background: rgba(16,185,129,.2);
          color: #10b981;
          font-size: clamp(7px,1.6vw,11px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .18em;
          border: 1px solid rgba(16,185,129,.3);
          border-radius: 999px;
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }

        /* Title */
        .s1-title {
          font-size: clamp(18px,5.5vw,56px);
          font-weight: 900;
          color: #fff;
          text-align: center;
          line-height: 1.15;
          letter-spacing: -.02em;
          margin: 0;
        }

        /* Desc */
        .s1-desc {
          font-size: clamp(9px,2vw,16px);
          color: rgba(255,255,255,.65);
          text-align: center;
          max-width: 540px;
          line-height: 1.6;
          font-weight: 500;
          margin: 0;
          padding: 0 clamp(4px,2vw,16px);
        }

        /* Feature Cards Grid */
        .s1-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(5px,1.5vw,14px);
          width: 100%;
          max-width: 820px;
        }
        .s1-feature-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: clamp(10px,2.5vw,24px);
          padding: clamp(8px,1.8vh,18px) clamp(6px,1.5vw,14px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(3px,.8vh,6px);
          backdrop-filter: blur(12px);
          transition: all .4s cubic-bezier(.4,0,.2,1);
        }
        .s1-feature-card:hover {
          background: rgba(255,255,255,.08);
          transform: translateY(-4px);
        }
        .s1-feature-icon {
          font-size: clamp(16px,3.5vw,28px);
          line-height: 1;
        }
        .s1-feature-title {
          font-size: clamp(9px,2vw,16px);
          font-weight: 900;
          color: #fff;
          line-height: 1.2;
        }
        .s1-feature-desc {
          font-size: clamp(7px,1.5vw,11px);
          color: rgba(255,255,255,.55);
          line-height: 1.45;
          /* تظهر فقط على شاشات أكبر من الهاتف */
          display: none;
        }
        @media (min-height: 700px) and (min-width: 380px) {
          .s1-feature-desc { display: block; }
        }

        /* Stats Grid */
        .s1-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(5px,1.5vw,12px);
          width: 100%;
          max-width: 820px;
        }
        .s1-stat-box {
          text-align: center;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: clamp(10px,2vw,18px);
          padding: clamp(6px,1.4vh,14px) 6px;
          backdrop-filter: blur(8px);
        }
        .s1-stat-num {
          font-size: clamp(13px,3.5vw,30px);
          font-weight: 900;
          background: linear-gradient(135deg,#10b981 0%,#059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        .s1-stat-label {
          font-size: clamp(6px,1.4vw,10px);
          color: rgba(255,255,255,.55);
          font-weight: 600;
          margin-top: 3px;
          line-height: 1.3;
        }

        /* CTA Buttons */
        .s1-cta-row {
          display: flex;
          gap: clamp(8px,2vw,14px);
          width: 100%;
          max-width: 820px;
          justify-content: center;
        }
        .s1-cta-btn {
          flex: 1;
          max-width: 240px;
          padding: clamp(8px,1.8vh,16px) clamp(10px,2.5vw,28px);
          border-radius: clamp(12px,2.5vw,20px);
          font-size: clamp(9px,2vw,15px);
          font-weight: 900;
          cursor: pointer;
          transition: all .2s;
          border: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .s1-cta-btn:active { transform: scale(.95); }
        .s1-cta-outline {
          background: rgba(255,255,255,.05);
          color: #fff;
          border: 1px solid rgba(255,255,255,.15) !important;
          backdrop-filter: blur(8px);
        }
        .s1-cta-outline:hover { background: rgba(255,255,255,.10); }
        .s1-cta-primary {
          background: #10b981;
          color: #fff;
          box-shadow: 0 8px 28px rgba(16,185,129,.35);
        }
        .s1-cta-primary:hover { background: rgba(16,185,129,.85); }
      `}</style>

      {/* ── Badge ─────────────────────────────────────────── */}
      <span className="s1-badge ae-1">
        {language === 'ar' ? '✨ طبيعي 100% • طازج يومياً' : '✨ 100% NATURAL • FRESH DAILY'}
      </span>

      {/* ── Title ─────────────────────────────────────────── */}
      <h1 className="s1-title ae-2">
        {language === 'ar'
          ? <>سوق <span style={{ color: '#10b981' }}>الفواكه الأطيب</span></>
          : <><span style={{ color: '#10b981' }}>ELATYAB</span> MARKET</>}
      </h1>

      {/* ── Description ───────────────────────────────────── */}
      <p className="s1-desc ae-3">
        {language === 'ar'
          ? 'استمتع بأجود أنواع الفواكه والخضروات المختارة بعناية من المزارع إليك مباشرة مع خدمة التوصيل السريع.'
          : 'Enjoy the finest selection of fruits and vegetables, handpicked from farms directly to your doorstep with express delivery.'}
      </p>

      {/* ── Feature Cards (نفس الأصل) ──────────────────────── */}
      <div className="s1-feature-grid ae-4">
        {[
          {
            icon: '🌱',
            titleAr: 'طازج يومياً',   titleEn: 'Fresh Daily',
            descAr: 'يتم اختيار كل ثمرة بعناية في الصباح الباكر لضمان أقصى درجات النضج والطعم.',
            descEn: 'Each fruit is carefully selected early in the morning to ensure peak ripeness.',
          },
          {
            icon: '⚡',
            titleAr: 'توصيل سريع',    titleEn: 'Express Delivery',
            descAr: 'استلام الطلب المريح في أقل من ساعة.',
            descEn: 'Receive your order in less than 1 hour.',
          },
          {
            icon: '✅',
            titleAr: 'فحص الجودة',   titleEn: 'Quality Control',
            descAr: 'اختبارات دقيقة لضمان خلو المنتجات من الكيماويات والمبيدات.',
            descEn: 'Rigorous testing to ensure products are free from chemicals.',
          },
        ].map((card, i) => (
          <div key={i} className="s1-feature-card">
            <div className="s1-feature-icon">{card.icon}</div>
            <div className="s1-feature-title">
              {language === 'ar' ? card.titleAr : card.titleEn}
            </div>
            <div className="s1-feature-desc">
              {language === 'ar' ? card.descAr : card.descEn}
            </div>
          </div>
        ))}
      </div>

      {/* ── Stats (نفس الأصل) ─────────────────────────────── */}
      <div className="s1-stats-grid ae-5">
        {[
          { num: '24 / 7', labelAr: 'ذكاء اصطناعي يرد على استفساراتك', labelEn: 'AI 24/7 Support' },
          { num: '+1200',  labelAr: 'عميل سعيد',                        labelEn: 'Happy Customers' },
          { num: '< 1h',   labelAr: 'من المزرعة لبابك',                 labelEn: 'Farm to Door' },
        ].map((stat, i) => (
          <div key={i} className="s1-stat-box">
            <div className="s1-stat-num">{stat.num}</div>
            <div className="s1-stat-label">
              {language === 'ar' ? stat.labelAr : stat.labelEn}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA Buttons (نفس الأصل) ──────────────────────── */}
      <div className="s1-cta-row ae-6">
        <button
          className="s1-cta-btn s1-cta-outline"
          onClick={() => navigate('/categories')}
        >
          {t.categories}
        </button>
        <button
          className="s1-cta-btn s1-cta-primary"
          onClick={() => navigate('/blogs')}
        >
          {language === 'ar' ? 'الوصفات والمدونة' : 'Recipes & Blog'}
        </button>
      </div>
    </div>
  ),
},
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000',
      content: (
        <div className="fix-12-12 text-center flex flex-col items-center justify-center">
          <div className="flex justify-center mb-8 ae-1">
            <span className="px-5 py-2.5 bg-white/10 text-white text-[10px] md:text-sm font-black uppercase tracking-[0.3em] border border-white/20 rounded-full backdrop-blur-xl">
              {language === 'ar' ? 'تحدي الأناقة • الأطيب' : 'ELATYAB • ARCADE CHALLENGE'}
            </span>
          </div>
          <div className="ae-2 w-full max-w-[320px] md:max-w-[550px]">
            <Buzzer />
          </div>
        </div>
      ),
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=2000',
      content: (
        <div className="fix-12-12 relative px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center">
            <div className="ae-1">
              <div className="inline-flex items-center gap-3 bg-green-500/20 text-green-500 px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-black mb-4 md:mb-8 border border-green-500/20">
                <ShieldCheck size={18} />
                <span>{t.freshness}</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-8 leading-tight">
                {language === 'ar' ? 'من المزرعة إلى مائدتك في ' : 'From Farm to Table in '}
                <span className="text-fruit-primary">{language === 'ar' ? '6 ساعات' : '6 Hours'}</span>
              </h2>
              <div className="space-y-8">
                {[
                  { t: language === 'ar' ? 'قطف يدوي'  : 'Handpicked',    d: language === 'ar' ? 'يتم اختيار كل ثمرة بعناية في الصباح الباكر.'           : 'Every fruit is carefully selected in the early morning.' },
                  { t: language === 'ar' ? 'فحص الجودة' : 'Quality Check', d: language === 'ar' ? 'اختبارات دقيقة لضمان خلو المنتجات من الكيماويات.'    : 'Rigorous testing to ensure chemical-free produce.' },
                  { t: language === 'ar' ? 'توصيل مبرد' : 'Cold Delivery', d: language === 'ar' ? 'أسطولنا المبرد يحافظ على درجة حرارة الثمار المثالية.' : 'Our refrigerated fleet maintains the perfect temperature.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="w-12 h-12 bg-fruit-primary rounded-2xl flex items-center justify-center shrink-0 font-black text-white shadow-lg group-hover:scale-110 transition-transform">{i + 1}</div>
                    <div>
                      <h4 className="text-white font-black text-2xl mb-1">{item.t}</h4>
                      <p className="text-white/40 text-lg font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="ae-2 hidden lg:block">
              <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800" className="rounded-[60px] shadow-3xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-700" alt="Farm" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000',
      content: (
        <div className="fix-12-12 text-center px-4 md:px-0">
          <div className="w-16 h-16 md:w-28 md:h-28 bg-fruit-primary/20 rounded-[20px] md:rounded-[40px] flex items-center justify-center mx-auto mb-6 md:mb-10 ae-1 shadow-2xl">
            <Leaf size={32} className="text-fruit-primary md:hidden" />
            <Leaf size={56} className="text-fruit-primary hidden md:block" />
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-8 ae-2 tracking-tight">{t.sustainability}</h2>
          <p className="text-base md:text-2xl text-white/50 max-w-4xl mx-auto mb-8 md:mb-16 ae-3 leading-relaxed font-medium">
            {language === 'ar' ? 'نحن نلتزم بتقليل البصمة الكربونية من خلال التغليف الصديق للبيئة ودعم المزارعين المحليين.' : 'We are committed to reducing carbon footprint through eco-friendly packaging and supporting local farmers.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 ae-4">
            {[
              { val: '500+ kg', label: language === 'ar' ? 'بلاستيك تم توفيره' : 'Plastic Saved',      color: 'text-fruit-primary' },
              { val: '1200+',  label: language === 'ar' ? 'شجرة تم غرسها'    : 'Trees Planted',       color: 'text-fruit-accent'  },
              { val: '100%',   label: language === 'ar' ? 'تغليف قابل للتحلل' : 'Biodegradable',      color: 'text-fruit-orange'  },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/10 backdrop-blur-md">
                <p className={`text-3xl md:text-5xl font-black ${s.color} mb-2 md:mb-3`}>{s.val}</p>
                <p className="text-white/30 font-black uppercase tracking-widest text-[10px] md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2000',
      content: (
        <div className="fix-12-12 px-4 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-4">
            <div className="ae-1">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">{t.recipes}</h2>
              <p className="text-white/40 mt-2 md:mt-3 text-base md:text-xl font-medium">{language === 'ar' ? 'أشهى الأطباق الصحية باستخدام منتجاتنا الطازجة.' : 'Delicious healthy dishes using our fresh produce.'}</p>
            </div>
            <button onClick={() => navigate('/blogs')} className="text-fruit-primary font-black text-sm md:text-lg flex items-center gap-2 md:gap-3 ae-2 hover:gap-5 transition-all">
              {language === 'ar' ? 'شاهد الكل' : 'View All'}
              <ArrowRight size={20} className={language === 'ar' ? 'rotate-180' : ''} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 ae-3">
            {(homeRecipes.length > 0 ? homeRecipes : [
              { title: { en: "Quinoa Fruit Salad", ar: "سلطة الكينوا بالفواكه" }, time: { en: "15 min", ar: "15 دقيقة" }, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400", id: null },
              { title: { en: "Green Energy Smoothie", ar: "سموذي الطاقة الأخضر" }, time: { en: "5 min", ar: "5 دقائق" }, img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400", id: null },
              { title: { en: "Seasonal Fruit Tart", ar: "تارت الفواكه الموسمية" }, time: { en: "45 min", ar: "45 دقيقة" }, img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400", id: null },
            ]).map((recipe: any, i) => (
              <div key={i} onClick={() => navigate(recipe.id ? `/blogs/${recipe.id}` : '/blogs')} className="bg-white/5 rounded-[48px] overflow-hidden border border-white/10 group cursor-pointer backdrop-blur-md hover:border-fruit-primary/30 transition-all">
                <div className="h-60 overflow-hidden">
                  <img src={recipe.image_url || recipe.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={language === 'ar' ? (recipe.title_ar || recipe.title?.ar) : (recipe.title_en || recipe.title?.en)} />
                </div>
                <div className="p-8">
                  <h4 className="text-white font-black text-2xl mb-3">{language === 'ar' ? (recipe.title_ar || recipe.title?.ar) : (recipe.title_en || recipe.title?.en)}</h4>
                  <div className="flex items-center gap-3 text-white/40 text-sm font-bold">
                    <Clock size={18} />
                    <span>{language === 'ar' ? (recipe.cooking_time_ar || recipe.time?.ar) : (recipe.cooking_time_en || recipe.time?.en)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slidesData.length);
  }, [slidesData.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slidesData.length) % slidesData.length);
  }, [slidesData.length]);

  // ── Keyboard + Mouse Wheel ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  prevSlide();
    };
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0) nextSlide(); else prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [nextSlide, prevSlide]);

  // ── Touch Swipe (الإضافة المهمة للهاتف) ────────────────────
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current    = e.touches[0].clientY;
      touchStartX.current    = e.touches[0].clientX;
      touchStartTime.current = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return;
      const dy   = touchStartY.current - e.changedTouches[0].clientY;
      const dx   = touchStartX.current - e.changedTouches[0].clientX;
      const dt   = Date.now() - touchStartTime.current;
      const fast = dt < 400;
      // Swipe عمودي فقط (أكبر من أفقي)
      if (Math.abs(dy) > Math.abs(dx) && (Math.abs(dy) > 60 || (fast && Math.abs(dy) > 30))) {
        if (dy > 0) nextSlide(); else prevSlide();
      }
      touchStartY.current = null;
      touchStartX.current = null;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    setProgress(((currentSlide + 1) / slidesData.length) * 100);
  }, [currentSlide, slidesData.length]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleInstallable = () => setShowInstallButton(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const handleInstallApp = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    (window as any).deferredPrompt = null;
    setShowInstallButton(false);
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) document.documentElement.classList.add('dark');
    else             document.documentElement.classList.remove('dark');
  };

  const handleCheckout = async () => {
    const result = await placeOrder();
    if (result) setTimeout(() => navigate('/orders'), 1000);
  };

  return (
    <div className="slides-app bg-fruit-bg min-h-screen overflow-hidden">
      <ProgressBar progress={progress} />

      {/* ── زر القائمة الجانبية ─────────────────────────────── */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-50 p-3 bg-fruit-primary/20 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-fruit-primary transition-all shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* ── القائمة الجانبية ────────────────────────────────── */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-fruit-surface transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fruit-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">الأ</span>
                </div>
                <span className="text-white font-black text-2xl">الأطيب</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                <CloseIcon size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {!user ? (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-black text-lg mb-4">{language === 'ar' ? 'مرحباً بك في الأطيب' : 'Welcome to Elatyab'}</h3>
                  <p className="text-white/60 text-sm mb-6">{language === 'ar' ? 'قم بتسجيل الدخول أو إنشاء حساب جديد للوصول إلى جميع الميزات' : 'Sign in or create a new account to access all features'}</p>
                  <div className="space-y-3">
                    <button onClick={() => { navigate('/login'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 p-4 bg-fruit-primary hover:bg-fruit-primary/80 text-white rounded-2xl font-black transition-all">
                      <LogIn size={20} />{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                    <button onClick={() => { navigate('/signup'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all border border-white/10">
                      <User size={20} />{language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-fruit-primary/10 rounded-2xl p-6 border border-fruit-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-fruit-primary rounded-xl flex items-center justify-center text-white font-black text-xl">{user.email?.[0].toUpperCase()}</div>
                    <div>
                      <p className="text-white font-black text-sm truncate w-40">{user.email}</p>
                      <p className="text-fruit-primary text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'عضو مميز' : 'Premium Member'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{language === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}</span>
                      <span className="text-white font-black text-xl">{totalPoints} <span className="text-[10px] text-fruit-primary">PTS</span></span>
                    </div>
                    <Star className="text-fruit-primary fill-fruit-primary" size={20} />
                  </div>
                </div>
              )}

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-black text-lg mb-4">روابط سريعة</h3>
                <ul className="space-y-3">
                  {user?.email === 'admin@gmail.com' && (
                    <li><button onClick={() => { navigate('/admin'); setSidebarOpen(false); }} className="w-full text-right p-3 text-fruit-primary font-black hover:bg-fruit-primary/10 rounded-xl transition-all flex items-center justify-between border border-fruit-primary/20"><span>لوحة التحكم</span></button></li>
                  )}
                  {[
                    { label: 'الرئيسية', path: '/' },
                    { label: 'الأقسام',  path: '/categories' },
                    { label: 'المحفظة', path: '/wallet' },
                    { label: 'طلباتي',  path: '/orders' },
                  ].map(link => (
                    <li key={link.path}><button onClick={() => { navigate(link.path); setSidebarOpen(false); }} className="w-full text-right p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">{link.label}</button></li>
                  ))}
                  {showInstallButton && (
                    <li><button onClick={handleInstallApp} className="w-full text-right p-3 text-fruit-primary font-black hover:bg-fruit-primary/10 rounded-xl transition-all flex items-center justify-between border border-fruit-primary/20"><span>تثبيت التطبيق</span><Smartphone size={16} /></button></li>
                  )}
                  {user && (
                    <li><button onClick={handleLogout} className="w-full text-right p-3 text-red-400 font-black hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-between border border-red-500/20"><span>تسجيل الخروج</span><LogOut size={16} /></button></li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => { setLanguage(language === 'ar' ? 'en' : 'ar'); setSidebarOpen(false); }} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                <Globe size={20} /><span className="font-bold text-sm">{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
              <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="font-bold text-sm">{darkMode ? 'وضع نهاري' : 'وضع ليلي'}</span>
              </button>
            </div>
            <div className="flex justify-center gap-6">
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors"><Smartphone size={20} /></span>
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors"><Leaf size={20} /></span>
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors"><ShieldCheck size={20} /></span>
            </div>
            <p className="text-white/40 text-center text-xs mt-4">© 2023 الأطيب. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}

      {/* ── حاوية الـ Slides ─────────────────────────────────── */}
      <div className="slides-container">
        {slidesData.map((slide, index) => (
          <Slide
            key={slide.id}
            id={slide.id}
            backgroundImage={slide.image}
            active={currentSlide === index}
          >
            {slide.content}
          </Slide>
        ))}
      </div>

      {/* ── سلة المشتريات ────────────────────────────────────── */}
      {cart.length > 0 && (
        <div
          className={`fixed z-30 ae-1`}
          style={{
            bottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
            [language === 'ar' ? 'left' : 'right']: '2rem',
          }}
        >
          <div className="bg-fruit-surface/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-3xl w-80">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-black flex items-center gap-2">
                <ShoppingBag size={18} className="text-fruit-primary" />{t.yourCart}
              </h4>
              <button onClick={() => setShowCartPreview(!showCartPreview)} className="text-white/40 hover:text-white">
                {showCartPreview ? <X size={18} /> : <span className="text-xs font-bold">{t.items} ({cart.length})</span>}
              </button>
            </div>
            {showCartPreview && (
              <div className="max-h-48 overflow-y-auto mb-4 space-y-3 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-white/5 p-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="text-white text-xs font-bold">{item.name[language]}</p>
                        <p className="text-fruit-primary text-[10px] font-black">{item.price} {t.egp} x {item.quantity}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500/50 hover:text-red-500"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/5">
              <span className="text-white/40 text-xs font-bold">{t.total}</span>
              <span className="text-white font-black text-xl">{cartTotal} {t.egp}</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-3 bg-fruit-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-fruit-primary/20 hover:scale-[1.02] transition-all">
              {t.checkout}
            </button>
          </div>
        </div>
      )}

      {/* ── نقاط التنقل الجانبية ─────────────────────────────── */}
      <nav className="side pole">
        <div className="navigation">
          <ul>
            {slidesData.map((_, index) => (
              <li
                key={index}
                className={currentSlide === index ? 'active' : ''}
                onClick={() => setCurrentSlide(index)}
              >
                <span className="!bg-fruit-primary/40" />
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Home;
