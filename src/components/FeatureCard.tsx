'use client';

import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  color: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function FeatureCard({ title, color, icon, children }: FeatureCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Color mapping for different card types
  const colorStyles = {
    pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
  };

  const cardStyle = colorStyles[color as keyof typeof colorStyles] || colorStyles.blue;

  return (
    <motion.div 
      className={`relative w-full overflow-hidden rounded-2xl border shadow-lg h-[520px] md:h-[580px] lg:h-[640px] ${cardStyle}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsRevealed(!isRevealed)}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      {/* Cover State */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
        animate={{ opacity: isRevealed ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 text-gray-700 dark:text-gray-200">
          {/* Minimal icon/symbol node provided by parent */}
          {icon}
        </div>
        <h3 className="text-xl font-bold text-center">{title}</h3>
      </motion.div>

      {/* Content State */}
      <motion.div 
        className="absolute inset-0 p-4 sm:p-6 overflow-y-auto"
        animate={{ 
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-3 text-center">{title}</h3>
        <div className="w-full">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
