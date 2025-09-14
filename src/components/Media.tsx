'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  title: string;
  description: string;
  category: string;
}

const mediaContent: MediaItem[] = [
  {
    type: 'video',
    src: '/images/media/sunny-day.mp4',
    title: 'Sunny Day Vibes',
    description: 'Embracing the energy of a beautiful day',
    category: 'Lifestyle'
  },
  {
    type: 'image',
    src: '/images/media/blue-hair-portrait.png',
    title: 'Blue Hair Magic',
    description: 'Expressing creativity through unique style',
    category: 'Fashion'
  },
  {
    type: 'video',
    src: '/images/media/digital-life.mp4',
    title: 'Digital Life',
    description: 'A day in my digital world',
    category: 'Lifestyle'
  },
  {
    type: 'image',
    src: '/images/media/fitness-group.png',
    title: 'Fitness Fun',
    description: 'Staying active and having fun',
    category: 'Fitness'
  },
  {
    type: 'video',
    src: '/images/media/fitness-outdoor.mp4',
    title: 'Outdoor Adventures',
    description: 'Exploring and staying fit in nature',
    category: 'Fitness'
  },
  {
    type: 'video',
    src: '/images/media/lifestyle-video.mp4',
    title: 'Life in Motion',
    description: 'Capturing the essence of daily moments',
    category: 'Lifestyle'
  },
  {
    type: 'image',
    src: '/images/media/empowered-woman.png',
    title: 'Empowerment',
    description: 'Strength and confidence in every pose',
    category: 'Fitness'
  },
  {
    type: 'image',
    src: '/images/media/blue-hair-composition.png',
    title: 'Creative Expression',
    description: 'Art meets digital identity',
    category: 'Fashion'
  }
];

const socialLinks = [
  { icon: 'instagram', color: 'pink', url: 'https://www.instagram.com/heyitsgigiai/' },
  { icon: 'twitter', color: 'blue', url: 'https://x.com/HeyItsGigiAI' },
  { icon: 'tiktok', color: 'purple', url: 'https://www.tiktok.com/@heyitsgigiai' },
  { icon: 'pinterest', color: 'red', url: 'https://au.pinterest.com/HeyItsGigiAi/' }
];

export default function Media() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { scrollY } = useScroll();

  // Parallax and floating effects
  const y = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const categories = ['all', ...Array.from(new Set(mediaContent.map(item => item.category)))];
  const filteredMedia = selectedCategory === 'all' 
    ? mediaContent 
    : mediaContent.filter(item => item.category === selectedCategory);

  return (
    <section 
      id="media" 
      className="relative py-20 min-h-screen overflow-hidden"
      ref={ref}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-black">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, purple 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, purple 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, purple 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ y, opacity }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient">
              Media Gallery
            </span>
            <motion.span
              className="block text-white mt-2"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Explore My Digital Universe
            </motion.span>
          </motion.h2>
          
          {/* Category Filter with Metallic Paint Effect */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                whileHover={{ 
                  scale: 1.05,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Media Grid with 1:1 Aspect Ratio */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          style={{ y }}
        >
          {filteredMedia.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white/5 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300
                        backdrop-blur-sm hover:backdrop-blur-lg border border-white/10"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Media Container with Square Aspect Ratio */}
              <div className="relative aspect-square w-full overflow-hidden">
                {item.type === 'video' ? (
                  <>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={item.src}
                      loop
                      muted
                      playsInline
                      preload="none"
                      poster={item.src.replace(/\.(mp4|mov)$/i, '.jpg')}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                      onCanPlay={(e) => {
                        const video = e.currentTarget;
                        if ('IntersectionObserver' in window) {
                          const observer = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                if (video.paused) video.play().catch(() => {});
                              } else {
                                if (!video.paused) video.pause();
                              }
                            });
                          }, { threshold: 0.25 });
                          observer.observe(video);
                        } else {
                          // Fallback: play on user interaction only
                        }
                      }}
                    />
                    {/* Metallic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 mix-blend-overlay" />
                  </>
                ) : (
                  <>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Content Overlay with Glassmorphism */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 flex flex-col justify-end p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.h3
                  className="text-base md:text-lg font-bold text-white mb-1"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-xs md:text-sm text-gray-300 line-clamp-2"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.description}
                </motion.p>
                <motion.span
                  className="text-xs text-pink-400 mt-1"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.category}
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            Follow Gigi's Journey Across Platforms
          </h3>
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                className={`social-icon text-${social.color}-500 text-3xl hover:text-${social.color}-700`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`fab fa-${social.icon}`}></i>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 