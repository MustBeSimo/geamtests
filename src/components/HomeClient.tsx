'use client';

import React, { useState, useEffect, Suspense } from 'react';
import SimpleCard from '@/components/SimpleCard';
import SocialLinks from '@/components/SocialLinks';
import ContactCard from '@/components/ContactCard';
import TypewriterText from '@/components/TypewriterText';
import FAQCard from '@/components/FAQCard';
import Hero from '@/components/Hero';
import DemoChat from '@/components/DemoChat';
import Footer from '@/components/Footer';
import ProfileSettings from '@/components/ProfileSettings';
import ThemeToggle from '@/components/ThemeToggle';
const GuideCard = React.lazy(() => import('@/components/GuideCard'));
const ChatCard = React.lazy(() => import('@/components/ChatCard'));
const WeatherHoroscopeCard = React.lazy(() => import('@/components/WeatherHoroscopeCard'));
const MoodCheckinCard = React.lazy(() => import('@/components/MoodCheckinCard'));
const UpsellBanner = React.lazy(() => import('@/components/UpsellBanner'));
import { fetchSocialLinks } from '@/utils/clientSocialLinks';
import { SocialLink } from '@/utils/socialLinks';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile } from '@/types/database';
import { motion } from 'framer-motion';
import BreathingMiniApp from '@/components/BreathingMiniApp';
import { GeneralDisclaimer, CrisisBanner } from '@/components/ComplianceDisclaimer';
import TrustBadges from '@/components/TrustBadges';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import ReferralProgram from '@/components/ReferralProgram';
import FeatureCard from '@/components/FeatureCard';

