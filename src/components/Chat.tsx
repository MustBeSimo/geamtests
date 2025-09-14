'use client';

import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function Chat() {
  const {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
    chatRef,
  } = useChat();
  const { user } = useAuth();
  const { isSubscriptionActive, loading } = useSubscription(user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isSubscriptionActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Premium Feature
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Chat with Gigi is a premium feature. Subscribe to unlock unlimited
          conversations and personalized guidance.
        </p>
        <Link
          href="/pricing"
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          View Pricing Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={chatRef}
        className="bg-white rounded-2xl shadow-xl p-6 mb-6 h-[60vh] overflow-y-auto"
      >
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm md:text-base">{message.text}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="w-full p-4 pr-24 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          rows={3}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          className="absolute right-4 bottom-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}
