
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, CheckCircle, ArrowRight } from 'lucide-react';

const FirstTimeLogin: React.FC = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        // Logic to mark user as "setup complete" could go here if needed.
        // For now, simple navigation.
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-fruit-bg text-white font-tajawal p-6 relative overflow-hidden" dir="rtl">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fruit-primary/10 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-[40px] p-10 text-center shadow-2xl">
                <div className="w-24 h-24 bg-fruit-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-fruit-primary/30 animate-bounce">
                    <ShoppingBasket size={48} className="text-white" />
                </div>

                <h1 className="text-4xl font-black mb-4">أهلاً بك في الأطيب! 👋</h1>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                    شكراً لانضمامك إلينا. نحن هنا لنوفر لك أجود أنواع الفواكه والخضروات الطازجة، تصلك أينما كنت.
                </p>

                <div className="space-y-4 mb-10 text-right">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><CheckCircle size={20} /></div>
                        <div>
                            <h3 className="font-bold">منتجات طازجة يومياً</h3>
                            <p className="text-xs text-white/50">من المزرعة إلى باب بيتك</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center"><CheckCircle size={20} /></div>
                        <div>
                            <h3 className="font-bold">توصيل سريع</h3>
                            <p className="text-xs text-white/50">خدمة توصيل مميزة في نفس اليوم</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-4 bg-fruit-primary text-white rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-fruit-primary/20 flex items-center justify-center gap-3"
                >
                    ابدأ التسوق الآن <ArrowRight />
                </button>
            </div>
        </div>
    );
};

export default FirstTimeLogin;
