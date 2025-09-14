'use client';

import React, { memo, Suspense } from 'react';
import FeatureCard from '@/components/FeatureCard';
import BreathingMiniApp from '@/components/BreathingMiniApp';
import { useAvatarSelection } from '@/hooks/useAvatarSelection';

const GuideCard = React.lazy(() => import('@/components/GuideCard'));
const MoodCheckinCard = React.lazy(
  () => import('@/components/MoodCheckinCard')
);

const FeaturesSection = memo(function FeaturesSection() {
  const { selectedAvatarId } = useAvatarSelection();

  return (
    <section className="mb-6 lg:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MindAir */}
        <FeatureCard
          title="MindAir"
          color="pink"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12h10M4 8h13M6 16h11"
              />
            </svg>
          }
        >
          <BreathingMiniApp selectedAvatar={selectedAvatarId} />
        </FeatureCard>

        {/* MindGuide */}
        <FeatureCard
          title="MindGuide"
          color="blue"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h13a3 3 0 013 3v9H7a3 3 0 01-3-3V6z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 6v12" />
            </svg>
          }
        >
          <Suspense
            fallback={
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            }
          >
            <GuideCard />
          </Suspense>
        </FeatureCard>

        {/* VibeCheck */}
        <FeatureCard
          title="VibeCheck"
          color="purple"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-9 h-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="10" r="5" />
              <path d="M6 20h12" />
            </svg>
          }
        >
          <Suspense
            fallback={
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            }
          >
            <MoodCheckinCard />
          </Suspense>
        </FeatureCard>
      </div>
    </section>
  );
});

export default FeaturesSection;
