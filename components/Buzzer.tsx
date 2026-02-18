import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { walletService } from '../src/supabase/supabase-service';
import { useAppContext } from '../contexts/AppContext';

const Buzzer: React.FC = () => {
  const { user } = useAppContext();
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
    velocity.current.x += tilt.x * 0.18;
    velocity.current.y += tilt.y * 0.18;

    velocity.current.x *= 0.93;
    velocity.current.y *= 0.93;

    setBallPos(prev => {
      let newX = prev.x + velocity.current.x;
      let newY = prev.y + velocity.current.y;

      const dist = Math.sqrt(Math.pow(newX - 50, 2) + Math.pow(newY - 50, 2));

      // WIN CONDITION: Ball enters center
      if (dist < 10 && !hasWonToday) {
        handleWin();
      }

      // Border collision
      if (dist > 47) {
        const angle = Math.atan2(newY - 50, newX - 50);
        newX = 50 + Math.cos(angle) * 47;
        newY = 50 + Math.sin(angle) * 47;
        velocity.current.x *= -0.6;
        velocity.current.y *= -0.6;
      }

      return { x: newX, y: newY };
    });

    requestRef.current = requestAnimationFrame(updateBall);
  };

  const handleWin = async () => {
    const today = new Date().toDateString();
    localStorage.setItem('buzzer_last_win', today);
    setHasWonToday(true);

    if (user && user.id) {
      // Connect to database profit
      const res = await walletService.addMoney(user.id, 500, 'Buzzer Maze Daily Reward');
      if (res.success) {
        toast.success('Congratulations! 500 PTS added to your wallet!', {
          duration: 6000,
          position: 'top-center',
          icon: '💰',
          style: {
            borderRadius: '24px',
            background: '#ff1a7d',
            color: '#fff',
            fontWeight: '900',
            border: '2px solid rgba(255,255,255,0.2)'
          },
        });
      } else {
        toast.error('Reward saved locally, but database sync failed.');
      }
    } else {
      toast.success('Offline Win! 500 PTS earned (Sign in to sync).', { icon: '🏅' });
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      requestRef.current = requestAnimationFrame(updateBall);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [permissionGranted, tilt, hasWonToday, user]);

  return (
    <div
      style={{ position: 'relative', width: '100%', maxWidth: 550, cursor: 'pointer', margin: '0 auto' }}
      onClick={permissionGranted === null ? requestPermission : undefined}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Maze paths with ULTRA BOLD stroke (3.5) */}
        <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
          <path d="M 43.02 56.99 A 9.88 9.88 90 1 1 50.01 59.88 M 55.68 36.32 A 14.81 14.81 90 0 1 64.82 50.01 M 63.7 55.68 A 14.81 14.81 90 0 1 39.53 60.48 M 36.32 55.68 A 14.81 14.81 90 0 1 35.19 50.01 M 36.32 44.34 A 14.81 14.81 90 0 1 44.34 36.32 M 42.45 31.76 A 19.75 19.75 90 0 1 68.26 42.45 M 69.76 50.01 A 19.75 19.75 90 0 1 68.26 57.57 M 63.98 63.98 A 19.75 19.75 90 0 1 57.57 68.26 M 50.01 69.76 A 19.75 19.75 90 0 1 31.76 57.57 M 30.26 50.01 A 19.75 19.75 90 0 1 31.76 42.45 M 32.55 32.55 A 24.69 24.69 90 0 1 50.01 25.32 M 54.83 25.79 A 24.69 24.69 90 0 1 63.73 29.48 M 67.47 32.55 A 24.69 24.69 90 0 1 74.23 54.83 M 72.82 59.46 A 24.69 24.69 90 0 1 70.54 63.73 M 67.47 67.47 A 24.69 24.69 90 0 1 63.73 70.54 M 59.46 72.82 A 24.69 24.69 90 0 1 45.19 74.23 M 36.29 70.54 A 24.69 24.69 90 0 1 32.55 67.47 M 29.48 63.73 A 24.69 24.69 90 0 1 25.79 45.19 M 27.2 40.56 A 24.69 24.69 90 0 1 29.48 36.29 M 66.47 25.37 L 70.96 29.06 M 77.38 38.67 A 29.63 29.63 90 0 1 61.35 77.38 M 38.67 77.38 A 29.63 29.63 90 0 1 33.55 74.64 M 29.06 70.96 L 25.37 66.47 M 22.63 61.35 A 29.63 29.63 90 0 1 20.38 50.01 M 20.95 44.23 L 22.63 38.67 M 25.37 33.55 A 29.63 29.63 90 0 1 33.55 25.37 M 43.27 16.11 A 34.57 34.57 90 0 1 69.21 21.27 M 78.75 30.8 A 34.57 34.57 90 0 1 83.91 43.27 M 81.94 63.24 A 34.57 34.57 90 0 1 36.78 81.94 M 30.8 78.75 L 25.57 74.45 M 21.27 69.21 A 34.57 34.57 90 0 1 18.07 63.24 M 15.44 50.01 A 34.57 34.57 90 0 1 21.27 30.8 M 25.57 25.57 L 30.8 21.27 M 28.06 17.16 A 39.51 39.51 90 0 1 50.01 10.5 M 65.13 13.51 A 39.51 39.51 90 0 1 89.52 50.01 M 86.51 65.13 L 82.86 71.96 M 77.94 77.94 A 39.51 39.51 90 0 1 71.96 82.86 M 65.13 86.51 A 39.51 39.51 90 0 1 17.16 71.96 M 13.51 65.13 L 11.26 57.72 M 11.26 42.3 A 39.51 39.51 90 0 1 13.51 34.89 M 17.16 28.06 L 22.07 22.07 M 58.68 6.42 A 44.44 44.44 90 0 1 78.2 15.65 M 86.96 25.32 L 89.2 29.06 M 92.54 37.11 A 44.44 44.44 90 0 1 94.24 45.65 M 94.45 50.01 L 93.6 58.68 M 92.54 62.91 A 44.44 44.44 90 0 1 91.07 67.02 M 86.96 74.7 L 78.2 84.36 M 74.7 86.96 A 44.44 44.44 90 0 1 54.37 94.24 M 50.01 94.45 L 41.34 93.6 M 33 91.07 L 29.06 89.2 M 21.81 84.36 L 18.58 81.44 M 15.65 78.2 A 44.44 44.44 90 0 1 7.48 62.91 M 6.42 58.68 L 5.78 45.65 M 6.42 41.34 L 7.48 37.11 M 8.95 33 A 44.44 44.44 90 0 1 18.58 18.58 M 21.81 15.65 L 25.32 13.05 M 37.11 7.48 L 45.65 5.78 M 54.85 0.86 A 49.38 49.38 90 1 1 50.01 0.63" transform="rotate(87.5 50 50)" />
        </g>

        {/* elatyab logo text */}
        <text
          x="50"
          y="52"
          fill="#fff"
          fontSize="4.5"
          textAnchor="middle"
          fontWeight="900"
          fontFamily="Cairo, sans-serif"
          opacity="1"
          style={{ letterSpacing: '0.05em', pointerEvents: 'none' }}
        >
          elatyab
        </text>

        {/* The Pink Ball - Larger and glowing */}
        {permissionGranted && (
          <circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="3.8"
            fill="#ff1a7d"
            filter="drop-shadow(0 0 10px rgba(255,26,125,1))"
            style={{ transition: 'none' }}
          />
        )}

        {/* Win Target Glow */}
        {!hasWonToday && permissionGranted && (
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="rgba(255,26,125,0.1)"
            stroke="#ff1a7d"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        )}

        {/* Start Game prompt */}
        {permissionGranted === null && (
          <text
            x="50"
            y="75"
            fill="#fff"
            fontSize="4.5"
            textAnchor="middle"
            fontWeight="900"
            opacity="0.9"
            style={{ letterSpacing: '0.1em' }}
          >
            TAP TO EARN 500 PTS
          </text>
        )}
      </svg>

      {/* Daily Status Badge */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        {hasWonToday && (
          <div className="bg-green-500 text-white text-[12px] font-black px-4 py-1.5 rounded-full shadow-2xl border-2 border-white/20 animate-bounce">
            500 PTS CLAIMED ✓
          </div>
        )}
        {!hasWonToday && permissionGranted && (
          <div className="bg-fruit-primary/20 backdrop-blur-md text-fruit-primary text-[10px] font-black px-3 py-1 rounded-full border border-fruit-primary/30">
            ENTER CENTER FOR 500 PTS
          </div>
        )}
      </div>
    </div>
  );
};

export default Buzzer;
