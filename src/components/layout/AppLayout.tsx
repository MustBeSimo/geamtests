'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthProvider';
import { useChat } from '@/contexts/ChatProvider';
import ThemeToggle from '@/components/ThemeToggle';
import ProfileSettings from '@/components/ProfileSettings';
import WeatherHoroscopeCard from '@/components/WeatherHoroscopeCard';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, balance, signInWithGoogle } = useAuth();
  const { selectedAvatar, setSelectedAvatar } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleSignIn = useCallback(() => {
    signInWithGoogle();
  }, [signInWithGoogle]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const openProfileSettings = useCallback(() => {
    setShowProfileSettings(true);
  }, []);

  const closeProfileSettings = useCallback(() => {
    setShowProfileSettings(false);
  }, []);

  const balanceDisplay = useMemo(() => {
    if (balance === null) return null;
    return `${balance.balance} credits`;
  }, [balance]);

  return (
    <div className="relative min-h-screen w-full bg-[rgb(250,245,235)] dark:bg-gray-900">
      {/* Sidebar for Weather/Horoscope - Mobile Optimized */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weather & Horoscope
            </h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
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
          <div className="pb-4">
            <React.Suspense
              fallback={
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
              }
            >
              <WeatherHoroscopeCard />
            </React.Suspense>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Header Navigation */}
      <header className="relative z-20 w-full">
        <div className="container mx-auto px-4 pb-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Mind Gleam
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Weather/Horoscope Button */}
              <button
                onClick={toggleSidebar}
                className="p-2.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                title="Weather & Horoscope"
                aria-label="Open weather and horoscope"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z"
                  />
                </svg>
              </button>

              {/* User Section */}
              {loading ? (
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  {/* Balance Display */}
                  {balanceDisplay && (
                    <div className="px-3 py-1.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                      {balanceDisplay}
                    </div>
                  )}

                  {/* Profile Button */}
                  <button
                    onClick={openProfileSettings}
                    className="p-2.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                    title="Profile Settings"
                    aria-label="Open profile settings"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Profile Settings Modal */}
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={closeProfileSettings}
      />
    </div>
  );
}
