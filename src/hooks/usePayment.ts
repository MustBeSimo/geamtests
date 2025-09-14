'use client';

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/EnhancedAuthProvider';

interface PaymentPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  messages: number;
  moodCheckins: number;
  popular?: boolean;
}

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: '$0',
    description: '20 messages included',
    messages: 20,
    moodCheckins: 10,
    features: [
      'Basic CBT guidance',
      '5 Mood check-ins and reports',
      '3 AI companions',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$4.99',
    description: '200 messages + 60 mood check-ins and reports',
    messages: 200,
    moodCheckins: 60,
    popular: true,
    features: [
      'Advanced CBT-based guidance',
      'Mood trend analysis',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    description: '500 messages + 150 mood check-ins and reports',
    messages: 500,
    moodCheckins: 150,
    features: [
      'Everything in Plus',
      'Advanced analytics',
      'Unlimited access',
    ],
  },
];

export function usePayment() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const purchasePlan = useCallback(
    async (planId: string) => {
      if (!user) {
        setError('Please sign in first to purchase a plan');
        return false;
      }

      if (planId === 'pro') {
        setError('Pro plan is coming soon! Please try the Plus plan for now.');
        return false;
      }

      if (planId === 'free') {
        setError('Free plan is already active');
        return false;
      }

      setIsProcessing((prev) => ({ ...prev, [planId]: true }));
      setError(null);

      try {
        // Create checkout session
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );

        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw stripeError;
        }

        return true;
      } catch (error) {
        console.error('Payment error:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during payment'
        );
        return false;
      } finally {
        setIsProcessing((prev) => ({ ...prev, [planId]: false }));
      }
    },
    [user]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isProcessingPlan = useCallback(
    (planId: string) => isProcessing[planId] || false,
    [isProcessing]
  );

  return {
    plans: PAYMENT_PLANS,
    purchasePlan,
    isProcessingPlan,
    error,
    clearError,
  };
}