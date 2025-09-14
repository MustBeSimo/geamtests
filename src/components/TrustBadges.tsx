'use client';

import { motion } from 'framer-motion';

const trustBadges = [
  {
    icon: '🔒',
    title: 'Privacy Focused',
    description: 'Your data stays secure'
  },
  {
    icon: '🧠',
    title: 'Evidence-Based',
    description: 'Built on CBT principles'
  },
  {
    icon: '🚀',
    title: '24/7 Available',
    description: 'AI support anytime'
  },
  {
    icon: '💡',
    title: 'Free to Try',
    description: '20 messages included'
  },
  {
    icon: '🌍',
    title: 'Compliant',
    description: 'Follows privacy standards'
  },
  {
    icon: '⚡',
    title: 'Instant Access',
    description: 'No waiting lists'
  }
];

export default function TrustBadges() {
  return (
    <section className="py-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Why Choose MindGleam?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Built with privacy, security, and evidence-based practices
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
