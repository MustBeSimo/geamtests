'use client';

import React, { memo } from 'react';
import Hero from '@/components/Hero';
import { useChat } from '@/contexts/ChatProvider';
import { useAuth } from '@/contexts/EnhancedAuthProvider';
import { useAvatarSelection } from '@/hooks/useAvatarSelection';

interface HeroSectionProps {
  onStartDemo: (goal?: string) => void;
}

const HeroSection = memo(function HeroSection({ onStartDemo }: HeroSectionProps) {
  const { selectedAvatarId, selectAvatar } = useAvatarSelection();

  return (
    <section className="mb-12 lg:mb-16">
      <Hero
        onStartDemo={onStartDemo}
        selectedAvatar={selectedAvatarId}
        onAvatarChange={selectAvatar}
      />
    </section>
  );
});

export default HeroSection;