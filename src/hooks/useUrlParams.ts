'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

interface UrlParamsState {
  success: boolean;
  cancelled: boolean;
  authError: boolean;
  hasAuthCode: boolean;
}

export function useUrlParams() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<UrlParamsState>({
    success: false,
    cancelled: false,
    authError: false,
    hasAuthCode: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cleanUrl = useCallback((params: string[]) => {
    if (typeof window === 'undefined') return;

    const newUrl = new URL(window.location.href);
    params.forEach((param) => {
      newUrl.searchParams.delete(param);
    });
    window.history.replaceState({}, '', newUrl.toString());
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  useEffect(() => {
    const code = searchParams.get('code');
    const success = searchParams.get('success') === 'true';
    const cancelled = searchParams.get('canceled') === 'true';
    const authError = searchParams.get('error') === 'auth_error';

    setState({
      success,
      cancelled,
      authError,
      hasAuthCode: Boolean(code),
    });

    // Handle success message
    if (success) {
      setSuccessMessage(
        '🎉 Payment successful! Your messages and mood check-ins have been added to your account.'
      );
      cleanUrl(['success']);
    } else if (cancelled) {
      setSuccessMessage('❌ Purchase was cancelled. No charges were made.');
      cleanUrl(['canceled']);
    } else if (authError) {
      setSuccessMessage('❌ Sign in failed. Please try again.');
      cleanUrl(['error']);
    }

    // Clean auth code from URL
    if (code) {
      cleanUrl(['code']);
    }
  }, [searchParams, cleanUrl]);

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return () => {}; // Empty cleanup for when successMessage is null
  }, [successMessage]);

  return {
    ...state,
    successMessage,
    clearSuccessMessage,
  };
}
