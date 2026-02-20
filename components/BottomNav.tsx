import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ClipboardList, Brain } from 'lucide-react';
import { NavItem } from '../types';
import { useAppContext } from '../contexts/AppContext';

const navItems: NavItem[] = [
  { icon: Home, label: "الرئيسية", path: "/" },
  { icon: Brain, label: "الذكاء", path: "/ai-assistant" },
  { icon: LayoutGrid, label: "الأقسام", path: "/categories" },
  { icon: ClipboardList, label: "طلباتي", path: "/orders" },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, cartCount } = useAppContext();
  const [hovered, setHovered] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [indicatorX, setIndicatorX] = useState(0);
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const updateIndicator = useCallback((index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLLIElement>(".nav-item-li");
    const item = items[index];
    if (item) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      setIndicatorX(itemRect.left - listRect.left + itemRect.width / 2);
    }
  }, []);

  useEffect(() => {
    updateIndicator(hovered !== null ? hovered : safeActiveIndex);
  }, [hovered, safeActiveIndex, updateIndicator]);

  return (
    <>
      {/* ── الحاوية الخارجية تمتد حتى حافة الشاشة ─────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'var(--color-fruit-surface, #1a2e27)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* ── شريط التنقل الفعلي ──────────────────────────────── */}
        <nav
          className="
            flex items-center justify-around
            bg-fruit-surface/95 backdrop-blur-2xl
            border-t border-fruit-primary/20
            shadow-[0_-8px_32px_rgba(0,0,0,0.4)]
            w-full
            px-2
          "
          style={{ height: '64px' }}
        >
          <ul
            className="relative flex flex-row flex-nowrap w-full justify-around list-none m-0 p-0 h-full items-center"
            ref={listRef}
            onMouseLeave={() => setHovered(null)}
          >
            {/* ── مؤشر النقطة المتحركة ──────────────────────── */}
            <span
              className="
                absolute top-1/2
                w-[52px] h-[52px]
                bg-fruit-accent rounded-full
                transition-all duration-[0.6s]
                shadow-[0_15px_40px_rgba(219,106,40,0.5)]
                z-[1]
                pointer-events-none
              "
              style={{
                left: `${indicatorX}px`,
                transform: `translate(-50%, ${
                  hovered !== null || safeActiveIndex !== -1 ? '-85%' : '-50%'
                })`,
              }}
            />

            {navItems.map((item, index) => {
              const isActive = safeActiveIndex === index;
              const isHovered = hovered === index;
              const Icon = item.icon;
              const isOrders = item.path === '/orders';

              return (
                <li
                  key={item.label}
                  className="nav-item-li relative flex flex-col items-center justify-center flex-1 cursor-pointer z-[2] group h-full"
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHovered(index)}
                >
                  <div
                    className={`
                      flex items-center justify-center
                      w-11 h-11 rounded-full
                      transition-all duration-[0.5s]
                      ${(isActive || isHovered)
                        ? '-translate-y-6 text-fruit-bg scale-110'
                        : 'text-fruit-primary/60 group-hover:text-fruit-accent'}
                    `}
                  >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    {isOrders && cartCount > 0 && !isActive && (
                      <span className="absolute top-0 right-0 bg-fruit-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border-2 border-fruit-surface shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-1 w-full flex justify-center overflow-hidden pointer-events-none">
                    <span
                      className={`
                        transition-all duration-[0.4s]
                        text-[10px] font-black tracking-tight text-center
                        ${(isActive || isHovered)
                          ? 'translate-y-0 opacity-100 text-fruit-accent'
                          : 'translate-y-8 opacity-0'}
                      `}
                    >
                      {item.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ── Spacer: يمنع المحتوى من الاختفاء خلف الـ nav ───── */}
      <div
        style={{
          height: `calc(64px + env(safe-area-inset-bottom, 0px))`,
          flexShrink: 0,
        }}
      />
    </>
  );
};

export default BottomNav;
