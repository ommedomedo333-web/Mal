import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, CreditCard, ShieldCheck, LogIn, RefreshCw, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuthContext, useWalletContext } from '../src/supabase/context-providers';
import { paymobService } from '../src/services/paymob';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Wallet: React.FC = () => {
  const { t, language } = useAppContext();
  const { user } = useAuthContext();
  const { wallet, transactions, monthlyStats, loading, chargeWallet, refetch } = useWalletContext();
  const [amount, setAmount] = useState<number>(100);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const handleMockRecharge = async () => {
    if (!user) return;
    setProcessing(true);
    const res = await chargeWallet(amount);
    if (res.success) {
      toast.success(language === 'ar' ? `تم شحن ${amount} ج.م بنجاح` : `Recharged ${amount} EGP successfully`);
    } else {
      toast.error(language === 'ar' ? 'فشل الشحن' : 'Recharge failed');
    }
    setProcessing(false);
  };

  const handlePaymobRecharge = async () => {
    if (!user) return;
    if (amount < 10) {
      toast.error(language === 'ar' ? 'أقل مبلغ للشحن هو 10 ج.م' : 'Minimum recharge is 10 EGP');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading(language === 'ar' ? 'جاري الاتصال بـ Paymob...' : 'Connecting to Paymob...');

    try {
      // 1. Prepare data
      const orderId = `WALLET-${Date.now()}`;
      const customerData = {
        full_name: user.user_metadata?.full_name || 'Cybernav User',
        email: user.email || 'user@example.com',
        phone_number: user.phone || '01000000000'
      };

      // 2. Create Payment Intent
      const intentRes = await paymobService.createIntent(amount, orderId, customerData);

      if (intentRes.success && intentRes.checkoutUrl) {
        toast.success(language === 'ar' ? 'تم إنشاء طلب الدفع! جاري التحويل...' : 'Payment intent created! Redirecting...', { id: toastId });

        // Redirect to Paymob checkout
        // window.location.href = intentRes.checkoutUrl; 
        // For demo, we'll just show the link and success
        console.log('Checkout URL:', intentRes.checkoutUrl);

        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <ShieldCheck className="h-10 w-10 text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Paymob Ready
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Checkout URL Generated
                  </p>
                  <a
                    href={intentRes.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs text-blue-600 underline"
                  >
                    Click here to pay (Test Mode)
                  </a>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  handleMockRecharge(); // Auto-complete for demo
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Simulate Success
              </button>
            </div>
          </div>
        ), { duration: 8000 });

      } else {
        throw new Error(intentRes.error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(language === 'ar' ? `خطأ: ${error.message}` : `Error: ${error.message}`, { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-fruit-bg p-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/10">
          <WalletIcon size={48} className="text-white/20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">
          {language === 'ar' ? 'المحفظة الرقمية' : 'Digital Wallet'}
        </h2>
        <p className="text-white/40 font-bold mb-10 max-w-xs mx-auto">
          {language === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى محفظتك وإدارة رصيدك' : 'Please login to access your wallet and manage your balance'}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-10 py-5 bg-fruit-primary text-white rounded-[24px] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-fruit-primary/20"
        >
          <LogIn size={24} />
          {language === 'ar' ? 'تسجيل الدخول الآن' : 'Login Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 bg-fruit-bg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        {/* Premium Balance Card */}
        <div className="relative group mb-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-fruit-primary via-fruit-accent to-fruit-orange rounded-[42px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-fruit-surface/40 backdrop-blur-3xl p-10 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fruit-primary/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />

            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-fruit-primary text-xs font-black uppercase tracking-[0.3em] mb-4">
                {t.btsAwards}
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <h1 className="text-7xl font-black text-white">{wallet?.points_balance || 0}</h1>
                <span className="text-2xl text-white/40 font-black">BTS</span>
              </div>

              <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                <p className="text-white/60 font-black flex items-center gap-2">
                  <span className="text-white/40">{language === 'ar' ? 'تساوي:' : 'Equals:'}</span>
                  <span className="text-fruit-primary text-xl">{((wallet?.points_balance || 0) / 100).toFixed(2)}</span>
                  <span className="text-xs">{t.egp}</span>
                </p>
              </div>

              <div className="mt-10 w-full grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-3xl border border-white/5 text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{language === 'ar' ? 'الرصيد النقدي' : 'Cash Balance'}</p>
                  <p className="text-2xl font-black text-white">{(wallet?.balance || 0).toFixed(2)} <span className="text-[10px] text-white/40">{t.egp}</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-3xl border border-white/5 text-center">
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{language === 'ar' ? 'قيمة المكافآت' : 'Rewards Value'}</p>
                  <p className="text-2xl font-black text-fruit-primary">{((wallet?.points_balance || 0) / 100).toFixed(2)} <span className="text-[10px] text-white/40">{t.egp}</span></p>
                </div>
              </div>
            </div>

            {/* Monthly Profit Section */}
            <div className="mt-8 p-6 bg-white/5 rounded-[32px] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  {language === 'ar' ? 'أرباح BTS هذا الشهر' : 'Monthly BTS Profit'}
                </span>
                <span className="text-fruit-primary text-[10px] font-black">
                  {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">+{monthlyStats?.points_earned || 0}</span>
                  <span className="text-sm text-white/40 font-bold">BTS</span>
                </div>
                <div className="w-12 h-12 bg-fruit-primary/20 rounded-2xl flex items-center justify-center border border-fruit-primary/20">
                  <Clock className="text-fruit-primary" size={24} />
                </div>
              </div>
              <div className="mt-4 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-fruit-primary shadow-[0_0_10px_rgba(255,26,125,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.min(((monthlyStats?.points_earned || 0) / 1000) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-[9px] text-white/20 font-bold uppercase text-center">
                {language === 'ar' ? 'هدف الشهر: 1000 BTS' : 'Monthly Goal: 1000 BTS'}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">{language === 'ar' ? 'آخر العمليات' : 'Recent Transactions'}</h2>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/40">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} onClick={refetch} />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-fruit-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/20 font-bold text-sm">جاري التحديث...</p>
            </div>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fruit-primary/20 to-transparent rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-fruit-surface/40 backdrop-blur-xl p-6 rounded-[30px] border border-white/5 flex items-center justify-between hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-2xl ${tx.transaction_type === 'charge' || tx.metadata?.is_points ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.transaction_type === 'charge' || tx.metadata?.is_points ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">
                        {tx.description || (tx.transaction_type === 'charge' ? (language === 'ar' ? 'شحن رصيد' : 'Deposit') : (language === 'ar' ? 'دفع طلب' : 'Payment'))}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-white/20" />
                        <p className="text-white/30 text-xs font-bold">{new Date(tx.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-2xl ${tx.transaction_type === 'charge' || tx.metadata?.is_points ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.transaction_type === 'charge' || tx.metadata?.is_points ? '+' : '-'}{tx.amount}
                      <span className="text-[10px] ml-1 opacity-60">{tx.metadata?.is_points ? 'BTS' : t.egp}</span>
                    </p>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                      {tx.metadata?.is_points ? (language === 'ar' ? 'مكافأة' : 'REWARD') : tx.transaction_type}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/5 rounded-[40px] border border-dashed border-white/10">
              <ShieldCheck size={64} className="mx-auto text-white/5 mb-6" />
              <h3 className="text-white/40 font-black text-xl">{language === 'ar' ? 'لا توجد عمليات بعد' : 'No transactions yet'}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
