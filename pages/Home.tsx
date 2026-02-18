import React, { useState, useEffect, useCallback } from 'react';
import ProgressBar from '../components/Slides/ProgressBar';
import Slide from '../components/Slides/Slide';
import Buzzer from '../components/Buzzer';
import { useAppContext } from '../contexts/AppContext';

import { useAuthContext } from '../src/supabase/context-providers';


import { Wallet, Zap, Leaf, ArrowRight, Star, ShieldCheck, Brain, Crown, Utensils, Smartphone, CheckCircle2, Clock, MapPin, X, ShoppingBag, Menu, X as CloseIcon, User, LogIn, LogOut, Globe, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../App.css';
import { getFeaturedOffers, Category, getIconComponent } from '../src/utils/dataLoader.tsx';
import { categoryService, recipeService, authService } from '../src/supabase/supabase-service';

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
        recipeService.getRecipes()
      ]);

      if (catRes.success) {
        setHomeCategories(catRes.data.slice(0, 10));
      }
      if (recRes.success) {
        setHomeRecipes(recRes.data.slice(0, 3));
      }
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
        
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }
        
        .hero-zoom-wrapper {
          position: relative;
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile */
          width: 100%;
          overflow: hidden;
          background: #000;
        }
        
        .hero-zoom__starship,
        .hero-zoom__scene {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        /* Desktop & Tablet - use fill for full coverage */
        @media (min-width: 769px) {
          .hero-zoom__starship,
          .hero-zoom__scene {
            object-fit: fill;
          }
        }
        
        /* Mobile - use cover to maintain aspect ratio */
        @media (max-width: 768px) {
          .hero-zoom__starship,
          .hero-zoom__scene {
            object-fit: cover;
            object-position: center;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            min-height: -webkit-fill-available;
          }
        }
        
        /* Extra small phones */
        @media (max-width: 480px) {
          .hero-zoom__starship,
          .hero-zoom__scene {
            object-fit: cover;
            width: 100%;
            height: 100%;
            min-width: 100vw;
            min-height: 100vh;
            min-height: 100dvh;
          }
        }
        
        .hero-zoom__title {
          font-family: "Oxanium", sans-serif;
          font-optical-sizing: auto;
          font-weight: 800;
          font-style: normal;
          position: absolute;
          font-size: clamp(1.5rem, 8vw, 8rem);
          color: white;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          animation: zoomContract 8s ease-in-out infinite;
          mix-blend-mode: overlay;
          text-align: center;
          line-height: 1.1;
          white-space: nowrap;
          padding: 0 1rem;
        }
        
        .hero-zoom__starship {
          animation: starshipZoom 8s ease-in-out infinite;
          z-index: 3;
          pointer-events: none;
        }
        
        .hero-zoom__scene {
          animation: sceneZoom 8s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }
        
        .hero-zoom__buttons {
          position: absolute;
          bottom: 8%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
          animation: fadeInButtons 2s ease-out 1s backwards;
          width: 90%;
          max-width: 500px;
        }
        
        @media (min-width: 640px) {
          .hero-zoom__buttons {
            flex-direction: row;
            gap: 1.5rem;
            width: auto;
          }
        }
        
        .hero-zoom__button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          width: 100%;
          text-align: center;
        }
        
        @media (min-width: 640px) {
          .hero-zoom__button {
            width: auto;
          }
        }
        
        .hero-zoom__button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .hero-zoom__button:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .hero-zoom__button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
        }
        
        .hero-zoom__button:active {
          transform: translateY(0) scale(0.98);
        }
        
        /* Touch devices */
        @media (hover: none) and (pointer: coarse) {
          .hero-zoom__button:active {
            transform: scale(0.95);
          }
        }
        
        /* Main Zoom Animations */
        @keyframes zoomContract {
          0%, 100% {
            letter-spacing: -1.5rem;
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.5);
          }
          15% {
            letter-spacing: 0;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            letter-spacing: 0.1rem;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          85% {
            letter-spacing: 0;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes sceneZoom {
          0%, 100% {
            filter: blur(20px);
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          15% {
            filter: blur(10px);
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.9;
          }
          50% {
            filter: blur(0px);
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 1;
          }
          85% {
            filter: blur(8px);
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
        }
        
        @keyframes starshipZoom {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          15% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(5);
            opacity: 1;
          }
          85% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
          }
        }
        
        @keyframes fadeInButtons {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .hero-zoom__title {
            font-size: clamp(1.2rem, 7vw, 3rem);
            white-space: normal;
            max-width: 85%;
            line-height: 1.15;
            letter-spacing: -0.02em;
          }
          
          .hero-zoom__buttons {
            bottom: 5%;
            gap: 0.6rem;
          }
        }
        
        /* Very small phones */
        @media (max-width: 375px) {
          .hero-zoom__title {
            font-size: clamp(1rem, 6.5vw, 2.5rem);
            max-width: 90%;
          }
          
          .hero-zoom__buttons {
            bottom: 4%;
          }
        }
        
        /* Landscape mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .hero-zoom__title {
            font-size: clamp(1rem, 5vh, 2rem);
            top: 45%;
          }
          
          .hero-zoom__buttons {
            bottom: 3%;
            flex-direction: row;
            gap: 0.5rem;
          }
        }
        
        /* RTL Support */
        [dir="rtl"] .hero-zoom__title {
          direction: rtl;
        }
        
        /* Overlay effect */
        .hero-zoom-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
          z-index: 2;
          pointer-events: none;
        }
        
        /* Prevent iOS zoom on double tap */
        .hero-zoom__button {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
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
            {language === 'ar' ? (
              <>
                المستقبل هنا
                <br />
                الأطيب
              </>
            ) : (
              <>
                The Future Is
                <br />
                Already Here
              </>
            )}
          </h1>


        </div>
      )
    },
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=2000',
      content: (
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full py-10 md:py-0">
          <style>{`
        .feature-card {
          backdrop-filter: blur(12px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .feature-icon {
          transition: all 0.4s ease;
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(5deg);
        }
        
        .stats-number {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Mobile Specific adjustments for really small screens */
        @media (max-width: 400px) {
          .mobile-tight-text {
            font-size: 1.75rem !important;
          }
          .mobile-stack-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center mb-4 md:mb-6">
              <span className="px-5 py-2 md:px-6 md:py-2.5 bg-fruit-primary/20 text-fruit-primary text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.25em] border border-fruit-primary/30 rounded-full backdrop-blur-md ae-1">
                {language === 'ar' ? '✨ طبيعي 100% • طازج يومياً' : '✨ 100% NATURAL • FRESH DAILY'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter ae-2 mb-4 md:mb-6 leading-tight mobile-tight-text">
              {language === 'ar' ? (
                <>
                  سوق <span className="text-fruit-primary">الفواكه الأطيب</span>
                </>
              ) : (
                <>
                  <span className="text-fruit-primary">ELATYAB</span> MARKET
                </>
              )}
            </h1>

            <p className="ae-3 mb-6 md:mb-10 text-sm md:text-xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed px-2">
              {language === 'ar'
                ? 'استمتع بأجود أنواع الفواكه والخضروات المختارة بعناية من المزارع إليك مباشرة مع خدمة التوصيل السريع.'
                : 'Enjoy the finest selection of fruits and vegetables, handpicked from farms directly to your doorstep with express delivery.'}
            </p>
          </div>

          {/* Features Grid - 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 ae-4">
            {/* Feature 1 - Fresh & Quality */}
            <div className="feature-card bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8">
              <div className="feature-icon text-3xl md:text-5xl mb-3 md:mb-4 floating">🌱</div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-3 text-white">
                {language === 'ar' ? 'طازج يومياً' : 'Fresh Daily'}
              </h3>
              <p className="text-xs md:text-base text-white/60 leading-relaxed">
                {language === 'ar'
                  ? 'يتم اختيار كل ثمرة بعناية في الصباح الباكر لضمان أقصى درجات النضج والطعم.'
                  : 'Each fruit is carefully selected early in the morning to ensure peak ripeness and flavor.'}
              </p>
            </div>

            {/* Feature 2 - Express Delivery */}
            <div className="feature-card bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8">
              <div className="feature-icon text-3xl md:text-5xl mb-3 md:mb-4 floating" style={{ animationDelay: '0.5s' }}>⚡</div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-3 text-white">
                {language === 'ar' ? 'توصيل سريع' : 'Express Delivery'}
              </h3>
              <p className="text-xs md:text-base text-white/60 leading-relaxed">
                {language === 'ar'
                  ? 'استلام الطلب المريح في أقل من ساعة.'
                  : 'Receive your order at optimal temperature in less than 6 hours.'}
              </p>
            </div>

            {/* Feature 3 - Quality Control */}
            <div className="feature-card bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8">
              <div className="feature-icon text-3xl md:text-5xl mb-3 md:mb-4 floating" style={{ animationDelay: '1s' }}>✓</div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-3 text-white">
                {language === 'ar' ? 'فحص الجودة' : 'Quality Control'}
              </h3>
              <p className="text-xs md:text-base text-white/60 leading-relaxed">
                {language === 'ar'
                  ? 'اختبارات دقيقة لضمان خلو المنتجات من الكيماويات والمبيدات.'
                  : 'Rigorous testing to ensure products are free from chemicals and pesticides.'}
              </p>
            </div>
          </div>

          {/* Stats Section - 1 col on mobile for better readability, 3 on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10 ae-5 mobile-stack-stats">
            <div className="text-center bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-md">
              <div className="stats-number text-2xl md:text-5xl font-black mb-1 md:mb-2">24 / 7</div>
              <div className="text-[10px] md:text-sm text-white/60 font-medium">
                {language === 'ar' ? 'ذكاء اصطناعي يرد علي استفساراتك' : 'AI 24/7 Support'}
              </div>
            </div>

            <div className="text-center bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-md">
              <div className="stats-number text-2xl md:text-5xl font-black mb-1 md:mb-2">+1200</div>
              <div className="text-[10px] md:text-sm text-white/60 font-medium">
                {language === 'ar' ? 'عميل سعيد' : 'Happy Customers'}
              </div>
            </div>

            <div className="text-center bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-md">
              <div className="stats-number text-2xl md:text-5xl font-black mb-1 md:mb-2">1h</div>
              <div className="text-[10px] md:text-sm text-white/60 font-medium">
                {language === 'ar' ? 'من المزرعة لبابك' : 'Farm to Door'}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 ae-6">
            <button
              onClick={() => navigate('/categories')}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-4 md:px-12 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-sm md:text-lg transition-all active:scale-95 backdrop-blur-md shadow-lg"
            >
              {t.categories}
            </button>
            <button
              onClick={() => navigate('/blogs')}
              className="w-full sm:w-auto bg-fruit-primary hover:bg-fruit-primary/80 text-white px-6 py-4 md:px-12 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-sm md:text-lg transition-all active:scale-95 shadow-xl shadow-fruit-primary/30"
            >
              {language === 'ar' ? 'الوصفات والمدونة' : 'Recipes & Blog'}
            </button>
          </div>
        </div>
      )
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
      )
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
                  {
                    t: language === 'ar' ? 'قطف يدوي' : 'Handpicked',
                    d: language === 'ar' ? 'يتم اختيار كل ثمرة بعناية في الصباح الباكر.' : 'Every fruit is carefully selected in the early morning.'
                  },
                  {
                    t: language === 'ar' ? 'فحص الجودة' : 'Quality Check',
                    d: language === 'ar' ? 'اختبارات دقيقة لضمان خلو المنتجات من الكيماويات.' : 'Rigorous testing to ensure chemical-free produce.'
                  },
                  {
                    t: language === 'ar' ? 'توصيل مبرد' : 'Cold Delivery',
                    d: language === 'ar' ? 'أسطولنا المبرد يحافظ على درجة حرارة الثمار المثالية.' : 'Our refrigerated fleet maintains the perfect temperature.'
                  }
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
      )
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
            <div className="bg-white/5 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/10 backdrop-blur-md">
              <p className="text-3xl md:text-5xl font-black text-fruit-primary mb-2 md:mb-3">500+ kg</p>
              <p className="text-white/30 font-black uppercase tracking-widest text-[10px] md:text-sm">{language === 'ar' ? 'بلاستيك تم توفيره' : 'Plastic Saved'}</p>
            </div>
            <div className="bg-white/5 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/10 backdrop-blur-md">
              <p className="text-3xl md:text-5xl font-black text-fruit-accent mb-2 md:mb-3">1200+</p>
              <p className="text-white/30 font-black uppercase tracking-widest text-[10px] md:text-sm">{language === 'ar' ? 'شجرة تم غرسها' : 'Trees Planted'}</p>
            </div>
            <div className="bg-white/5 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/10 backdrop-blur-md">
              <p className="text-3xl md:text-5xl font-black text-fruit-orange mb-2 md:mb-3">100%</p>
              <p className="text-white/30 font-black uppercase tracking-widest text-[10px] md:text-sm">{language === 'ar' ? 'تغليف قابل للتحلل' : 'Biodegradable'}</p>
            </div>
          </div>
        </div>
      )
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
            {homeRecipes.length > 0 ? (
              homeRecipes.map((recipe, i) => (
                <div key={i} onClick={() => navigate(`/blogs/${recipe.id}`)} className="bg-white/5 rounded-[48px] overflow-hidden border border-white/10 group cursor-pointer backdrop-blur-md hover:border-fruit-primary/30 transition-all">
                  <div className="h-60 overflow-hidden">
                    <img src={recipe.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={language === 'ar' ? recipe.title_ar : recipe.title_en} />
                  </div>
                  <div className="p-8">
                    <h4 className="text-white font-black text-2xl mb-3">{language === 'ar' ? recipe.title_ar : recipe.title_en}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/40 text-sm font-bold">
                        <Clock size={18} />
                        <span>{language === 'ar' ? recipe.cooking_time_ar : recipe.cooking_time_en}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${recipe.type === 'blog' ? 'bg-fruit-orange/20 text-fruit-orange border border-fruit-orange/30' : 'bg-fruit-primary/20 text-fruit-primary border border-fruit-primary/30'}`}>
                        {recipe.type === 'blog' ? (language === 'ar' ? 'تدوينة' : 'BLOG') : (language === 'ar' ? 'وصفة' : 'RECIPE')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [
                {
                  title: { en: "Quinoa Fruit Salad", ar: "سلطة الكينوا بالفواكه" },
                  time: { en: "15 min", ar: "15 دقيقة" },
                  img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400"
                },
                {
                  title: { en: "Green Energy Smoothie", ar: "سموذي الطاقة الأخضر" },
                  time: { en: "5 min", ar: "5 دقائق" },
                  img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400"
                },
                {
                  title: { en: "Seasonal Fruit Tart", ar: "تارت الفواكه الموسمية" },
                  time: { en: "45 min", ar: "45 دقيقة" },
                  img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400"
                }
              ].map((recipe, i) => (
                <div key={i} onClick={() => navigate('/blogs')} className="bg-white/5 rounded-[48px] overflow-hidden border border-white/10 group cursor-pointer backdrop-blur-md hover:border-fruit-primary/30 transition-all">
                  <div className="h-60 overflow-hidden">
                    <img src={recipe.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={recipe.title[language]} />
                  </div>
                  <div className="p-8">
                    <h4 className="text-white font-black text-2xl mb-3">{recipe.title[language]}</h4>
                    <div className="flex items-center gap-3 text-white/40 text-sm font-bold">
                      <Clock size={18} />
                      <span>{recipe.time[language]}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )
    },
  ];
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  }, [slidesData.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  }, [slidesData.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prevSlide();
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        if (e.deltaY > 0) nextSlide();
        else prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    setProgress(((currentSlide + 1) / slidesData.length) * 100);
  }, [currentSlide, slidesData.length]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleInstallable = () => setShowInstallButton(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);

  const handleInstallApp = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) return;

    // إظهار مطالبة التثبيت
    promptEvent.prompt();

    // انتظر استجابة المستخدم
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // تنظيف الحدث
    (window as any).deferredPrompt = null;
    setShowInstallButton(false);
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleCheckout = async () => {
    const result = await placeOrder();
    if (result) {
      setTimeout(() => navigate('/orders'), 1000);
    }
  };

  return (
    <div className="slides-app bg-fruit-bg min-h-screen overflow-hidden">
      <ProgressBar progress={progress} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-6 left-6 z-50 p-3 bg-fruit-primary/20 backdrop-blur-xl rounded-2xl border border-white/10 text-white hover:bg-fruit-primary transition-all shadow-lg"
      >
        <Menu size={24} />
      </button>

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
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <CloseIcon size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {!user ? (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-white font-black text-lg mb-4">
                    {language === 'ar' ? 'مرحباً بك في الأطيب' : 'Welcome to Elatyab'}
                  </h3>
                  <p className="text-white/60 text-sm mb-6">
                    {language === 'ar' ? 'قم بتسجيل الدخول أو إنشاء حساب جديد للوصول إلى جميع الميزات' : 'Sign in or create a new account to access all features'}
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-fruit-primary hover:bg-fruit-primary/80 text-white rounded-2xl font-black transition-all"
                    >
                      <LogIn size={20} />
                      {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </button>

                    <button
                      onClick={() => {
                        navigate('/signup');
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all border border-white/10"
                    >
                      <User size={20} />
                      {language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-fruit-primary/10 rounded-2xl p-6 border border-fruit-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-fruit-primary rounded-xl flex items-center justify-center text-white font-black text-xl">
                      {user.email?.[0].toUpperCase()}
                    </div>
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
                    <li>
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setSidebarOpen(false);
                        }}
                        className="w-full text-right p-3 text-fruit-primary font-black hover:bg-fruit-primary/10 rounded-xl transition-all flex items-center justify-between border border-fruit-primary/20"
                      >
                        <span>لوحة التحكم</span>
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        navigate('/');
                        setSidebarOpen(false);
                      }}
                      className="w-full text-right p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      الرئيسية
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/categories');
                        setSidebarOpen(false);
                      }}
                      className="w-full text-right p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      الأقسام
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/wallet');
                        setSidebarOpen(false);
                      }}
                      className="w-full text-right p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      المحفظة
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/orders');
                        setSidebarOpen(false);
                      }}
                      className="w-full text-right p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      طلباتي
                    </button>
                  </li>
                  {showInstallButton && (
                    <li>
                      <button
                        onClick={handleInstallApp}
                        className="w-full text-right p-3 text-fruit-primary font-black hover:bg-fruit-primary/10 rounded-xl transition-all flex items-center justify-between border border-fruit-primary/20"
                      >
                        <span>تثبيت التطبيق</span>
                        <Smartphone size={16} />
                      </button>
                    </li>
                  )}
                  {user && (
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-right p-3 text-red-400 font-black hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-between border border-red-500/20"
                      >
                        <span>تسجيل الخروج</span>
                        <LogOut size={16} />
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  setLanguage(language === 'ar' ? 'en' : 'ar');
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <Globe size={20} />
                <span className="font-bold text-sm">
                  {language === 'ar' ? 'English' : 'العربية'}
                </span>
              </button>

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="font-bold text-sm">
                  {darkMode ? 'وضع نهاري' : 'وضع ليلي'}
                </span>
              </button>
            </div>

            <div className="flex justify-center gap-6">
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors">
                <Smartphone size={20} />
              </span>
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors">
                <Leaf size={20} />
              </span>
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors">
                <ShieldCheck size={20} />
              </span>
            </div>
            <p className="text-white/40 text-center text-xs mt-4">
              © 2023 الأطيب. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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

      {cart.length > 0 && (
        <div className={`fixed bottom-24 ${language === 'ar' ? 'left-8' : 'right-8'} z-30 ae-1`}>
          <div className="bg-fruit-surface/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-3xl w-80">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-black flex items-center gap-2">
                <ShoppingBag size={18} className="text-fruit-primary" />
                {t.yourCart}
              </h4>
              <button
                onClick={() => setShowCartPreview(!showCartPreview)}
                className="text-white/40 hover:text-white"
              >
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
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500/50 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/5">
              <span className="text-white/40 text-xs font-bold">{t.total}</span>
              <span className="text-white font-black text-xl">{cartTotal} {t.egp}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-fruit-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-fruit-primary/20 hover:scale-[1.02] transition-all"
            >
              {t.checkout}
            </button>
          </div>
        </div>
      )}

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
