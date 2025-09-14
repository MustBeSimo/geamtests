'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerWord?: string;
}

// Crisis keywords that trigger the modal
export const crisisKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self harm', 'self-harm', 'cut myself', 'hurt myself', 'harm myself',
  'overdose', 'pills', 'jump off', 'hanging', 'rope',
  'hopeless', 'worthless', 'no point', 'give up', 'can\'t go on',
  'crisis', 'emergency', 'help me', 'desperate'
];

// Crisis resources by region
const crisisResources = {
  global: [
    { region: 'United States', number: '988', description: 'Suicide & Crisis Lifeline', available: '24/7' },
    { region: 'United States', number: '911', description: 'Emergency Services', available: '24/7' },
    { region: 'Australia', number: '13 11 14', description: 'Lifeline', available: '24/7' },
    { region: 'Australia', number: '000', description: 'Emergency Services', available: '24/7' },
    { region: 'United Kingdom', number: '116 123', description: 'Samaritans', available: '24/7' },
    { region: 'United Kingdom', number: '999', description: 'Emergency Services', available: '24/7' },
    { region: 'Canada', number: '1-833-456-4566', description: 'Talk Suicide Canada', available: '24/7' },
    { region: 'Canada', number: '911', description: 'Emergency Services', available: '24/7' },
  ]
};

// Function to detect crisis keywords in text
export const detectCrisisKeywords = (text: string): string | null => {
  const lowerText = text.toLowerCase();
  for (const keyword of crisisKeywords) {
    if (lowerText.includes(keyword)) {
      return keyword;
    }
  }
  return null;
};

export default function CrisisResourceModal({ isOpen, onClose, triggerWord }: CrisisResourceModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Reset acknowledgment when modal opens
  useEffect(() => {
    if (isOpen) {
      setAcknowledged(false);
    }
  }, [isOpen]);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        // Non-dismissable - no onClick to close
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          // Prevent closing by clicking inside
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-red-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🆘</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Crisis Support Resources</h2>
                <p className="text-red-100">Immediate help is available</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-200 font-semibold">
                  We noticed you may be experiencing a crisis. Your safety is our priority.
                </p>
                {triggerWord && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                    Detected concern: "{triggerWord}"
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  You are not alone. Help is available right now.
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  These resources provide immediate, confidential support from trained professionals who understand what you're going through.
                </p>
              </div>
            </div>

            {/* Crisis Resources */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Crisis Hotlines (24/7 Support)
              </h3>
              
              <div className="grid gap-4">
                {crisisResources.global.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {resource.region}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {resource.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <a
                          href={`tel:${resource.number}`}
                          className="text-2xl font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        >
                          {resource.number}
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.available}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Additional Support Options:
              </h4>
              <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <li>• Text "HELLO" to 741741 (Crisis Text Line)</li>
                <li>• Visit your nearest emergency room</li>
                <li>• Contact your doctor or mental health provider</li>
                <li>• Reach out to a trusted friend or family member</li>
              </ul>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Important:</strong> Mind Gleam is not equipped to handle crisis situations. 
                Please use the resources above for immediate professional support.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="acknowledge" className="text-sm text-gray-700 dark:text-gray-300">
                I acknowledge that I have read the crisis resources and understand that Mind Gleam cannot provide emergency support.
              </label>
            </div>
            
            <button
              onClick={handleAcknowledge}
              disabled={!acknowledged}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                acknowledged
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              I Understand - Continue
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 