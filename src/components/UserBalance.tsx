'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import LoadingSpinner, { SkeletonCard } from '@/components/LoadingSpinner';

export default function UserBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [moodCheckins, setMoodCheckins] = useState<number | null>(null);
  const [voiceTimeRemaining, setVoiceTimeRemaining] = useState<number | null>(
    null
  );
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchBalance = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/balance');
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setMoodCheckins(data.moodCheckins);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }

    // Also fetch voice time from database
    const { data, error } = await supabase
      .from('user_balances')
      .select('voice_time_remaining')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setVoiceTimeRemaining(data.voice_time_remaining);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    } else {
      setIsLoading(false);
    }

    // Subscribe to balance changes only if user exists
    if (!user) return;

    const channel = supabase
      .channel('balance_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBalance(payload.new.balance);
          setMoodCheckins(payload.new.mood_checkins_remaining);
          setVoiceTimeRemaining(payload.new.voice_time_remaining);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-24 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-8 w-16"></div>
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-24 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-8 w-16"></div>
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-24 mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-8 w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || balance === null) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg">
      <div className="flex flex-col gap-4">
        {/* Text Chat Balance */}
        <div>
          <h3 className="text-sm text-gray-400 mb-1">Text Chat Credits</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{balance}</span>
            <span className="text-sm text-gray-400">messages remaining</span>
          </div>
        </div>

        {/* Mood Check-ins Balance */}
        <div>
          <h3 className="text-sm text-gray-400 mb-1">Mood Check-ins</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{moodCheckins ?? 0}</span>
            <span className="text-sm text-gray-400">check-ins remaining</span>
          </div>
        </div>

        {/* Voice Chat Balance */}
        <div>
          <h3 className="text-sm text-gray-400 mb-1">Voice Chat Trial</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {voiceTimeRemaining !== null
                ? `${Math.floor(voiceTimeRemaining / 60)}:${String(voiceTimeRemaining % 60).padStart(2, '0')}`
                : '5:00'}
            </span>
            <span className="text-sm text-gray-400">minutes remaining</span>
          </div>
          <button
            onClick={() => setIsVoiceChatOpen(true)}
            className="mt-2 w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-lg transition-colors hover:from-pink-500 hover:to-purple-500"
          >
            Start Voice Chat
          </button>
        </div>

        {(balance === 0 || (moodCheckins ?? 0) === 0) && (
          <Link
            href="/subscribe"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm text-center"
          >
            Get More Credits
          </Link>
        )}
      </div>

      {/* Voice Chat Widget Modal */}
      {isVoiceChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Voice Chat with Gigi</h2>
              <button
                onClick={() => setIsVoiceChatOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
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
            </div>
            <div className="p-4">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold mb-2">
                  Voice Chat Coming Soon!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We're working on bringing you an amazing voice chat experience
                  with Gigi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
