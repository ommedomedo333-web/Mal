import React, { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { walletService } from '../src/supabase/supabase-service';
import { useAppContext } from '../contexts/AppContext';
import { useWalletContext } from '../src/supabase/context-providers';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Constants ────────────────────────────────────────────────────────────────
const DAILY_REWARD_PTS = 50;
const DEVICE_KEY = 'atyab_device_buzzer_date';
const WIN_RADIUS = 8;      // svg units – distance to centre to trigger win
const BALL_RADIUS = 3;

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

// Build ring arc paths once (static strings – no re-computation each frame)
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTodayStr() {
  return new Date().toDateString();
}

function isDeviceLockedToday() {
  return localStorage.getItem(DEVICE_KEY) === getTodayStr();
}

function lockDeviceToday() {
  localStorage.setItem(DEVICE_KEY, getTodayStr());
}

// ─── Component ────────────────────────────────────────────────────────────────
const Buzzer: React.FC = () => {
  const { user, language, refreshWallet, setTotalPoints } = useAppContext() as any;
  const { refetch: refetchWalletData } = useWalletContext();
  const navigate = useNavigate();

  // ── State that triggers re-render only when necessary ──────────────────────
  const [hasWonToday, setHasWonToday] = useState(() => isDeviceLockedToday());
  const [winAnim, setWinAnim] = useState(false);

  // ── Refs: game state that lives entirely outside React render cycle ─────────
  const svgRef = useRef<SVGSVGElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);
  const pos = useRef({ x: 97, y: 50 });
  const vel = useRef({ x: 0, y: 0 });
  const wonRef = useRef(isDeviceLockedToday());
  const userRef = useRef(user);
  userRef.current = user;

  // ── Pointer → velocity ─────────────────────────────────────────────────────
  const handlePointer = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!userRef.current || wonRef.current || !svgRef.current) return;
    if ('touches' in e && e.cancelable) e.preventDefault();

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    if ('touches' in e) {
      pt.x = e.touches[0].clientX;
      pt.y = e.touches[0].clientY;
    } else {
      pt.x = (e as React.MouseEvent).clientX;
      pt.y = (e as React.MouseEvent).clientY;
    }
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    const dx = loc.x - pos.current.x;
    const dy = loc.y - pos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.5) {
      const speed = Math.min(dist * 0.22, 3);
      vel.current.x = (dx / dist) * speed;
      vel.current.y = (dy / dist) * speed;
    }
  }, []);

  // ── Win handler (async, called from rAF – safe because won flag is set immediately) ──
  const handleWin = useCallback(async () => {
    if (wonRef.current) return;          // guard against double-fire
    wonRef.current = true;
    lockDeviceToday();
    setHasWonToday(true);
    setWinAnim(true);
    cancelAnimationFrame(rafRef.current);

    const currentUser = userRef.current;
    if (!currentUser?.id) return;

    const res = await walletService.addPoints(currentUser.id, DAILY_REWARD_PTS, 'Buzzer Game Daily Reward');
    if (res.success) {
      // Immediately bump the header counter without waiting for full refetch
      if (typeof setTotalPoints === 'function') {
        setTotalPoints((prev: number) => prev + DAILY_REWARD_PTS);
      }
      // Full wallet refresh in background
      refreshWallet?.();
      refetchWalletData?.();

      toast.success(
        language === 'ar'
          ? `🎉 مبروك! ربحت ${DAILY_REWARD_PTS} نقطة أطيب!`
          : `🎉 Congrats! You earned ${DAILY_REWARD_PTS} Atyab Points!`,
        {
          duration: 5000,
          position: 'top-center',
          style: { borderRadius: '24px', background: '#00c853', color: '#fff', fontWeight: '900', fontSize: '16px' },
        }
      );
    } else {
      toast.error(language === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Error – please try again');
      wonRef.current = false;
      setHasWonToday(false);
      setWinAnim(false);
    }
  }, [language, refreshWallet, refetchWalletData, setTotalPoints]);

  // ── Animation loop – uses refs only, DOM mutated directly for max smoothness ──
  const loop = useCallback(() => {
    if (wonRef.current) return;

    // Friction
    vel.current.x *= 0.82;
    vel.current.y *= 0.82;

    let { x: nx, y: ny } = pos.current;
    nx += vel.current.x;
    ny += vel.current.y;

    const dx = nx - 50;
    const dy = ny - 50;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const pdx = pos.current.x - 50;
    const pdy = pos.current.y - 50;
    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

    // ── Win check ──────────────────────────────────────────────────────────────
    if (dist < WIN_RADIUS) {
      handleWin();
      return;
    }

    let collided = false;
    let fx = nx, fy = ny;

    // ── Outer boundary ─────────────────────────────────────────────────────────
    if (dist > 48) {
      const a = Math.atan2(dy, dx);
      fx = 50 + Math.cos(a) * 48;
      fy = 50 + Math.sin(a) * 48;
      collided = true;
    }

    // ── Ring collisions ────────────────────────────────────────────────────────
    for (const ring of MAZE_RINGS) {
      const crossing =
        (pdist > ring.radius && dist <= ring.radius) ||
        (pdist < ring.radius && dist >= ring.radius);
      if (!crossing) continue;

      const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      const inGap = ring.gaps.some((g) => angle >= g.start && angle <= g.end);
      if (!inGap) {
        const al = Math.atan2(pdy, pdx);
        const off = pdist > ring.radius ? 0.35 : -0.35;
        fx = 50 + Math.cos(al) * (ring.radius + off);
        fy = 50 + Math.sin(al) * (ring.radius + off);
        collided = true;
      }
    }

    if (collided) vel.current = { x: 0, y: 0 };

    pos.current = { x: fx, y: fy };

    // ── Directly mutate SVG DOM – no setState, zero GC pressure ───────────────
    if (ballRef.current) {
      ballRef.current.setAttribute('cx', String(fx));
      ballRef.current.setAttribute('cy', String(fy));
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [handleWin]);

  // ── Start / stop loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (user && !hasWonToday) {
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [user, hasWonToday, loop]);

  // ─── Locked screen (not logged in) ───────────────────────────────────────
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
            {language === 'ar'
              ? `سجل دخول لتربح ${DAILY_REWARD_PTS} نقطة أطيب يومياً`
              : `Sign in to earn ${DAILY_REWARD_PTS} Atyab Points daily`}
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

  // ─── Game Screen ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center mb-2">
        {hasWonToday ? (
          <h3 className="text-green-400 font-black tracking-[0.1em] text-lg md:text-2xl uppercase">
            {language === 'ar' ? `✓ حصلت على ${DAILY_REWARD_PTS} نقطة أطيب اليوم` : `✓ You earned ${DAILY_REWARD_PTS} Atyab Points today`}
          </h3>
        ) : (
          <h3 className="text-white font-black tracking-[0.2em] text-lg md:text-2xl animate-pulse uppercase">
            {language === 'ar'
              ? `ادخل المركز لتربح ${DAILY_REWARD_PTS} نقطة أطيب`
              : `REACH CENTER FOR ${DAILY_REWARD_PTS} ATYAB POINTS`}
          </h3>
        )}
      </div>

      {/* SVG Arena */}
      <div
        className="relative w-full max-w-[550px] touch-none select-none"
        onMouseMove={handlePointer}
        onTouchMove={handlePointer}
        style={{ WebkitUserSelect: 'none' }}
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          style={{ width: '100%', height: 'auto', display: 'block', touchAction: 'none' }}
        >
          {/* Static ring paths – rendered once */}
          <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
            {RING_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* Watermark */}
          <text x="50" y="52" fill="rgba(255,255,255,0.15)" fontSize="3" textAnchor="middle" fontWeight="900">
            elatyab
          </text>

          {/* Win target ring (only when not won) */}
          {!hasWonToday && (
            <circle
              cx="50" cy="50" r="7"
              fill="rgba(255,26,125,0.12)"
              stroke="#ff1a7d"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          )}

          {/* The Ball – ref for direct DOM mutation */}
          <circle
            ref={ballRef}
            cx={pos.current.x}
            cy={pos.current.y}
            r={BALL_RADIUS}
            fill="#ff1a7d"
            filter="drop-shadow(0 0 10px rgba(255,26,125,1))"
          />
        </svg>

        {/* Win overlay */}
        {hasWonToday && (
          <div
            className="absolute inset-0 backdrop-blur-sm rounded-[50px] flex flex-col items-center justify-center pointer-events-none border-2 border-green-500/40"
            style={{
              background: 'rgba(0,200,83,0.18)',
              animation: winAnim ? 'winPop 0.5s ease' : 'none',
            }}
          >
            <div
              className="bg-green-500 text-white font-black px-8 py-4 rounded-full shadow-2xl text-center"
              style={{ boxShadow: '0 0 40px rgba(0,200,83,0.5)', fontSize: '18px' }}
            >
              🎉 {language === 'ar' ? `${DAILY_REWARD_PTS} نقطة أطيب` : `${DAILY_REWARD_PTS} Atyab Points`}
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                {language === 'ar' ? 'أُضيفت إلى رصيدك ✓' : 'Added to your balance ✓'}
              </div>
            </div>
            <p
              className="text-white/60 text-xs font-bold mt-4 uppercase tracking-widest"
            >
              {language === 'ar' ? 'عد غداً للمكافأة اليومية' : 'Come back tomorrow for your daily reward'}
            </p>
          </div>
        )}
      </div>

      {/* Hint text */}
      {!hasWonToday && (
        <div className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">
          {language === 'ar' ? 'حرك إصبعك لتوجيه الكرة' : 'MOVE YOUR FINGER TO GUIDE THE BALL'}
        </div>
      )}

      {/* Daily limit note */}
      <div className="text-white/20 text-[10px] font-bold text-center">
        {language === 'ar'
          ? `• مكافأة ${DAILY_REWARD_PTS} نقطة أطيب مرة واحدة يومياً لكل جهاز •`
          : `• ${DAILY_REWARD_PTS} Atyab Points reward once per device per day •`}
      </div>

      <style>{`
        @keyframes winPop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); }
          100% { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Buzzer;
