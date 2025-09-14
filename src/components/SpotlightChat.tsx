// SpotlightChat.tsx – Chat UI for SpotlightCard powered by Together LLM

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { Resizable, ResizeCallback } from 're-resizable';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Size {
  width: string;
  height: string;
}

export default function SpotlightChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<Size>({ width: '100%', height: '600px' });
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleResize: ResizeCallback = (e, direction, ref) => {
    if (!ref) return;
    const width = `${Math.max(300, ref.offsetWidth)}px`;
    const height = `${Math.max(400, ref.offsetHeight)}px`;
    setSize({ width, height });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Resizable
      size={size}
      onResizeStop={handleResize}
      minHeight={400}
      maxHeight="80vh"
      minWidth={300}
      maxWidth="100%"
      enable={{
        top: false,
        right: true,
        bottom: true,
        left: true,
        topRight: false,
        bottomRight: true,
        bottomLeft: true,
        topLeft: false,
      }}
      className="relative flex flex-col bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden w-full shadow-lg"
      handleStyles={{
        right: { width: '8px', right: '-4px' },
        left: { width: '8px', left: '-4px' },
        bottom: { height: '8px', bottom: '-4px' },
        bottomRight: {
          width: '16px',
          height: '16px',
          right: '-8px',
          bottom: '-8px',
        },
        bottomLeft: {
          width: '16px',
          height: '16px',
          left: '-8px',
          bottom: '-8px',
        },
      }}
      handleClasses={{
        right: 'hover:bg-pink-400/50 transition-colors',
        left: 'hover:bg-pink-400/50 transition-colors',
        bottom: 'hover:bg-pink-400/50 transition-colors',
        bottomRight: 'hover:bg-pink-400/50 transition-colors cursor-se-resize',
        bottomLeft: 'hover:bg-pink-400/50 transition-colors cursor-sw-resize',
      }}
    >
      <div
        ref={ref}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ height: `calc(${size.height} - 80px)` }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 dark:text-gray-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-400/20 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm max-w-xs">
              Send a message to start guided journaling with Gigi, your AI
              Thought-Coach!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                <Image
                  src="/images/avatars/gigi-avatar-logo.png"
                  alt="Gigi"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white rounded-bl-none'
              }`}
            >
              {message.content}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-sky-400 ml-2 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <Image
                src="/images/avatars/gigi-avatar-logo.png"
                alt="Gigi"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gray-100 dark:bg-white/10 p-3 rounded-2xl rounded-bl-none">
              <LoadingSpinner />
            </div>
          </motion.div>
        )}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/20 bg-white/10 dark:bg-black/20"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 dark:bg-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-2 text-center">
            {error} - Please try again!
          </p>
        )}
      </form>

      {/* Resize indicators */}
      <div className="absolute inset-0 pointer-events-none border border-transparent hover:border-pink-400/20 rounded-2xl transition-colors" />
    </Resizable>
  );
}
