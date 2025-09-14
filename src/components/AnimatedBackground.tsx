'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Media = {
  type: 'image' | 'video';
  src: string;
};

const mediaFiles: Media[] = [
  { type: 'image', src: '/images/media/blue-hair-portrait.png' },
  { type: 'image', src: '/images/media/blue-hair-composition.png' },
  { type: 'image', src: '/images/media/empowered-woman.png' },
  { type: 'image', src: '/images/media/fitness-group.png' },
  { type: 'image', src: '/images/media/1 strength.png' },
  { type: 'image', src: '/images/media/3 dancing.png' },
  { type: 'image', src: '/images/media/5 boxing .png' },
  {
    type: 'image',
    src: '/images/media/8 pilates_girl_with_blue_hair_6efvsudxco652w1zd617_0.png',
  },
  { type: 'video', src: '/images/media/digital-life.mp4' },
  { type: 'video', src: '/images/media/lifestyle-video.mp4' },
  { type: 'video', src: '/images/media/sunny-day.mp4' },
  { type: 'video', src: '/images/media/fitness-outdoor.mp4' },
];

export default function AnimatedBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentMedia = mediaFiles[currentIndex];

  if (!currentMedia) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/30 z-10" />{' '}
      {/* Overlay for contrast */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {currentMedia.type === 'image' ? (
            <div className="relative w-full h-full">
              <Image
                src={currentMedia.src}
                alt="Gigi background"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          ) : (
            <video
              src={currentMedia.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Particle overlay effect */}
      <div className="absolute inset-0 z-20 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
