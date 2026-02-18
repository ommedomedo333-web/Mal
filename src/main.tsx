import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import '../index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// تسجيل الـ Service Worker
// تسجيل الـ Service Worker (معطّل مؤقتاً أثناء التشخيص لتجنّب مشاكل الكاش)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

// التعامل مع تثبيت التطبيق
window.addEventListener('beforeinstallprompt', (e: any) => {
  // منع المتصفح من إظهار المطالبة التلقائية
  e.preventDefault();
  // تخزين الحدث ليتم استخدامه لاحقاً
  (window as any).deferredPrompt = e;
  // بث حدث مخصص لإعلام المكونات بأن التطبيق جاهز للتثبيت
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});