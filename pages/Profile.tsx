
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, ChevronRight, Wallet, Leaf, History, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { authService } from '../src/supabase/supabase-service';
import { supabase } from '../src/supabase/supabase-config';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, language } = useAppContext();
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', postalCode: '' });

  useEffect(() => {
    if (user && user.user_metadata) {
      setAddress({
        line1: user.user_metadata.address_line1 || '',
        line2: user.user_metadata.address_line2 || '',
        city: user.user_metadata.city || '',
        postalCode: user.user_metadata.postal_code || ''
      });
    }
  }, [user]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleUpdateAddress = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        address_line1: address.line1,
        address_line2: address.line2,
        city: address.city,
        postal_code: address.postalCode
      }
    });

    if (!error) {
      setUser(data.user);
      toast.success(language === 'ar' ? 'تم تحديث العنوان بنجاح!' : 'Address updated successfully!');
    } else {
      toast.error(language === 'ar' ? 'فشل تحديث العنوان.' : 'Failed to update address.');
    }
  };

  const handleLogout = async () => {
    const res = await authService.signOut();
    if (res.success) {
      setUser(null);
      toast.success(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-fruit-bg p-6 text-center">
        <User size={64} className="text-white/20 mb-4" />
        <h2 className="text-2xl font-black text-white mb-6">يرجى تسجيل الدخول لعرض ملفك الشخصي</h2>
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-fruit-primary text-white rounded-2xl font-black"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-32 px-6 relative bg-fruit-bg" dir="rtl">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* ... Header ... */}
        
        <div className="space-y-4">
          <ProfileLink icon={Wallet} label="إدارة المحفظة" sub="شحن الرصيد • سجل العمليات" onClick={() => navigate('/wallet')} />
          <ProfileLink icon={History} label="سجل الطلبات" sub="تتبع طلباتك الحالية والسابقة" onClick={() => navigate('/orders')} />
          
          {/* Address Management */}
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 space-y-4">
            <div className="flex items-center gap-4 text-white">
                <MapPin size={20} className="text-fruit-primary"/>
                <h3 className="font-bold text-lg">عنوان التوصيل</h3>
            </div>
            <input name="line1" value={address.line1} onChange={handleAddressChange} placeholder="العنوان الأول" className="w-full bg-white/10 p-2 rounded text-white" />
            <input name="line2" value={address.line2} onChange={handleAddressChange} placeholder="العنوان الثاني (اختياري)" className="w-full bg-white/10 p-2 rounded text-white" />
            <div className="flex gap-4">
                <input name="city" value={address.city} onChange={handleAddressChange} placeholder="المدينة" className="w-1/2 bg-white/10 p-2 rounded text-white" />
                <input name="postalCode" value={address.postalCode} onChange={handleAddressChange} placeholder="الرمز البريدي" className="w-1/2 bg-white/10 p-2 rounded text-white" />
            </div>
            <button onClick={handleUpdateAddress} className="w-full bg-fruit-primary text-white font-bold py-2 rounded-lg mt-2">حفظ العنوان</button>
          </div>

          <ProfileLink icon={Leaf} label="تأثيرك البيئي" sub="شاهد مساهمتك في حماية الكوكب" />
          <ProfileLink icon={Settings} label="إعدادات الحساب" sub="تعديل البيانات • التنبيهات • المظهر" />
          
          <div className="pt-6">
            <button onClick={handleLogout} className="w-full flex items-center p-6 bg-red-500/5 hover:bg-red-500/10 rounded-[28px] border border-red-500/20 text-red-500 ...">
              {/* ... Logout Button ... */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileLink: React.FC<{icon: any, label: string, sub: string, onClick?: () => void}> = ({ icon: Icon, label, sub, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-6 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/5 ...">
        {/* ... ProfileLink implementation ... */}
    </button>
);

export default Profile;
