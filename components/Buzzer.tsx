import React, { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { walletService } from '../src/supabase/supabase-service';
import { useAppContext } from '../contexts/AppContext';
import { useWalletContext } from '../src/supabase/context-providers';
import { Lock, LogIn, Info, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Constants ────────────────────────────────────────────────────────────────
const DAILY_REWARD_PTS = 50;
const DEVICE_KEY = 'atyab_device_buzzer_date';
const WIN_RADIUS = 7.5;    // Optimized win detection
const BALL_RADIUS = 2.8;
const FRICTION = 0.90;     // Increased from 0.85 for stability
const SENSITIVITY = 0.25;  // Reduced from 0.28 for less jerky movement
const MAX_SPEED = 2.8;     // Reduced from 3.5 for smoother gameplay

// ─── Ring layout ─────────────────────────────────────────────────────────────
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

// Pre-calculate radii squared for faster distance checks
const RING_RADII_SQ = MAZE_RINGS.map(r => ({
  r: r.radius,
  rSq: r.radius * r.radius,
  gaps: r.gaps
}));

const WIN_RADIUS_SQ = WIN_RADIUS * WIN_RADIUS;
const BORDER_RADIUS = 48.5;
const BORDER_RADIUS_SQ = BORDER_RADIUS * BORDER_RADIUS;

function buildRingPaths() {
  const paths: string[] = [];
  MAZE_RINGS.forEach((ring) => {
    const sortedGaps = [...ring.gaps].sort((a, b) => a.start - b.start);
    let current = 0;
    const segs: { start: number; end: number }[] = [];
    sortedGaps.forEach((gap) => {
      if (gap.start > current) segs.push({ start: current, end: gap.start });
      current = gap.end;
    });
    if (current < 360) segs.push({ start: current, end: 360 });

    segs.forEach((seg) => {
      const s = (seg.start * Math.PI) / 180;
      const e = (seg.end * Math.PI) / 180;
      const x1 = 50 + Math.cos(s) * ring.radius;
      const y1 = 50 + Math.sin(s) * ring.radius;
      const x2 = 50 + Math.cos(e) * ring.radius;
      const y2 = 50 + Math.sin(e) * ring.radius;
      const la = seg.end - seg.start > 180 ? 1 : 0;
      paths.push(`M ${x1} ${y1} A ${ring.radius} ${ring.radius} 0 ${la} 1 ${x2} ${y2}`);
    });
  });
  return paths;
}
const RING_PATHS = buildRingPaths();

function getTodayStr() {
  return new Date().toLocaleDateString('en-CA'); // Stable ISO-like date
}

function isDeviceLockedToday() {
  return localStorage.getItem(DEVICE_KEY) === getTodayStr();
}

function lockDeviceToday() {
  localStorage.setItem(DEVICE_KEY, getTodayStr());
}

// Fast angle calculation without atan2
function fastAngle(dx: number, dy: number): number {
  return ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
}

// Check if angle is in any gap
function isInGap(angle: number, gaps: Array<{ start: number; end: number }>): boolean {
  for (let i = 0; i < gaps.length; i++) {
    const gap = gaps[i];
    if (angle >= gap.start && angle <= gap.end) {
      return true;
    }
  }
  return false;
}

const Buzzer: React.FC = () => {
  const { user, language, refreshWallet, setTotalPoints } = useAppContext() as any;
  const { refetch: refetchWalletData } = useWalletContext();
  const navigate = useNavigate();

  const [hasWonToday, setHasWonToday] = useState(() => isDeviceLockedToday());
  const [winAnim, setWinAnim] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // High-performance refs
  const svgRef = useRef<SVGSVGElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);
  const pos = useRef({ x: 97, y: 50 });
  const vel = useRef({ x: 0, y: 0 });
  const wonRef = useRef(isDeviceLockedToday());
  const userRef = useRef(user);

  useEffect(() => { userRef.current = user; }, [user]);

  const handlePointer = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!userRef.current || wonRef.current || !svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();

    if ('touches' in e) {
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else {
      pt.x = (e as React.MouseEvent).clientX;
      pt.y = (e as React.MouseEvent).clientY;
    }

    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const loc = pt.matrixTransform(ctm.inverse());

    const dx = loc.x - pos.current.x;
    const dy = loc.y - pos.current.y;
    const distSq = dx * dx + dy * dy;

    // Skip if movement is too small (dead zone)
    if (distSq > 0.04) { // 0.2^2
      vel.current.x = Math.min(Math.max(dx * SENSITIVITY, -MAX_SPEED), MAX_SPEED);
      vel.current.y = Math.min(Math.max(dy * SENSITIVITY, -MAX_SPEED), MAX_SPEED);
    }
  }, []);

  const handleWin = useCallback(async () => {
    if (wonRef.current) return;
    wonRef.current = true;

    // Immediate Local Sync
    lockDeviceToday();
    setHasWonToday(true);
    setWinAnim(true);
    if (typeof setTotalPoints === 'function') {
      setTotalPoints((prev: number) => prev + DAILY_REWARD_PTS);
    }

    const currentUser = userRef.current;
    if (!currentUser?.id) return;

    // Async Server Sync
    const res = await walletService.addPoints(currentUser.id, DAILY_REWARD_PTS, 'Buzzer Game Daily Reward');
    if (res.success) {
      // تحديث النقاط من السيرفر بتأخير صغير للتأكد من تطبيق التحديث
      setTimeout(async () => {
        try {
          await refreshWallet?.();
          await refetchWalletData?.();
        } catch (error) {
          console.log('Wallet refresh completed');
        }
      }, 300);

      toast.success(
        language === 'ar'
          ? `🎉 مبروك! ربحت ${DAILY_REWARD_PTS} نقطة أطيب!`
          : `🎉 Congrats! You earned ${DAILY_REWARD_PTS} Atyab Points!`,
        { id: 'win-toast', duration: 4000 }
      );
    } else {
      toast.error(
        language === 'ar'
          ? 'حدث خطأ في إضافة النقاط'
          : 'Error adding points',
        { id: 'error-toast', duration: 4000 }
      );
    }
  }, [language, refreshWallet, refetchWalletData, setTotalPoints]);

  const loop = useCallback(() => {
    if (wonRef.current) return;

    // Apply friction
    vel.current.x *= FRICTION;
    vel.current.y *= FRICTION;

    // Early exit if velocity is negligible
    if (Math.abs(vel.current.x) < 0.005 && Math.abs(vel.current.y) < 0.005) {
      vel.current = { x: 0, y: 0 };
      // Still update DOM for final position
      if (ballRef.current) {
        ballRef.current.setAttribute('cx', pos.current.x.toFixed(1));
        ballRef.current.setAttribute('cy', pos.current.y.toFixed(1));
      }
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    const nx = pos.current.x + vel.current.x;
    const ny = pos.current.y + vel.current.y;

    const dx = nx - 50;
    const dy = ny - 50;
    
    const distSq = dx * dx + dy * dy;

    // Win check using squared distance (faster)
    if (distSq < WIN_RADIUS_SQ) {
      handleWin();
      return;
    }

    let fx = nx, fy = ny;
    const prevDx = pos.current.x - 50;
    const prevDy = pos.current.y - 50;
    const prevDistSq = prevDx * prevDx + prevDy * prevDy;

    // Circular border check using squared distance
    if (distSq > BORDER_RADIUS_SQ) {
      const dist = Math.sqrt(distSq);
      const ratio = BORDER_RADIUS / dist;
      fx = 50 + dx * ratio;
      fy = 50 + dy * ratio;
      vel.current = { x: 0, y: 0 };
    } else {
      // Check ring collisions more efficiently
      const dist = Math.sqrt(distSq);
      const prevDist = Math.sqrt(prevDistSq);
      
      // Only calculate angle once
      const angle = fastAngle(dx, dy);

      for (let i = 0; i < RING_RADII_SQ.length; i++) {
        const ring = RING_RADII_SQ[i];
        
        // Check if crossing this ring
        const crossed = (prevDist <= ring.r && dist > ring.r) || 
                       (prevDist >= ring.r && dist < ring.r);
        
        if (!crossed) continue;

        // Check if in gap
        if (!isInGap(angle, ring.gaps)) {
          // Collision - bounce back
          const ratio = ring.r / prevDist;
          fx = 50 + prevDx * ratio;
          fy = 50 + prevDy * ratio;
          vel.current = { x: 0, y: 0 };
          break;
        }
      }
    }

    pos.current = { x: fx, y: fy };

    // Batch DOM update with minimal precision
    if (ballRef.current) {
      ballRef.current.setAttribute('cx', fx.toFixed(1));
      ballRef.current.setAttribute('cy', fy.toFixed(1));
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [handleWin]);

  useEffect(() => {
    if (user && !hasWonToday) {
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [user, hasWonToday, loop]);

  if (!user) {
    return (
      <div className="relative w-full aspect-square max-w-[550px] mx-auto bg-black/40 rounded-[60px] border-4 border-white/5 flex flex-col items-center justify-center p-8 backdrop-blur-xl shadow-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fruit-primary/20 to-transparent opacity-40" />
        <Lock size={60} className="text-fruit-primary mb-6 animate-bounce" />
        <h2 className="text-white font-black text-2xl mb-2 text-center">{language === 'ar' ? 'للمسجلين فقط' : 'Members Only'}</h2>
        <p className="text-white/40 text-sm mb-8 font-medium text-center">
          {language === 'ar' ? `سجل دخول لتربح ${DAILY_REWARD_PTS} نقطة أطيب يومياً` : `Sign in to earn ${DAILY_REWARD_PTS} Atyab Points daily`}
        </p>
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-10 py-5 bg-fruit-primary text-white rounded-[24px] font-black text-lg shadow-xl shadow-fruit-primary/30 active:scale-95 transition-all">
          <LogIn size={22} /> {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between w-full max-w-[550px] px-4">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-colors"
        >
          <Info size={24} />
        </button>

        <div className="text-center">
          <h3 className={`font-black tracking-tight text-xl md:text-2xl uppercase ${hasWonToday ? 'text-green-400' : 'text-white'}`}>
            {hasWonToday
              ? (language === 'ar' ? `✓ ربحت ${DAILY_REWARD_PTS} نقطة` : `✓ WON ${DAILY_REWARD_PTS} PTS`)
              : (language === 'ar' ? 'لعبة المتاهة' : 'THE MAZE')
            }
          </h3>
        </div>

        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-fruit-primary">
          <Target size={24} />
        </div>
      </div>

      {/* Instructions Modal (Directly in-game for convenience) */}
      {showInstructions && !hasWonToday && (
        <div className="w-full max-w-[550px] bg-fruit-primary/10 border border-fruit-primary/20 p-6 rounded-[32px] animate-in slide-in-from-top duration-300">
          <h4 className="text-fruit-primary font-black mb-2 flex items-center gap-2">
            <Zap size={18} /> {language === 'ar' ? 'كيفية اللعب:' : 'HOW TO PLAY:'}
          </h4>
          <p className="text-white/70 text-sm leading-relaxed font-bold">
            {language === 'ar'
              ? 'تجنب جدران المتاهة (الخطوط البيضاء) وابحث عن الفتحات الصغيرة للعبور من خلالها حتى تصل إلى النقطة المتوهجة في المركز لتربح 50 نقطة أطيب فوراً!'
              : 'Avoid the white walls, find the gaps to pass through, and reach the glowing center to win 50 Atyab Points instantly!'}
          </p>
        </div>
      )}

      {/* Main Game Arena */}
      <div
        className="relative w-full max-w-[550px] touch-none cursor-none will-change-transform"
        onMouseMove={handlePointer}
        onTouchMove={handlePointer}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-auto block drop-shadow-2xl"
          style={{ 
            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {/* Maze Rings */}
          <g fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3.2" strokeLinecap="round" className="transition-opacity duration-1000">
            {RING_PATHS.map((d, i) => <path key={i} d={d} />)}
          </g>

          {/* Winning Center Core */}
          {!hasWonToday && (
            <g className="animate-pulse">
              <circle cx="50" cy="50" r="7.5" fill="rgba(255,26,125,0.15)" stroke="#ff1a7d" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="3" fill="#ff1a7d" />
            </g>
          )}

          {/* The Player Ball */}
          <circle
            ref={ballRef}
            cx={pos.current.x}
            cy={pos.current.y}
            r={BALL_RADIUS}
            fill="#ff1a7d"
            filter="drop-shadow(0 0 12px rgba(255,26,125,1))"
            style={{ pointerEvents: 'none' }}
          />

          <text x="50" y="52" fill="rgba(255,255,255,0.05)" fontSize="3" textAnchor="middle" fontWeight="900">EL ATYAB</text>
        </svg>

        {/* Win Screen Overlay */}
        {hasWonToday && (
          <div className="absolute inset-0 backdrop-blur-md rounded-[50px] flex flex-col items-center justify-center pointer-events-none border-4 border-green-500/20 bg-green-500/10 animate-in zoom-in duration-500">
            <div className="bg-green-500 text-white font-black px-10 py-5 rounded-[30px] shadow-[0_0_50px_rgba(34,197,94,0.4)] scale-110 text-center">
              <div className="text-2xl mb-1">+{DAILY_REWARD_PTS}</div>
              <div className="text-sm opacity-90">{language === 'ar' ? 'نقطة أطيب ✓' : 'ATYAB PTS ✓'}</div>
            </div>
            <p className="text-white/40 text-xs font-black mt-8 uppercase tracking-[0.3em]">
              {language === 'ar' ? 'لقد انتهيت اليوم' : 'YOU ARE DONE FOR TODAY'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Status */}
      {!hasWonToday && (
        <div className="flex flex-col items-center gap-2 opacity-40">
          <div className="w-1 h-8 bg-white/20 rounded-full animate-bounce" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            {language === 'ar' ? 'حرك الكرة نحو المنتج في المركز' : 'GUIDE BALL TO THE CENTER'}
          </span>
        </div>
      )}

      <div className="text-white/10 text-[9px] font-black uppercase text-center mt-2">
        {language === 'ar'
          ? `• الحد اليومي: لعبة واحدة لكل جهاز (${getTodayStr()}) •`
          : `• DAILY LIMIT: 1 PLAY PER DEVICE (${getTodayStr()}) •`}
      </div>

      <style>{`
        @keyframes winPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Buzzer;
