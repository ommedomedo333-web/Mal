import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { walletService } from '../src/supabase/supabase-service';
import { useAppContext } from '../contexts/AppContext';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Collision-optimized ring definition
const MAZE_RINGS = [
  { radius: 45, gaps: [{ start: 260, end: 280 }] },
  { radius: 40, gaps: [{ start: 80, end: 110 }] },
  { radius: 35, gaps: [{ start: 300, end: 330 }] },
  { radius: 30, gaps: [{ start: 170, end: 200 }] },
  { radius: 25, gaps: [{ start: 10, end: 40 }] },
  { radius: 20, gaps: [{ start: 220, end: 250 }] },
  { radius: 15, gaps: [{ start: 120, end: 150 }] },
  { radius: 10, gaps: [{ start: 340, end: 360 }, { start: 0, end: 10 }] },
];

const Buzzer: React.FC = () => {
  const { user, language } = useAppContext();
  const navigate = useNavigate();
  const [ballPos, setBallPos] = useState({ x: 97, y: 50 });
  const [hasWonToday, setHasWonToday] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  // Check daily status
  useEffect(() => {
    const lastWin = localStorage.getItem('buzzer_last_win');
    const today = new Date().toDateString();
    if (lastWin === today) {
      setHasWonToday(true);
    }
  }, []);

  const handlePointerInteraction = (e: React.TouchEvent | React.MouseEvent) => {
    if (!user || hasWonToday || !svgRef.current) return;

    // Prevent default scrolling on touch
    if ('touches' in e) {
      if (e.cancelable) e.preventDefault();
    }

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();

    if ('touches' in e) {
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else {
      pt.x = (e as React.MouseEvent).clientX;
      pt.y = (e as React.MouseEvent).clientY;
    }

    const loc = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    // Smooth movement towards touch point
    const dx = loc.x - ballPos.x;
    const dy = loc.y - ballPos.y;
    const distToTouch = Math.sqrt(dx * dx + dy * dy);

    if (distToTouch > 1) {
      const speed = Math.min(distToTouch * 0.2, 2.5);
      velocity.current.x = (dx / distToTouch) * speed;
      velocity.current.y = (dy / distToTouch) * speed;
    } else {
      velocity.current.x = 0;
      velocity.current.y = 0;
    }
  };

  const updateBall = () => {
    if (!user || hasWonToday) return;

    // Apply some friction/damping to velocity
    velocity.current.x *= 0.8;
    velocity.current.y *= 0.8;

    setBallPos(prev => {
      let newX = prev.x + velocity.current.x;
      let newY = prev.y + velocity.current.y;

      const dx = newX - 50;
      const dy = newY - 50;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const prevDx = prev.x - 50;
      const prevDy = prev.y - 50;
      const prevDist = Math.sqrt(prevDx * prevDx + prevDy * prevDy);

      let finalX = newX;
      let finalY = newY;
      let collided = false;

      // WIN CONDITION
      if (dist < 8) {
        handleWin();
        return prev;
      }

      // 1. Boundary
      if (dist > 48) {
        const angle = Math.atan2(dy, dx);
        finalX = 50 + Math.cos(angle) * 48;
        finalY = 50 + Math.sin(angle) * 48;
        collided = true;
      }

      // 2. Ring collision
      MAZE_RINGS.forEach(ring => {
        if ((prevDist > ring.radius && dist <= ring.radius) ||
          (prevDist < ring.radius && dist >= ring.radius)) {

          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const isInGap = ring.gaps.some(gap => angle >= gap.start && angle <= gap.end);

          if (!isInGap) {
            const angleLocked = Math.atan2(prevDy, prevDx);
            const offset = (prevDist > ring.radius) ? 0.35 : -0.35;
            finalX = 50 + Math.cos(angleLocked) * (ring.radius + offset);
            finalY = 50 + Math.sin(angleLocked) * (ring.radius + offset);
            collided = true;
          }
        }
      });

      if (collided) {
        velocity.current = { x: 0, y: 0 };
      }

      return { x: finalX, y: finalY };
    });

    requestRef.current = requestAnimationFrame(updateBall);
  };

  const handleWin = async () => {
    const today = new Date().toDateString();
    localStorage.setItem('buzzer_last_win', today);
    setHasWonToday(true);
    velocity.current = { x: 0, y: 0 };

    if (user && user.id) {
      const res = await walletService.addMoney(user.id, 20, 'Maze Game Daily Reward');
      if (res.success) {
        toast.success(language === 'ar' ? 'مبروك! ربحت 20 نقطة!' : 'Congratulations! You earned 20 PTS!', {
          duration: 5000,
          position: 'top-center',
          icon: '🎉',
          style: { borderRadius: '24px', background: '#00c853', color: '#fff', fontWeight: '900' },
        });
      }
    }
  };

  useEffect(() => {
    if (user && !hasWonToday) {
      requestRef.current = requestAnimationFrame(updateBall);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [user, hasWonToday]);

  if (!user) {
    return (
      <div className="relative w-full aspect-square max-w-[550px] mx-auto bg-black/40 rounded-[60px] border-4 border-white/5 flex flex-col items-center justify-center p-8 backdrop-blur-xl group overflow-hidden shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fruit-primary/20 to-transparent opacity-40" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
            <Lock size={40} className="text-fruit-primary" />
          </div>
          <h2 className="text-white font-black text-2xl mb-2">
            {language === 'ar' ? 'للمسجلين فقط' : 'Members Only'}
          </h2>
          <p className="text-white/40 text-sm mb-8 font-medium">
            {language === 'ar' ? 'سجل دخول لتربح 20 نقطة يومياً' : 'Sign in to earn 20 points daily'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-8 py-4 bg-fruit-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-fruit-primary/30"
          >
            <LogIn size={20} />
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-6"
    >
      <div className="ae-1 text-center mb-2">
        <h3 className="text-white font-black tracking-[0.2em] text-lg md:text-2xl animate-pulse uppercase">
          {language === 'ar' ? 'ادخل المركز لتربح 20 نقطة' : 'ENTER CENTER FOR 20 PTS'}
        </h3>
      </div>

      <div
        className="relative w-full max-w-[550px] touch-none"
        onMouseMove={handlePointerInteraction}
        onTouchMove={handlePointerInteraction}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'auto' }}
        >
          {/* Maze Rings */}
          <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
            {MAZE_RINGS.map((ring, i) => {
              const segments = [];
              let current = 0;
              const sortedGaps = [...ring.gaps].sort((a, b) => a.start - b.start);

              sortedGaps.forEach(gap => {
                if (gap.start > current) segments.push({ start: current, end: gap.start });
                current = gap.end;
              });
              if (current < 360) segments.push({ start: current, end: 360 });

              return segments.map((seg, si) => {
                const startRad = (seg.start * Math.PI) / 180;
                const endRad = (seg.end * Math.PI) / 180;
                const x1 = 50 + Math.cos(startRad) * ring.radius;
                const y1 = 50 + Math.sin(startRad) * ring.radius;
                const x2 = 50 + Math.cos(endRad) * ring.radius;
                const y2 = 50 + Math.sin(endRad) * ring.radius;
                const largeArc = (seg.end - seg.start) > 180 ? 1 : 0;
                return <path key={`${i}-${si}`} d={`M ${x1} ${y1} A ${ring.radius} ${ring.radius} 0 ${largeArc} 1 ${x2} ${y2}`} />;
              });
            })}
          </g>

          <text x="50" y="52" fill="rgba(255,255,255,0.2)" fontSize="3" textAnchor="middle" fontWeight="900">elatyab</text>

          {/* The Ball */}
          <circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="3"
            fill="#ff1a7d"
            filter="drop-shadow(0 0 12px rgba(255,26,125,1))"
            style={{ transition: 'none' }}
          />

          {/* Winning Center */}
          {!hasWonToday && (
            <circle cx="50" cy="50" r="7" fill="rgba(255,26,125,0.15)" stroke="#ff1a7d" strokeWidth="0.5" strokeDasharray="2 2" />
          )}
        </svg>

        {hasWonToday && (
          <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-[50px] flex items-center justify-center pointer-events-none border-2 border-green-500/30">
            <div className="bg-green-500 text-white font-black px-8 py-3 rounded-full shadow-2xl scale-125">
              {language === 'ar' ? 'مبروك: 20 نقطة ✓' : 'WON: 20 PTS ✓'}
            </div>
          </div>
        )}
      </div>

      <div className="text-white/40 font-bold uppercase tracking-widest text-[10px] ae-3 mt-4">
        {language === 'ar' ? 'حرك اصبعك لتوجيه الكرة' : 'MOVE YOUR FINGER TO GUIDE THE BALL'}
      </div>
    </div>
  );
};

export default Buzzer;
