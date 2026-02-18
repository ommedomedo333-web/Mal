"use client";

import React, { useState, useEffect } from "react";

const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Tracking page views for "Browsing" alert logic
    const views = parseInt(localStorage.getItem("pwa-view-count") || "0");
    localStorage.setItem("pwa-view-count", (views + 1).toString());

    // iOS detection
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const shouldShow = () => {
      const dismissed = localStorage.getItem(isIOSDevice ? "pwa-ios-dismissed" : "pwa-dismissed");
      if (dismissed) return false;

      // Show if we have at least 2 views OR after a delay
      return views >= 1;
    };

    if (isIOSDevice) {
      if (shouldShow()) {
        setTimeout(() => setShowBanner(true), 2000);
      }
      return;
    }

    // Android / Desktop
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShow()) {
        setTimeout(() => setShowBanner(true), 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      handleClose();
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) return;
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      handleClose();
    }
  };

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setShowBanner(false);
      setAnimateOut(false);
    }, 400);
    const key = isIOS ? "pwa-ios-dismissed" : "pwa-dismissed";
    localStorage.setItem(key, "true");
  };

  if (!showBanner || isInstalled) return null;

  return (
    <>
      <style>{`
        .pwa-banner {
          position: fixed;
          top: 24px; left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          width: 90%;
          max-width: 440px;
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .pwa-banner.out { animation: slideUpOut 0.4s ease forwards; }

        .pwa-card {
          background: rgba(0, 26, 20, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(219, 106, 40, 0.3);
          border-radius: 32px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(219,106,40,0.1);
          position: relative;
        }

        .pwa-top-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .pwa-icon-wrap {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #db6a28, #f97316);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 30px;
          box-shadow: 0 8px 16px rgba(219,106,40,0.3);
          flex-shrink: 0;
        }

        .pwa-title {
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          margin: 0;
        }

        .pwa-subtitle {
          font-size: 12px;
          color: rgba(254, 233, 209, 0.6);
          margin-top: 2px;
        }

        .pwa-features {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .pwa-feature-chip {
          background: rgba(219, 106, 40, 0.1);
          border: 1px solid rgba(219, 106, 40, 0.15);
          border-radius: 10px;
          padding: 4px 10px;
          font-size: 11px;
          color: #fee9d1;
          font-weight: 700;
          display: flex; align-items: center; gap: 4px;
        }

        .pwa-btn-group {
          display: flex;
          gap: 12px;
        }

        .pwa-install-btn {
          flex: 2;
          background: #db6a28;
          border: none;
          border-radius: 16px;
          padding: 14px;
          font-size: 15px;
          font-weight: 900;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(219,106,40,0.3);
          transition: all 0.2s;
        }
        .pwa-install-btn:active { transform: scale(0.96); }

        .pwa-later-btn {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pwa-later-btn:hover { background: rgba(255,255,255,0.1); }

        .pwa-ios-steps {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .pwa-ios-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 0;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
        }

        .pwa-step-num {
          width: 24px; height: 24px;
          background: #db6a28;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900;
        }

        @keyframes slideDown { 
          from { transform: translate(-50%, -120%); opacity: 0; } 
          to { transform: translate(-50%, 0); opacity: 1; } 
        }
        @keyframes slideUpOut { 
          from { transform: translate(-50%, 0); opacity: 1; } 
          to { transform: translate(-50%, -120%); opacity: 0; } 
        }

        @media (max-width: 480px) {
          .pwa-banner { top: 12px; width: 94%; }
          .pwa-card { padding: 20px; }
        }
      `}</style>

      <div className={`pwa-banner ${animateOut ? "out" : ""}`}>
        <div className="pwa-card">
          <div className="pwa-top-row">
            <div className="pwa-icon-wrap">🌿</div>
            <div className="pwa-title-block">
              <h2 className="pwa-title">CyberNav Hub</h2>
              <div className="pwa-subtitle">بضاعة فاخرة • تنزيل سريع ومزايا كاملة</div>
            </div>
          </div>

          <div className="pwa-features">
            <div className="pwa-feature-chip"><span>⚡</span> فائق السرعة</div>
            <div className="pwa-feature-chip"><span>📴</span> تصفح أوفلاين</div>
            <div className="pwa-feature-chip"><span>🎁</span> تنبيهات العروض</div>
          </div>

          {isIOS ? (
            <>
              <div className="pwa-ios-steps">
                <div className="pwa-ios-step">
                  <div className="pwa-step-num">1</div>
                  <span>اضغط على <strong>المشاركة</strong> ⬆️</span>
                </div>
                <div className="pwa-ios-step">
                  <div className="pwa-step-num">2</div>
                  <span>اختر <strong>إضافة إلى الشاشة الرئيسية</strong> 📲</span>
                </div>
              </div>
              <button className="pwa-install-btn" onClick={handleClose}>حسناً</button>
            </>
          ) : (
            <div className="pwa-btn-group">
              <button className="pwa-install-btn" onClick={handleInstall}>تنزيل التطبيق</button>
              <button className="pwa-later-btn" onClick={handleClose}>ليس الآن</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PWAInstallBanner;