'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface ExitIntentPopupProps {
  onClose?: () => void;
  onSignUp?: () => void;
}

export default function ExitIntentPopup({ onClose, onSignUp }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  useEffect(() => {
    // Don't show if user is already signed in
    if (user) return;

    // Don't show if already shown in this session
    const hasShownToday = sessionStorage.getItem('exit-intent-shown');
    if (hasShownToday) return;

    let mouseLeaveTimer: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !hasShown) {
        mouseLeaveTimer = setTimeout(() => {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exit-intent-shown', 'true');
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };
  }, [user, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleSignUp = async () => {
    try {
      await signInWithGoogle();
      setIsVisible(false);
      onSignUp?.();
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  if (!isVisible || user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Wait! Don't leave yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get 20 free AI wellness messages to start your mental health journey today
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                20 free messages with AI companions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                5 mood check-ins with personalized reports
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                No credit card required
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Free Access Now
            </button>
            
            <button
              onClick={handleClose}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm py-2 transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Trust indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Your privacy is protected. No spam, unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
