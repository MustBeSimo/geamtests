'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Profile, Subscription } from '@/types/database';

export function useSubscription(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadSubscriptionData() {
      try {
        // Get profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // Get subscription
        const { data: subscription, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          throw subscriptionError;
        }

        setProfile(profile);
        setSubscription(subscription);
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptionData();
  }, [userId]);

  const isSubscriptionActive = Boolean(
    subscription?.status === 'active' &&
      subscription?.current_period_end &&
      new Date(subscription.current_period_end) > new Date()
  );

  return {
    loading,
    profile,
    subscription,
    isSubscriptionActive,
  };
}
