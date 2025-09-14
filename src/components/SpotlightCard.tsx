// Example usage for SpotlightCard with Together LLM chat:\n//\n// <SpotlightCard title="Spotlight Chat" subtitle="Ask anything!">\n//   <SpotlightChat />\n// </SpotlightCard>\n\n'use client';

import React, {
  useState,
  useRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import './SpotlightCard.css';
import styles from './SpotlightCardRainbowBorder.module.css';

interface SpotlightCardProps {
  title: string;
  subtitle?: React.ReactNode;
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  cardColor?: string;
  initialPosition?: { x: number; y: number };
  isDraggable?: boolean;
}

// Spark particle interface
interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function SpotlightCard({
  title,
  subtitle,
  children,
  className = '',
  spotlightColor = 'rgba(255, 126, 179, 0.6)',
  cardColor = 'rgba(255, 255, 255, 0.95)',
  initialPosition = { x: 0, y: 0 },
  isDraggable = true,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [metaBalls, setMetaBalls] = useState([
    { x: 0.3, y: 0.3, vx: 0.02, vy: 0.01, size: 0.15 },
    { x: 0.7, y: 0.6, vx: -0.015, vy: 0.02, size: 0.12 },
    { x: 0.5, y: 0.8, vx: 0.01, vy: -0.015, size: 0.1 },
  ]);

  // Mouse position with optimized motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic attraction spring physics
  const magnetX = useSpring(mouseX, {
    stiffness: 200,
    damping: 40,
    mass: 0.8,
  });
  const magnetY = useSpring(mouseY, {
    stiffness: 200,
    damping: 40,
    mass: 0.8,
  });

  // Position for dragging
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);

  // Magnetic field strength based on focus
  const magnetStrength = useTransform([magnetX, magnetY], () =>
    isFocused ? 1 : 0.3
  );

  // Animate meta balls
  useEffect(() => {
    if (!isFocused) return;

    const interval = setInterval(() => {
      setMetaBalls((prev) =>
        prev.map((ball) => ({
          ...ball,
          x: ball.x + ball.vx,
          y: ball.y + ball.vy,
          vx: ball.x <= 0 || ball.x >= 1 ? -ball.vx : ball.vx,
          vy: ball.y <= 0 || ball.y >= 1 ? -ball.vy : ball.vy,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isFocused]);

  // Animate sparks
  useEffect(() => {
    if (sparks.length === 0) return;

    const interval = setInterval(() => {
      setSparks((prev) =>
        prev
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vy: spark.vy + 0.5, // gravity
            life: spark.life - 1,
          }))
          .filter((spark) => spark.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [sparks.length]);

  // Create click sparks
  const createSparks = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newSparks: Spark[] = [];
    for (let i = 0; i < 12; i++) {
      newSparks.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        life: 60,
        maxLife: 60,
      });
    }

    setSparks((prev) => [...prev, ...newSparks]);
  }, []);

  // Constrain drag
  const dragConstraints = useRef({
    left: 0,
    right: 0,
    top: -Infinity,
    bottom: Infinity,
  });
  useLayoutEffect(() => {
    function updateConstraints() {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      dragConstraints.current = {
        left: -rect.left,
        right: window.innerWidth - rect.left - rect.width,
        top: -Infinity,
        bottom: Infinity,
      };
    }
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Optimized mouse handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      requestAnimationFrame(() => {
        mouseX.set(relativeX);
        mouseY.set(relativeY);
      });
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsFocused(false);
    setSparks([]); // Clear sparks when leaving
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      createSparks(e.clientX, e.clientY);
    },
    [createSparks]
  );

  // Tooltip logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDraggable && !hasBeenDragged) {
      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('drag-handle')) {
          timeout = setTimeout(() => setShowTooltip(true), 100);
        }
      };

      const handleMouseUp = () => {
        clearTimeout(timeout);
        setShowTooltip(false);
      };

      if (cardRef.current) {
        cardRef.current.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        window.removeEventListener('mouseup', handleMouseUp);
        clearTimeout(timeout);
        setShowTooltip(false);
      };
    }
    return () => {}; // Empty cleanup for other cases
  }, [isDraggable, hasBeenDragged]);

  return (
    <motion.div
      ref={cardRef}
      className={`card-spotlight ${className} rounded-[28px] backdrop-blur-md relative overflow-hidden border border-white/30 cursor-pointer`}
      style={{
        backgroundColor: cardColor,
        x,
        y,
        zIndex: isFocused ? 20 : 10,
      }}
      drag={isDraggable}
      dragListener={false}
      dragMomentum={true}
      dragConstraints={dragConstraints.current}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
      whileDrag={{
        scale: 1.05,
        zIndex: 30,
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
        transition: { duration: 0.1 },
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 100,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onDragStart={() => {
        setHasBeenDragged(true);
        setShowTooltip(false);
      }}
      onPointerDown={(e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('drag-handle')) {
          (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
        }
      }}
      onPointerUp={(e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('drag-handle')) {
          (e.currentTarget as HTMLElement).style.cursor = 'grab';
        }
      }}
    >
      {/* Meta Balls Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: isFocused ? 0.6 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <filter id="metaball">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              />
            </filter>
            <linearGradient
              id="ballGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255, 126, 179, 0.8)" />
              <stop offset="50%" stopColor="rgba(216, 180, 254, 0.6)" />
              <stop offset="100%" stopColor="rgba(116, 192, 252, 0.4)" />
            </linearGradient>
          </defs>
          <g filter="url(#metaball)">
            {metaBalls.map((ball, i) => (
              <motion.circle
                key={i}
                cx={`${ball.x * 100}%`}
                cy={`${ball.y * 100}%`}
                r={`${ball.size * 100}px`}
                fill="url(#ballGradient)"
                animate={{
                  r: isFocused ? `${ball.size * 120}px` : `${ball.size * 80}px`,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Magnetic Cursor Follower */}
      <motion.div
        className="absolute pointer-events-none z-0 w-32 h-32 rounded-full"
        style={{
          x: useTransform(magnetX, (x) => x - 64),
          y: useTransform(magnetY, (y) => y - 64),
          background: `radial-gradient(circle, 
            rgba(255, 126, 179, 0.4) 0%, 
            rgba(216, 180, 254, 0.2) 50%, 
            transparent 100%)`,
          opacity: magnetStrength,
          filter: 'blur(20px)',
        }}
      />

      {/* Star Border Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 text-yellow-300"
            style={{
              left: `${10 + i * 10}%`,
              top: '5px',
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            ⭐
          </motion.div>
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="absolute w-2 h-2 text-blue-300"
            style={{
              left: `${15 + i * 10}%`,
              bottom: '5px',
            }}
            animate={{
              rotate: [360, 0],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>
        ))}
      </motion.div>

      {/* Click Sparks */}
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none z-10"
            style={{
              left: spark.x,
              top: spark.y,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1,
              opacity: spark.life / spark.maxLife,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </AnimatePresence>

      {/* Enhanced draggable corner handles */}
      {isDraggable && (
        <>
          {[
            { position: 'top-0 left-0', corner: 'tl' },
            { position: 'bottom-0 left-0', corner: 'bl' },
            { position: 'top-0 right-0', corner: 'tr' },
            { position: 'bottom-0 right-0', corner: 'br' },
          ].map((handle, i) => (
            <motion.div
              key={handle.corner}
              className={`drag-handle absolute ${handle.position} w-8 h-8 cursor-grab rounded-${handle.corner}-[28px] transition-all duration-200`}
              whileHover={{
                backgroundColor: 'rgba(255, 126, 179, 0.4)',
                scale: 1.2,
              }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: isFocused
                  ? '0 0 10px rgba(255, 126, 179, 0.6)'
                  : '0 0 0px rgba(255, 126, 179, 0)',
              }}
            />
          ))}

          {/* Pulsing corner indicators */}
          {[
            { position: 'top-2 left-2', color: 'bg-pink-400', delay: 0 },
            { position: 'bottom-2 left-2', color: 'bg-purple-400', delay: 0.5 },
            { position: 'top-2 right-2', color: 'bg-blue-400', delay: 1 },
            { position: 'bottom-2 right-2', color: 'bg-green-400', delay: 1.5 },
          ].map((indicator, i) => (
            <motion.div
              key={i}
              className={`absolute ${indicator.position} w-2 h-2 ${indicator.color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
                boxShadow: [
                  '0 0 0px rgba(255, 255, 255, 0)',
                  '0 0 8px rgba(255, 255, 255, 0.8)',
                  '0 0 0px rgba(255, 255, 255, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: indicator.delay,
              }}
            />
          ))}
        </>
      )}

      {/* Rainbow animated border */}
      <div className={styles['rainbow-border']} aria-hidden="true">
        <div
          className={`${styles['rainbow-border-inner']} rounded-[28px]`}
        ></div>
      </div>

      {/* Card content with staggered animations */}
      <motion.div
        className="p-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          className="flex items-center gap-3 mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Animated sparkle icon with magnetic effect */}
          <motion.span
            className="text-xl"
            role="presentation"
            style={{
              x: useTransform(magnetX, (x) => (x - 100) * 0.05),
              y: useTransform(magnetY, (y) => (y - 50) * 0.05),
            }}
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.span>
          <h3 className="text-xl font-bold text-black dark:text-white mb-0">
            <AnimatedText text={title} className="inline-block" />
          </h3>
        </motion.div>

        {subtitle && (
          <motion.p
            className="text-gray-800 dark:text-gray-200 mb-4 ml-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {typeof subtitle === 'string' ? (
              <AnimatedText text={subtitle} className="inline-block" />
            ) : (
              subtitle
            )}
          </motion.p>
        )}

        <motion.div
          className="text-black dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Enhanced tooltip with sparkle effect */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-[-8px] px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white text-sm rounded-xl whitespace-nowrap pointer-events-none font-medium shadow-lg"
          >
            ✨ Click and drag to move this magical card ✨
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px] border-t-pink-500"
              animate={{
                borderTopColor: ['#ec4899', '#a855f7', '#3b82f6', '#ec4899'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
