'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
}

export default function TypewriterText({
  texts,
  className = '',
}: TypewriterTextProps) {
  // Just use the first text without animation
  const text = texts[0];

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.span>
  );
}
