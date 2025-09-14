'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtRecordData {
  situation: string;
  emotions: { [key: string]: number };
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  action: string;
}

const emotionsList = [
  { name: 'Anxiety', emoji: '😰', color: 'text-yellow-600' },
  { name: 'Frustration', emoji: '😤', color: 'text-red-600' },
  { name: 'Sadness', emoji: '😢', color: 'text-blue-600' },
  { name: 'Guilt', emoji: '😔', color: 'text-purple-600' },
  { name: 'Anger', emoji: '😠', color: 'text-red-700' },
  { name: 'Fear', emoji: '😨', color: 'text-orange-600' },
  { name: 'Shame', emoji: '😳', color: 'text-pink-600' },
  { name: 'Overwhelm', emoji: '🤯', color: 'text-indigo-600' },
];

export default function ThoughtRecordGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<ThoughtRecordData>({
    situation: '',
    emotions: {},
    automaticThought: '',
    evidenceFor: '',
    evidenceAgainst: '',
    balancedThought: '',
    action: '',
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const updateData = (field: keyof ThoughtRecordData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEmotion = (emotion: string, intensity: number) => {
    setData((prev) => ({
      ...prev,
      emotions: { ...prev.emotions, [emotion]: intensity },
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGuide = () => {
    setCurrentStep(1);
    setData({
      situation: '',
      emotions: {},
      automaticThought: '',
      evidenceFor: '',
      evidenceAgainst: '',
      balancedThought: '',
      action: '',
    });
    setIsCompleted(false);
  };

  const exportData = () => {
    const exportText = `
# Thought Record - ${new Date().toLocaleDateString()}

## 1. Situation
${data.situation}

## 2. Emotions
${Object.entries(data.emotions)
  .map(([emotion, intensity]) => `${emotion}: ${intensity}/10`)
  .join('\n')}

## 3. Automatic Thought
${data.automaticThought}

## 4. Evidence
**For:** ${data.evidenceFor}
**Against:** ${data.evidenceAgainst}

## 5. Balanced Thought & Action
**Balanced Thought:** ${data.balancedThought}
**Action:** ${data.action}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thought-record-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                1. Capture the Moment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                What happened? Describe the triggering situation in one crisp
                sentence.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Example:</strong> "Missed a project deadline."
              </p>
            </div>

            <textarea
              value={data.situation}
              onChange={(e) => updateData('situation', e.target.value)}
              placeholder="Describe what happened..."
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
              rows={3}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                2. Name the Feeling
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Rate each emotion 1–10 for intensity.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Example:</strong> Anxiety 8, Guilt 6.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emotionsList.map((emotion) => (
                <div
                  key={emotion.name}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{emotion.emoji}</span>
                      <span className={`font-medium ${emotion.color}`}>
                        {emotion.name}
                      </span>
                    </span>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {data.emotions[emotion.name] || 0}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={data.emotions[emotion.name] || 0}
                    onChange={(e) =>
                      updateEmotion(emotion.name, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                3. Spot the Automatic Thought
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Write the first thought that flashed through your mind.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Example:</strong> "I always mess things up."
              </p>
            </div>

            <textarea
              value={data.automaticThought}
              onChange={(e) => updateData('automaticThought', e.target.value)}
              placeholder="What was your first thought?"
              className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
              rows={3}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                4. Test the Evidence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                List facts for & against that thought. Keep it objective—dates,
                outcomes, witness feedback.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>For:</strong> I missed this deadline.
                <br />
                <strong>Against:</strong> 9 of 10 past projects were on time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidence FOR the thought
                </label>
                <textarea
                  value={data.evidenceFor}
                  onChange={(e) => updateData('evidenceFor', e.target.value)}
                  placeholder="What supports this thought?"
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Evidence AGAINST the thought
                </label>
                <textarea
                  value={data.evidenceAgainst}
                  onChange={(e) =>
                    updateData('evidenceAgainst', e.target.value)
                  }
                  placeholder="What contradicts this thought?"
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
                  rows={4}
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                5. Reframe & Plan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Craft a balanced alternative thought + one concrete next action.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Balanced thought:</strong> "One slip doesn't define my
                track record."
                <br />
                <strong>Action:</strong> Email the team with a recovery plan.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Balanced Thought
                </label>
                <textarea
                  value={data.balancedThought}
                  onChange={(e) =>
                    updateData('balancedThought', e.target.value)
                  }
                  placeholder="What's a more balanced way to think about this?"
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Concrete Action
                </label>
                <textarea
                  value={data.action}
                  onChange={(e) => updateData('action', e.target.value)}
                  placeholder="What's one specific action you can take?"
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Thought Record Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            You've successfully completed the 5-step thought transformation
            process.
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
            Your Thought Record Summary
          </h4>
          <div className="space-y-4 text-sm">
            <div>
              <strong>Situation:</strong> {data.situation}
            </div>
            <div>
              <strong>Emotions:</strong>{' '}
              {Object.entries(data.emotions)
                .filter(([_, intensity]) => intensity > 0)
                .map(([emotion, intensity]) => `${emotion} ${intensity}/10`)
                .join(', ')}
            </div>
            <div>
              <strong>Automatic Thought:</strong> {data.automaticThought}
            </div>
            <div>
              <strong>Balanced Thought:</strong> {data.balancedThought}
            </div>
            <div>
              <strong>Action:</strong> {data.action}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Why This Works
          </h4>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>
              • <strong>Interrupts</strong> the negative thought loop
            </li>
            <li>
              • <strong>Builds</strong> self-awareness & emotional regulation
            </li>
            <li>
              • <strong>Translates</strong> insight into action—habit loops, not
              just hindsight
            </li>
          </ul>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-4 font-medium">
            Try it daily for one week and track the shift in your mood data
            inside Mind Gleam.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={exportData}
            className="px-6 py-3 bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Record
          </button>
          <button
            onClick={resetGuide}
            className="px-6 py-3 bg-gradient-to-r from-blue-300 to-cyan-300 hover:from-blue-400 hover:to-cyan-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Start New Record
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Thought Record Guide
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Master a 5-step thought-shift exercise to transform difficult thoughts
          with evidence-based techniques (CBT-inspired).
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of 5
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((currentStep / 5) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pink-300 to-purple-300 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
            currentStep === 1
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-white'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <button
          onClick={nextStep}
          className="px-6 py-3 bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          {currentStep === 5 ? 'Complete' : 'Next'}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
