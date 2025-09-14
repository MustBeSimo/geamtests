'use client';

import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthProvider';
import { ChatProvider } from '@/contexts/ChatProvider';
import AppLayout from '@/components/layout/AppLayout';
import Providers from '@/components/Providers';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <EnhancedAuthProvider>
      <ChatProvider>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </ChatProvider>
    </EnhancedAuthProvider>
  );
} 