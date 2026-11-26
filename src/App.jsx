import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Flashlight,
  Volume2,
  VolumeX,
  Sun,
  Zap,
  BatteryCharging,
  Thermometer,
  Power,
  SunMedium,
  Minus,
  Plus,
  Flame,
  Sparkles,
  Lightbulb,
  Radio,
  PartyPopper,
  FlameKindling,
  Siren,
  Palette,
  Focus,
  Moon,
  Lock,
  X,
  CheckCircle2,
  Laugh,
} from 'lucide-react';

const MODE_LIST = [
  { id: 'steady', label: 'Oddiy', desc: 'Doimiy nur', Icon: Lightbulb },
  { id: 'strobe', label: 'Stroboskop', desc: 'Tez miltillash', Icon: Zap },
  { id: 'sos', label: 'SOS Signal', desc: 'Morze kodi', Icon: Radio },
  { id: 'disco', label: 'Disko', desc: "Ranglar o'yini", Icon: PartyPopper },
  { id: 'candle', label: 'Sham', desc: 'Tinch tebranish', Icon: FlameKindling },
  { id: 'police', label: 'Sirena', desc: "Qizil va ko'k", Icon: Siren },
];

const COLOR_LIST = [
  { rgb: '255, 250, 235', name: 'Oq', dotClass: 'bg-amber-50 border border-slate-400' },
  { rgb: '255, 196, 107', name: 'Iliq', dotClass: 'bg-amber-300' },
  { rgb: '248, 113, 113', name: 'Qizil', dotClass: 'bg-red-400' },
  { rgb: '96, 165, 250', name: "Ko'k", dotClass: 'bg-blue-400' },
  { rgb: '74, 222, 128', name: 'Yashil', dotClass: 'bg-green-400' },
  { rgb: '192, 132, 252', name: 'UV', dotClass: 'bg-purple-400' },
];

const ZOOM_LIST = [
  { id: 'narrow', label: 'Tor', coneWidth: '220px', coreWidth: '78px' },
  { id: 'medium', label: "O'rta", coneWidth: '400px', coreWidth: '130px' },
  { id: 'wide', label: 'Keng', coneWidth: '580px', coreWidth: '200px' },
];

const DISCO_COLORS = [
  '248, 113, 113',
  '251, 191, 36',
  '74, 222, 128',
  '56, 189, 248',
  '192, 132, 252',
  '244, 114, 182',
];

const SOS_PATTERN = [
  1, 0, 1, 0, 1, 0, 0,
  1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0,
  1, 0, 1, 0, 1, 0, 0, 0, 0,
];

const CUSTOM_STYLES = `
  .fonar-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #07090f;
    color: #f8fafc;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .room-glow {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.15s ease;
  }
  .screen-lamp-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    transition: background-color 0.2s ease;
  }
  .beam-cone {
    position: absolute;
    bottom: 88%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 96vw;
    height: 210px;
    pointer-events: none;
    clip-path: polygon(36% 100%, 64% 100%, 100% 0%, 0% 0%);
    filter: blur(8px);
    transition: width 0.25s ease, opacity 0.12s ease;
    transform-origin: bottom center;
  }
  .beam-core {
    position: absolute;
    bottom: 88%;
    left: 50%;
    transform: translateX(-50%);
    height: 180px;
    pointer-events: none;
    clip-path: polygon(32% 100%, 68% 100%, 92% 0%, 8% 0%);
    filter: blur(6px);
    transition: width 0.25s ease, opacity 0.12s ease;
  }
  .torch-head {
    background: linear-gradient(90deg, #1b202b 0%, #3a4354 22%, #505b70 46%, #28303f 78%, #151922 100%);
    box-shadow:
      inset 0 2px 4px rgba(255, 255, 255, 0.22),
      inset 0 -3px 6px rgba(0, 0, 0, 0.7),
      0 14px 32px rgba(0, 0, 0, 0.65);
  }
  .torch-neck {
    background: linear-gradient(90deg, #12161f 0%, #2c3444 26%, #3f495e 48%, #1f2633 78%, #0f131b 100%);
  }
  .torch-body {
    background:
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(0, 0, 0, 0.14) 2px,
        rgba(0, 0, 0, 0.14) 4px
      ),
      linear-gradient(90deg, #141923 0%, #2b3342 25%, #3d475c 48%, #1f2533 78%, #10141d 100%);
    box-shadow:
      inset 0 2px 3px rgba(255, 255, 255, 0.1),
      inset 0 -4px 10px rgba(0, 0, 0, 0.75),
      0 18px 36px rgba(0, 0, 0, 0.75);
  }
  .power-btn {
    background: radial-gradient(circle at 35% 30%, #334155, #0f172a 75%);
    box-shadow:
      0 6px 14px rgba(0, 0, 0, 0.75),
      inset 0 1px 2px rgba(255, 255, 255, 0.25);
    transition: transform 0.12s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .power-btn:active {
    transform: scale(0.93);
  }
  .power-btn.is-on {
    border-color: rgba(250, 204, 21, 0.9);
    box-shadow:
      0 0 22px rgba(250, 204, 21, 0.55),
      inset 0 0 12px rgba(250, 204, 21, 0.35);
  }
  input[type='range'].bright-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 9999px;
    background: linear-gradient(90deg, #1e293b 0%, #334155 100%);
    outline: none;
  }
  input[type='range'].bright-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f8fafc;
    border: 3px solid #f59e0b;
    box-shadow: 0 0 14px rgba(245, 158, 11, 0.65);
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  input[type='range'].bright-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  input[type='range'].bright-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f8fafc;
    border: 3px solid #f59e0b;
    box-shadow: 0 0 14px rgba(245, 158, 11, 0.65);
    cursor: pointer;
  }
  .glass-panel {
    background: rgba(15, 23, 42, 0.72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(148, 163, 184, 0.16);
  }
  @keyframes shakeModal {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-7px); }
    40% { transform: translateX(7px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shakeModal 0.36s ease-in-out;
  }
  @keyframes modalPop {
    0% { opacity: 0; transform: scale(0.9) translateY(14px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal-pop {
    animation: modalPop 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.45); }
    50% { box-shadow: 0 0 26px 4px rgba(245, 158, 11, 0.65); }
  }
  .cta-glow {
    animation: pulseGlow 2.2s infinite;
  }
`;

