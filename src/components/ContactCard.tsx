'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactCardProps {
  email: string;
  className?: string;
}

export default function ContactCard({
  email,
  className = '',
}: ContactCardProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, you would send the message to your backend
    // For this demo, we'll just simulate a success

    // Show success message
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setName('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-blue-900 to-purple-800 rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Let's Collaborate</h3>

        {submitted ? (
          <motion.div
            className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm mt-1">
              Thanks for reaching out. I'll get back to you soon. 💖
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-white mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Tell me about your project or idea"
                rows={4}
                required
              />
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-white/70">Or email directly:</p>
          <motion.a
            href={`mailto:${email}`}
            className="text-white hover:text-purple-300 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {email}
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
