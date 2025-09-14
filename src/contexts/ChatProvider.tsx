'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { useAuth } from './EnhancedAuthProvider';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  avatarId?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  avatarId: 'gigi' | 'vee' | 'lumo';
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  currentSession: ChatSession | null;
  isVisible: boolean;
  isDemoMode: boolean;
  selectedAvatar: 'gigi' | 'vee' | 'lumo';
  demoMessagesUsed: number;
  isLoading: boolean;
  error: string | null;
  startNewSession: (avatarId: 'gigi' | 'vee' | 'lumo') => void;
  sendMessage: (content: string) => Promise<void>;
  setVisible: (visible: boolean) => void;
  setSelectedAvatar: (avatar: 'gigi' | 'vee' | 'lumo') => void;
  startDemoMode: () => void;
  endDemoMode: () => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MAX_DEMO_MESSAGES = 3;
const DEMO_STORAGE_KEY = 'mindgleam_demo_chat';

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, balance, refreshBalance } = useAuth();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'gigi' | 'vee' | 'lumo'>(
    'gigi'
  );
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoMessagesUsed, setDemoMessagesUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load demo usage from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const demoData = localStorage.getItem(DEMO_STORAGE_KEY);
      if (demoData) {
        try {
          const parsed = JSON.parse(demoData);
          setDemoMessagesUsed(parsed.count || 0);
        } catch (error) {
          console.error('Error parsing demo data:', error);
        }
      }
    }
  }, []);

  const updateDemoUsage = useCallback((count: number) => {
    setDemoMessagesUsed(count);
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ count, lastUsed: new Date().toISOString() })
      );
    }
  }, []);

  const startNewSession = useCallback((avatarId: 'gigi' | 'vee' | 'lumo') => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      avatarId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentSession(newSession);
    setSelectedAvatar(avatarId);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check if user can send message
        if (!user && isDemoMode) {
          if (demoMessagesUsed >= MAX_DEMO_MESSAGES) {
            throw new Error(
              'Demo limit reached. Please sign in to continue chatting.'
            );
          }
        } else if (user && balance && balance.balance <= 0) {
          throw new Error(
            'No messages remaining. Please purchase more credits to continue.'
          );
        }

        // Create user message
        const userMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content,
          role: 'user',
          timestamp: new Date(),
          avatarId: selectedAvatar,
        };

        // Add user message to current session
        setCurrentSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, userMessage],
            updatedAt: new Date(),
          };
        });

        // Send to API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            avatar: selectedAvatar,
            isDemo: isDemoMode && !user,
            sessionId: currentSession?.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        // Create assistant message
        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          content:
            data.response || 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
          avatarId: selectedAvatar,
        };

        // Add assistant message to session
        setCurrentSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, assistantMessage],
            updatedAt: new Date(),
          };
        });

        // Update usage counters
        if (!user && isDemoMode) {
          updateDemoUsage(demoMessagesUsed + 1);
        } else if (user) {
          // Refresh balance from server
          await refreshBalance();
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      user,
      balance,
      isDemoMode,
      demoMessagesUsed,
      selectedAvatar,
      currentSession,
      refreshBalance,
      updateDemoUsage,
    ]
  );

  const setVisible = useCallback(
    (visible: boolean) => {
      setIsVisible(visible);
      if (visible && !currentSession) {
        startNewSession(selectedAvatar);
      }
    },
    [currentSession, selectedAvatar, startNewSession]
  );

  const startDemoMode = useCallback(() => {
    if (demoMessagesUsed >= MAX_DEMO_MESSAGES) {
      setError('Demo limit reached. Please sign in to continue chatting.');
      return;
    }
    setIsDemoMode(true);
    startNewSession(selectedAvatar);
    setVisible(true);
  }, [demoMessagesUsed, selectedAvatar, startNewSession, setVisible]);

  const endDemoMode = useCallback(() => {
    setIsDemoMode(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-end demo mode when user signs in
  useEffect(() => {
    if (user && isDemoMode) {
      endDemoMode();
    }
  }, [user, isDemoMode, endDemoMode]);

  const value = useMemo(
    () => ({
      currentSession,
      isVisible,
      isDemoMode,
      selectedAvatar,
      demoMessagesUsed,
      isLoading,
      error,
      startNewSession,
      sendMessage,
      setVisible,
      setSelectedAvatar,
      startDemoMode,
      endDemoMode,
      clearError,
    }),
    [
      currentSession,
      isVisible,
      isDemoMode,
      selectedAvatar,
      demoMessagesUsed,
      isLoading,
      error,
      startNewSession,
      sendMessage,
      setVisible,
      startDemoMode,
      endDemoMode,
      clearError,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