export default function App() {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(75);
  const [turbo, setTurbo] = useState(false);
  const [mode, setMode] = useState('steady');
  const [colorRgb, setColorRgb] = useState('255, 250, 235');
  const [zoom, setZoom] = useState('medium');
  const [screenLamp, setScreenLamp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [battery, setBattery] = useState(98);
  const [temp, setTemp] = useState(24);
  const [secondsOn, setSecondsOn] = useState(0);

  // Dynamic effect visual state
  const [effectIntensity, setEffectIntensity] = useState(1);
  const [effectRgb, setEffectRgb] = useState(null);
  const [morseText, setMorseText] = useState('');

  // Paywall modal state
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallStep, setPaywallStep] = useState(1);
  const [paywallAttempts, setPaywallAttempts] = useState(0);
  const [modalShaking, setModalShaking] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const audioCtxRef = useRef(null);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message, tone = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  const playTone = useCallback(
    (type) => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'clickOn') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.06);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'clickOff') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'tick') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
        } else if (type === 'paywall') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(185, now + 0.12);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
          osc.start(now);
          osc.stop(now + 0.32);
        }
      } catch {
        // Audio blocked or unsupported
      }
    },
    [soundEnabled]
  );

  // Lighting Mode Effects Loop
  useEffect(() => {
    setMorseText('');
    setEffectRgb(null);
    setEffectIntensity(1);

    if (!isOn || mode === 'steady') return undefined;

    let timerId = null;

    if (mode === 'strobe') {
      let lit = true;
      timerId = setInterval(() => {
        lit = !lit;
        setEffectIntensity(lit ? 1 : 0.04);
      }, 95);
    } else if (mode === 'sos') {
      let step = 0;
      timerId = setInterval(() => {
        const phase = step % SOS_PATTERN.length;
        const lit = SOS_PATTERN[phase] === 1;
        setEffectIntensity(lit ? 1 : 0.05);
        setMorseText(phase < 7 ? '• • • (S)' : phase < 20 ? '— — — (O)' : '• • • (S)');
        step += 1;
      }, 180);
    } else if (mode === 'disco') {
      let idx = 0;
      setEffectRgb(DISCO_COLORS[0]);
      timerId = setInterval(() => {
        idx = (idx + 1) % DISCO_COLORS.length;
        setEffectRgb(DISCO_COLORS[idx]);
      }, 320);
    } else if (mode === 'candle') {
      setEffectRgb('255, 178, 72');
      timerId = setInterval(() => {
        setEffectIntensity(0.65 + Math.random() * 0.35);
      }, 110);
    } else if (mode === 'police') {
      let flip = false;
      setEffectRgb('239, 68, 68');
      timerId = setInterval(() => {
        flip = !flip;
        setEffectRgb(flip ? '239, 68, 68' : '59, 130, 246');
      }, 170);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isOn, mode]);

  // Telemetry Timer
  useEffect(() => {
    const id = setInterval(() => {
      if (isOn) {
        setSecondsOn((s) => s + 1);
        setBattery((b) => {
          const drain = turbo ? 0.45 : (brightness / 100) * 0.16;
          return Math.max(1, +(b - drain).toFixed(1));
        });
        setTemp((t) => {
          const target = 26 + (brightness / 100) * 18 + (turbo ? 19 : 0);
          return +(t + (target - t) * 0.12).toFixed(1);
        });
      } else {
        setTemp((t) => +(t + (24 - t) * 0.15).toFixed(1));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [isOn, brightness, turbo]);

  // Paywall Handlers
  const openPaywall = () => {
    setPaywallAttempts((n) => n + 1);
    playTone('paywall');
    setPaywallStep(1);
    setPaywallOpen(true);
  };

  const closePaywallKeepOn = () => {
    setPaywallOpen(false);
    showToast("Fonar hali ham yoniq! O'chirish uchun $499 kerak 😅", 'warn');
  };

  const handlePowerAttempt = () => {
    if (!isOn) {
      setIsOn(true);
      playTone('clickOn');
      showToast("Fonar yoqildi! Yorug'likni bemalol sozlang.", 'success');
    } else {
      openPaywall();
    }
  };

  const handleForceTurnOffFree = () => {
    setIsOn(false);
    setTurbo(false);
    setScreenLamp(false);
    setPaywallOpen(false);
    playTone('clickOff');
    showToast("Fonar muvaffaqiyatli o'chirildi (0$ to'landi!)", 'success');
  };

  const handleModalCloseX = () => {
    playTone('paywall');
    setModalShaking(true);
    setTimeout(() => {
      setModalShaking(false);
      closePaywallKeepOn();
    }, 280);
  };

  // Computed visual values
  const activeRgb = effectRgb || colorRgb;
  const beamAlpha = isOn
    ? Math.min(1, Math.max(0, (brightness / 100) * (turbo ? 1.35 : 1) * effectIntensity))
    : 0;
  const activeZoom = ZOOM_LIST.find((z) => z.id === zoom) || ZOOM_LIST[1];
  const activeModeLabel = MODE_LIST.find((m) => m.id === mode)?.label || 'Oddiy';
  const lumens = isOn ? Math.round((brightness / 100) * (turbo ? 5000 : 2400)) : 0;
  const mins = String(Math.floor(secondsOn / 60)).padStart(2, '0');
  const secs = String(secondsOn % 60).padStart(2, '0');

  return (
    <div className="fonar-root selection:bg-amber-400/30 selection:text-amber-200 lg:h-screen lg:overflow-hidden flex flex-col justify-center">
      <style>{CUSTOM_STYLES}</style>

      {/* Ambient Room Glow */}
      <div
        className="room-glow"
        style={{
          background: `radial-gradient(circle at 50% 24%, rgba(${activeRgb}, ${(beamAlpha * 0.58).toFixed(3)}) 0%, rgba(${activeRgb}, ${(beamAlpha * 0.26).toFixed(3)}) 34%, rgba(${activeRgb}, ${(beamAlpha * 0.08).toFixed(3)}) 64%, rgba(7, 9, 15, 0) 90%)`,
        }}
      />

      {/* Fullscreen Lamp Overlay */}
      <div
        className="screen-lamp-overlay"
        style={{
          backgroundColor:
            isOn && screenLamp ? `rgba(${activeRgb}, ${(beamAlpha * 0.45).toFixed(3)})` : 'rgba(255,255,255,0)',
        }}
      />

      {/* Toasts */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[92%] max-w-md">
        {toasts.map((t) => {
          const palette =
            t.tone === 'warn'
              ? 'bg-amber-500/95 text-slate-950 border-amber-300'
              : t.tone === 'success'
              ? 'bg-emerald-500/95 text-slate-950 border-emerald-300'
              : 'bg-slate-800/95 text-white border-slate-600';
          return (
            <div
              key={t.id}
              className={`px-4 py-2 rounded-2xl border shadow-xl text-xs sm:text-sm font-bold text-center ${palette}`}
            >
              {t.message}
            </div>
          );
        })}
      </div>

      {/* Main App Shell — Fits single desktop viewport, scrolls smoothly on mobile/tablet */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-5 py-3 lg:py-4 flex flex-col gap-3">
        {/* Header */}
        <header className="glass-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Flashlight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  Fonar Ultra Max+
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Bepul versiya
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Yoqish bepul • Yorug'lik cheksiz</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playTone('tick');
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              )}
              <span>{soundEnabled ? 'Ovoz: Yoq' : "Ovoz: O'ch"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTone('tick');
                if (!isOn) setIsOn(true);
                setScreenLamp((v) => !v);
              }}
              className={
                screenLamp
                  ? 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-sky-500/25 border border-sky-400/60 text-xs font-semibold text-sky-200 transition'
                  : 'flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition'
              }
            >
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
              <span>Ekran chirog'i</span>
            </button>
          </div>
        </header>

        {/* Telemetry Strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="glass-panel rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Holat</p>
              <p className={`text-xs sm:text-sm font-bold mt-0.5 ${isOn ? 'text-amber-300' : 'text-slate-300'}`}>
                {isOn ? (turbo ? 'YONIQ (TURBO)' : 'Yoniq') : "O'chirilgan"}
              </p>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                isOn ? 'bg-amber-400 shadow-lg shadow-amber-400/80' : 'bg-slate-600'
              }`}
            />
          </div>

          <div className="glass-panel rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Quvvat</p>
              <p className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">
                {lumens.toLocaleString('uz-UZ')} lm
              </p>
            </div>
            <Zap className="w-4 h-4 text-amber-400/80" />
          </div>

          <div className="glass-panel rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Batareya</p>
              <p
                className={`text-xs sm:text-sm font-bold mt-0.5 ${
                  battery <= 20 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {Math.round(battery)}%
              </p>
            </div>
            <BatteryCharging className="w-4 h-4 text-emerald-400/80" />
          </div>

          <div className="glass-panel rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Harorat</p>
              <p className={`text-xs sm:text-sm font-bold mt-0.5 ${temp >= 48 ? 'text-rose-400' : 'text-sky-300'}`}>
                {Math.round(temp)}°C
              </p>
            </div>
            <Thermometer className="w-4 h-4 text-sky-400/80" />
          </div>
        </section>

        {/* Main 2-Column Stage (2 cols on tablet md+ and desktop lg+) */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
          {/* Left: Flashlight Hardware */}
          <section className="md:col-span-5 glass-panel rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 font-semibold text-slate-300">
                Rejim: {activeModeLabel}
              </span>
              <span className="font-mono text-slate-400">
                {mins}:{secs}
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-end pt-24 sm:pt-28 pb-2 w-full select-none my-auto">
              {/* Dynamic Beam Cone */}
              <div
                className="beam-cone"
                style={{
                  width: activeZoom.coneWidth,
                  background: `linear-gradient(to top, rgba(${activeRgb}, ${(beamAlpha * 0.92).toFixed(3)}) 0%, rgba(${activeRgb}, ${(beamAlpha * 0.45).toFixed(3)}) 42%, rgba(${activeRgb}, 0) 100%)`,
                }}
              />
              <div
                className="beam-core"
                style={{
                  width: activeZoom.coreWidth,
                  background: `linear-gradient(to top, rgba(255, 255, 255, ${(beamAlpha * 0.95).toFixed(3)}) 0%, rgba(${activeRgb}, ${(beamAlpha * 0.5).toFixed(3)}) 45%, rgba(${activeRgb}, 0) 100%)`,
                }}
              />

              {/* Hardware Torch Body */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 sm:w-32 h-4 sm:h-5 rounded-t-xl bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 border-b border-slate-900 flex items-center justify-center px-2">
                  <div
                    className="w-full h-2.5 sm:h-3 rounded-full transition-all duration-150"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, ${(0.18 + beamAlpha * 0.82).toFixed(3)}) 0%, rgba(${activeRgb}, ${(0.12 + beamAlpha * 0.85).toFixed(3)}) 55%, rgba(30, 41, 59, 0.9) 100%)`,
                      boxShadow: `0 0 ${(beamAlpha * 44).toFixed(1)}px rgba(${activeRgb}, ${(beamAlpha * 0.95).toFixed(3)}), inset 0 0 12px rgba(255, 255, 255, ${(0.2 + beamAlpha * 0.7).toFixed(3)})`,
                    }}
                  />
                </div>

                <div className="torch-head w-32 sm:w-36 h-12 rounded-t-lg rounded-b-2xl flex flex-col items-center justify-center border-y border-slate-700/60 relative">
                  <div className="w-24 sm:w-28 h-1 rounded-full bg-slate-900/60 mb-1" />
                  <div className="w-24 sm:w-28 h-1 rounded-full bg-slate-900/60" />
                  <span className="absolute right-2.5 top-1.5 text-[8px] font-bold tracking-widest text-amber-400/80">
                    ULTRA
                  </span>
                </div>

                <div className="torch-neck w-20 sm:w-24 h-4 border-b border-slate-900/80" />

                <div className="torch-body w-20 sm:w-24 h-40 sm:h-44 rounded-b-3xl flex flex-col items-center justify-between py-3.5 px-2 border-x border-b border-slate-700/40 relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950/90 border border-slate-700/80 flex items-center justify-center shadow-inner">
                    <button
                      type="button"
                      onClick={handlePowerAttempt}
                      aria-label="Fonarni yoqish yoki o'chirish"
                      className={`power-btn w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-slate-600 flex items-center justify-center cursor-pointer ${
                        isOn ? 'is-on' : ''
                      }`}
                    >
                      <Power className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isOn ? 'text-amber-300' : 'text-slate-300'}`} />
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1 w-full">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400/40" />
                    </div>
                    <span className="text-[9px] tracking-[0.22em] font-bold text-slate-400 uppercase">
                      PRO-X499
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full z-10 mt-2">
              <button
                type="button"
                onClick={handlePowerAttempt}
                className={
                  isOn
                    ? 'w-full py-3 px-4 rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/25 active:scale-[0.98]'
                    : 'w-full py-3 px-4 rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-amber-500/25 active:scale-[0.98]'
                }
              >
                <Power className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{isOn ? "FONARNI O'CHIRISH" : 'FONARNI YOQISH'}</span>
              </button>
            </div>
          </section>

          {/* Right: Controls Deck */}
          <section className="md:col-span-7 flex flex-col justify-between gap-3">
            {/* Brightness Card */}
            <div className="glass-panel rounded-3xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <SunMedium className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Yorug'lik darajasi
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {turbo && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      TURBO 200%
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums">{brightness}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  aria-label="Yorug'likni kamaytirish"
                  onClick={() => {
                    playTone('tick');
                    if (brightness <= 10 && isOn) {
                      openPaywall();
                      return;
                    }
                    setBrightness((v) => Math.max(10, v - 10));
                  }}
                  className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-white transition"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min={10}
                  max={100}
                  value={brightness}
                  onChange={(e) => {
                    setBrightness(Number(e.target.value));
                    if (!isOn) {
                      setIsOn(true);
                      playTone('clickOn');
                    }
                  }}
                  className="bright-slider"
                />

                <button
                  type="button"
                  aria-label="Yorug'likni oshirish"
                  onClick={() => {
                    playTone('tick');
                    if (!isOn) setIsOn(true);
                    setBrightness((v) => Math.min(100, v + 10));
                  }}
                  className="w-10 h-10 shrink-0 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-white transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {[
                  { val: 25, label: '25% Tun' },
                  { val: 50, label: "50% O'rta" },
                  { val: 100, label: '100% Maks' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      playTone('tick');
                      setBrightness(preset.val);
                      setTurbo(false);
                      if (!isOn) setIsOn(true);
                    }}
                    className="py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition"
                  >
                    {preset.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    playTone('clickOn');
                    if (!isOn) setIsOn(true);
                    setTurbo((prev) => {
                      const next = !prev;
                      if (next) {
                        setBrightness(100);
                        showToast('TURBO 200% yoqildi! Diqqat, fonar qizib ketmoqda 🔥', 'warn');
                      }
                      return next;
                    });
                  }}
                  className={
                    turbo
                      ? 'py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold bg-rose-500 text-white border border-rose-400 shadow-md shadow-rose-500/30 transition flex items-center justify-center gap-1'
                      : 'py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 transition flex items-center justify-center gap-1'
                  }
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Turbo</span>
                </button>
              </div>
            </div>

            {/* Modes Card */}
            <div className="glass-panel rounded-3xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Yoritish rejimlari
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">{morseText}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MODE_LIST.map(({ id, label, desc, Icon }) => {
                  const active = mode === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        playTone('tick');
                        setMode(id);
                        if (!isOn) setIsOn(true);
                      }}
                      className={
                        active
                          ? 'p-2.5 rounded-2xl border text-left transition flex items-center gap-2 bg-amber-500/20 border-amber-400/60 text-amber-200'
                          : 'p-2.5 rounded-2xl border text-left transition flex items-center gap-2 bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">{label}</div>
                        <div className="text-[10px] opacity-75 leading-tight mt-0.5">{desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color & Zoom Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-panel rounded-3xl p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Nur rangi</h2>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_LIST.map((c) => {
                    const active = colorRgb === c.rgb;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          playTone('tick');
                          setColorRgb(c.rgb);
                          if (mode === 'disco' || mode === 'police' || mode === 'candle') {
                            setMode('steady');
                          }
                          if (!isOn) setIsOn(true);
                        }}
                        className={
                          active
                            ? 'py-1.5 px-2 rounded-xl border border-amber-400 bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-white'
                            : 'py-1.5 px-2 rounded-xl border border-slate-700 bg-slate-800/70 text-xs font-semibold flex items-center justify-center gap-1.5 transition text-slate-300 hover:bg-slate-800'
                        }
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${c.dotClass}`} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Focus className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                      Nur kengligi (Zoom)
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ZOOM_LIST.map((z) => {
                      const active = zoom === z.id;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => {
                            playTone('tick');
                            setZoom(z.id);
                          }}
                          className={
                            active
                              ? 'py-2 rounded-xl border border-emerald-400/70 bg-emerald-500/20 text-xs font-bold text-emerald-200 transition'
                              : 'py-2 rounded-xl border border-slate-700 bg-slate-800/70 text-xs font-bold text-slate-300 hover:bg-slate-800 transition'
                          }
                        >
                          {z.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isOn) {
                        showToast("Fonar allaqachon o'chirilgan! Avval uni yoqing.", 'info');
                      } else {
                        openPaywall();
                      }
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tez o'chirish</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                      PRO
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Viral $499 Paywall Modal */}
      {paywallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div
            className={`modal-pop relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-400/40 shadow-2xl shadow-amber-500/15 ${
              modalShaking ? 'animate-shake' : ''
            }`}
          >
            <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 px-5 py-2 text-center sticky top-0 z-10">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-950">
                ⚡ Premium obuna talab qilinadi ⚡
              </p>
            </div>

            <button
              type="button"
              onClick={handleModalCloseX}
              aria-label="Yopish"
              className="absolute top-11 right-4 w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {paywallStep === 1 ? (
              <div className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-amber-400" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Fonarni o'chirish — PRO funksiya!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Fonarni yoqish mutlaqo bepul. Lekin uni{' '}
                  <strong className="text-amber-300">o'chirish</strong> uchun{' '}
                  <strong className="text-white">Fonar Ultra Max+</strong> tarifiga o'tishingiz kerak.
                </p>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/70 border border-amber-400/30">
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-400 line-through">$999</span>
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight">$499</span>
                    <span className="text-xs font-semibold text-slate-400">/ o'chirish</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    Bugun 50% chegirma! (Faqat 1 marta o'chirish uchun)
                  </p>
                </div>

                <ul className="mt-3.5 space-y-1.5 text-left text-xs text-slate-300 bg-slate-950/50 rounded-2xl p-3.5 border border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Fonarni 1 marta darhol o'chirish imkoniyati</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Qorong'ulikdan cheksiz foydalanish (HD sifatda)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Batareyangizni 1% ga tushishdan saqlab qolish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>«O'chirish» tugmasi uchun VIP navbat</span>
                  </li>
                </ul>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTone('clickOn');
                      setPaywallStep(2);
                    }}
                    className="cta-glow w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base transition active:scale-[0.98]"
                  >
                    Hozir $499 to'lash va o'chirish
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTone('paywall');
                      closePaywallKeepOn();
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
                  >
                    Yo'q, batareyam tugaguncha yonib tursin
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 mt-2.5">
                  {paywallAttempts > 1
                    ? `O'chirishga ${paywallAttempts}-urinish — baribir $499 kerak 😉`
                    : "Xavfsiz to'lov • Karta ma'lumoti so'ralmaydi (hazil demo)"}
                </p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <Laugh className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black text-white">Hazil edi! 😄</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Albatta hech qanday <strong className="text-amber-300">$499</strong> kerak emas — bu
                  internetdagi mashhur mem-sayt parodiyasi! Endi fonarni bemalol bepul o'chirishingiz mumkin.
                </p>
                <button
                  type="button"
                  onClick={handleForceTurnOffFree}
                  className="mt-5 w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base transition active:scale-[0.98]"
                >
                  Fonarni bepul o'chirish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}