'use client';

import React, { memo, useMemo } from 'react';

interface MoodTimerProps {
  countdown: number;
  onTimerComplete?: () => void;
}

const MoodTimer = memo(function MoodTimer({
  countdown,
  onTimerComplete,
}: MoodTimerProps) {
  // Memoize the time formatting calculation
  const formattedTime = useMemo(() => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const remainingSeconds = countdown % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, [countdown]);

  if (countdown <= 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      <div className="text-center flex-1">
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Mood Check-In Complete!
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Thanks for sharing how you're feeling today
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Auto-close in
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          {formattedTime}
        </div>
      </div>
    </div>
  );
});

export default MoodTimer;
