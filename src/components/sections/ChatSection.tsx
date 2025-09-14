'use client';

import React, { memo, Suspense } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/EnhancedAuthProvider';
import { useChat } from '@/contexts/ChatProvider';
import { useAvatarSelection } from '@/hooks/useAvatarSelection';

const ChatCard = React.lazy(() => import('@/components/ChatCard'));

interface ChatSectionProps {
  isVisible: boolean;
}

const ChatSection = memo(function ChatSection({ isVisible }: ChatSectionProps) {
  const { user, balance } = useAuth();
  const { currentAvatar, getColorSchemeById } = useAvatarSelection();

  if (!isVisible) return null;

  const colorScheme = getColorSchemeById(currentAvatar.id);

  return (
    <section className="mb-12 lg:mb-16">
      <div
        className={`bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-lg border-2 ${colorScheme.borderColor}`}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorScheme.gradient} p-1`}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src={currentAvatar.src}
                alt={currentAvatar.name}
                width={48}
                height={48}
                className="object-contain avatar-image"
                sizes="48px"
              />
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${colorScheme.textColor}`}>
            Chat with {currentAvatar.name}
          </h2>
        </div>
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
          }
        >
          <ChatCard
            user={user || undefined}
            balance={balance}
            selectedAvatar={currentAvatar}
          />
        </Suspense>
      </div>
    </section>
  );
});

export default ChatSection;