import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Categories from './pages/Categories';
import OrdersScreen from './pages/Orders';
import Offers from './pages/Offers';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import AIAssistant from './pages/AIAssistant';
import Admin from './pages/Admin';
import EmailTest from './pages/EmailTest';
import FirstTimeLogin from './pages/FirstTimeLogin';
import Signup from './pages/Signup';
import BottomNav from './components/BottomNav';
import PWAInstallBanner from './src/components/PWAInstallBanner';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { CompleteAppProviders, ProtectedRoute } from './src/supabase/context-providers';

const App: React.FC = () => {
  return (
    <CompleteAppProviders>
      <AppProvider>
        <Router>
          <MainApp />
        </Router>
      </AppProvider>
    </CompleteAppProviders>
  );
};

const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const { totalPoints, setTotalPoints, t } = useAppContext() as any;
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('cybernav_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderHistory, setOrderHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('cybernav_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  React.useEffect(() => {
    localStorage.setItem('cybernav_cart', JSON.stringify(cart));
  }, [cart]);

  React.useEffect(() => {
    localStorage.setItem('cybernav_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  function updateOrderStatus(orderId: string, newStatus: string) {
    setOrderHistory(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date() }
          : o
      )
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-fruit-bg">
      {/* PWA Install Banner - This is the primary "Download App" alert */}
      <PWAInstallBanner />

      {/* Floating Header Actions (Cart & BTS) */}
      <div className="fixed top-5 right-5 z-20 flex items-center gap-3">
        {/* BTS Points Display */}
        <div
          className="flex items-center gap-2 px-4 py-2 cursor-pointer transition-all active:scale-95 group"
          onClick={() => navigate('/wallet')}
          style={{
            background: 'rgba(0, 77, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="w-6 h-6 bg-fruit-primary rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="text-[10px] font-black text-white">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-black uppercase tracking-tighter leading-none">{t.btsAwards}</span>
            <span className="text-sm font-black text-white leading-none">{totalPoints || 0}</span>
          </div>
        </div>

        {/* Cart Icon */}
        <div
          className="relative cursor-pointer transition-all active:scale-95"
          onClick={() => navigate('/orders')}
          style={{
            background: '#004d3e',
            padding: '12px',
            borderRadius: '50%',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: totalItems > 0 ? 'scalePop 0.25s ease' : 'none'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-[#db6a28] text-white rounded-full flex items-center justify-center font-extrabold"
              style={{
                minWidth: '18px',
                height: '18px',
                fontSize: '10px',
                border: '2px solid #004d3e',
                animation: 'bounceBadge 0.5s ease'
              }}
            >
              {totalItems}
            </span>
          )}
        </div>
      </div>

      <style>{`\n        @keyframes scalePop {\n          0% { transform: scale(1); }\n          50% { transform: scale(1.3); }\n          100% { transform: scale(1); }\n+        }\n        @keyframes bounceBadge {\n          0%, 100% { transform: translateY(0); }\n          50% { transform: translateY(-3px) scale(1.1); }\n        }\n      `}</style>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/first-time-login" element={<FirstTimeLogin />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/categories" element={<Categories cart={cart} setCart={setCart} />} />
          <Route path="/categories/:categoryId" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersScreen cart={cart} setCart={setCart} orderHistory={orderHistory} setOrderHistory={setOrderHistory} />
            </ProtectedRoute>
          } />
          <Route path="/offers" element={<Offers />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/admin" element={<Admin orderHistory={orderHistory} updateOrderStatus={updateOrderStatus} />} />
          <Route path="/email-test" element={<EmailTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNavWrapper />
    </div>
  );
};

const BottomNavWrapper: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  if (isLoginPage) return null;
  return <BottomNav />;
};

export default App;
