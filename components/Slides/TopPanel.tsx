import React from 'react';
import { Menu, Search, MapPin, ShoppingCart, Globe } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import '../Navigation.css';

const TopPanel: React.FC = () => {
  const { language, setLanguage, t, cart, searchQuery, setSearchQuery } = useAppContext();

  return (
    <nav className="panel top !bg-fruit-bg/60 backdrop-blur-xl border-b border-white/5">
      <div className="sections desktop">
        <div className="left flex items-center gap-6">
          <a href="/" className="text-white font-black text-2xl tracking-tighter flex items-center gap-2">
            <span className="bg-fruit-primary p-1.5 rounded-xl text-white">EL</span>
            <span className="text-fruit-primary">ATYAB</span>
          </a>
          <div className="hidden lg:flex items-center gap-2 text-white/60 text-xs bg-white/5 px-4 py-2 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <MapPin size={14} className="text-fruit-accent" />
            <span>{t.deliveryTo}: {t.cairo}</span>
          </div>
        </div>
        
        <div className="center">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder} 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-12 text-sm text-white outline-none focus:border-fruit-primary focus:bg-white/10 transition-all"
            />
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/30`} size={18} />
          </div>
        </div>

        <div className="right gap-4">
          <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
          >
            <Globe size={16} />
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          
          <button className="relative p-2.5 text-white hover:text-fruit-primary transition-colors bg-white/5 rounded-full">
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-fruit-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-fruit-bg animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="sections compact">
        <div className="left">
          <span className="text-white font-black text-xl">ELATYAB</span>
        </div>
        <div className="right flex gap-3">
          <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="text-white/60"><Globe size={20}/></button>
          <button className="sidebarTrigger"><Menu size={24} /></button>
        </div>
      </div>
    </nav>
  );
};

export default TopPanel;