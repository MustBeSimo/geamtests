import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPinterestImages } from '../utils/pinterest';

interface PinterestGalleryProps {
  username: string;
  className?: string;
}

export default function PinterestGallery({
  username,
  className = '',
}: PinterestGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    async function loadImages() {
      try {
        const pinterestImages = await fetchPinterestImages(username);
        setImages(pinterestImages.map((img) => img.url));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Pinterest images:', error);
        setIsLoading(false);
      }
    }

    loadImages();
  }, [username]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [images.length, isTransitioning]);

  const isVideo = (url: string) => {
    return url.includes('.m3u8') || url.includes('.mp4');
  };

  if (isLoading) {
    return (
      <div
        className={`relative w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}
      />
    );
  }

  if (images.length === 0) {
    return null;
  }

  const currentUrl = images[currentImageIndex];

  return (
    <div
      className={`relative w-full aspect-square rounded-xl overflow-hidden ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 2.7,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={() => setIsTransitioning(false)}
          className="absolute inset-0 w-full h-full"
        >
          {currentUrl && isVideo(currentUrl) ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              loop
              src={currentUrl}
            />
          ) : (
            <div
              className="w-full h-full transform-gpu"
              style={{
                backgroundImage: `url(${currentUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
