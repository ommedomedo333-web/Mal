import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { walletService } from '../src/supabase/supabase-service';
import { useAppContext } from '../contexts/AppContext';
import { useWalletContext } from '../src/supabase/context-providers';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FRUITS = ["🍎","🍌","🍊","🍇","🍓","🍑","🥝","🍍","🥭","🍒","🍋"];
const TOTAL = 50;
const W = 380;
const H = 580;
const BW = 90;
const BH = 44;
const DAILY_REWARD_PTS = 50;
const DEVICE_KEY = 'atyab_device_fruit_date';

function getTodayStr() {
  return new Date().toLocaleDateString('en-CA');
}

function isDeviceLockedToday() {
  return localStorage.getItem(DEVICE_KEY) === getTodayStr();
}

function lockDeviceToday() {
  localStorage.setItem(DEVICE_KEY, getTodayStr());
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Fruit {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  spd: number;
  rot: number;
  rotV: number;
  done: boolean;
  hit: boolean;
}

interface Particle {
  id: string;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

function mkFruit(id: number, ms: number): Fruit {
  const base = 1.8 + ms * 0.0018;
  return {
    id,
    emoji: FRUITS[Math.floor(Math.random() * FRUITS.length)],
    x: rand(14, W - 50),
    y: -50,
    size: rand(30, 46),
    spd: Math.min(rand(base, base + 2.6), 13),
    rot: rand(-25, 25),
    rotV: rand(-2.5, 2.5),
    done: false,
    hit: false,
  };
}

function mkParticles(cx: number, cy: number, emoji: string): Particle[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${Date.now()}_${i}`,
    emoji,
    x: cx,
    y: cy,
    vx: rand(-5, 5),
    vy: rand(-7, -2),
    life: 1,
    size: rand(18, 28),
  }));
}

const FruitGame: React.FC = () => {
  const { user, language, refreshWallet, setTotalPoints } = useAppContext() as any;
  const { refetch: refetchWalletData } = useWalletContext();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [bx, setBx] = useState(W / 2 - BW / 2);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [parts, setParts] = useState<Particle[]>([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [spawned, setSpawned] = useState(0);
  const [flash, setFlash] = useState(false);
  const [combo, setCombo] = useState(0);
  const [toast_, setToast] = useState<{ emoji: string; key: number } | null>(null);
  const [hasWonToday, setHasWonToday] = useState(() => isDeviceLockedToday());

  const bxR = useRef(W / 2 - BW / 2);
  const fruitsR = useRef<Fruit[]>([]);
  const partsR = useRef<Particle[]>([]);
  const caughtR = useRef(0);
  const missedR = useRef(0);
  const spawnedR = useRef(0);
  const comboR = useRef(0);
  const phaseR = useRef<"idle" | "playing" | "over">("idle");
  const elapsedR = useRef(0);
  const spawnTR = useRef(0);
  const lastTsR = useRef<number | null>(null);
  const rafR = useRef<number>(0);
  const areaR = useRef<HTMLDivElement>(null);
  const userRef = useRef(user);
  const wonRef = useRef(hasWonToday);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const moveBx = useCallback((clientX: number) => {
    if (!areaR.current) return;
    const rect = areaR.current.getBoundingClientRect();
    const scale = W / rect.width;
    const nx = Math.max(0, Math.min(W - BW, (clientX - rect.left) * scale - BW / 2));
    bxR.current = nx;
    setBx(nx);
  }, []);

  const handleGameEnd = useCallback(async () => {
    if (wonRef.current) return;
    wonRef.current = true;
    setHasWonToday(true);

    // Local update
    lockDeviceToday();
    if (typeof setTotalPoints === 'function') {
      setTotalPoints((prev: number) => prev + DAILY_REWARD_PTS);
    }

    const currentUser = userRef.current;
    if (!currentUser?.id) return;

    // Server sync
    const res = await walletService.addPoints(
      currentUser.id,
      DAILY_REWARD_PTS,
      'Fruit Catcher Game Daily Reward'
    );

    if (res.success) {
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
        { id: 'fruit-game-win', duration: 4000 }
      );
    }
  }, [language, refreshWallet, refetchWalletData, setTotalPoints]);

  const start = useCallback(() => {
    fruitsR.current = [];
    partsR.current = [];
    caughtR.current = 0;
    missedR.current = 0;
    spawnedR.current = 0;
    comboR.current = 0;
    elapsedR.current = 0;
    spawnTR.current = 0;
    lastTsR.current = null;
    bxR.current = W / 2 - BW / 2;
    setBx(W / 2 - BW / 2);
    setFruits([]);
    setParts([]);
    setCaught(0);
    setMissed(0);
    setSpawned(0);
    setCombo(0);
    setToast(null);
    setFlash(false);
    phaseR.current = "playing";
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") {
      if (rafR.current) cancelAnimationFrame(rafR.current);
      return;
    }

    function loop(ts: number) {
      if (phaseR.current !== "playing") return;
      if (!lastTsR.current) lastTsR.current = ts;
      const dt = Math.min((ts - lastTsR.current) / 16.67, 3);
      lastTsR.current = ts;
      elapsedR.current += dt * 16.67;
      spawnTR.current += dt;

      const interval = Math.max(22, 60 - elapsedR.current * 0.022) / 16.67;
      if (spawnedR.current < TOTAL && spawnTR.current >= interval) {
        spawnTR.current = 0;
        fruitsR.current = [...fruitsR.current, mkFruit(spawnedR.current, elapsedR.current)];
        spawnedR.current++;
      }

      const bLeft = bxR.current;
      const bTop = H - BH - 12;
      let nc = 0,
        nm = 0;
      const newParts: Particle[] = [];
      let hitEmoji: string | null = null;

      fruitsR.current = fruitsR.current.map((f) => {
        if (f.done) return f;
        const ny = f.y + f.spd * dt;
        const nr = f.rot + f.rotV * dt;
        const fcx = f.x + f.size / 2;

        if (ny + f.size >= bTop && ny <= bTop + BH && fcx >= bLeft && fcx <= bLeft + BW) {
          nc++;
          comboR.current++;
          newParts.push(...mkParticles(fcx, bTop, f.emoji));
          hitEmoji = f.emoji;
          return { ...f, y: ny, rot: nr, done: true, hit: true };
        }
        if (ny > H + 10) {
          nm++;
          comboR.current = 0;
          return { ...f, y: ny, done: true, hit: false };
        }
        return { ...f, y: ny, rot: nr };
      });

      partsR.current = [
        ...partsR.current.filter((p) => p.life > 0.05),
        ...newParts,
      ].map((p) => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.35,
        life: p.life - 0.045,
      }));

      caughtR.current += nc;
      missedR.current += nm;

      if (nc > 0) {
        setFlash(true);
        setToast({ emoji: hitEmoji || '🎉', key: ts });
        setTimeout(() => setFlash(false), 150);
      }

      setFruits([...fruitsR.current]);
      setParts([...partsR.current]);
      setCaught(caughtR.current);
      setMissed(missedR.current);
      setSpawned(spawnedR.current);
      setCombo(comboR.current);

      if (spawnedR.current >= TOTAL && fruitsR.current.every((f) => f.done)) {
        phaseR.current = "over";
        setPhase("over");
        handleGameEnd();
        return;
      }
      rafR.current = requestAnimationFrame(loop);
    }

    rafR.current = requestAnimationFrame(loop);
    return () => {
      if (rafR.current) cancelAnimationFrame(rafR.current);
    };
  }, [phase, handleGameEnd]);

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '32px',
        textAlign: 'center',
      }}>
        <Lock size={60} style={{ color: '#10b981', animation: 'bounce 1s infinite' }} />
        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
          {language === 'ar' ? 'للمسجلين فقط' : 'Members Only'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          {language === 'ar'
            ? `سجل دخول لتربح ${DAILY_REWARD_PTS} نقطة أطيب يومياً`
            : `Sign in to earn ${DAILY_REWARD_PTS} Atyab Points daily`}
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          <LogIn size={20} />
          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </button>
      </div>
    );
  }

  const points = Math.round((caught / TOTAL) * DAILY_REWARD_PTS);
  const pct = Math.round((caught / TOTAL) * 100);
  const stars = caught >= 48 ? 3 : caught >= 35 ? 2 : caught >= 20 ? 1 : 0;
  const active = fruits.filter((f) => !f.done);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at top,#061a0f 0%,#020c07 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        fontFamily: "'Cairo','Tajawal',sans-serif",
        userSelect: 'none',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;900&display=swap');
        .gt { font-size:clamp(20px,5.5vw,30px); font-weight:900; text-align:center;
          background:linear-gradient(135deg,#10b981 0%,#34d399 45%,#f59e0b 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          letter-spacing:-.02em; margin-bottom:2px; }
        .gsub { font-size:10px; color:rgba(255,255,255,.3); text-align:center;
          letter-spacing:.1em; font-weight:700; margin-bottom:10px; text-transform:uppercase; }
        .hud { display:flex; gap:8px; margin-bottom:8px; width:100%; max-width:${W}px; }
        .hc { flex:1; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          border-radius:14px; padding:7px 6px; text-align:center; backdrop-filter:blur(8px); }
        .hn { font-size:20px; font-weight:900; line-height:1; color:#10b981; }
        .hl { font-size:8px; color:rgba(255,255,255,.3); font-weight:700;
          letter-spacing:.1em; text-transform:uppercase; margin-top:2px; }
        .pt { width:100%; max-width:${W}px; margin-bottom:8px; }
        .ptr { display:flex; justify-content:space-between; margin-bottom:3px; }
        .ptx { font-size:10px; color:rgba(255,255,255,.35); font-weight:700; }
        .ptrack { height:6px; background:rgba(255,255,255,.07); border-radius:99px; overflow:hidden; }
        .pfill { height:100%; background:linear-gradient(90deg,#10b981,#34d399,#f59e0b);
          border-radius:99px; transition:width .18s; box-shadow:0 0 10px rgba(16,185,129,.5); }
        .arena { position:relative; width:${W}px; max-width:100%; height:${H}px;
          border-radius:22px; background:rgba(0,0,0,.45);
          border:1.5px solid rgba(16,185,129,.18); overflow:hidden; cursor:crosshair;
          box-shadow:0 0 80px rgba(16,185,129,.06),inset 0 0 60px rgba(0,0,0,.4);
          touch-action:none; }
        .agrid { position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 38px,rgba(255,255,255,.012) 39px),
                     repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,255,255,.012) 39px); }
        .aglow { position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 25% 15%,rgba(16,185,129,.07) 0%,transparent 55%),
                     radial-gradient(ellipse at 75% 85%,rgba(245,158,11,.05) 0%,transparent 55%); }
        .fi { position:absolute; pointer-events:none; will-change:transform; line-height:1;
          filter:drop-shadow(0 3px 8px rgba(0,0,0,.5)); }
        .bwrap { position:absolute; bottom:10px; pointer-events:none; width:${BW}px; }
        .brim { width:100%; height:9px; background:linear-gradient(90deg,#059669,#10b981,#059669);
          border-radius:5px 5px 0 0; border:1.5px solid #34d399;
          box-shadow:0 0 12px rgba(16,185,129,.7); transition:box-shadow .1s; }
        .brim.flash { box-shadow:0 0 35px rgba(16,185,129,1); }
        .bbody { width:100%; height:${BH - 9}px;
          background:linear-gradient(180deg,rgba(16,185,129,.3),rgba(16,185,129,.1));
          border:1.5px solid rgba(16,185,129,.4); border-top:none;
          border-radius:0 0 14px 14px; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .part { position:absolute; pointer-events:none; line-height:1; will-change:transform,opacity; }
        .combo { position:absolute; top:10px; right:10px; z-index:5;
          background:rgba(245,158,11,.15); border:1px solid rgba(245,158,11,.4);
          border-radius:10px; padding:5px 12px; font-size:12px; font-weight:900; color:#f59e0b;
          backdrop-filter:blur(6px); animation:cpop .25s ease-out; }
        @keyframes cpop { from{transform:scale(1.4)} to{transform:scale(1)} }
        .toast { position:absolute; top:10px; left:12px; pointer-events:none; z-index:5;
          animation:tup .5s ease-out forwards; }
        @keyframes tup { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(-40px) scale(1.4)} }
        .overlay { position:absolute; inset:0; display:flex; flex-direction:column;
          align-items:center; justify-content:center; background:rgba(0,0,0,.78);
          backdrop-filter:blur(12px); border-radius:22px; z-index:20; padding:20px; gap:10px; }
        .otitle { font-size:clamp(24px,6.5vw,40px); font-weight:900; text-align:center; line-height:1.2; }
        .osub { font-size:13px; color:rgba(255,255,255,.6); text-align:center; font-weight:700; line-height:1.7; }
        .opoints { display:flex; align-items:center; gap:12px;
          background:rgba(16,185,129,.12); border:1.5px solid rgba(16,185,129,.4);
          border-radius:18px; padding:12px 28px; }
        .opn { font-size:44px; font-weight:900; color:#10b981; line-height:1; }
        .opl { font-size:12px; color:rgba(255,255,255,.5); font-weight:700; line-height:1.5; }
        .stars { display:flex; gap:6px; }
        .star { font-size:32px; filter:grayscale(1) opacity(.25); animation:sin .4s ease-out both; }
        .star.on { filter:none; text-shadow:0 0 20px rgba(245,158,11,.8); }
        .star:nth-child(1){animation-delay:.1s} .star:nth-child(2){animation-delay:.25s} .star:nth-child(3){animation-delay:.4s}
        @keyframes sin { from{transform:scale(0) rotate(-40deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
        .btn { background:linear-gradient(135deg,#10b981,#059669); color:#fff; border:none;
          border-radius:16px; padding:13px 36px; font-size:15px; font-weight:900;
          font-family:'Cairo',sans-serif; cursor:pointer;
          box-shadow:0 8px 28px rgba(16,185,129,.45); transition:all .2s;
          -webkit-tap-highlight-color:transparent; }
        .btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(16,185,129,.55)}
        .btn:active{transform:scale(.95)}
        .hint { font-size:10px; color:rgba(255,255,255,.22); text-align:center; font-weight:700;
          margin-top:6px; letter-spacing:.05em; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      <div className="gt">🍉 {language === 'ar' ? 'فواكه الأطيب' : 'Fruit Catcher'}</div>
      <div className="gsub">
        {language === 'ar' ? 'اجمع ٥٠ فاكهة • اكسب ٥٠ نقطة أطيب' : 'Catch 50 fruits • Earn 50 points'}
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hc">
          <div className="hn">{caught}</div>
          <div className="hl">{language === 'ar' ? 'جُمعت' : 'Caught'}</div>
        </div>
        <div className="hc">
          <div className="hn" style={{ color: '#f59e0b' }}>{Math.max(0, TOTAL - spawned)}</div>
          <div className="hl">{language === 'ar' ? 'متبقي' : 'Left'}</div>
        </div>
        <div className="hc">
          <div className="hn" style={{ color: '#ef4444' }}>{missed}</div>
          <div className="hl">{language === 'ar' ? 'فاتت' : 'Missed'}</div>
        </div>
        <div className="hc">
          <div className="hn" style={{ color: '#f59e0b' }}>{points}</div>
          <div className="hl">{language === 'ar' ? 'نقاط' : 'Points'}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="pt">
        <div className="ptr">
          <span className="ptx">{language === 'ar' ? 'التقدم' : 'Progress'}</span>
          <span className="ptx">{pct}%</span>
        </div>
        <div className="ptrack">
          <div className="pfill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Arena */}
      <div
        ref={areaR}
        className="arena"
        onMouseMove={(e) => phase === 'playing' && moveBx(e.clientX)}
        onTouchMove={(e) => {
          e.preventDefault();
          moveBx(e.touches[0].clientX);
        }}
        onTouchStart={(e) => moveBx(e.touches[0].clientX)}
      >
        <div className="agrid" />
        <div className="aglow" />

        {/* falling fruits */}
        {active.map((f) => (
          <div
            key={f.id}
            className="fi"
            style={{
              left: f.x,
              top: f.y,
              fontSize: f.size,
              transform: `rotate(${f.rot}deg)`,
            }}
          >
            {f.emoji}
          </div>
        ))}

        {/* particles */}
        {parts.map((p) => (
          <div
            key={p.id}
            className="part"
            style={{
              left: p.x,
              top: p.y,
              fontSize: p.size,
              opacity: p.life,
              transform: `scale(${0.4 + p.life * 0.6})`,
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* combo */}
        {phase === 'playing' && combo >= 3 && (
          <div key={combo} className="combo">
            🔥 ×{combo} {language === 'ar' ? 'كومبو!' : 'Combo!'}
          </div>
        )}

        {/* catch toast */}
        {toast_ && (
          <div key={toast_.key} className="toast" style={{ fontSize: 30 }}>
            {toast_.emoji}
          </div>
        )}

        {/* basket */}
        {phase === 'playing' && (
          <div className="bwrap" style={{ left: bx }}>
            <div className={`brim ${flash ? 'flash' : ''}`} />
            <div className="bbody">🧺</div>
          </div>
        )}

        {/* ── idle ── */}
        {phase === 'idle' && (
          <div className="overlay">
            <div style={{ fontSize: 58, lineHeight: 1 }}>🍎🍌🍊🍇🍓</div>
            <div
              className="otitle"
              style={{
                background: 'linear-gradient(135deg,#10b981,#f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {language === 'ar' ? 'فواكه الأطيب' : 'Fruit Catcher'}
            </div>
            <div className="osub">
              {language === 'ar'
                ? <>تسقط <strong style={{color:"#fff"}}>٥٠ فاكهة</strong> من الأعلى<br/>امسك كلها واكسب <strong style={{color:"#10b981"}}>٥٠ نقطة أطيب!</strong><br/><span style={{fontSize:11,opacity:.55}}>⚡ الفواكه تتسارع مع مرور الوقت</span></>
                : <>Catch all <strong style={{color:"#fff"}}>50 fruits</strong> falling from above<br/>Earn <strong style={{color:"#10b981"}}>50 Atyab Points!</strong><br/><span style={{fontSize:11,opacity:.55}}>⚡ Fruits speed up over time</span></>}
            </div>
            <button className="btn" onClick={start}>
              🚀 {language === 'ar' ? 'ابدأ اللعبة' : 'Start Game'}
            </button>
            <div className="hint">
              {language === 'ar' ? '🖱️ حرّك الماوس • 👆 اسحب بإصبعك لتحريك السلة' : '🖱️ Move mouse • 👆 Drag to move basket'}
            </div>
          </div>
        )}

        {/* ── over ── */}
        {phase === 'over' && (
          <div className="overlay">
            <div className="stars">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`star ${i < stars ? 'on' : ''}`}>
                  ⭐
                </div>
              ))}
            </div>
            <div className="otitle">
              {caught === TOTAL ? (
                <span style={{ color: '#f59e0b' }}>
                  {language === 'ar' ? 'مثالي! 🏆' : 'Perfect! 🏆'}
                </span>
              ) : caught >= 40 ? (
                <span style={{ color: '#10b981' }}>
                  {language === 'ar' ? 'رائع! 🎉' : 'Awesome! 🎉'}
                </span>
              ) : caught >= 25 ? (
                <span style={{ color: '#fff' }}>
                  {language === 'ar' ? 'جيد 💪' : 'Good 💪'}
                </span>
              ) : (
                <span style={{ color: '#ef4444' }}>
                  {language === 'ar' ? 'حاول مجدداً 😅' : 'Try again 😅'}
                </span>
              )}
            </div>
            <div className="osub">
              {language === 'ar'
                ? <>جمعت <strong style={{color:"#fff"}}>{caught}</strong> من أصل {TOTAL} فاكهة
                    {missed > 0 && <><br/><span style={{color:"rgba(239,68,68,.7)"}}>فاتتك {missed} فاكهة</span></>}
                  </>
                : <>Caught <strong style={{color:"#fff"}}>{caught}</strong> out of {TOTAL} fruits
                    {missed > 0 && <><br/><span style={{color:"rgba(239,68,68,.7)"}}>Missed {missed} fruits</span></>}
                  </>}
            </div>
            <div className="opoints">
              <div className="opn">+{points}</div>
              <div className="opl">
                {language === 'ar' ? 'نقطة أطيب' : 'Atyab Points'}
                <br />
                <span style={{ fontSize: 10, opacity: 0.5 }}>
                  {language === 'ar' ? 'تُضاف لرصيدك' : 'Added to your balance'}
                </span>
              </div>
            </div>
            <button className="btn" onClick={start}>
              🔄 {language === 'ar' ? 'العب مرة أخرى' : 'Play Again'}
            </button>
          </div>
        )}
      </div>

      <div className="hint" style={{ marginTop: 8 }}>
        {language === 'ar' ? 'حرّك الماوس أو اسحب بإصبعك لتحريك السلة' : 'Move mouse or drag to move basket'}
      </div>
    </div>
  );
};

export default FruitGame;
