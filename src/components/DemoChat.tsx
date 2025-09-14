'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import CrisisResourceModal, { detectCrisisKeywords } from './CrisisResourceModal';

interface DemoChatProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar: string;
}

const avatars = {
  'gigi': {
    name: 'Gigi',
    src: '/images/avatars/Gigi_avatar.png',
    gradient: 'from-pink-200 to-purple-200',
    personality: 'empathetic and warm'
  },
  'vee': {
    name: 'Vee',
    src: '/images/avatars/Vee_avatar.png',
    gradient: 'from-blue-200 to-cyan-200',
    personality: 'logical and structured'
  },
  'lumo': {
    name: 'Lumo',
    src: '/images/avatars/Lumo_avatar.png',
    gradient: 'from-teal-200 to-emerald-200',
    personality: 'creative and inspiring'
  }
};

const demoResponses = [
  {
    trigger: ['hello', 'hi', 'hey'],
    response: "Hello! I'm {name}, your AI mental wellness companion. I'm here to help you work through thoughts and feelings using evidence-based CBT techniques. What's on your mind today?"
  },
  {
    trigger: ['anxious', 'anxiety', 'worried', 'stress'],
    response: "I understand you're feeling anxious. That's a very common experience. Let's try a simple technique: Can you tell me what specific thoughts are making you feel this way? Sometimes just naming them helps reduce their power."
  },
  {
    trigger: ['sad', 'depressed', 'down', 'low'],
    response: "I hear that you're feeling down. It takes courage to reach out. One thing that often helps is identifying what we call 'thought patterns.' What thoughts have been going through your mind lately?"
  },
  {
    trigger: ['angry', 'frustrated', 'mad', 'upset'],
    response: "Anger can be really intense. Let's work with it constructively. Can you describe the situation that triggered these feelings? Often there are underlying thoughts that fuel our anger."
  },
  {
    trigger: ['help', 'support', 'need'],
    response: "I'm here to support you. CBT helps us understand the connection between our thoughts, feelings, and behaviors. What specific area would you like to focus on today - thoughts, emotions, or behaviors?"
  }
];

const defaultResponse = "Thank you for sharing that with me. In CBT principles, we explore how thoughts, feelings, and behaviors are connected. I'd love to help you explore this further. To continue our conversation and access personalized guidance, would you like to sign up for your 20 free messages?";

// Goal-specific sample conversations
const goalSamples = {
  'sleep': {
    userMessage: "I can't sleep because I keep thinking about tomorrow's presentation. What if I mess up?",
    aiResponse: "I understand that worry about tomorrow is keeping you awake. Let's work with that 'what if' thought. You're catastrophizing - imagining the worst possible outcome. Instead, let's reframe: What if you do well? What if you're prepared? Even if there are small hiccups, would that truly be a disaster? Try this: Take 3 deep breaths and list 3 things you've done to prepare. Your mind needs facts, not fears, to rest peacefully."
  },
  'stress': {
    userMessage: "I'm so overwhelmed with work. I feel like I'm drowning and can't handle everything on my plate.",
    aiResponse: "That feeling of drowning is your mind's way of saying you're in overwhelm mode. Let's step back and challenge that 'I can't handle this' thought. You're dealing with a lot, but you're not actually drowning - you're here, you're talking about it, which shows you're coping. Let's break this down: What's one small task you could complete today? Sometimes our minds make mountains out of molehills. You've handled difficult situations before - what skills did you use then?"
  },
  'confidence': {
    userMessage: "I want to apply for a promotion but I don't think I'm good enough. Everyone else seems more qualified.",
    aiResponse: "I hear that inner critic telling you 'you're not good enough.' This is a classic example of self-doubt and comparison thinking. Let's challenge this: What evidence do you have that you're not qualified? Are you comparing your behind-the-scenes to others' highlight reels? Think about it - your company wouldn't have the position available if they didn't think someone like you could do it. What are 3 specific achievements you're proud of? Let's reframe: Instead of 'I'm not good enough,' try 'I'm learning and growing, and I have valuable skills to offer.'"
  },
  'anxiety': {
    userMessage: "I have a social event tonight and I'm already anxious about it. I keep imagining all the ways it could go wrong.",
    aiResponse: "Your mind is stuck in 'what if' mode - anticipating problems that haven't happened yet. This is anxiety's favorite trick. Let's reframe those anxious thoughts: Instead of 'What if I say something awkward?' try 'What if I have an interesting conversation?' Instead of 'What if no one likes me?' try 'What if I meet someone new?' Anxiety makes us fortune-tellers of doom, but you can choose to predict positive outcomes too. What's one thing you're actually looking forward to about tonight?"
  }
};

