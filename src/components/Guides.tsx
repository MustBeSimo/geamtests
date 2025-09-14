'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const guides = [
  {
    title: 'Glow Up & Own It',
    subtitle: '10 Exercises to Build Confidence & Love Your Body',
    description:
      'Ready to break up with self-doubt and fall head over heels in love with your body? This free guide is your glow-up blueprint: 10 powerful exercises designed not just to sculpt your body—but to elevate your confidence, crush comparison traps, and help you walk, dance, and lift like the queen you are.',
    image: '/images/guides/confidence-guide.jpg',
    fileSize: '2MB',
    buttonColor: 'pink',
    icon: 'fa-solid fa-heart-pulse',
    downloadUrl: 'https://payhip.com/b/YKuyU',
    highlights: [
      'Confidence-building exercises',
      'Body positivity techniques',
      'Mindful movement practices',
      'Self-love affirmations',
    ],
  },
  {
    title: 'Thought Record Guide',
    subtitle: 'Master a 5-step thought-shift exercise',
    description:
      'Transform difficult thoughts with this evidence-based guide. Learn the 5-step thought-shift exercise used by mental health professionals worldwide. This practical workbook will teach you to identify unhelpful thinking patterns and develop more balanced perspectives.',
    image: '/images/guides/thought-record.png',
    fileSize: '3MB',
    buttonColor: 'emerald',
    icon: 'fa-solid fa-brain',
    downloadUrl: '#',
    highlights: [
      '5-step thought-shift framework',
      'Common thinking trap examples',
      'Guided practice worksheets',
      'Evidence-based techniques (CBT-inspired)',
    ],
  },
];

export default function Guides() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="guides"
      className="py-20 bg-gradient-to-b from-purple-900 to-gray-900"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Free Downloads
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Transform Your Mindset & Wellbeing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Evidence-based guides crafted with care to help you develop mental
            wellness and emotional resilience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover-glow group"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-900 opacity-90" />
                <i
                  className={`${guide.icon} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-white/30`}
                />
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-lg text-pink-400 mb-4">{guide.subtitle}</p>
                  <p className="text-gray-300 mb-6">{guide.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-white">
                    What's Inside:
                  </h4>
                  <ul className="space-y-2">
                    {guide.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <i className="fas fa-check-circle text-pink-500 mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    <i className="fas fa-file-pdf mr-2" />
                    PDF ({guide.fileSize})
                  </span>
                  <motion.a
                    href={guide.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 bg-gradient-to-r from-${guide.buttonColor}-500 to-purple-500 rounded-full text-white font-medium inline-flex items-center group`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Download Free</span>
                    <motion.i
                      className="fas fa-download ml-2 transition-transform"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
