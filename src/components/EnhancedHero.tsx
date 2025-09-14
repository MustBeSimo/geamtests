'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/EnhancedAuthProvider';
import { useChat } from '@/contexts/ChatProvider';
import { useAvatarSelection } from '@/hooks/useAvatarSelection';

interface EnhancedHeroProps {
  onStartDemo: (goal?: string) => void;
}

const QUICK_START_PROMPTS = [
  {
    id: 'stress',
    text: "I'm feeling stressed today",
    emoji: '😰',
    category: 'mood',
  },
  {
    id: 'breathing',
    text: 'Help me with breathing exercises',
    emoji: '🌬️',
    category: 'wellness',
  },
  {
    id: 'meditation',
    text: 'Guide me through meditation',
    emoji: '🧘‍♀️',
    category: 'mindfulness',
  },
  {
    id: 'sleep',
    text: 'I need help sleeping better',
    emoji: '😴',
    category: 'wellness',
  },
];

export default function EnhancedHero({ onStartDemo }: EnhancedHeroProps) {
  const { user, signInWithGoogle } = useAuth();
  const {
    startDemoMode,
    setVisible: setChatVisible,
    selectedAvatar,
  } = useChat();
  const { avatars, currentAvatar, selectAvatar } =
    useAvatarSelection(selectedAvatar);

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  const handleQuickStart = useCallback(
    (prompt: string) => {
      setSelectedPrompt(prompt);
      onStartDemo(prompt);
    },
    [onStartDemo]
  );

  const handleAvatarSelect = useCallback(
    (avatarId: 'gigi' | 'vee' | 'lumo') => {
      selectAvatar(avatarId);
      setShowAvatarSelection(false);
    },
    [selectAvatar]
  );

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 rounded-3xl p-8 lg:p-12 shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your AI Wellness
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {' '}
                  Companion
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Experience personalized mental health support with our three
              specialized AI companions. Get instant help with stress, anxiety,
              meditation, and wellness guidance.
            </motion.p>

            {/* Avatar Selection */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Choose your companion:
                </span>
                <button
                  onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  See all
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`relative group ${
                      currentAvatar?.id === avatar.id
                        ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                        : 'hover:ring-2 hover:ring-blue-300'
                    } rounded-full transition-all duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                      <Image
                        src={avatar.src}
                        alt={avatar.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {showAvatarSelection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm"
                  >
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentAvatar?.id === avatar.id
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
                        }`}
                        onClick={() => handleAvatarSelect(avatar.id)}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {avatar.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {avatar.description}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Quick Start Buttons */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                Quick Start Options:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_START_PROMPTS.map((prompt) => (
                  <motion.button
                    key={prompt.id}
                    onClick={() => handleQuickStart(prompt.text)}
                    className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{prompt.emoji}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {prompt.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              {user ? (
                <motion.button
                  onClick={() => setChatVisible(true)}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Chatting with {currentAvatar?.name || 'AI'}
                </motion.button>
              ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                  <motion.button
                    onClick={() => onStartDemo()}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Free Demo (3 messages)
                  </motion.button>
                  <motion.button
                    onClick={signInWithGoogle}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In for 20 Free Messages
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Content - Avatar Showcase */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative w-80 h-80 mx-auto">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900/40 dark:via-purple-900/40 dark:to-blue-900/40 rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src={
                    currentAvatar?.src || '/images/avatars/gigi-avatar-logo.png'
                  }
                  alt={currentAvatar?.name || 'AI Avatar'}
                  width={280}
                  height={280}
                  className="object-contain"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💭
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center text-xl shadow-lg"
                animate={{
                  x: [-5, 5, -5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