export default function DemoChat({ isOpen, onClose, selectedAvatar }: DemoChatProps) {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, timestamp: Date}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [userMessageCount, setUserMessageCount] = useState(0); // Only real user messages after onboarding
  const [isTyping, setIsTyping] = useState(false);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [crisisTriggerWord, setCrisisTriggerWord] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();

  const avatar = avatars[selectedAvatar as keyof typeof avatars] || avatars.gigi;

  // Templated onboarding messages
  const onboardingUser = {
    text: "Hi, I'm feeling a bit anxious today. Can you help?",
    isUser: true,
    timestamp: new Date(Date.now() - 60000)
  };
  const onboardingLLM = {
    text: `Of course! It's normal to feel anxious sometimes. Can you tell me a bit more about what's on your mind, or would you like to try a calming exercise together?`,
    isUser: false,
    timestamp: new Date(Date.now() - 30000)
  };

  // On open, inject onboarding if not already present
  useEffect(() => {
    if (isOpen && !sampleLoaded) {
      setMessages([onboardingUser, onboardingLLM]);
      setSampleLoaded(true);
      setUserMessageCount(0); // Only count real user messages after onboarding
    }
  }, [isOpen, sampleLoaded]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setUserMessageCount(0);
      setSampleLoaded(false);
      setInputValue('');
      setIsTyping(false);
    } else {
      // Initialize user message count from localStorage when opening
      if (typeof window !== 'undefined') {
        const demoData = localStorage.getItem('mindgleam_demo_chat');
        if (demoData) {
          const parsedData = JSON.parse(demoData);
          setUserMessageCount(parsedData.count || 0);
        }
      }
    }
  }, [isOpen]);

  const getFallbackResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    const matchedResponse = demoResponses.find(response => 
      response.trigger.some(trigger => lowerMessage.includes(trigger))
    );
    const responseText = matchedResponse ? matchedResponse.response : defaultResponse;
    return responseText.replace('{name}', avatar.name);
  };

  const getResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are ${avatar.name}, a ${avatar.personality} AI mental wellness companion. You use CBT-inspired techniques to help users reframe thoughts and manage emotions. Keep responses helpful, empathetic, and under 150 words. This is a demo conversation, so be engaging and showcase your capabilities.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          isDemo: true
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.fallback && process.env.NODE_ENV === 'development') {
          console.warn('Demo using fallback response:', data.debugInfo);
        }
        return data.message;
      } else {
        console.error('Demo API response not ok:', response.status, response.statusText);
        return getFallbackResponse(userMessage);
      }
    } catch (error) {
      console.error('Demo chat API error:', error);
      return getFallbackResponse(userMessage);
    }
  };

  // Only allow 3 real user messages after onboarding
  const handleSendMessage = async () => {
    if (!inputValue.trim() || userMessageCount >= 3) return;
    const userMessage = inputValue.trim();
    // Check for crisis keywords before sending
    const crisisKeyword = detectCrisisKeywords(userMessage);
    if (crisisKeyword) {
      setCrisisTriggerWord(crisisKeyword);
      setShowCrisisModal(true);
      return;
    }
    setInputValue('');
    // Add user message
    const newUserMessage = {
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindgleam_demo_chat', JSON.stringify({
        count: newUserMessageCount,
        lastUsed: new Date().toISOString()
      }));
    }
    setIsTyping(true);
    try {
      const aiResponseText = await getResponse(userMessage);
      const aiResponse = {
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const fallbackResponse = {
        text: getFallbackResponse(userMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignUpAndContinue = () => {
    signInWithGoogle();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatar.gradient} p-1`}>
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className="w-full h-full object-contain avatar-image"
                    style={{ background: 'transparent' }}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Flow in</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sampleLoaded && messages.length > 0 ? `Sample Chat • ${3 - userMessageCount} messages remaining` : 'Loading sample...'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {!sampleLoaded && (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="text-4xl mb-4">💭</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Loading sample conversation...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {avatar.name} is preparing a personalized example for you
                  </p>
                </div>
              </div>
            )}

            {sampleLoaded && messages.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500 text-sm">✨</span>
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                    Sample Conversation
                  </p>
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-xs">
                  This shows how {avatar.name} helps reframe anxious thoughts. Try your own message below!
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            {userMessageCount >= 3 ? (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🎉 Enjoyed your chat with {avatar.name}?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Get 20 free messages with personalized guidance, mood tracking, and 24/7 support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSignUpAndContinue}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Try your own message with ${avatar.name}...`}
                    className="w-full p-4 pr-16 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows={2}
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-4 bottom-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                {/* Medical Disclaimer */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Educational content only • Not medical advice • Ages 18+ • Crisis? Call 988 (US) or emergency services
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Crisis Resource Modal */}
        <CrisisResourceModal
          isOpen={showCrisisModal}
          onClose={() => setShowCrisisModal(false)}
          triggerWord={crisisTriggerWord || undefined}
        />
      </motion.div>
    </AnimatePresence>
  );
} 