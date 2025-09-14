import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BalanceData {
  balance: number;
  moodCheckins: number;
}

interface UseBalanceReturn {
  balance: number | null;
  moodCheckins: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache to prevent unnecessary API calls
const balanceCache = new Map<
  string,
  { data: BalanceData; timestamp: number }
>();
const CACHE_TTL = 60000; // 1 minute cache

export function useBalance(): UseBalanceReturn {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [moodCheckins, setMoodCheckins] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user || authLoading) return;

    const userId = user.id;
    const now = Date.now();

    // Check cache first
    const cached = balanceCache.get(userId);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      setBalance(cached.data.balance);
      setMoodCheckins(cached.data.moodCheckins);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/balance', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      const balanceData: BalanceData = {
        balance: data.balance || 0,
        moodCheckins: data.moodCheckins || 0,
      };

      // Update cache
      balanceCache.set(userId, { data: balanceData, timestamp: now });

      setBalance(balanceData.balance);
      setMoodCheckins(balanceData.moodCheckins);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(errorMessage);

      // Set default values on error
      setBalance(20);
      setMoodCheckins(10);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  const refetch = useCallback(async () => {
    if (user) {
      // Clear cache for this user
      balanceCache.delete(user.id);
      await fetchBalance();
    }
  }, [user, fetchBalance]);

  // Fetch balance when user becomes available
  useEffect(() => {
    if (user && !authLoading && balance === null) {
      fetchBalance();
    }
  }, [user, authLoading, balance, fetchBalance]);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setBalance(null);
      setMoodCheckins(null);
      setError(null);
    }
  }, [user]);

  return {
    balance,
    moodCheckins,
    loading,
    error,
    refetch,
  };
}

// Utility to invalidate cache (useful after purchases)
export function invalidateBalanceCache(userId?: string) {
  if (userId) {
    balanceCache.delete(userId);
  } else {
    balanceCache.clear();
  }
}
