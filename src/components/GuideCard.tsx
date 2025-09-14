'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedText from '@/components/AnimatedText';
import ThoughtRecordGuide from '@/components/ThoughtRecordGuide';
import BreathingTechniquesGuide from '@/components/BreathingTechniquesGuide';
import EnergyBoostWorkoutGuide from '@/components/EnergyBoostWorkoutGuide';
import SleepHygieneGuide from '@/components/SleepHygieneGuide';

interface GuideCardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  downloadUrl?: string;
  className?: string;
  isFree?: boolean;
  requiresSignIn?: boolean;
}

export default function GuideCard({
  title = "MindGuide",
  description = "Evidence-based tools for mental wellness",
  imageSrc = "/images/guides/thought-record.png",
  downloadUrl = "#",
  className = '',
}: GuideCardProps) {
  const [showInteractiveGuide, setShowInteractiveGuide] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { user } = useAuth();

  const guideCategories = [
    {
      id: 'free-tools',
      title: 'Free Wellness Tools',
      description: 'Available to everyone',
      icon: '🆓',
      color: 'emerald',
      guides: [
        {
          title: "Thought Record Guide",
          description: "Master a 5-step thought-shift exercise to transform difficult thoughts with evidence-based techniques (CBT-inspired)",
          imageSrc: "/images/guides/thought-record-guide.png",
          downloadUrl: "#",
          hasInteractive: true,
          isFree: true,
          tags: ['CBT', 'Anxiety', 'Depression'],
          guideComponent: 'thought-record'
        },
        {
          title: "Breathing Techniques Collection",
          description: "Simple but powerful breathing exercises for instant calm and stress relief",
          imageSrc: "/images/guides/breathing-techniques-collection.png",
          downloadUrl: "#",
          hasInteractive: true,
          isFree: true,
          tags: ['Stress', 'Anxiety', 'Sleep'],
          guideComponent: 'breathing'
        },
        {
          title: "10-Minute Energy Boost Workout",
          description: "Quick, effective exercises to boost your energy and mood when you're feeling low or sluggish",
          imageSrc: "/images/guides/10-minute-energy-boost-workout.png",
          downloadUrl: "#",
          hasInteractive: true,
          isFree: true,
          tags: ['Exercise', 'Energy', 'Mood', 'Physical'],
          guideComponent: 'workout'
        },
        {
          title: "Sleep Hygiene Checklist",
          description: "Evidence-based sleep strategies to improve your rest and support mental wellness",
          imageSrc: "/images/guides/sleep-hygiene-checklist.png",
          downloadUrl: "#",
          hasInteractive: true,
          isFree: true,
          tags: ['Sleep', 'Recovery', 'Physical', 'Mental Health'],
          guideComponent: 'sleep'
        }
      ]
    }
  ];

  if (showInteractiveGuide || activeGuide) {
    const renderGuideComponent = () => {
      if (activeGuide === 'breathing') return <BreathingTechniquesGuide />;
      if (activeGuide === 'workout') return <EnergyBoostWorkoutGuide />;
      if (activeGuide === 'sleep') return <SleepHygieneGuide />;
      if (activeGuide === 'thought-record') return <ThoughtRecordGuide />;
      return <ThoughtRecordGuide />;
    };

    const getGuideTitle = () => {
      if (activeGuide === 'breathing') return 'Breathing Techniques Collection';
      if (activeGuide === 'workout') return '10-Minute Energy Boost Workout';
      if (activeGuide === 'sleep') return 'Sleep Hygiene Checklist';
      if (activeGuide === 'thought-record') return 'Interactive Thought Record Guide';
      return 'Interactive Thought Record Guide';
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {getGuideTitle()}
          </h3>
          <button
            onClick={() => {
              setShowInteractiveGuide(false);
              setActiveGuide(null);
            }}
            className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </button>
        </div>
        {renderGuideComponent()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {guideCategories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Category Header */}
          <button
            onClick={() => setExpandedCategory(
              expandedCategory === category.id ? null : category.id
            )}
            className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {category.guides.length} resource{category.guides.length !== 1 ? 's' : ''}
              </span>
              <motion.div
                animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </button>

          {/* Category Content */}
          <motion.div
            initial={false}
            animate={{
              height: expandedCategory === category.id ? "auto" : 0,
              opacity: expandedCategory === category.id ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {category.guides.map((guide, index) => (
                <GuideItem
                  key={index}
                  guide={guide}
                  category={category}
                  user={user}
                  onStartInteractive={() => {
                    if (guide.guideComponent) {
                      setActiveGuide(guide.guideComponent);
                    } else {
                      setShowInteractiveGuide(true);
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Quick Access Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            💡 Need Something Specific?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Can't find what you're looking for? We're constantly adding new resources based on user feedback.
          </p>
          <button 
            onClick={() => {
              const subject = encodeURIComponent('Resource Suggestion for Mind Gleam');
              const body = encodeURIComponent(`Hi Simone,

I'd like to suggest a new resource for the Mind Gleam CBT Guides section:

[Please describe your suggested resource here]

Resource Type: [e.g., Guide, Worksheet, Exercise]
Topic: [e.g., Anxiety, Depression, Sleep, etc.]
Description: [Brief description of what this resource would cover]

Thank you!`);
              window.location.href = `mailto:simone@w230.net?subject=${subject}&body=${body}`;
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Suggest a Resource
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface GuideItemProps {
  guide: any;
  category: any;
  user: any;
  onStartInteractive: () => void;
}

function GuideItem({ guide, category, user, onStartInteractive }: GuideItemProps) {
  const canAccess = guide.isFree || (guide.requiresSignIn && user);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-lg overflow-hidden shadow-md ${
        canAccess ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-32 h-32 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center overflow-hidden">
          {guide.imageSrc ? (
            <img 
              src={guide.imageSrc} 
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl opacity-50">📚</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${
                canAccess ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {guide.title}
                {guide.isExternal && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">External</span>}
                {!guide.isFree && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Premium</span>}
              </h4>
              <p className={`text-sm mb-2 ${
                canAccess ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {guide.description}
              </p>
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {guide.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {guide.hasInteractive && canAccess && (
              <button
                onClick={onStartInteractive}
                className={`flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 hover:from-${category.color}-600 hover:to-${category.color}-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Interactive
              </button>
            )}

            {canAccess ? (
              <a
                href={guide.downloadUrl}
                target={guide.isExternal ? "_blank" : "_self"}
                rel={guide.isExternal ? "noopener noreferrer" : ""}
                className={`flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {guide.downloadUrl === "#" ? "View Guide" : guide.isFree ? "Download Free" : "Download"}
              </a>
            ) : (
              <button
                onClick={() => alert('Please sign in to access premium resources')}
                className="flex-1 sm:flex-none px-3 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                disabled
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sign In Required
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lock Overlay for Premium */}
      {!canAccess && (
        <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {guide.requiresSignIn ? 'Sign in to access' : 'Premium resource'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
} 