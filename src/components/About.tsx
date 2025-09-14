'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const stats = [
    { label: 'Active Users', value: '100K+', icon: '👥' },
    { label: 'Daily Chats', value: '50K+', icon: '💬' },
    { label: 'AI Responses', value: '1M+', icon: '🤖' },
    { label: 'User Rating', value: '4.9/5', icon: '⭐' },
  ];

  const features = [
    {
      title: 'Emotional Intelligence',
      description: 'Advanced empathy algorithms for meaningful conversations',
      icon: '❤️',
    },
    {
      title: 'Thought-Shift Coaching',
      description:
        'Evidence-based techniques for transforming difficult thoughts',
      icon: '🧠',
    },
    {
      title: 'Mental Wellness',
      description: 'Holistic approach to emotional well-being and resilience',
      icon: '🧘‍♀️',
    },
    {
      title: 'Private Journaling',
      description: 'Secure, confidential space for self-reflection and growth',
      icon: '📝',
    },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="py-20 bg-gradient-to-b from-gray-900 to-purple-900 text-white"
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ scale, opacity }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Mental Wellness Support
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet Gigi, your AI Thought-Coach designed to provide evidence-based
            support for your mental wellness journey.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:opacity-100 transition-opacity opacity-0" />
              <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <motion.a
            href="#chat"
            className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Wellness Journey
            <motion.span
              className="ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
