'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SleepCategoryProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  tips: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  isExpanded: boolean;
  onToggle: () => void;
}

function SleepCategory({ 
  title, 
  description, 
  icon, 
  color, 
  tips, 
  isExpanded, 
  onToggle 
}: SleepCategoryProps) {
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
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="text-2xl">{tip.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {tip.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ChecklistItemProps {
  item: {
    title: string;
    description: string;
    icon: string;
  };
  isChecked: boolean;
  onToggle: () => void;
}

function ChecklistItem({ item, isChecked, onToggle }: ChecklistItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isChecked 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isChecked 
            ? 'border-green-500 bg-green-500' 
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {isChecked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </motion.svg>
          )}
        </div>
        <div className="text-2xl">{item.icon}</div>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${
            isChecked ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'
          }`}>
            {item.title}
          </h4>
          <p className={`text-sm ${
            isChecked ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SleepHygieneGuide() {
  const [expandedCategory, setExpandedCategory] = useState<string>('schedule');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showChecklist, setShowChecklist] = useState(false);

  const sleepCategories = [
    {
      id: 'schedule',
      title: 'Set Your Sleep Schedule',
      description: 'Establish consistent sleep and wake times',
      icon: '⏰',
      color: 'blue',
      tips: [
        {
          title: 'Fix your wake-up time',
          description: 'Rise at the same time every day, including weekends, to stabilize your internal clock.',
          icon: '🌅'
        },
        {
          title: 'Prioritize sleep',
          description: 'Treat sleep as an essential task. Calculate your bedtime based on when you need to wake up and aim to be in bed at that time.',
          icon: '🎯'
        },
        {
          title: 'Adjust gradually',
          description: 'If you need to shift your schedule, make small changes of 1–2 hours rather than abrupt swings.',
          icon: '📈'
        },
        {
          title: 'Limit naps',
          description: 'Short daytime naps can be refreshing, but long or late naps may interfere with nighttime sleep. Keep naps brief and schedule them in the early afternoon.',
          icon: '😴'
        }
      ]
    },
    {
      id: 'routine',
      title: 'Follow a Nightly Routine',
      description: 'Create consistent pre-sleep activities',
      icon: '🌙',
      color: 'purple',
      tips: [
        {
          title: 'Stay consistent',
          description: 'Perform the same pre-sleep activities (putting on pajamas, brushing teeth) in the same order each night.',
          icon: '🔄'
        },
        {
          title: 'Budget wind-down time',
          description: 'Dedicate about 30 minutes to quiet activities such as light stretching, soft music, or reading.',
          icon: '⏳'
        },
        {
          title: 'Dim the lights',
          description: 'Reduce exposure to bright light in the evening to support melatonin production.',
          icon: '💡'
        },
        {
          title: 'Unplug electronics',
          description: 'Avoid screens (phones, tablets, TVs) for 30–60 minutes before bed; the mental stimulation and blue light can delay sleep.',
          icon: '📱'
        },
        {
          title: 'Practice relaxation techniques',
          description: 'Breathing exercises, meditation, or mindfulness can ease your mind and prepare you for sleep.',
          icon: '🧘'
        },
        {
          title: 'Leave the bed if you can\'t sleep',
          description: 'If you\'re awake for more than 20 minutes, get up and do a quiet activity in low light, then return to bed when sleepy.',
          icon: '🚶'
        }
      ]
    },
    {
      id: 'habits',
      title: 'Cultivate Healthy Daily Habits',
      description: 'Daytime choices that influence nighttime rest',
      icon: '☀️',
      color: 'orange',
      tips: [
        {
          title: 'Get daylight exposure',
          description: 'Natural light during the day helps regulate your circadian rhythm.',
          icon: '🌞'
        },
        {
          title: 'Stay active',
          description: 'Regular exercise makes it easier to fall asleep and has numerous health benefits.',
          icon: '🏃'
        },
        {
          title: 'Avoid nicotine',
          description: 'Nicotine is a stimulant that disrupts sleep.',
          icon: '🚭'
        },
        {
          title: 'Limit alcohol',
          description: 'Alcohol may make you sleepy initially but disrupts sleep later in the night.',
          icon: '🍷'
        },
        {
          title: 'Cut down on caffeine after lunch',
          description: 'Caffeine can keep you wired even when you want to rest.',
          icon: '☕'
        },
        {
          title: 'Finish meals early',
          description: 'Avoid heavy or spicy meals close to bedtime; allow at least 2–3 hours for digestion.',
          icon: '🍽️'
        },
        {
          title: 'Reserve the bed for sleep and intimacy',
          description: 'Restrict other activities (work, TV, reading) in bed to build a strong association between bed and sleep.',
          icon: '🛏️'
        }
      ]
    },
    {
      id: 'environment',
      title: 'Optimize Your Bedroom Environment',
      description: 'Create a comfortable, quiet, and dark space',
      icon: '🏠',
      color: 'green',
      tips: [
        {
          title: 'Invest in a supportive mattress and pillow',
          description: 'A comfortable sleeping surface is fundamental.',
          icon: '🛏️'
        },
        {
          title: 'Use quality bedding',
          description: 'Choose sheets and blankets that feel good against your skin.',
          icon: '🧾'
        },
        {
          title: 'Set a cool temperature',
          description: 'Keep the bedroom slightly cool; around 18°C (65°F) is often recommended.',
          icon: '🌡️'
        },
        {
          title: 'Block light',
          description: 'Use blackout curtains or an eye mask to prevent light intrusion.',
          icon: '🔒'
        },
        {
          title: 'Reduce noise',
          description: 'Earplugs, white noise machines, or a fan can mask disruptive sounds.',
          icon: '🔇'
        },
        {
          title: 'Try calming scents',
          description: 'Light fragrances such as lavender may promote relaxation.',
          icon: '🌸'
        }
      ]
    }
  ];

  // Create a checklist from all tips
  const allTips = sleepCategories.flatMap(category => 
    category.tips.map(tip => ({
      ...tip,
      category: category.title,
      id: `${category.id}-${tip.title.toLowerCase().replace(/\s+/g, '-')}`
    }))
  );

  const toggleChecklistItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const completionPercentage = Math.round((checkedItems.size / allTips.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-2xl">
            😴
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sleep Hygiene Checklist
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Good sleep is essential for physical and mental health. Sleep hygiene refers to creating a bedroom 
            environment and daily routines that promote consistent, uninterrupted rest. These evidence-based 
            practices can improve sleep quality, mental health, and productivity.
          </p>
        </motion.div>

        {/* Research Evidence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            <strong>Evidence-based:</strong> Adopting strong sleep hygiene practices has little cost and has been 
            identified as an effective public health strategy to counteract widespread problems of insufficient sleep 
            and insomnia. Good sleep is linked to better mental health, improved productivity, and higher quality of life.
          </p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setShowChecklist(false)}
            className={`px-4 py-2 rounded-md transition-colors ${
              !showChecklist 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📚 Learn About Sleep Hygiene
          </button>
          <button
            onClick={() => setShowChecklist(true)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showChecklist 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ✅ Interactive Checklist
          </button>
        </div>
      </motion.div>

      {showChecklist && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 mb-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Sleep Hygiene Progress
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300 dark:text-gray-600"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className="text-green-500"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${completionPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-gray-600 dark:text-gray-400">
                  {checkedItems.size} of {allTips.length} practices completed
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Keep going! Every small change helps improve your sleep quality.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!showChecklist ? (
        /* Educational Content */
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Four Pillars of Sleep Hygiene
          </h2>
          {sleepCategories.map((category) => (
            <SleepCategory
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              color={category.color}
              tips={category.tips}
              isExpanded={expandedCategory === category.id}
              onToggle={() => setExpandedCategory(
                expandedCategory === category.id ? '' : category.id
              )}
            />
          ))}
        </div>
      ) : (
        /* Interactive Checklist */
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Personal Sleep Hygiene Checklist
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Check off each practice as you implement it into your routine. Remember, sleep hygiene isn't about 
            rigid rules—it's about creating habits that invite better sleep.
          </p>
          
          {sleepCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                {category.title}
              </h3>
              <div className="grid gap-3">
                {category.tips.map((tip) => {
                  const itemId = `${category.id}-${tip.title.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <ChecklistItem
                      key={itemId}
                      item={tip}
                      isChecked={checkedItems.has(itemId)}
                      onToggle={() => toggleChecklistItem(itemId)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Final Thoughts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Remember: Progress, Not Perfection
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Sleep hygiene isn't about following rigid rules—it's about creating habits and spaces that invite sleep. 
          Because humans are creatures of habit, internalizing these practices over time can lead to lasting 
          improvements in sleep quality and overall wellbeing. Start with one or two changes and build from there.
        </p>
      </motion.div>
    </div>
  );
}