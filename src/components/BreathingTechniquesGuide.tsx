'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingTechniqueProps {
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
  icon: string;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function BreathingTechnique({ 
  title, 
  description, 
  steps, 
  benefits, 
  icon, 
  color, 
  isExpanded, 
  onToggle 
}: BreathingTechniqueProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6"
    >
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600 flex items-center justify-center text-white text-xl`}>
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {description}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Steps */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    How to Practice
                  </h4>
                  <ol className="space-y-3">
                    {steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${color}-100 dark:bg-${color}-900 text-${color}-600 dark:text-${color}-400 text-sm font-medium flex items-center justify-center`}>
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Benefits
                  </h4>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className={`w-5 h-5 text-${color}-500 mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BreathingTechniquesGuide() {
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>('diaphragmatic');

  const techniques = [
    {
      id: 'diaphragmatic',
      title: 'Diaphragmatic (Belly) Breathing',
      description: 'Fully engage your diaphragm for deep, calming breaths',
      icon: '🫁',
      color: 'blue',
      steps: [
        'Find a comfortable position. Sit upright or lie down. Place one hand on your upper chest and the other on your abdomen.',
        'Inhale through your nose. Draw the breath down so that your abdomen rises while your chest remains relatively still. Use a slow, steady count of 4–5 seconds.',
        'Exhale slowly through pursed lips. Feel your belly fall as you breathe out for 5–6 seconds. Aim for a longer exhale than inhale to stimulate your relaxation response.',
        'Repeat for 3–5 minutes. Maintain a gentle, smooth rhythm.'
      ],
      benefits: [
        'Lowers resting blood pressure',
        'Calms the mind and nervous system',
        'Can be practiced anywhere, no equipment needed',
        'Improves oxygen efficiency',
        'Reduces stress hormones'
      ]
    },
    {
      id: 'four-seven-eight',
      title: '4-7-8 Breathing',
      description: 'Paced breathing technique that lengthens exhalation for relaxation',
      icon: '⏱️',
      color: 'green',
      steps: [
        'Position yourself comfortably. Sit or lie with your back straight. Rest your tongue lightly on the roof of your mouth just behind your front teeth.',
        'Inhale through your nose for a count of 4. Feel your belly expand.',
        'Hold your breath for a count of 7.',
        'Exhale fully through your mouth for a count of 8. Make a whooshing sound by gently contracting your diaphragm.',
        'Repeat for four breath cycles.'
      ],
      benefits: [
        'Slows breathing to 5-6 breaths per minute',
        'Improves heart-rate variability',
        'Decreases stress and anxiety',
        'Promotes better sleep',
        'Activates parasympathetic nervous system'
      ]
    },
    {
      id: 'box',
      title: 'Box (Square) Breathing',
      description: 'Structured technique used by athletes and first responders',
      icon: '⬜',
      color: 'purple',
      steps: [
        'Inhale through your nose for a count of 4.',
        'Hold the breath for a count of 4.',
        'Exhale slowly through your mouth for a count of 4.',
        'Hold again for a count of 4. This completes one "box."',
        'Repeat for 1–2 minutes. Focus on the rhythm of the counts.'
      ],
      benefits: [
        'Encourages parasympathetic activity',
        'Reduces anxiety and stress',
        'Improves focus and concentration',
        'Helps maintain calm under pressure',
        'Easy to remember and practice'
      ]
    },
    {
      id: 'alternate-nostril',
      title: 'Alternate-Nostril Breathing',
      description: 'Yogic pranayama practice for balance and focus',
      icon: '🧘',
      color: 'orange',
      steps: [
        'Sit comfortably. Rest your left hand on your lap. Bring your right hand toward your face.',
        'Rest your index and middle fingers between your eyebrows; your thumb will control your right nostril and your ring finger will control your left nostril.',
        'Close your right nostril with your thumb and inhale slowly through your left nostril.',
        'Close your left nostril with your ring finger, open your right nostril and exhale.',
        'Inhale through the right nostril, then switch and exhale through the left. This completes one cycle.',
        'Continue for 5–10 cycles. Maintain gentle, slow breathing.'
      ],
      benefits: [
        'Improves focus and concentration',
        'Creates sense of balance and calm',
        'Reduces stress and anxiety',
        'Enhances mental clarity',
        'Balances nervous system activity'
      ]
    }
  ];

  const practicetips = [
    {
      title: 'Start slowly',
      description: 'Deep breathing is a skill that improves with practice. If you feel light-headed, reduce the depth or duration of your breaths.',
      icon: '🐌'
    },
    {
      title: 'Combine with mindfulness',
      description: 'Paying attention to the sensations of breathing can amplify relaxation and help interrupt anxious thought patterns.',
      icon: '🧠'
    },
    {
      title: 'Practice regularly',
      description: 'Research suggests daily deep breathing exercises can lower resting blood pressure and reduce stress over time.',
      icon: '📅'
    },
    {
      title: 'Be patient',
      description: 'Like any skill, breathwork becomes more effective with consistent practice. Aim for a few minutes each day and gradually increase as comfortable.',
      icon: '⏳'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full flex items-center justify-center text-2xl">
            🌬️
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Breathing Techniques Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Breath-control exercises are a simple but powerful way to calm the nervous system and lower stress and anxiety. 
            These evidence-based techniques increase parasympathetic tone, counteracting the body's fight-or-flight response 
            and helping to stabilize mood.
          </p>
        </motion.div>

        {/* Research Citations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Evidence-based:</strong> Modern research shows that voluntary regulated breathing practices 
            are accessible, scalable, and cost-free tools for managing stress. Studies demonstrate that slow 
            and deep breathing improves stress and anxiety outcomes and can lower blood pressure when practiced daily.
          </p>
        </motion.div>
      </div>

      {/* Techniques */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Four Evidence-Based Techniques
        </h2>
        {techniques.map((technique) => (
          <BreathingTechnique
            key={technique.id}
            title={technique.title}
            description={technique.description}
            steps={technique.steps}
            benefits={technique.benefits}
            icon={technique.icon}
            color={technique.color}
            isExpanded={expandedTechnique === technique.id}
            onToggle={() => setExpandedTechnique(
              expandedTechnique === technique.id ? null : technique.id
            )}
          />
        ))}
      </div>

      {/* Practice Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Tips for Practicing Breathwork
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {practicetips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex gap-4"
            >
              <div className="text-2xl">{tip.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tip.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Take Control of Your Stress
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Breath-control techniques put a powerful stress-management tool in your own hands. 
          Because they are inexpensive, portable, and safe, these exercises can be integrated 
          into daily routines for immediate calming effects and long-term health benefits.
        </p>
      </motion.div>
    </div>
  );
}