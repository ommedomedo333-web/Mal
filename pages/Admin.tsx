import React from 'react';
import { useAuthContext } from '../src/supabase/context-providers';
import DashboardPage from '../src/admin/DashboardPage';
import { Link } from 'react-router-dom';

const AdminPage: React.FC<{
  orderHistory?: any[];
  updateOrderStatus?: (id: string, status: string) => void;
}> = ({ orderHistory = [], updateOrderStatus }) => {
  const { user, loading } = useAuthContext();

  if (loading)
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center text-white font-tajawal">
        جاري التحميل...
      </div>
    );

  const isAdmin = user?.email === 'omm651571@gmail.com';

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-[#070707] flex items-center justify-center text-white font-tajawal p-6 text-center"
        dir="rtl"
      >
        <div>
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-black mb-4">وصول غير مصرح به</h1>
          <p className="text-white/50 mb-8">
            عذراً، هذه الصفحة مخصصة لمدير النظام فقط.
          </p>
          <Link
            to="/login"
            className="bg-[#db6a28] text-white px-8 py-3 rounded-2xl font-bold inline-block"
          >
            تسجيل الدخول كمدير
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardPage
      orderHistory={orderHistory}
      updateOrderStatus={updateOrderStatus}
    />
  );
};

export default AdminPage;
