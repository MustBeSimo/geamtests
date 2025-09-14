'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function ReferralProgram() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Generate a simple referral code based on user ID
      const code = `MINDGLEAM${user.id.slice(-6).toUpperCase()}`;
      setReferralCode(code);
    }
  }, [user]);

  const generateReferralLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}?ref=${referralCode}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Try MindGleam - AI Mental Wellness App');
    const body = encodeURIComponent(
      `Hi! I've been using MindGleam for my mental wellness and thought you might find it helpful too. It's an AI-powered app with free CBT guidance and mood tracking.\n\nTry it here: ${generateReferralLink()}\n\nYou'll get 20 free messages to start with. Hope it helps!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Check out MindGleam - an AI mental wellness app I've been using. Get 20 free messages: ${generateReferralLink()}`
    );
    window.open(`sms:?body=${message}`);
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
      <div className="text-center mb-6">
        <div className="text-3xl mb-3">🎁</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Share MindGleam with Friends
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Help others discover AI-powered mental wellness. Share your experience!
        </p>
      </div>

      <div className="space-y-4">
        {/* Referral Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={generateReferralLink()}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareViaEmail}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <span>📧</span>
            <span className="text-sm font-medium">Email</span>
          </button>
          
          <button
            onClick={shareViaSMS}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <span>💬</span>
            <span className="text-sm font-medium">Text</span>
          </button>
        </div>

        {/* Benefits */}
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Why share MindGleam?
          </h4>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              <span>Help friends access free mental wellness support</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              <span>Evidence-based CBT techniques available 24/7</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">•</span>
              <span>Private, secure, and affordable mental wellness</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
