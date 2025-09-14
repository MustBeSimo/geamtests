'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { mindgleamGradients } from '@/utils/colors';

interface ProgressBarProps {
  className?: string;
}

interface UserStats {
  balance: number;
  moodCheckins: number;
  streak: number;
  lastMoodLog?: string;
}

export default function ProgressBar({ className = '' }: ProgressBarProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const { user } = useAuth();

  // Fetch user stats
  const fetchStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch balance
      const balanceResponse = await fetch('/api/balance');
      const balanceData = await balanceResponse.json();

      // Calculate mood streak
      const streakCount = await calculateMoodStreak(user.id);

      setStats({
        balance: balanceData.balance || 0,
        moodCheckins: balanceData.moodCheckins || 0,
        streak: streakCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        balance: 0,
        moodCheckins: 0,
        streak: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate mood streak based on consecutive days
  const calculateMoodStreak = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30); // Look at last 30 days

      if (error || !data) return 0;

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < data.length; i++) {
        const logDate = new Date(data[i].created_at);
        logDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating mood streak:', error);
      return 0;
    }
  };

  // Animate when balance or streak changes
  const handleStatsChange = (newStats: UserStats) => {
    const oldStats = stats;
    setStats(newStats);

    // Show animation if stats improved
    if (oldStats && (newStats.balance > oldStats.balance || newStats.streak > oldStats.streak)) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }
  };

  useEffect(() => {
    fetchStats();

    if (!user) return;

    // Subscribe to balance changes
    const channel = supabase
      .channel('progress_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          handleStatsChange({
            balance: payload.new.balance,
            moodCheckins: payload.new.mood_checkins_remaining,
            streak: stats?.streak || 0,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_logs',
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          // Recalculate streak when new mood log is added
          const newStreak = await calculateMoodStreak(user.id);
          if (stats) {
            handleStatsChange({
              ...stats,
              streak: newStreak,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user || isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 ${className}`}
    >
      <div className={`bg-gradient-to-r ${mindgleamGradients.subtle} backdrop-blur-md border-b border-white/20 dark:border-gray-700/50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Left side - Credits */}
            <div className="flex items-center gap-6">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-mindgleam-mint-400 to-mindgleam-mint-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💬</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stats?.balance || 0} messages
                  </p>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <motion.div
                      className="bg-gradient-to-r from-mindgleam-mint-400 to-mindgleam-mint-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats?.balance || 0) / 50 * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-mindgleam-peach-400 to-mindgleam-peach-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stats?.moodCheckins || 0} check-ins
                  </p>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <motion.div
                      className="bg-gradient-to-r from-mindgleam-peach-400 to-mindgleam-peach-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stats?.moodCheckins || 0) / 20 * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Streak */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="relative"
                  animate={showAnimation ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-mindgleam-lavender-400 to-mindgleam-lavender-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🔥</span>
                  </div>
                  <AnimatePresence>
                    {showAnimation && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-mindgleam-gold-400 to-mindgleam-gold-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">+1</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stats?.streak || 0} day streak
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.streak === 0 ? 'Start your streak!' : 'Keep it going!'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              exit={{ scale: 0, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 