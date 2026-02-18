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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ballPos, setBallPos] = useState({ x: 97, y: 50 });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [hasWonToday, setHasWonToday] = useState(false);
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

  const requestPermission = async () => {
    if (!user) return; // Prevent start if not logged in

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setPermissionGranted(permission === 'granted');
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionGranted(false);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setTilt({
        x: (e.gamma || 0) / 45,
        y: (e.beta || 0) / 45
      });
    };

    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  const updateBall = () => {
    if (!permissionGranted || !user) return;

    velocity.current.x += tilt.x * 0.15;
    velocity.current.y += tilt.y * 0.15;

    velocity.current.x *= 0.94;
    velocity.current.y *= 0.94;

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
      if (dist < 8 && !hasWonToday) {
        handleWin();
      }

      // 1. Boundary collision (outer limit)
      if (dist > 48) {
        const angle = Math.atan2(dy, dx);
        finalX = 50 + Math.cos(angle) * 48;
        finalY = 50 + Math.sin(angle) * 48;
        collided = true;
      }

      // 2. Ring collision (Cross through holes only)
      MAZE_RINGS.forEach(ring => {
        // If we transition across the ring's radius
        if ((prevDist > ring.radius && dist <= ring.radius) ||
          (prevDist < ring.radius && dist >= ring.radius)) {

          // Check if current angle is in a gap
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const isInGap = ring.gaps.some(gap => angle >= gap.start && angle <= gap.end);

          if (!isInGap) {
            // Block passage: Revert to previous side of the ring
            const angleLocked = Math.atan2(prevDy, prevDx);
            const offset = (prevDist > ring.radius) ? 0.5 : -0.5;
            finalX = 50 + Math.cos(angleLocked) * (ring.radius + offset);
            finalY = 50 + Math.sin(angleLocked) * (ring.radius + offset);
            collided = true;
          }
        }
      });

      if (collided) {
        velocity.current.x *= -0.4;
        velocity.current.y *= -0.4;
      }

      return { x: finalX, y: finalY };
    });

    requestRef.current = requestAnimationFrame(updateBall);
  };

  const handleWin = async () => {
    const today = new Date().toDateString();
    localStorage.setItem('buzzer_last_win', today);
    setHasWonToday(true);

    if (user && user.id) {
      const res = await walletService.addMoney(user.id, 500, 'Buzzer Maze Daily Reward');
      if (res.success) {
        toast.success(language === 'ar' ? 'مبروك! تم إضافة 500 نقطة لمحفظتك!' : 'Congratulations! 500 PTS added to your wallet!', {
          duration: 6000,
          position: 'top-center',
          icon: '💰',
          style: { borderRadius: '24px', background: '#ff1a7d', color: '#fff', fontWeight: '900' },
        });
      }
    }
  };

  useEffect(() => {
    if (permissionGranted && user) {
      requestRef.current = requestAnimationFrame(updateBall);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [permissionGranted, tilt, hasWonToday, user]);

  // Auth Guard Rendering
  if (!user) {
    return (
      <div className="relative w-full aspect-square max-w-[550px] mx-auto bg-black/40 rounded-[60px] border-4 border-white/5 flex flex-col items-center justify-center p-8 backdrop-blur-xl group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fruit-primary/10 to-transparent opacity-50" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Lock size={48} className="text-white/40" />
          </div>
          <h2 className="text-white font-black text-3xl mb-4 ae-1">
            {language === 'ar' ? 'للمسجلين فقط' : 'Members Only'}
          </h2>
          <p className="text-white/40 text-lg mb-10 ae-2 font-medium">
            {language === 'ar' ? 'سجل دخول لتربح 500 نقطة يومياً' : 'Sign in to earn 500 points daily'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-4 px-10 py-5 bg-fruit-primary text-white rounded-[24px] font-black text-xl hover:bg-fruit-primary/80 transition-all shadow-2xl shadow-fruit-primary/40 active:scale-95 ae-3"
          >
            <LogIn size={24} />
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', maxWidth: 550, cursor: 'pointer', margin: '0 auto' }}
      onClick={permissionGranted === null ? requestPermission : undefined}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Dynamic Maze Rings based on the logic array */}
        <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
          {MAZE_RINGS.map((ring, i) => {
            // Visualize arcs based on gaps
            // For each radius, draw segments that occupy non-gap areas
            // Since SVG arcs are simpler with start/end angles
            // We'll draw one arc for each solid segment
            const segments = [];
            let current = 0;
            // Sort gaps to be safe
            const sortedGaps = [...ring.gaps].sort((a, b) => a.start - b.start);

            sortedGaps.forEach(gap => {
              if (gap.start > current) {
                segments.push({ start: current, end: gap.start });
              }
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

              return (
                <path
                  key={`${i}-${si}`}
                  d={`M ${x1} ${y1} A ${ring.radius} ${ring.radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                />
              );
            });
          })}
        </g>

        <text x="50" y="52" fill="#fff" fontSize="3.5" textAnchor="middle" fontWeight="900" opacity="0.6">elatyab</text>

        {/* The Ball */}
        <circle
          cx={ballPos.x}
          cy={ballPos.y}
          r="2.8"
          fill="#ff1a7d"
          filter="drop-shadow(0 0 12px rgba(255,26,125,1))"
          style={{ transition: 'none' }}
        />

        {/* Target Glow */}
        {!hasWonToday && (
          <circle cx="50" cy="50" r="8" fill="rgba(255,26,125,0.15)" stroke="#ff1a7d" strokeWidth="0.5" strokeDasharray="2 2" className="animate-pulse" />
        )}

        {permissionGranted === null && (
          <text x="50" y="75" fill="#fff" fontSize="4" textAnchor="middle" fontWeight="900" opacity="0.9" className="animate-bounce">
            {language === 'ar' ? 'إبدأ اللعب' : 'TAP TO PLAY'}
          </text>
        )}
      </svg>

      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {hasWonToday ? (
          <div className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl animate-pulse">
            {language === 'ar' ? 'تم استلام المكافأة ✓' : '500 PTS CLAIMED ✓'}
          </div>
        ) : (
          <div className="bg-fruit-primary/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20">
            {language === 'ar' ? 'ادخل المركز لتربح' : 'REACH CENTER TO WIN'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buzzer;
