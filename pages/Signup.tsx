
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Smartphone, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useAuthContext } from '../src/supabase/context-providers';
import { useAppContext } from '../contexts/AppContext';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signUp } = useAuthContext();
    const { language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "", email: "", phone_number: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await signUp(formData.email, formData.password, {
                full_name: formData.username,
                phone_number: formData.phone_number
            });

            if (error) {
                toast.error(language === 'ar' ? 'فشل إنشاء الحساب. ' + error.message : 'Signup failed. ' + error.message);
            } else {
                toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري التوجيه...' : 'Account created successfully!');
                // Redirect to first-time login page directly for new users
                navigate('/first-time-login');
            }
        } catch (err: any) {
            toast.error(language === 'ar' ? 'حدث خطأ: ' + (err.message || '') : 'An error occurred: ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-fruit-bg overflow-hidden relative" dir="rtl">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(45,138,78,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(45,138,78,0.05)_1px,transparent_1px)] bg-[length:40px_40px] animate-gridMove" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="relative flex flex-col justify-center p-10 bg-gradient-to-br from-fruit-surface to-fruit-bg rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/20">
                    <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-fruit-primary/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                            <User className="text-fruit-primary" size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter">تسجيل جديد</h2>
                        <p className="text-white/70 text-sm mt-1">انضم إلى عائلة المتجر الآن.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="اسم المستخدم"
                                style={{ backgroundColor: 'white', color: '#003e31', height: '48px', border: '2px solid rgba(131, 232, 115, 0.4)' }}
                                className="w-full py-3 pr-10 pl-4 rounded-xl placeholder-fruit-bg/40 outline-none focus:border-fruit-accent transition-all text-right shadow-md"
                                required
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-fruit-bg/60" size={18} />
                        </div>
                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="البريد الإلكتروني"
                                style={{ backgroundColor: 'white', color: '#003e31', height: '48px', border: '2px solid rgba(131, 232, 115, 0.4)' }}
                                className="w-full py-3 pr-10 pl-4 rounded-xl placeholder-fruit-bg/40 outline-none focus:border-fruit-accent transition-all text-right shadow-md"
                                required
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-fruit-bg/60" size={18} />
                        </div>
                        <div className="relative group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="كلمة المرور"
                                style={{ backgroundColor: 'white', color: '#003e31', height: '48px', border: '2px solid rgba(131, 232, 115, 0.4)' }}
                                className="w-full py-3 pr-10 pl-4 rounded-xl placeholder-fruit-bg/40 outline-none focus:border-fruit-accent transition-all text-right shadow-md"
                                required
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-fruit-bg/60" size={18} />
                        </div>
                        <div className="relative group">
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                placeholder="رقم الهاتف"
                                style={{ backgroundColor: 'white', color: '#003e31', height: '48px', border: '2px solid rgba(131, 232, 115, 0.4)' }}
                                className="w-full py-3 pr-10 pl-4 rounded-xl placeholder-fruit-bg/40 outline-none focus:border-fruit-accent transition-all text-right shadow-md"
                                required
                            />
                            <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 text-fruit-bg/60" size={18} />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-fruit-primary text-white rounded-2xl font-black tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-50"
                        >
                            {loading ? 'جاري التحميل...' : 'تأكيد التسجيل'}
                        </button>
                    </form>

                    <Link
                        to="/login"
                        className="mt-6 text-white/80 text-sm font-bold flex items-center justify-center gap-2 hover:text-white transition-colors w-full"
                    >
                        <ArrowRight size={16} /> لديك حساب بالفعل؟ دخول
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
