"use client";

import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

const AppDownloadAlert: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is on mobile and hasn't dismissed the alert
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isDismissed = localStorage.getItem('app_download_dismissed');
    
    if (isMobile && !isDismissed) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('app_download_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-in slide-in-from-top duration-500">
      <div className="bg-fruit-surface/95 backdrop-blur-xl border border-fruit-accent/30 p-4 rounded-[24px] shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-fruit-accent/20 rounded-2xl flex items-center justify-center text-fruit-accent">
            <Smartphone size={24} />
          </div>
          <div>
            <h4 className="text-white font-black text-sm">تطبيق الأطيب أسرع!</h4>
            <p className="text-white/50 text-[10px] font-bold">حمل التطبيق الآن لتجربة تسوق أفضل</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open('#', '_blank')}
            className="bg-fruit-accent text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-lg shadow-fruit-accent/20 active:scale-95 transition-all"
          >
            <Download size={14} />
            تحميل
          </button>
          <button 
            onClick={handleDismiss}
            className="p-2 text-white/30 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadAlert;