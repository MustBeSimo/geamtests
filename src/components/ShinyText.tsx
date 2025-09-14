// ShinyText.tsx – animated shiny sweep for hero headings
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, className = '' }) => {
  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, #000 60%, transparent 100%)',
      }}
    >
      <span
        className="relative z-10 rainbow-gradient-text"
        style={{
          background:
            'linear-gradient(270deg, #ff00cc, #3333ff, #00ff99, #ffff00, #ff6600, #ff00cc)',
          backgroundSize: '1200% 1200%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: 'rainbow-move 6s linear infinite',
        }}
      >
        {text}
      </span>
      <motion.span
        className="absolute left-0 top-0 h-full w-full pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          mixBlendMode: 'screen',
        }}
      >
        {text}
      </motion.span>
    </span>
  );
};

// Rainbow animation keyframes
if (typeof window !== 'undefined') {
  const styleId = 'rainbow-gradient-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes rainbow-move {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default ShinyText;
