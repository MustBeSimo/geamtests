'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthProvider';
import { useChat } from '@/contexts/ChatProvider';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useAvatarSelection } from '@/hooks/useAvatarSelection';

// Section components
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ChatSection from '@/components/sections/ChatSection';
import PricingSection from '@/components/sections/PricingSection';

// Other components
import TrustBadges from '@/components/TrustBadges';
import { GeneralDisclaimer } from '@/components/ComplianceDisclaimer';
import Footer from '@/components/Footer';
import DemoChat from '@/components/DemoChat';
import ReferralProgram from '@/components/ReferralProgram';
import ExitIntentPopup from '@/components/ExitIntentPopup';

const UpsellBanner = React.lazy(() => import('@/components/UpsellBanner'));
const FAQCard = React.lazy(() => import('@/components/FAQCard'));

export default function HomeClientRefactored() {
  const { user, signInWithGoogle } = useAuth();
  const {
    isVisible: isChatVisible,
    setVisible: setChatVisible,
    startDemoMode,
    selectedAvatar
  } = useChat();
  const { successMessage, clearSuccessMessage } = useUrlParams();
  const { selectedAvatarId } = useAvatarSelection();

  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false);

  // Set chat visible when user is signed in
  useEffect(() => {
    if (user) {
      setChatVisible(true);
    }
  }, [user, setChatVisible]);

  const handleStartDemo = useCallback((goal?: string) => {
    if (!user) {
      startDemoMode();
      if (goal) {
        localStorage.setItem('selectedGoal', goal);
      }
    } else {
      setChatVisible(true);
      if (goal) {
        localStorage.setItem('selectedGoal', goal);
      }
    }
  }, [user, startDemoMode, setChatVisible]);

  return (
    <main className="relative min-h-screen w-full">
      <div className="container mx-auto px-4 pb-8 max-w-7xl">

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-600 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-green-800 dark:text-green-200">{successMessage}</p>
              <button
                onClick={clearSuccessMessage}
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection onStartDemo={handleStartDemo} />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Compliance Disclaimer */}
        <section className="mb-8">
          <GeneralDisclaimer compact className="max-w-4xl mx-auto" />
        </section>

        {/* Feature Cards */}
        <FeaturesSection />

        {/* Upsells */}
        <Suspense fallback={null}>
          <UpsellBanner
            trigger="low-balance"
            balance={0}
            onUpgrade={() => {}}
          />
          {!user && (
            <UpsellBanner
              trigger="feature-locked"
              onUpgrade={signInWithGoogle}
            />
          )}
        </Suspense>

        {/* Chat Section */}
        <ChatSection isVisible={isChatVisible} />

        {/* Pricing Section */}
        <PricingSection />

        {/* Referral Program - Only for signed-in users */}
        {user && (
          <section className="mb-12 lg:mb-16">
            <div className="max-w-2xl mx-auto">
              <ReferralProgram />
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-12 lg:mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <Suspense
                fallback={
                  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>
                }
              >
                <FAQCard />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <DemoChat
        isOpen={isDemoChatOpen}
        onClose={() => setIsDemoChatOpen(false)}
        selectedAvatar={selectedAvatarId}
      />
      <ExitIntentPopup />
    </main>
  );
}