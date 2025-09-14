'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/utils/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

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

      // Only initialize profile and balance for new users on fresh sign in
      if (event === 'SIGNED_IN' && session?.user) {
        // Keep loading true while initializing user data
        setLoading(true);
        await initializeUserData(session.user);
        setLoading(false);
      } else {
        // For other events (like existing sessions), set loading to false
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const initializeUserData = async (user: User) => {
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
            balance: 20, // Give 20 free messages to new users
            mood_checkins_remaining: 10, // Give 10 free mood check-ins
            updated_at: new Date().toISOString(),
          });

        if (balanceError) {
          console.error('Error initializing balance:', balanceError);
        }
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      // Don't throw - let the user continue even if initialization fails
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
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
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Reset user state immediately for better UX
      setUser(null);
      setSession(null);

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
        // Don't throw here - continue with logout process
      }

      // Force reload to ensure all state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, reset the state and redirect
      setUser(null);
      setSession(null);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
