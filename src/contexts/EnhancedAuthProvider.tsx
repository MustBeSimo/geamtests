'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { supabase } from '@/utils/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

interface UserBalance {
  balance: number;
  mood_checkins_remaining: number;
  updated_at: string;
}

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  balance: UserBalance | null;
  loading: boolean;
  balanceLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(
  undefined
);

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  const fetchUserBalance = useCallback(async (userId: string) => {
    try {
      setBalanceLoading(true);
      const { data, error } = await supabase
        .from('user_balances')
        .select('balance, mood_checkins_remaining, updated_at')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const balanceData = data
        ? {
            balance: data.balance || 0,
            mood_checkins_remaining: data.mood_checkins_remaining || 0,
            updated_at: data.updated_at,
          }
        : null;

      setBalance(balanceData);
      return balanceData;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const initializeUserData = useCallback(
    async (user: User) => {
      try {
        // Initialize user profile
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (profileError) {
          console.error('Error creating/updating profile:', profileError);
        }

        // Initialize balance if needed (only for new users)
        const { data: existingBalance } = await supabase
          .from('user_balances')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (!existingBalance) {
          const { error: balanceError } = await supabase
            .from('user_balances')
            .insert({
              user_id: user.id,
              balance: 20,
              mood_checkins_remaining: 10,
              updated_at: new Date().toISOString(),
            });

          if (balanceError) {
            console.error('Error initializing balance:', balanceError);
          }
        }

        // Fetch the user data
        await Promise.all([
          fetchUserProfile(user.id),
          fetchUserBalance(user.id),
        ]);
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    },
    [fetchUserProfile, fetchUserBalance]
  );

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthContext: Session error:', error);
          throw error;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          await Promise.all([
            fetchUserProfile(session.user.id),
            fetchUserBalance(session.user.id),
          ]);
        }
      } catch (error) {
        console.error('Error in auth:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        await initializeUserData(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setBalance(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, fetchUserBalance, initializeUserData]);

  // Set up real-time subscriptions for balance updates
  useEffect(() => {
    if (!user) return;

    const balanceSubscription = supabase
      .channel(`balance_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const newBalance = payload.new as any;
            setBalance({
              balance: newBalance.balance || 0,
              mood_checkins_remaining: newBalance.mood_checkins_remaining || 0,
              updated_at: newBalance.updated_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(balanceSubscription);
    };
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      // Reset user state immediately for better UX
      setUser(null);
      setSession(null);
      setProfile(null);
      setBalance(null);

      // Call the server-side API to clear cookies properly
      try {
        await fetch('/api/auth/signout', { method: 'POST' });
      } catch (serverError) {
        console.warn(
          'Server-side sign out failed, continuing with client-side:',
          serverError
        );
      }

      // Then sign out on the client side
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Client-side sign out error:', error);
      }

      // Force reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
      setSession(null);
      setProfile(null);
      setBalance(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!user) return;
    await fetchUserBalance(user.id);
  }, [user, fetchUserBalance]);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) throw error;

        // Update local state
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      balance,
      loading,
      balanceLoading,
      signInWithGoogle,
      signOut,
      refreshBalance,
      updateProfile,
    }),
    [
      user,
      session,
      profile,
      balance,
      loading,
      balanceLoading,
      signInWithGoogle,
      signOut,
      refreshBalance,
      updateProfile,
    ]
  );

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an EnhancedAuthProvider');
  }
  return context;
}
