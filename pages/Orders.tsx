import React, { useState } from 'react';
import {
  ShoppingBag, RefreshCw, Plus, Minus, Smartphone,
  Banknote, ShieldCheck, ChevronLeft, Loader2,
  CheckCircle2, Mail
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { paymobService } from '../src/services/paymob';
import orderEmailService from '../src/services/orderEmailService';
import toast from 'react-hot-toast';

const OrdersScreen: React.FC<{
  cart?: any[];
  setCart?: any;
  orderHistory?: any[];
  setOrderHistory?: any;
}> = ({ cart = [], setCart, orderHistory = [], setOrderHistory }) => {
  const { totalPoints, setTotalPoints, user } = useAppContext() as any;
  const [pMethod, setPMethod] = useState('cash');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [walletPhone, setWalletPhone] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const navigate = useNavigate();

  const cartCount = cart.reduce((s, i) => s + (i.qty || 0), 0);
  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
  const deliveryFee = 5;
  const grandTotal = cartTotal + deliveryFee;

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev: any[]) => prev.filter(c => c.id !== productId));
      return;
    }
    setCart((prev: any[]) => prev.map(c => c.id === productId ? { ...c, qty: newQty } : c));
  };

  const clearCart = () => setCart([]);

  // ── Send order email to admin ─────────────────────────────────────────────
  const notifyAdmin = async (id: string) => {
    setEmailSending(true);
    try {
      const result = await orderEmailService.sendOrderToAdmin({
        orderId: id,
        customerName: user?.user_metadata?.full_name || user?.email || 'عميل',
        customerEmail: user?.email,
        customerPhone: user?.user_metadata?.phone_number || walletPhone || undefined,
        items: cart.map(item => ({
          name_ar: item.name_ar || item.name || 'منتج',
          price: item.price,
          qty: item.qty,
          unit: item.unit || 'وحدة',
        })),
        total: cartTotal,
        deliveryFee,
        grandTotal,
        deliveryAddress: user?.user_metadata?.address_line1
          ? `${user.user_metadata.address_line1}، ${user.user_metadata.city || ''}`
          : 'لم يحدد عنوان',
        paymentMethod: pMethod,
      });

      if (result.success) {
        console.log(`📧 Admin notified at ${result.sentTo}`);
      } else {
        console.warn('⚠️ Admin email failed (silent):', result.error);
        // Don't block the order — email failure is non-critical
      }
    } catch (e) {
      console.warn('⚠️ Email notification skipped:', e);
    } finally {
      setEmailSending(false);
    }
  };

  // ── Main checkout handler ─────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const rand = Math.floor(1000 + Math.random() * 9000);
    const newId = `ORD-${rand}`;
    setOrderNum(newId);

    if (pMethod === 'cash') {
      processOrderLocally(newId);
      // Send email to admin
      await notifyAdmin(newId);
    } else {
      processOrderLocally(newId, true);
      await notifyAdmin(newId);

      setLoading(true);
      try {
        const response = await paymobService.createIntent(grandTotal, newId, {
          full_name: user?.user_metadata?.full_name || 'Customer',
          email: user?.email || 'client@elatyab.com',
          phone_number: walletPhone || user?.user_metadata?.phone_number || '01000000000',
        });

        if (response.success && response.checkoutUrl) {
          clearCart();
          window.location.href = response.checkoutUrl;
        } else {
          toast.error(response.error || 'فشل الاتصال بـ Paymob');
          setLoading(false);
        }
      } catch (err: any) {
        toast.error('حدث خطأ في معالجة الدفع');
        setLoading(false);
      }
    }
  };

  const processOrderLocally = (id: string, isRedirect = false) => {
    if (setOrderHistory) {
      setOrderHistory((prev: any[]) => [
        ...prev,
        {
          id,
          date: new Date().toLocaleDateString('ar-EG'),
          items: [...cart],
          total: grandTotal,
          pts: cart.reduce(
            (s, i) => s + (i.points || Math.round((i.price || 0) * 10)) * (i.qty || 0), 0
          ),
          status: 'pending',
          updatedAt: new Date(),
          paymentMethod: pMethod,
        },
      ]);
    }
    if (!isRedirect) {
      setIsSuccess(true);
    }
  };

  const handleFinish = () => {
    clearCart();
    setIsSuccess(false);
    navigate('/categories');
  };

  const statusMap: any = {
    pending:   { label: 'قيد الانتظار',   color: '#F59E0B', rank: 0 },
    preparing: { label: 'جاري التحضير',   color: '#3B82F6', rank: 1 },
    shipping:  { label: 'قيد التوصيل',    color: '#8B5CF6', rank: 2 },
    delivered: { label: 'تم التوصيل',     color: '#22c55e', rank: 3 },
  };

  const timelineSteps = [
    { key: 'pending',   label: 'تم استلام الطلب' },
    { key: 'preparing', label: 'جاري التحضير'    },
    { key: 'shipping',  label: 'قيد التوصيل'     },
    { key: 'delivered', label: 'تم التوصيل'      },
  ];

  return (
    <div
      style={{
        minHeight: '100vh', background: '#0a0a0a', padding: '20px 20px 120px',
        color: '#fff', direction: 'rtl', fontFamily: "'Cairo', sans-serif",
      }}
      dir="rtl"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');
        @keyframes bounceIn {
          0%   { transform:scale(0.3); opacity:0; }
          50%  { transform:scale(1.05); opacity:1; }
          70%  { transform:scale(0.9); }
          100% { transform:scale(1); }
        }
        @keyframes slideUp {
          from { transform:translateY(100%); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        .payment-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 20px;
          transition: all 0.3s; cursor: pointer;
        }
        .payment-card.active {
          background: rgba(34,197,94,0.08);
          border-color: #22c55e;
          box-shadow: 0 0 20px rgba(34,197,94,0.1);
        }
        .input-field {
          background: #111; border: 1px solid #333; border-radius: 12px;
          padding: 12px 16px; color: #fff; width: 100%;
          font-family: 'Cairo', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #22c55e; }
      `}</style>

      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background:'rgba(255,255,255,0.05)', border:'none', color:'#fff', padding:12, borderRadius:15, cursor:'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <div style={{ textAlign:'right' }}>
          <h1 style={{ fontSize:24, fontWeight:900, margin:0 }}>مراجعة الطلب</h1>
          <p style={{ color:'#555', fontSize:13, margin:0 }}>خطوة واحدة لتأكيد طلبك</p>
        </div>
      </div>

      {cart.length === 0 && orderHistory.length === 0 ? (
        <div style={{ textAlign:'center', padding:'100px 20px' }}>
          <ShoppingBag size={80} color="#22c55e" style={{ opacity:0.2, marginBottom:20 }} />
          <h2 style={{ fontSize:20, fontWeight:700, opacity:0.5 }}>سلتك فارغة تماماً</h2>
          <button
            onClick={() => navigate('/categories')}
            style={{ marginTop:20, background:'#22c55e', color:'#000', border:'none', padding:'12px 30px', borderRadius:12, fontWeight:800 }}
          >
            تسوق الآن
          </button>
        </div>
      ) : (
        <>
          {/* ITEMS LIST */}
          <div style={{ marginBottom:40 }}>
            {cart.map(item => (
              <div
                key={item.id}
                style={{
                  background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
                  borderRadius:20, padding:15, marginBottom:12,
                  display:'flex', gap:15, alignItems:'center',
                }}
              >
                <img src={item.image_url} style={{ width:60, height:60, borderRadius:12, objectFit:'cover' }} />
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, margin:0 }}>{item.name_ar}</h3>
                  <p style={{ color:'#22c55e', fontWeight:800, margin:'2px 0' }}>{item.price} ج.م</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'#000', padding:'5px 10px', borderRadius:12 }}>
                  <button onClick={() => updateQuantity(item.id, item.qty - 1)} style={{ background:'none', border:'none', color:'#ff4444' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight:800, width:20, textAlign:'center' }}>{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, item.qty + 1)} style={{ background:'none', border:'none', color:'#22c55e' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAYMENT METHODS */}
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>اختر طريقة الدفع</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginBottom:25 }}>
            {[
              { id:'cash',   label:'كاش عند الاستلام',        desc:'ادفع للمندوب', icon:<Banknote size={24}/>,   color:'#F59E0B' },
              { id:'wallet', label:'فودافون كاش',              desc:'والمحافظ الإلكترونية', icon:<Smartphone size={24}/>, color:'#EF4444' },
            ].map(m => (
              <div key={m.id} onClick={() => setPMethod(m.id)} className={`payment-card ${pMethod === m.id ? 'active' : ''}`}>
                <div style={{ color:m.color, marginBottom:10 }}>{m.icon}</div>
                <div style={{ fontWeight:800, fontSize:13 }}>{m.label}</div>
                <div style={{ color:'#666', fontSize:10 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          {/* WALLET FORM */}
          {pMethod === 'wallet' && (
            <div style={{ background:'rgba(255,255,255,0.02)', padding:20, borderRadius:24, border:'1px solid rgba(239,68,68,0.2)', marginBottom:25, animation:'slideUp 0.3s ease-out' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:15 }}>
                <div style={{ padding:8, background:'#EF444422', color:'#EF4444', borderRadius:10 }}><Smartphone size={18}/></div>
                <h3 style={{ fontSize:14, fontWeight:700, margin:0 }}>فودافون كاش</h3>
              </div>
              <input className="input-field" placeholder="010xxxxxxxx" maxLength={11} value={walletPhone} onChange={e => setWalletPhone(e.target.value)} />
              <div style={{ marginTop:15, padding:10, background:'#0006', borderRadius:12, border:'1px dashed #ef444466' }}>
                <p style={{ fontSize:11, margin:0, color:'#ccc', textAlign:'center' }}>
                  للمساعدة: <span style={{ color:'#ef4444', fontWeight:800 }}>01090743333</span>
                </p>
              </div>
            </div>
          )}

          {/* EMAIL NOTE */}
          <div style={{ background:'rgba(0,62,49,0.2)', border:'1px solid rgba(0,62,49,0.4)', borderRadius:16, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <Mail size={18} color="#22c55e" />
            <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.6)' }}>
              سيتم إرسال تفاصيل طلبك تلقائياً إلى الأدمن وسيتواصل معك قريباً
            </p>
          </div>

          {/* SUMMARY */}
          <div style={{ background:'#111', borderRadius:24, padding:20, marginBottom:30 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ color:'#666', fontSize:13 }}>المجموع ({cartCount} قطع)</span>
              <span style={{ fontWeight:700 }}>{cartTotal.toFixed(2)} ج.م</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ color:'#666', fontSize:13 }}>رسوم التوصيل</span>
              <span style={{ fontWeight:700 }}>{deliveryFee.toFixed(2)} ج.م</span>
            </div>
            <div style={{ height:1, background:'#222', margin:'15px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:18, fontWeight:900 }}>الإجمالي</span>
              <span style={{ fontSize:22, fontWeight:900, color:'#22c55e' }}>{grandTotal.toFixed(2)} ج.م</span>
            </div>
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading || emailSending}
            style={{
              width:'100%', padding:18, borderRadius:20, border:'none',
              background: loading || emailSending ? '#1a4a3a' : '#22c55e',
              color: loading || emailSending ? '#aaa' : '#000',
              fontSize:18, fontWeight:900,
              cursor: loading || emailSending ? 'not-allowed' : 'pointer',
              transition:'all 0.3s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow:'0 10px 30px rgba(34,197,94,0.2)',
            }}
          >
            {loading || emailSending
              ? <><Loader2 className="animate-spin" size={22} /> جاري معالجة الطلب...</>
              : pMethod === 'cash'
                ? <><ShieldCheck size={22}/> تأكيد الطلب كاش</>
                : <><Smartphone size={22}/> ادفع الآن واطلب</>
            }
          </button>
        </>
      )}

      {/* PREVIOUS ORDERS */}
      {orderHistory.length > 0 && (
        <div style={{ marginTop:50 }}>
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>طلباتك السابقة</h2>
          {orderHistory.map(order => (
            <div key={order.id} style={{ background:'#111', borderRadius:20, padding:15, marginBottom:15 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:800 }}>#{order.id}</span>
                <span style={{ color:statusMap[order.status]?.color || '#fff', fontSize:12, fontWeight:800 }}>
                  {statusMap[order.status]?.label || 'قيد الانتظار'}
                </span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
                <span style={{ color:'#555', fontSize:12 }}>{order.date}</span>
                <button
                  onClick={() => setTrackingOrder(order)}
                  style={{ background:'#22c55e22', color:'#22c55e', border:'none', borderRadius:8, padding:'4px 12px', fontSize:11, fontWeight:800 }}
                >
                  تتبع الطلب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccess && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#111', borderRadius:32, padding:40, textAlign:'center', width:'100%', maxWidth:400, animation:'bounceIn 0.5s' }}>
            <div style={{ width:80, height:80, background:'#22c55e22', color:'#22c55e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize:24, fontWeight:900, marginBottom:10 }}>تم استلام طلبك! 🎉</h2>
            <p style={{ color:'#666', marginBottom:10 }}>
              رقم طلبك: <span style={{ color:'#22c55e', fontWeight:800 }}>{orderNum}</span>
            </p>
            <div style={{ background:'rgba(0,62,49,0.2)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, padding:'10px 16px', marginBottom:20 }}>
              <p style={{ margin:0, fontSize:13, color:'rgba(255,255,255,0.7)' }}>
                📧 تم إرسال تفاصيل طلبك للأدمن وسيتواصل معك قريباً
              </p>
            </div>
            <button onClick={handleFinish} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:'#22c55e', color:'#000', fontWeight:900, fontSize:16 }}>
              العودة للمتجر
            </button>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingOrder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:2000, display:'flex', alignItems:'flex-end' }} onClick={() => setTrackingOrder(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#0a0a0a', width:'100%', borderRadius:'32px 32px 0 0', padding:30, animation:'slideUp 0.3s' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:30 }}>
              <h2 style={{ fontSize:20, fontWeight:900 }}>حالة الطلب #{trackingOrder.id}</h2>
              <button onClick={() => setTrackingOrder(null)} style={{ background:'#222', border:'none', color:'#fff', borderRadius:'50%', width:30, height:30 }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
              {timelineSteps.map((step, i) => {
                const isDone = statusMap[trackingOrder.status]?.rank >= i;
                return (
                  <div key={step.key} style={{ display:'flex', gap:15, position:'relative' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', background: isDone ? '#22c55e' : '#222', zIndex:2 }} />
                      {i < 3 && <div style={{ width:2, flex:1, background: isDone ? '#22c55e55' : '#222', minHeight:30 }} />}
                    </div>
                    <span style={{ fontWeight: isDone ? 800 : 400, opacity: isDone ? 1 : 0.3 }}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
