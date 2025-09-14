'use client';

import { useState, useRef } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there! I'm Gigi, your AI companion. How can I help you today? 😊",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages = [
      ...messages,
      { text: inputValue, isUser: true, timestamp: new Date() },
    ];

    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          text: "Thanks for your message! I'll get back to you with a thoughtful response shortly. 😊",
          isUser: false,
          timestamp: new Date(),
        },
      ]);

      // Scroll to bottom
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleKeyPress,
    chatRef,
  };
}
