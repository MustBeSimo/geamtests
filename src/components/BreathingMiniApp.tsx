
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { getAvatarColors, mindgleamGradients } from '@/utils/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import Orb from '@/components/Orb';

interface BreathingMiniAppProps {
  selectedAvatar: 'gigi' | 'vee' | 'lumo';
}

type BreathingPhase = {
  key: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  label: string;
  seconds: number;
  instruction: string;
};

export default function BreathingMiniApp({ selectedAvatar }: BreathingMiniAppProps) {
  const { user } = useAuth();
  const { isSubscriptionActive } = useSubscription(user?.id);

  const phases: BreathingPhase[] = useMemo(
    () => [
      { key: 'inhale', label: 'Breathe In', seconds: 4, instruction: 'Inhale gently through the nose' },
      { key: 'hold1', label: 'Hold', seconds: 4, instruction: 'Hold your breath softly' },
      { key: 'exhale', label: 'Breathe Out', seconds: 4, instruction: 'Exhale slowly through the mouth' },
      { key: 'hold2', label: 'Hold', seconds: 4, instruction: 'Hold, feel the calm' },
    ],
    []
  );

  const cycleLengthMs = useMemo(
    () => phases.reduce((sum, p) => sum + p.seconds * 1000, 0),
    [phases]
  );

  const SESSION_DURATION_MS = 4 * 60 * 1000; // default 4 minutes (adjustable)
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseElapsedMs, setPhaseElapsedMs] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [startTimestamp, setStartTimestamp] = useState<string | null>(null);
  const [enableHaptics, setEnableHaptics] = useState(true);
  const [sessionElapsedMs, setSessionElapsedMs] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [clicks, setClicks] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const currentPhase = phases[phaseIndex];
  const currentPhaseDurationMs = currentPhase.seconds * 1000;
  const phaseProgress = Math.min(1, phaseElapsedMs / currentPhaseDurationMs || 0);
  const sessionProgress = Math.min(1, sessionElapsedMs / SESSION_DURATION_MS || 0);

  const vibrate = useCallback((pattern: number | number[]) => {
    try {
      if (!enableHaptics) return;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        // @ts-ignore - vibrate exists in most browsers
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  }, [enableHaptics]);

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => {
      const next = (prev + 1) % phases.length;
      if (next === 0) {
        setCyclesCompleted((c) => c + 1);
      }
      return next;
    });
    setPhaseElapsedMs(0);
  }, [phases.length]);

  const tick = useCallback((now: number) => {
    if (!isRunning) return;
    const last = lastTickRef.current ?? now;
    const delta = Math.min(100, now - last); // clamp to keep stability on tab switch
    lastTickRef.current = now;

    setPhaseElapsedMs((ms) => {
      const next = ms + delta;
      if (next >= currentPhaseDurationMs) {
        // Phase transition - single accent vibration
        vibrate(currentPhase.key === 'exhale' ? [50, 50, 50] : 20);
        advancePhase();
        return 0;
      }

      // Precise vibration during active breathing phases (inhale/exhale)
      if (currentPhase.key === 'inhale' || currentPhase.key === 'exhale') {
        const progress = next / currentPhaseDurationMs;

        // Create pulsing vibration pattern that syncs with breathing rhythm
        const pulseFrequency = currentPhase.key === 'inhale' ? 600 : 800; // Faster for inhale, slower for exhale
        const shouldVibrate = Math.floor(next / pulseFrequency) !== Math.floor(ms / pulseFrequency);

        if (shouldVibrate) {
          let intensity;

          if (currentPhase.key === 'inhale') {
            // Stronger, more frequent pulses during inhale
            intensity = Math.round(30 + (progress * 30)); // 30 to 60
          } else {
            // Decreasing intensity during exhale
            intensity = Math.round(60 - (progress * 50)); // 60 to 10
          }

          // Add phase transition vibrations
          if (progress < 0.1) {
            // Start of phase - strong pulse
            vibrate(Math.max(intensity, 50));
          } else if (progress > 0.9) {
            // End of phase - diminishing pulse
            vibrate(Math.max(intensity * 0.7, 20));
          } else {
            // Middle of phase - normal pulse
            vibrate(intensity);
          }
        }
      }
      // Complete silence during hold phases (hold1, hold2)

      return next;
    });
    
    // update session time and stop at end
    setSessionElapsedMs((t) => {
      const updated = Math.min(SESSION_DURATION_MS, t + delta);
      if (updated >= SESSION_DURATION_MS) {
        setIsRunning(false);
      }
      return updated;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, currentPhaseDurationMs, currentPhase.key, vibrate, advancePhase]);

  useEffect(() => {
    if (!isRunning) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, tick]);

  const handleStartPause = () => {
    // triple click reset detection within 500ms
    setClicks((c) => c + 1);
    setTimeout(() => setClicks(0), 500);
    if (clicks >= 2) {
      handleReset();
      return;
    }
    if (!isRunning) {
      if (!startTimestamp) setStartTimestamp(new Date().toISOString());
      lastTickRef.current = null;
      setIsRunning(true);
      vibrate(20);
    } else {
      setIsRunning(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    vibrate(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setPhaseElapsedMs(0);
    setCyclesCompleted(0);
    setStartTimestamp(null);
    setSessionElapsedMs(0);
  };

  const logSession = useCallback(async () => {
    try {
      const payload = {
        pattern: 'box-4-4-4-4',
        cyclesCompleted,
        startedAt: startTimestamp,
        endedAt: new Date().toISOString(),
        durationMs: startTimestamp ? Date.now() - new Date(startTimestamp).getTime() : cyclesCompleted * cycleLengthMs,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      };
      await fetch('/api/breathing/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      // non-blocking
      console.error('Breathing log error:', error);
    }
  }, [cyclesCompleted, startTimestamp, cycleLengthMs]);

  const handleComplete = async () => {
    setIsRunning(false);
    await logSession();
  };

  // Auto-log when user stops after at least one full cycle
  useEffect(() => {
    if (!isRunning && cyclesCompleted > 0) {
      // mild debounce to avoid duplicate logs on quick toggles
      const t = setTimeout(() => logSession(), 600);
      return () => clearTimeout(t);
    }
  }, [isRunning, cyclesCompleted, logSession]);

  const ringRadius = 110;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const cumulativeProgress = useMemo(() => {
    const prior = phases.slice(0, phaseIndex).reduce((sum, p) => sum + p.seconds, 0);
    const total = phases.reduce((sum, p) => sum + p.seconds, 0);
    return (prior + phaseProgress * currentPhase.seconds) / total;
  }, [phases, phaseIndex, phaseProgress, currentPhase.seconds]);

  // Dynamic shake during breathing phases: stronger during transitions
  const getShakeIntensity = () => {
    if (!isRunning) return 0;

    switch (currentPhase.key) {
      case 'inhale':
        // Gentle shake that builds during inhale
        return phaseProgress < 0.1 || phaseProgress > 0.9 ? 1 : 0.3;
      case 'exhale':
        // Strong shake that diminishes during exhale
        return Math.max(0.5, (1 - phaseProgress) * 6);
      case 'hold1':
      case 'hold2':
        // Subtle pulse at start and end of hold, otherwise still
        return (phaseProgress < 0.1 || phaseProgress > 0.9) ? 0.2 : 0;
      default:
        return 0;
    }
  };

  const shakeIntensity = getShakeIntensity();
  const exhaleShake = currentPhase.key === 'exhale' && isRunning ? shakeIntensity : 0;

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <div className="relative rounded-3xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Ambient gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-pink-300/20 dark:bg-pink-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-purple-300/20 dark:bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 px-5 py-4">
          <motion.h2
            className="text-base sm:text-lg lg:text-xl font-bold"
            animate={{
              background: isRunning && currentPhase.key === 'inhale'
                ? 'linear-gradient(90deg, #10b981, #34d399, #10b981)'
                : isRunning && currentPhase.key === 'exhale'
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)'
                : isRunning && (currentPhase.key === 'hold1' || currentPhase.key === 'hold2')
                ? 'linear-gradient(90deg, #8b5cf6, #a855f7, #8b5cf6)'
                : 'linear-gradient(90deg, #374151, #4b5563, #374151)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            MindAir
          </motion.h2>

          <div className="flex items-center gap-2 ml-auto">
            <div className="bg-white/40 dark:bg-white/10 border border-white/30 rounded-full px-3 py-1.5 text-xs shadow-sm">
              <span className="text-gray-700 dark:text-gray-200 font-medium">Session</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {Math.floor(sessionElapsedMs / 60000)}:{String(Math.floor((sessionElapsedMs % 60000) / 1000)).padStart(2, '0')}
              </span>
            </div>
            <motion.button
              onClick={() => setInfoOpen((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 dark:bg-white/10 border border-white/30 text-gray-800 dark:text-gray-200 text-xs font-medium shadow-sm hover:shadow transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>4-4-4-4</span>
              <span className="w-4 h-4 rounded-full bg-white/60 dark:bg-white/20 flex items-center justify-center text-[10px] font-bold">i</span>
            </motion.button>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center py-10">
          {/* Progress ring */}
          <svg className="absolute w-[260px] h-[260px]" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={ringRadius} stroke="rgba(255,255,255,0.35)" strokeWidth="10" fill="none" />
            <motion.circle
              cx="130"
              cy="130"
              r={ringRadius}
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: ringCircumference, strokeDashoffset: ringCircumference }}
              animate={{ strokeDasharray: ringCircumference, strokeDashoffset: ringCircumference * (1 - cumulativeProgress) }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.25))' }}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Orb */}
          <motion.div
            className="relative w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] flex items-center justify-center cursor-pointer"
            onClick={handleStartPause}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: isRunning ? (
                  currentPhase.key === 'inhale' ? 1.5 :
                  currentPhase.key === 'exhale' ? 0.5 :
                  currentPhase.key === 'hold1' || currentPhase.key === 'hold2' ? 1.15 : 1
                ) : 1,
                filter: `blur(${isRunning ? (
                  currentPhase.key === 'exhale' ? '18px' :
                  currentPhase.key === 'inhale' ? '1px' :
                  '6px'
                ) : '6px'})`,
                opacity: isRunning ? (
                  currentPhase.key === 'hold1' || currentPhase.key === 'hold2' ? 0.75 :
                  currentPhase.key === 'inhale' ? 1 :
                  currentPhase.key === 'exhale' ? 0.9 : 0.85
                ) : 0.85
              }}
              transition={{
                duration: isRunning ? currentPhase.seconds : 0.3,
                ease: isRunning ? (
                  currentPhase.key === 'inhale' ? 'easeOut' :
                  currentPhase.key === 'exhale' ? 'easeIn' :
                  'linear'
                ) : 'easeInOut'
              }}
              style={{ willChange: 'transform, filter, opacity' }}
            >
              <Orb
                hue={selectedAvatar === 'gigi' ? 330 : selectedAvatar === 'vee' ? 220 : 150}
                hoverIntensity={isRunning ? 1.4 : 0.7}
                forceHoverState={isRunning}
              />
            </motion.div>

            {/* Overlay label */}
            <motion.div
              animate={{
                x: shakeIntensity * (currentPhase.key === 'exhale' ? 2 : 0.6),
                y: -shakeIntensity * (currentPhase.key === 'exhale' ? 2 : 0.6),
                scale: isRunning ? (
                  currentPhase.key === 'inhale' ? 1.12 :
                  currentPhase.key === 'exhale' ? 0.88 :
                  currentPhase.key === 'hold1' || currentPhase.key === 'hold2' ? 1.06 : 1
                ) : 1
              }}
              transition={{ type: 'tween', duration: isRunning ? 0.25 : 0.2, ease: currentPhase.key === 'exhale' ? 'easeIn' : 'easeOut' }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center bg-white/60 dark:bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/40 dark:border-white/10 shadow-xl min-w-[160px]">
                <motion.p className="text-base sm:text-lg lg:text-xl font-bold tracking-wide uppercase" animate={{
                  color: isRunning && currentPhase.key === 'inhale' ? '#10b981' :
                         isRunning && currentPhase.key === 'exhale' ? '#f59e0b' :
                         isRunning && (currentPhase.key === 'hold1' || currentPhase.key === 'hold2') ? '#8b5cf6' :
                         '#111827'
                }} transition={{ duration: 0.3 }}>
                  {currentPhase.label}
                </motion.p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">{isRunning ? 'Tap to pause' : 'Tap to start'}</p>
                {isRunning && (
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    {[1,2,3,4].map((count) => (
                      <div key={count} className={`w-1.5 h-1.5 rounded-full ${Math.ceil(currentPhase.seconds - phaseElapsedMs / 1000) >= count ? 'bg-purple-500' : 'bg-white/40'}`} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-white/30 dark:border-white/10 px-5 py-3 text-center">
          <p className="text-xs text-gray-700/80 dark:text-gray-300">Triple-tap to reset • Box breathing 4-4-4-4</p>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-4 top-16 z-20 w-64 p-3 rounded-2xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl text-gray-800 dark:text-gray-200 border border-white/40 text-xs shadow-2xl"
            >
              <div className="font-medium mb-1">Box Breathing</div>
              <p>Follow a 4–4–4–4 rhythm: inhale, hold, exhale, hold.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pro tip below card */}
      {isSubscriptionActive && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-emerald-500/10 backdrop-blur-md rounded-full px-4 py-2 border border-emerald-400/20 text-xs text-emerald-800 dark:text-emerald-200 shadow-lg text-center">
            <span className="mr-1">💡</span> 4–6 cycles can activate your parasympathetic system
          </div>
        </motion.div>
      )}
    </div>
  );
}


