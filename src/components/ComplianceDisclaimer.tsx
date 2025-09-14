'use client';

import { useState, useEffect } from 'react';

interface CrisisBannerProps {
  className?: string;
}

export function CrisisBanner({ className = "" }: CrisisBannerProps) {
  const [countryCode, setCountryCode] = useState<string>('');

  useEffect(() => {
    // Get user's country code (simplified - in production use proper geolocation)
    const getCountryCode = async () => {
      try {
        // Using timezone as a fallback method
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Australia')) setCountryCode('AU');
        else if (timezone.includes('America') || timezone.includes('New_York') || timezone.includes('Chicago') || timezone.includes('Denver') || timezone.includes('Los_Angeles')) setCountryCode('US');
        else if (timezone.includes('London')) setCountryCode('GB');
        else setCountryCode('US'); // Default to US
      } catch (error) {
        setCountryCode('US'); // Default fallback
      }
    };
    getCountryCode();
  }, []);

  const getCrisisInfo = () => {
    switch (countryCode) {
      case 'AU':
        return {
          flag: '🇦🇺',
          text: 'Need help now? Call 000 or Lifeline 13 11 14'
        };
      case 'GB':
        return {
          flag: '🇬🇧',
          text: 'Call 999 or Samaritans 116 123'
        };
      case 'US':
      default:
        return {
          flag: '🇺🇸',
          text: 'Call 911 or 988 (Suicide & Crisis Lifeline)'
        };
    }
  };

  const crisisInfo = getCrisisInfo();

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{crisisInfo.flag}</span>
        <span className="text-red-800 dark:text-red-200 font-medium">
          {crisisInfo.text}
        </span>
      </div>
    </div>
  );
}

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function GeneralDisclaimer({ className = "", compact = false }: DisclaimerProps) {
  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-2">
        <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
        <div className="text-yellow-800 dark:text-yellow-200 text-sm">
          {compact ? (
            <p>
              <strong>Important:</strong> Mind Gleam offers self-help tools and educational content only. 
              It is <strong>not a medical device</strong> and does not diagnose, treat, cure or prevent any disease or mental health condition.
            </p>
          ) : (
            <>
              <p className="font-semibold mb-2">Important Disclaimer</p>
              <p>
                Mind Gleam offers self-help tools and educational content only. It is <strong>not a medical device</strong> and 
                does not diagnose, treat, cure or prevent any disease or mental health condition. If you feel unsafe or in crisis, 
                call your local emergency number immediately.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceDisclaimer() {
  return (
    <div className="space-y-4">
      <GeneralDisclaimer />
      <CrisisBanner />
    </div>
  );
}