export default function HomeClient() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [buyingPlus, setBuyingPlus] = useState(false);
  const [buyingPro, setBuyingPro] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'gigi' | 'vee' | 'lumo'>('gigi');
  const [isDemoChatOpen, setIsDemoChatOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);

  // Avatar configuration
  const avatars = [
    {
      id: 'gigi' as const,
      name: 'Gigi',
      description: 'Your holistic AI wellness companion',
      src: '/images/avatars/Gigi_avatar.png',
      gradient: 'from-pink-200 to-purple-200'
    },
    {
      id: 'vee' as const,
      name: 'Vee',
      description: 'Your evidence-based AI wellness coach',
      src: '/images/avatars/Vee_avatar.png',
      gradient: 'from-blue-200 to-cyan-200'
    },
    {
      id: 'lumo' as const,
      name: 'Lumo',
      description: 'Your AI creative movement & wellness guide',
      src: '/images/avatars/Lumo_avatar.png',
      gradient: 'from-teal-200 to-emerald-200'
    }
  ];

  const currentAvatar = avatars.find(avatar => avatar.id === selectedAvatar) || avatars[0];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Handle auth code and clean URL
    const code = searchParams.get('code');
    if (code) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('code');
      window.history.replaceState({}, '', newUrl.toString());
    }

    // Handle successful purchase
    const success = searchParams.get('success');
    if (success === 'true') {
      setSuccessMessage('🎉 Payment successful! Your messages and mood check-ins have been added to your account.');
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('success');
      window.history.replaceState({}, '', newUrl.toString());
      if (user) {
        setTimeout(() => {
          fetchUserBalance();
        }, 1000);
      }
    }

    // Handle cancelled purchase
    const cancelled = searchParams.get('canceled');
    if (cancelled === 'true') {
      setSuccessMessage('❌ Purchase was cancelled. No charges were made.');
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('canceled');
      window.history.replaceState({}, '', newUrl.toString());
    }

    // Handle authentication errors
    const authError = searchParams.get('error');
    if (authError === 'auth_error') {
      setSuccessMessage('❌ Sign in failed. Please try again.');
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.toString());
    }

    // Set chat visible when user is signed in
    if (user) {
      setIsChatVisible(true);
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [searchParams, user, isClient]);

  // Function to fetch user balance
  const fetchUserBalance = async () => {
    if (!user) return;
    setBalanceLoading(true);
    try {
      const response = await fetch('/api/balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch balance when user is available
  useEffect(() => {
    if (user) {
      fetchUserBalance();
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: Profile | null }) => setUserProfile(data));
    }
  }, [user]);

  useEffect(() => {
    // Fetch social links
    const loadSocialLinks = async () => {
      const links = await fetchSocialLinks();
      setSocialLinks(links);
    };
    loadSocialLinks();
  }, []);

  const handleBuyPlus = async () => {
    if (!user) {
      alert('Please sign in first to purchase the Plus plan. Click the "Sign In" button at the top right.');
      return;
    }
    setBuyingPlus(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Something went wrong with the payment. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setBuyingPlus(false);
    }
  };

  const handleBuyPro = async () => {
    alert('Pro plan is coming soon! Please try the Plus plan for now.');
  };

  const handleStartDemo = (goal?: string) => {
    if (typeof window !== 'undefined') {
      const demoData = localStorage.getItem('mindgleam_demo_chat');
      const parsedData = demoData ? JSON.parse(demoData) : { count: 0, lastUsed: null };
      if (parsedData.count >= 3) {
        alert("You've used your 3 free demo messages! Sign in to get 20 free messages and continue your wellness journey.");
        signInWithGoogle();
        return;
      }
    }
    if (!user) {
      setIsDemoChatOpen(true);
    } else {
      setIsChatVisible(true);
    }
    if (goal) {
      localStorage.setItem('selectedGoal', goal);
    }
  };

  const getAvatarColorScheme = (avatarId: string) => {
    switch (avatarId) {
      case 'gigi':
        return {
          gradient: 'from-pink-400 to-purple-400',
          primaryColor: 'pink',
          accentColor: 'purple',
          bgPrimary: 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40',
          borderColor: 'border-pink-400 dark:border-pink-500',
          textColor: 'text-pink-800 dark:text-pink-200',
          buttonColor: 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
        };
      case 'vee':
        return {
          gradient: 'from-blue-400 to-cyan-400',
          primaryColor: 'blue',
          accentColor: 'cyan',
          bgPrimary: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40',
          borderColor: 'border-blue-400 dark:border-blue-500',
          textColor: 'text-blue-800 dark:text-blue-200',
          buttonColor: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
        };
      case 'lumo':
        return {
          gradient: 'from-teal-400 to-emerald-400',
          primaryColor: 'teal',
          accentColor: 'emerald',
          bgPrimary: 'bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40',
          borderColor: 'border-teal-400 dark:border-teal-500',
          textColor: 'text-teal-800 dark:text-teal-200',
          buttonColor: 'from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
        };
      default:
        return {
          gradient: 'from-pink-400 to-purple-400',
          primaryColor: 'pink',
          accentColor: 'purple',
          bgPrimary: 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40',
          borderColor: 'border-pink-400 dark:border-pink-500',
          textColor: 'text-pink-800 dark:text-pink-200',
          buttonColor: 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
        };
    }
  };

  const colorScheme = getAvatarColorScheme(selectedAvatar);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'true') {
      setShowSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[rgb(250,245,235)] dark:bg-gray-900">
      {/* Sidebar for Weather/Horoscope - Mobile Optimized */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weather & Horoscope</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="pb-4">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>}>
              <WeatherHoroscopeCard />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header Navigation */}
      <header className="relative z-20 w-full">
        <div className="container mx-auto px-4 pb-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mind Gleam</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                title="Weather & Horoscope"
                aria-label="Open weather and horoscope"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.002 4.002 0 003 15z" />
                </svg>
              </button>
              {loading ? (
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  {balance !== null && (
                    <div className="px-3 py-1.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                      {balance} credits
                    </div>
                  )}
                  <button
                    onClick={() => setShowProfileSettings(true)}
                    className="p-2.5 bg-white/70 dark:bg-gray-800/70 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                    title="Profile Settings"
                    aria-label="Open profile settings"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
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
      <div className="relative z-10">
        <div className="container mx-auto px-4 pb-8 max-w-7xl">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-600 rounded-lg">
              <p className="text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          )}

          {/* Hero */}
          <section className="mb-12 lg:mb-16">
            <Hero
              onStartDemo={handleStartDemo}
              selectedAvatar={selectedAvatar}
              onAvatarChange={setSelectedAvatar}
            />
          </section>

          {/* Trust Badges */}
          <TrustBadges />

          {/* Compliance Disclaimer */}
          <section className="mb-8">
            <GeneralDisclaimer compact className="max-w-4xl mx-auto" />
          </section>

          {/* Feature Cards - MindAir, MindGuide, VibeCheck */}
          <section className="mb-6 lg:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                title="MindAir" 
                color="pink" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h10M4 8h13M6 16h11"/></svg>}
              >
                <BreathingMiniApp selectedAvatar={selectedAvatar} />
              </FeatureCard>
              
              <FeatureCard 
                title="MindGuide" 
                color="blue" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h13a3 3 0 013 3v9H7a3 3 0 01-3-3V6z"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 6v12"/></svg>}
              >
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <GuideCard />
                </Suspense>
              </FeatureCard>
              
              <FeatureCard 
                title="VibeCheck" 
                color="purple" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="10" r="5"/><path d="M6 20h12"/></svg>}
              >
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <MoodCheckinCard />
                </Suspense>
              </FeatureCard>
            </div>
          </section>

          {/* Upsells */}
          <UpsellBanner trigger="low-balance" balance={balance || 0} onUpgrade={() => handleBuyPlus()} />
          {!user && (
            <UpsellBanner trigger="feature-locked" onUpgrade={() => signInWithGoogle()} />
          )}

          {/* Chat Section */}
          {isChatVisible && (
            <section className="mb-12 lg:mb-16">
              <div className={`bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg border-2 ${getAvatarColorScheme(selectedAvatar).borderColor}`}>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColorScheme(selectedAvatar).gradient} p-1`}>
                    <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                      <Image src={currentAvatar.src} alt={currentAvatar.name} width={48} height={48} className="object-contain avatar-image" sizes="48px" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold ${getAvatarColorScheme(selectedAvatar).textColor}`}>Chat with {currentAvatar.name}</h2>
                </div>
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>}>
                  <ChatCard user={user || undefined} balance={balance} selectedAvatar={currentAvatar} />
                </Suspense>
              </div>
            </section>
          )}

          {/* Mood Check-in expandable section removed in favor of compact VibeCheck card above */}

          {/* Guides full-width section removed; included in MindGuide card */}

          {/* Pricing */}
          <section className="mb-12 lg:mb-16">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Choose Your Plan</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600 h-fit">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free Trial</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$0</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">20 messages included</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>Basic CBT guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>5 Mood check-ins and reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>3 AI companions</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-600 relative h-fit">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">Most Popular</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plus</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$4.99</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">200 messages + 60 mood check-ins and reports</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Advanced CBT-based guidance</span></li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Mood trend analysis</span></li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Priority support</span></li>
                  </ul>
                  <div className="mt-4">
                    <button onClick={handleBuyPlus} disabled={buyingPlus} className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${buyingPlus ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg hover:shadow-xl'}`}>{buyingPlus ? 'Processing...' : 'Get Plus'}</button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600 h-fit">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">$9.99</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">500 messages + 150 mood check-ins and reports</p>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Everything in Plus</span></li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Advanced analytics</span></li>
                    <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>Unlimited access</span></li>
                  </ul>
                  <div className="mt-4">
                    <button onClick={handleBuyPro} disabled className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-gray-400 cursor-not-allowed text-white`}>Coming Soon</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Referral Program - Only show for signed-in users */}
          {user && (
            <section className="mb-12 lg:mb-16">
              <div className="max-w-2xl mx-auto">
                <ReferralProgram />
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-12 lg:mb-16">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <CrisisBanner />
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg"></div>}>
                  <FAQCard />
                </Suspense>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </div>

        {/* Modals */}
        <DemoChat isOpen={isDemoChatOpen} onClose={() => setIsDemoChatOpen(false)} selectedAvatar={selectedAvatar} />
        <ProfileSettings isOpen={showProfileSettings} onClose={() => setShowProfileSettings(false)} />
        <ExitIntentPopup />
      </div>
    </main>
  );
}


