'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedText from '@/components/AnimatedText';
import Script from 'next/script';
import { useTheme } from 'next-themes';
import { getAvatarClasses } from '@/utils/avatarThemes';

interface Avatar {
  id: 'gigi' | 'vee' | 'lumo';
  name: string;
  description: string;
  src: string;
  gradient: string;
}

interface ChatCardProps {
  className?: string;
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  balance?: number | null;
  selectedAvatar?: Avatar;
}

import { useAuth } from '@/contexts/AuthContext';
import CrisisResourceModal, { detectCrisisKeywords } from './CrisisResourceModal';

const AGENT_ID = 'DeJ9S1LXgsrUIPkSKRyy';

export default function ChatCard({ className = '', user: propUser, balance, selectedAvatar }: ChatCardProps) {
  const { user: contextUser } = useAuth();
  const user = propUser ?? contextUser;
  const [isOpen, setIsOpen] = useState(true); // Always open by default to encourage usage
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisTriggerWord, setCrisisTriggerWord] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get avatar-specific styling
  const avatarClasses = selectedAvatar ? getAvatarClasses(selectedAvatar.id, isDark) : null;

  // Avatar-specific personalities and approaches
  const getAvatarPersonality = (avatar?: Avatar) => {
    if (!avatar) return {
      name: 'Mind Gleam AI',
      initialMessage: "Hi! I'm your AI companion. I provide educational wellness content only - not therapy or medical advice. How can I help you learn today? 💁‍♀️",
      approach: 'general',
      gradient: 'from-pink-400 to-purple-400'
    };

    switch (avatar.id) {
      case 'gigi':
        return {
          name: 'Gigi',
          initialMessage: "Hi there! I'm Gigi, your empathetic wellness companion 💚 I'm here to support both your mental and physical wellbeing through gentle, holistic approaches. I combine emotional support with practical wellness tips for your mind and body. How are you feeling today - mentally and physically?",
          approach: 'empathetic and holistic',
          gradient: avatar.gradient
        };
      case 'vee':
        return {
          name: 'Vee',
          initialMessage: "Hello! I'm Vee, your logical wellness coach 🧠 I take a structured, evidence-based approach to mental and physical health. I love helping you understand the science behind mind-body wellness and create systematic plans for better health. What aspect of your wellbeing would you like to work on?",
          approach: 'logical and systematic',
          gradient: avatar.gradient
        };
      case 'lumo':
        return {
          name: 'Lumo',
          initialMessage: "Hey! I'm Lumo, your creative wellness guide ✨ I make mental and physical wellness fun through movement, creativity, and joyful practices! Think dance therapy, mindful cooking, creative exercise, and playful stress relief. Ready to explore wellness in a whole new way?",
          approach: 'creative and energetic',
          gradient: avatar.gradient
        };
      default:
        return {
          name: avatar.name,
          initialMessage: `Hi! I'm ${avatar.name}. I provide educational wellness content only - not therapy or medical advice. How can I help you learn today?`,
          approach: 'general',
          gradient: avatar.gradient
        };
    }
  };

  const personality = getAvatarPersonality(selectedAvatar);
  
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: personality.initialMessage, isUser: false },
  ]);
  // Track demo message count for non-authenticated users (3 free messages)
  const [demoMessageCount, setDemoMessageCount] = useState(0);

  // Update chat messages when avatar changes
  useEffect(() => {
    const newPersonality = getAvatarPersonality(selectedAvatar);
    setChatMessages([{ text: newPersonality.initialMessage, isUser: false }]);
    setDemoMessageCount(0); // Reset demo count when avatar changes
  }, [selectedAvatar]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    // If not signed in and used all 3 demo messages, block further input
    if (!user && demoMessageCount >= 3) return;

    // Check for crisis keywords before sending
    const crisisKeyword = detectCrisisKeywords(message);
    if (crisisKeyword) {
      setCrisisTriggerWord(crisisKeyword);
      setShowCrisisModal(true);
      return; // Don't send the message, show crisis resources instead
    }

    const newUserMsg = { text: message, isUser: true };
    const updatedMsgs = [...chatMessages, newUserMsg];
    setChatMessages(updatedMsgs);
    setMessage('');
    setIsTyping(true);

    // If not signed in, increment demo message count
    if (!user) {
      setDemoMessageCount(prev => prev + 1);
    }

    try {
      // Include all messages in the history, including the initial welcome message
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are ${personality.name}, a ${personality.approach} AI mental wellness companion. You use CBT-inspired techniques to help users reframe thoughts and manage emotions. Keep responses helpful, empathetic, and under 150 words. ${!user ? 'This is a demo conversation, so be engaging and showcase your capabilities.' : ''}`
            },
            ...chatMessages.concat(newUserMsg).map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            }))
          ],
          isDemo: !user // Send isDemo: true when user is not authenticated
        })
      });
      if (!res.ok) {
        if (res.status === 402) {
          setChatMessages(prev => [...prev, { text: "Oops! Looks like you're out of messages. Purchase more to continue chatting! 💝", isUser: false }]);
          return;
        }
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setChatMessages(prev => [...prev, { text: data.message, isUser: false }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { text: 'Sorry, I had trouble processing that. Please try again! 💕', isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg overflow-hidden
          border border-gray-200 dark:border-gray-700
          transition-all duration-700 ease-in-out
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            {selectedAvatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 dark:border-gray-600/20 shadow-lg">
                <img 
                  src={selectedAvatar.src} 
                  alt={selectedAvatar.name}
                  className="w-full h-full object-contain avatar-image"
                  style={{ background: 'transparent' }}
                />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${personality.gradient} flex items-center justify-center`}>
                <span className="text-white font-semibold">M</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {personality.name}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300">
                {selectedAvatar ? selectedAvatar.description : 'AI-Powered Wellness Companion'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-800 dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Legal Disclaimer */}
              <div className="px-4 pt-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <div className="text-red-700 dark:text-red-300 text-xs">
                      <p className="font-semibold">NOT THERAPY OR MEDICAL ADVICE</p>
                      <p>Educational AI content only. Ages 18+. Crisis? Call 988 (US) or emergency services.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Chat messages */}
              <div className="px-4 space-y-4 max-h-[350px] overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg text-base ${
                        msg.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      {msg.isUser ? (
                        msg.text
                      ) : (
                        <AnimatedText text={msg.text} />
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-4 rounded-lg text-base">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-400 dark:bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {user || demoMessageCount < 3 ? (
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={!user && demoMessageCount >= 3 ? "Sign in for more messages..." : "Type your message..."}
                      className="flex-1 bg-white dark:bg-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 dark:border-gray-600"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={(!user && demoMessageCount >= 3) || isTyping}
                    />
                    <motion.button
                      type="submit"
                      className={`
                        bg-blue-500 text-white p-3 rounded-lg transition-all duration-200
                        ${isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:scale-105'}
                      `}
                      whileHover={{ scale: isTyping ? 1 : 1.05 }}
                      whileTap={{ scale: isTyping ? 1 : 0.95 }}
                      disabled={!message.trim() || (!user && demoMessageCount >= 3) || isTyping}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </motion.button>
                  </div>
                  {/* Message Counter for Non-Authenticated Users */}
                  {!user && (
                    <div className="mt-2 text-xs text-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {3 - demoMessageCount} free messages remaining
                      </span>
                    </div>
                  )}
                  {/* Medical Disclaimer */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Mind Gleam offers educational tools, not professional medical care. 
                    <button className="underline hover:text-gray-700 dark:hover:text-gray-200 ml-1">
                      Learn more
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 border-t text-center bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    You've used your 3 free messages! Sign in to get <span className="font-bold">20 more free messages!</span>
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Crisis Resource Modal */}
      <CrisisResourceModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        triggerWord={crisisTriggerWord || undefined}
      />
    </div>
  );
} 