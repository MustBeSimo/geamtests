'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface UpsellBannerProps {
  trigger: 'low-balance' | 'streak-complete' | 'mood-chain' | 'feature-locked';
  balance?: number;
  streak?: number;
  onDismiss?: () => void;
  onUpgrade?: () => void;
}

const upsellContent = {
  'low-balance': {
    icon: '⚡',
    title: 'Running low on messages?',
    description:
      'Power users average 120 messages/week. Keep your momentum going!',
    cta: 'Get 200 Messages - $4.99',
    color: 'orange',
  },
  'streak-complete': {
    icon: '🎉',
    title: 'Amazing streak!',
    description:
      'Keep the momentum alive with unlimited messages and advanced tracking.',
    cta: 'Upgrade to Keep Streak',
    color: 'emerald',
  },
  'mood-chain': {
    icon: '📊',
    title: 'Great progress!',
    description: 'Unlock weekly mood trends and deeper insights with Plus.',
    cta: 'See Trend Analysis',
    color: 'blue',
  },
  'feature-locked': {
    icon: '🔓',
    title: 'Unlock advanced features',
    description:
      'Get personalized insights, unlimited messages, and priority support.',
    cta: 'Upgrade Now',
    color: 'purple',
  },
};

export default function UpsellBanner({
  trigger,
  balance,
  streak,
  onDismiss,
  onUpgrade,
}: UpsellBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  const content = upsellContent[trigger];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return () => {};

    // Check if this upsell was already dismissed today
    const dismissKey = `upsell_dismissed_${trigger}_${new Date().toDateString()}`;
    const wasDismissed = localStorage.getItem(dismissKey) === 'true';

    if (wasDismissed) {
      setIsDismissed(true);
      return () => {};
    }

    // Show upsell based on trigger conditions
    let shouldShow = false;

    switch (trigger) {
      case 'low-balance':
        shouldShow =
          !!user && balance !== undefined && balance <= 10 && balance > 0;
        break;
      case 'streak-complete':
        shouldShow = !!user && streak !== undefined && streak >= 3;
        break;
      case 'mood-chain':
        const moodCheckCount = isClient
          ? parseInt(localStorage.getItem('mood_check_count') || '0')
          : 0;
        shouldShow = !!user && moodCheckCount >= 3;
        break;
      case 'feature-locked':
        shouldShow = !user; // Show for non-authenticated users
        break;
    }

    if (shouldShow) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    return () => {}; // Empty cleanup for when shouldShow is false
  }, [trigger, balance, streak, user, isClient]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);

    // Remember dismissal for today
    if (isClient) {
      const dismissKey = `upsell_dismissed_${trigger}_${new Date().toDateString()}`;
      localStorage.setItem(dismissKey, 'true');
    }

    onDismiss?.();
  };

  const handleUpgrade = () => {
    // Track conversion attempt
    if (isClient) {
      const eventData = {
        trigger,
        balance,
        streak,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('upsell_click', JSON.stringify(eventData));
    }

    onUpgrade?.();
  };

  if (!isVisible || isDismissed) return null;

  const colorClasses = {
    orange: {
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-600',
      button: 'bg-orange-500 hover:bg-orange-600',
      text: 'text-orange-900 dark:text-orange-100',
    },
    emerald: {
      bg: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      border: 'border-emerald-200 dark:border-emerald-600',
      button: 'bg-emerald-500 hover:bg-emerald-600',
      text: 'text-emerald-900 dark:text-emerald-100',
    },
    blue: {
      bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-200 dark:border-blue-600',
      button: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-900 dark:text-blue-100',
    },
    purple: {
      bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-200 dark:border-purple-600',
      button: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-900 dark:text-purple-100',
    },
  };

  const colors = colorClasses[content.color as keyof typeof colorClasses];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-xl p-4 shadow-lg mb-4`}
      >
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center gap-4 pr-6">
          {/* Icon */}
          <div className="text-2xl shrink-0">{content.icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${colors.text} text-sm sm:text-base`}>
              {content.title}
            </h3>
            <p className={`${colors.text} opacity-80 text-xs sm:text-sm mt-1`}>
              {content.description}
            </p>

            {/* Additional context based on trigger */}
            {trigger === 'low-balance' && balance !== undefined && (
              <p className={`${colors.text} opacity-60 text-xs mt-1`}>
                {balance} message{balance !== 1 ? 's' : ''} remaining
              </p>
            )}

            {trigger === 'streak-complete' && streak !== undefined && (
              <p className={`${colors.text} opacity-60 text-xs mt-1`}>
                {streak} day streak completed!
              </p>
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handleUpgrade}
            className={`${colors.button} text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shrink-0`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {content.cta}
          </motion.button>
        </div>

        {/* Progress indicator for low balance */}
        {trigger === 'low-balance' && balance !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  balance <= 5
                    ? 'bg-red-400'
                    : balance <= 10
                      ? 'bg-orange-400'
                      : 'bg-green-400'
                }`}
                style={{ width: `${Math.max((balance / 50) * 100, 5)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
              {balance > 10
                ? 'Good balance'
                : balance > 5
                  ? 'Low balance'
                  : 'Very low balance'}
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
