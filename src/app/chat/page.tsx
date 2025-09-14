'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { ChatErrorBoundary } from '@/components/ErrorBoundary';

export default function ChatPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <main className="container mx-auto min-h-screen p-4 flex items-center justify-center">
        <div className="animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 p-8 text-center">
          Loading...
        </div>
      </main>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <main className="container mx-auto min-h-screen p-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-6">Sign In Required</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You need to be signed in to access the voice chat feature.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  // Authenticated user
  return (
    <main className="container mx-auto min-h-screen p-4 flex items-start justify-center">
      <ChatErrorBoundary>
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Chat with Gigi
          </h1>
        </div>
      </ChatErrorBoundary>
    </main>
  );
}
