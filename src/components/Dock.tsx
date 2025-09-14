'use client';

import { motion, useAnimation, Variants, PanInfo } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DockItem {
  icon: string;
  label: string;
  href: string;
}

const dockItems: DockItem[] = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '💬', label: 'Chat', href: '#chat' },
  { icon: '📚', label: 'Guides', href: '#guides' },
  { icon: '🎨', label: 'Media', href: '#media' },
  { icon: '🤝', label: 'Collab', href: '#collab' },
];

const itemVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0.6,
  },
  hover: {
    scale: 1.2,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

const Dock = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Initialize dock position at the bottom center
    setPosition({
      x: typeof window !== 'undefined' ? window.innerWidth / 2 - 150 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight - 100 : 0,
    });
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    setPosition((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={controls}
      style={{
        x: position.x,
        y: position.y,
      }}
      className="fixed z-50 flex items-center justify-center"
    >
      <motion.div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-2xl
          bg-gray-900/80 backdrop-blur-lg border border-white/10
          shadow-xl hover:shadow-2xl transition-shadow
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
      >
        {dockItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <motion.div
              className="relative group"
              variants={itemVariants}
              initial="initial"
              whileHover="hover"
            >
              <motion.div
                className="w-12 h-12 flex items-center justify-center text-2xl
                         bg-gray-800/50 rounded-xl border border-white/5
                         hover:bg-gray-700/50 transition-colors"
              >
                {item.icon}
              </motion.div>
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2
                         bg-gray-900 text-white px-2 py-1 rounded text-sm
                         opacity-0 group-hover:opacity-100 transition-opacity
                         whitespace-nowrap"
              >
                {item.label}
              </motion.div>
            </motion.div>
          </Link>
        ))}

        {/* Drag handle */}
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2
                   w-10 h-1 bg-white/20 rounded-full cursor-grab
                   hover:bg-white/30 transition-colors"
        />
      </motion.div>
    </motion.div>
  );
};

export default Dock;
