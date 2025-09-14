'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import MindGleamLogoAnimated from '@/components/MindGleamLogoAnimated';
import { mindgleamGradients, getAvatarColors } from '@/utils/colors';

// Typewriter component for rotating taglines
const TypewriterTaglines = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const taglines = [
    { text: 'Feel lighter in five minutes a day', color: 'text-emerald-500' },
    {
      text: 'Transform anxious thoughts into calm confidence',
      color: 'text-blue-500',
    },
    {
      text: 'Build mental resilience with CBT-inspired tools',
      color: 'text-purple-500',
    },
    {
      text: 'Your AI companion for emotional wellness',
      color: 'text-pink-500',
    },
    {
      text: 'Evidence-based techniques for daily mental health',
      color: 'text-teal-500',
    },
  ];

  const currentTagline = taglines[currentTaglineIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < (currentTagline?.text.length || 0)) {
        timeout = setTimeout(() => {
          setDisplayText(
            currentTagline?.text.slice(0, displayText.length + 1) || ''
          );
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Pause before erasing
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTagline?.text]);

  return (
    <div className="h-20 sm:h-24 lg:h-28 flex items-center justify-center">
      <h1
        className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight ${currentTagline?.color || 'text-blue-600'} transition-colors duration-500`}
      >
        {displayText}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
};

// Import animations based on react-animations.txt
const SplitText = ({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {text}
    </motion.div>
  );
};

// Avatar configuration with unified colors
const avatars = [
  {
    id: 'gigi' as const,
    name: 'Gigi',
    description: 'Your empathetic companion',
    src: '/images/avatars/Gigi_avatar.png',
    gradient: 'from-mindgleam-peach-200 to-mindgleam-peach-300',
  },
  {
    id: 'vee' as const,
    name: 'Vee',
    description: 'Your logical coach',
    src: '/images/avatars/Vee_avatar.png',
    gradient: 'from-mindgleam-lavender-200 to-mindgleam-lavender-300',
  },
  {
    id: 'lumo' as const,
    name: 'Lumo',
    description: 'Your creative guide',
    src: '/images/avatars/Lumo_avatar.png',
    gradient: 'from-mindgleam-mint-200 to-mindgleam-mint-300',
  },
];

interface HeroProps {
  onStartDemo: (goal?: string) => void;
  selectedAvatar: string;
  onAvatarChange: (avatar: 'gigi' | 'vee' | 'lumo') => void;
}

export default function Hero({
  onStartDemo,
  selectedAvatar,
  onAvatarChange,
}: HeroProps) {
  const { user, signInWithGoogle } = useAuth();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const avatarSectionRef = useRef<HTMLDivElement | null>(null);

  const currentAvatar =
    avatars.find((avatar) => avatar.id === selectedAvatar) || avatars[0];

  // Goal options for users to select
  const goalOptions = [
    {
      id: 'sleep',
      emoji: '😴',
      label: 'Sleep Better',
      description: 'Calm racing thoughts at bedtime',
    },
    {
      id: 'stress',
      emoji: '🧘',
      label: 'Stress Less',
      description: 'Build resilience for daily challenges',
    },
    {
      id: 'confidence',
      emoji: '💪',
      label: 'Grow Confidence',
      description: 'Challenge self-doubt and limiting beliefs',
    },
    {
      id: 'anxiety',
      emoji: '🌱',
      label: 'Manage Anxiety',
      description: 'Learn to reframe anxious thoughts',
    },
  ];

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = avatars.map((avatar) => avatar.src);

      const loadPromises = imageUrls.map((url) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
      });

      try {
        await Promise.all(loadPromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  // Auto-rotate highlighted avatar every 8 seconds on onboarding (slower for better UX)
  useEffect(() => {
    const id = setInterval(() => {
      const idx = avatars.findIndex((a) => a.id === (selectedAvatar as any));
      const next = avatars[(idx + 1) % avatars.length]?.id;
      if (next) onAvatarChange(next);
    }, 8000);
    return () => clearInterval(id);
  }, [selectedAvatar, onAvatarChange]);

  return (
    <div className="relative">
      {/* Main Hero Section */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${mindgleamGradients.hero} dark:from-mindgleam-mint-900/20 dark:via-mindgleam-peach-900/20 dark:to-mindgleam-lavender-900/20`}
      >
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/5 dark:to-black/10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-orange-100/30 via-transparent to-transparent dark:from-orange-900/10"></div>

        {/* Content - Rearranged layout */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Main Headline - Moved to top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mb-6"
            >
              {/* Animated Taglines as Main Title */}
              <div className="mb-4">
                <TypewriterTaglines />
              </div>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                CBT-inspired coaching tools that help you feel lighter, faster
              </p>
            </motion.div>

            {/* Brand logo - repositioned after headline with shine animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div
                className={`relative p-4 rounded-full backdrop-blur-sm overflow-hidden bg-gradient-to-br from-pink-50/20 to-purple-50/20 dark:from-pink-900/20 dark:to-purple-900/20`}
              >
                {/* Animated background glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/20 to-transparent animate-pulse`}
                ></div>
                <div className="relative z-10">
                  <MindGleamLogoAnimated width={138} height={215} />
                </div>
              </div>
            </motion.div>

            {/* Primary CTA - Flow in button - moved under logo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6 flex justify-center"
            >
              {!user ? (
                <motion.button
                  onClick={() => onStartDemo?.('flow')}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2 border border-gray-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Flow in</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.button>
              ) : (
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 shadow-md">
                  <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                    Welcome back! 👋
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ready to continue with {currentAvatar?.name || 'AI'}?
                  </p>
                </div>
              )}
            </motion.div>

            {/* Compact Avatar Selection - hidden large avatar for more compact UI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-6"
            >
              {/* Meet section without large avatar */}
              <motion.div
                key={selectedAvatar}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-center mb-4"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Meet {currentAvatar?.name || 'AI'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentAvatar?.description || 'Your AI companion'}
                </p>
              </motion.div>

              {/* Compact Avatar Selection */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-6 px-4"
                ref={avatarSectionRef}
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium text-center">
                  Choose your AI companion:
                </p>
                <div className="flex justify-center gap-2 sm:gap-3 flex-wrap max-w-sm mx-auto">
                  {avatars.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      onClick={() => onAvatarChange(avatar.id)}
                      className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg transition-all duration-300 min-w-[80px] sm:min-w-[90px] flex-1 max-w-[100px] ${
                        selectedAvatar === avatar.id
                          ? 'bg-white/70 dark:bg-gray-800/70 shadow-md scale-105 ring-2 ring-blue-300'
                          : 'bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:scale-102'
                      }`}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${avatar.gradient} p-0.5 ${
                          selectedAvatar === avatar.id
                            ? 'ring-2 ring-white/50'
                            : ''
                        }`}
                      >
                        <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                          {imagesLoaded && (
                            <Image
                              src={avatar.src}
                              alt={avatar.name}
                              width={40}
                              height={40}
                              className="object-contain avatar-image"
                              sizes="40px"
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-xs font-semibold ${
                            selectedAvatar === avatar.id
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {avatar.name}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Indicators - Compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>CBT-inspired coaching</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% private & secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
