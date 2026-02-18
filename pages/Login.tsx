import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ShoppingBasket, ArrowRight, ArrowLeft, Smartphone, X, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../src/supabase/context-providers';
import { useAppContext } from '../contexts/AppContext';
import toast from 'react-hot-toast';
import OrangeMascot from '../src/components/OrangeMascot';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, resetPassword } = useAuthContext();
  const { language } = useAppContext();

  const [flip, setFlip] = useState(location.pathname === '/signup');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", email: "", phone_number: "" });
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFlip(location.pathname === '/signup');
    if (location.pathname !== '/signup') {
      setShowForgot(false);
      setMood('neutral');
    }
  }, [location.pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (mood !== 'neutral') setMood('neutral');
  };

  const handleFlip = (toSignup: boolean) => {
    setFlip(toSignup);
    setMood('neutral');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resetPassword(formData.email);
      if (error) {
        setMood('sad');
        toast.error(language === 'ar' ? 'حدث خطأ: ' + error.message : 'Error: ' + error.message);
      } else {
        setMood('happy');
        toast.success(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور.' : 'Password reset link sent.');
        setTimeout(() => { setShowForgot(false); setMood('neutral'); }, 2000);
      }
    } catch (err: any) {
      setMood('sad');
      toast.error(language === 'ar' ? 'حدث خطأ غير متوقع' : 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin local check
    if (formData.email === 'admin@gmail.com' && formData.password === '123456') {
      setShowAdminDashboard(true);
      setLoading(false);
      return;
    } else {
      setShowAdminDashboard(false); // Hide dashboard for any non-admin login attempt
    }

    try {
      if (flip) {
        // ── SIGN UP ──
        const { data, error } = await signUp(formData.email, formData.password, {
          full_name: formData.username,
          phone_number: formData.phone_number,
        });

        if (error) {
          setMood('sad');
          // ✅ رسائل خطأ أوضح بالعربي
          let msg = error.message;
          if (msg.includes('already registered') || msg.includes('already exists')) {
            msg = language === 'ar' ? 'هذا الإيميل مسجل مسبقاً. جرب تسجيل الدخول.' : 'This email is already registered.';
          } else if (msg.includes('Password should be')) {
            msg = language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' : 'Password must be at least 6 characters.';
          } else if (msg.includes('Invalid email')) {
            msg = language === 'ar' ? 'البريد الإلكتروني غير صحيح.' : 'Invalid email address.';
          }
          toast.error(msg);
        } else if (data?.user) {
          setMood('happy');
          toast.success(language === 'ar' ? '🎉 تم إنشاء حسابك بنجاح!' : '🎉 Account created successfully!');
          setTimeout(() => navigate('/first-time-login'), 1200);
        }

      } else {
        // ── SIGN IN ──
        const { data, error } = await signIn(formData.email, formData.password);

        if (error || !data?.user) {
          setMood('sad');
          let msg = error?.message || '';
          if (msg.includes('Invalid login') || msg.includes('invalid') || msg.includes('credentials')) {
            msg = language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.';
          } else if (msg.includes('Email not confirmed')) {
            msg = language === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني أولاً.' : 'Please confirm your email first.';
          } else if (msg.includes('Too many requests')) {
            msg = language === 'ar' ? 'محاولات كثيرة. انتظر قليلاً.' : 'Too many attempts. Please wait.';
          }
          toast.error(msg || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed'));
          return;
        }

        setMood('happy');

        // ✅ تحقق من الأدمن
        const isAdmin = data.user.app_metadata?.role === 'admin'
          || data.user.email === 'omm651571@gmail.com'; // fallback بالإيميل

        if (isAdmin) {
          toast.success(language === 'ar' ? '👑 مرحباً أيها المدير!' : '👑 Welcome Admin!');
          setTimeout(() => navigate('/admin'), 1000); // ✅ navigate مباشرة
          return;
        }

        // ✅ مستخدم عادي - تحقق إذا جديد (24 ساعة أول مرة)
        const createdAt = new Date(data.user.created_at || '');
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        const isNew = hoursDiff < 24;

        toast.success(language === 'ar' ? 'مرحباً بك! 👋' : 'Welcome back! 👋');
        setTimeout(() => {
          navigate(isNew ? '/first-time-login' : '/');
        }, 1000);
      }

    } catch (err: any) {
      setMood('sad');
      console.error('Auth error:', err);
      toast.error(language === 'ar' ? 'حدث خطأ غير متوقع: ' + (err.message || '') : 'Unexpected error: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setMood('happy');
    toast.success(language === 'ar' ? 'مرحباً! تصفح كزائر 👋' : 'Welcome! Browse as guest 👋');
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] overflow-hidden relative" dir="rtl">
      {showAdminDashboard ? (
        <div className="w-full h-full flex items-center justify-center">
          <Suspense fallback={<div>Loading admin dashboard...</div>}>
            <DashboardPage />
          </Suspense>
        </div>
      ) : (
        <>
          {/* ...existing login/signup UI... */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,154,0,0.08)_0%,transparent_70%)]" />

          <div className="perspective-1000 w-[380px] h-[600px] relative z-10 scale-90 sm:scale-100 transition-transform">
            <div className={`w-full h-full relative transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) preserve-3d ${flip ? 'rotate-y-180' : ''}`}>

              {/* ── LOGIN FACE ── */}
              <div className="absolute inset-0 backface-hidden">
                <OrangeMascot mood={mood}>
                  <div className="absolute inset-0 flex flex-col px-8 pb-8 z-10 w-full h-full justify-center items-center">
                    <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors z-20">
                      <X size={20} />
                    </button>

                    <div className="text-center mb-6 mt-24 scale-90">
                      <h2 className="text-3xl font-black text-white drop-shadow-md">{showForgot ? 'استعادة' : 'دخول'}</h2>
                      <p className="text-white/80 text-xs font-bold drop-shadow-sm">{showForgot ? 'استرجع حسابك بسهولة' : 'مرحباً بك في عالم الطزاجة'}</p>
                    </div>

                    {!showForgot ? (
                      <div className="flex flex-col gap-2.5 w-full max-w-[280px] mx-auto scale-95 origin-center">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
                          <div className="relative">
                            <input
                              style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '48px' }}
                              className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-lg font-bold"
                              type="email"
                              name="email"
                              placeholder="البريد الإلكتروني"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                            <Mail className="absolute right-3 top-3.5 text-[#003e31]/60" size={18} />
                          </div>
                          <div className="relative mb-1">
                            <input
                              style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '48px' }}
                              className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-lg font-bold"
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="كلمة المرور"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                            {showPassword
                              ? <EyeOff className="absolute left-3 top-3.5 text-[#003e31]/60 cursor-pointer" size={18} onClick={() => setShowPassword(false)} />
                              : <Eye className="absolute left-3 top-3.5 text-[#003e31]/60 cursor-pointer" size={18} onClick={() => setShowPassword(true)} />
                            }
                            <Lock className="absolute right-3 top-3.5 text-[#003e31]/60" size={18} />
                          </div>

                          <div className="text-left">
                            <button type="button" onClick={() => setShowForgot(true)} className="text-[10px] text-white/80 hover:text-white font-bold">
                              نسيت كلمة المرور؟
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-white text-[#b85000] rounded-xl font-black text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100"
                          >
                            {loading ? '⏳ جاري الدخول...' : 'تسجيل الدخول'}
                          </button>
                        </form>

                        <button
                          onClick={handleGuestLogin}
                          className="w-full py-2.5 bg-black/20 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-black/30 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingBasket size={14} /> تصفح كزائر
                        </button>

                        <button
                          onClick={() => handleFlip(true)}
                          className="mt-2 text-white/90 text-xs font-bold flex items-center justify-center gap-1 hover:text-white"
                        >
                          إنشاء حساب جديد <ArrowLeft size={12} />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleResetSubmit} className="flex flex-col gap-4 w-full max-w-[280px] mx-auto mt-4">
                        <div className="relative">
                          <input
                            className="w-full py-3 px-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-sm outline-none text-right shadow-inner"
                            type="email" name="email" placeholder="البريد الإلكتروني"
                            value={formData.email} onChange={handleChange} required
                          />
                          <Mail className="absolute right-3 top-3 text-white/50" size={16} />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 bg-white text-[#b85000] rounded-xl font-black text-sm shadow-lg hover:scale-105">
                          {loading ? '...' : 'إرسال الرابط'}
                        </button>
                        <button type="button" onClick={() => setShowForgot(false)} className="w-full py-2 text-white/80 font-black text-xs hover:text-white">
                          إلغاء
                        </button>
                      </form>
                    )}
                  </div>
                </OrangeMascot>
              </div>

              {/* ── SIGNUP FACE ── */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <OrangeMascot mood={mood}>
                  <div className="absolute inset-0 flex flex-col px-8 pb-8 z-10 w-full h-full justify-center items-center">
                    <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors z-20">
                      <X size={24} />
                    </button>

                    <div className="text-center mb-4 mt-20 scale-90">
                      <h2 className="text-3xl font-black text-white drop-shadow-md">تسجيل</h2>
                      <p className="text-white/80 text-xs font-bold drop-shadow-sm">انضم لعائلتنا</p>
                    </div>

                    <div className="flex flex-col gap-2.5 w-full max-w-[280px] mx-auto scale-95 origin-center">
                      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full">
                        <div className="relative">
                          <input
                            style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '45px' }}
                            className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-md font-bold"
                            type="text" name="username" placeholder="الاسم"
                            value={formData.username} onChange={handleChange} required
                          />
                          <User className="absolute right-3 top-3 text-[#003e31]/60" size={18} />
                        </div>
                        <div className="relative">
                          <input
                            style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '45px' }}
                            className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-md font-bold"
                            type="email" name="email" placeholder="البريد الإلكتروني"
                            value={formData.email} onChange={handleChange} required
                          />
                          <Mail className="absolute right-3 top-3 text-[#003e31]/60" size={18} />
                        </div>
                        <div className="relative">
                          <input
                            style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '45px' }}
                            className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-md font-bold"
                            type={showPassword ? 'text' : 'password'} name="password" placeholder="كلمة المرور (6+ أحرف)"
                            value={formData.password} onChange={handleChange} required minLength={6}
                          />
                          {showPassword
                            ? <EyeOff className="absolute left-3 top-3 text-[#003e31]/60 cursor-pointer" size={18} onClick={() => setShowPassword(false)} />
                            : <Eye className="absolute left-3 top-3 text-[#003e31]/60 cursor-pointer" size={18} onClick={() => setShowPassword(true)} />
                          }
                          <Lock className="absolute right-3 top-3 text-[#003e31]/60" size={18} />
                        </div>
                        <div className="relative">
                          <input
                            style={{ backgroundColor: 'white', color: '#003e31', opacity: 1, height: '45px' }}
                            className="w-full px-4 rounded-xl border-2 border-[#db6a28] text-sm outline-none text-right shadow-md font-bold"
                            type="tel" name="phone_number" placeholder="رقم الهاتف"
                            value={formData.phone_number} onChange={handleChange} required
                          />
                          <Smartphone className="absolute right-3 top-3 text-[#003e31]/60" size={18} />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-white text-[#b85000] rounded-xl font-black text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100"
                        >
                          {loading ? '⏳ جاري إنشاء الحساب...' : 'تأكيد التسجيل'}
                        </button>
                      </form>

                      <button
                        onClick={handleGuestLogin}
                        className="w-full py-2.5 bg-black/20 text-white border border-white/10 rounded-xl font-bold text-sm hover:bg-black/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBasket size={14} /> تصفح كزائر
                      </button>

                      <button
                        onClick={() => handleFlip(false)}
                        className="mt-2 text-white/90 text-xs font-bold flex items-center justify-center gap-1 hover:text-white"
                      >
                        <ArrowRight size={12} /> لديك حساب؟ دخول
                      </button>
                    </div>
                  </div>
                </OrangeMascot>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;

const DashboardPage = lazy(() => import('../src/admin/DashboardPage'));
