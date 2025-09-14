'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkoutPhaseProps {
  title: string;
  duration: string;
  description: string;
  exercises: Array<{
    name: string;
    duration: string;
    description: string;
    modifications?: string;
    icon: string;
  }>;
  color: string;
  isActive: boolean;
  onToggle: () => void;
}

function WorkoutPhase({ 
  title, 
  duration, 
  description, 
  exercises, 
  color, 
  isActive, 
  onToggle 
}: WorkoutPhaseProps) {
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
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600 flex items-center justify-center text-white font-bold`}>
              {duration.split(' ')[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {duration} • {description}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{exercise.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exercise.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200`}>
                            {exercise.duration}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {exercise.description}
                        </p>
                        {exercise.modifications && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-2">
                            <p className="text-blue-800 dark:text-blue-300 text-sm">
                              <strong>Modification:</strong> {exercise.modifications}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TimerProps {
  isActive: boolean;
  timeLeft: number;
  phase: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function WorkoutTimer({ isActive, timeLeft, phase, onStart, onPause, onReset }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center"
    >
      <h3 className="text-lg font-semibold mb-2">{phase}</h3>
      <div className="text-4xl font-mono font-bold mb-4">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="flex gap-2 justify-center">
        {!isActive ? (
          <button
            onClick={onStart}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            ▶️ Start
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            ⏸️ Pause
          </button>
        )}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
        >
          🔄 Reset
        </button>
      </div>
    </motion.div>
  );
}

export default function EnergyBoostWorkoutGuide() {
  const [activePhase, setActivePhase] = useState<string>('warmup');
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes total
  const [currentPhase, setCurrentPhase] = useState('Ready to Start');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const workoutPhases = [
    {
      id: 'warmup',
      title: 'Warm-Up',
      duration: '2 minutes',
      description: 'Prepare your muscles and heart for movement',
      color: 'green',
      exercises: [
        {
          name: 'March in Place',
          duration: '30 seconds',
          description: 'Lift your knees gently and swing your arms.',
          icon: '🚶'
        },
        {
          name: 'Arm Circles',
          duration: '30 seconds',
          description: 'Extend your arms to the side and draw small circles forward, then backward.',
          icon: '🔄'
        },
        {
          name: 'Bodyweight Squats',
          duration: '30 seconds',
          description: 'Stand with feet shoulder-width apart, lower into a squat and rise slowly.',
          icon: '⬇️'
        },
        {
          name: 'Dynamic Calf Stretch',
          duration: '30 seconds',
          description: 'Step one foot back, press the heel toward the floor and alternate legs.',
          icon: '🦵'
        }
      ]
    },
    {
      id: 'circuit',
      title: 'Main Circuit',
      duration: '6 minutes',
      description: 'High-energy exercises to boost mood and energy',
      color: 'red',
      exercises: [
        {
          name: 'Jumping Jacks',
          duration: '45 seconds',
          description: 'Traditional jumping jacks to increase cardiovascular output.',
          modifications: 'Low-impact option: step one leg out at a time instead of jumping.',
          icon: '🤸'
        },
        {
          name: 'Bodyweight Squats',
          duration: '45 seconds',
          description: 'Feet shoulder-width apart, lower your hips back and down as if sitting into a chair, then press through your heels to stand.',
          icon: '⬇️'
        },
        {
          name: 'Push-Ups',
          duration: '45 seconds',
          description: 'Begin in a plank position. Lower your chest toward the floor, keeping elbows at a 45° angle, then push back up.',
          modifications: 'Place hands on a wall or sturdy table for easier variation.',
          icon: '💪'
        },
        {
          name: 'Reverse Lunges',
          duration: '45 seconds',
          description: 'Step one foot back and lower the knee toward the floor until both knees are at roughly 90° angles. Return to standing and switch legs.',
          icon: '🏃'
        },
        {
          name: 'Mountain Climbers',
          duration: '45 seconds',
          description: 'From a plank, draw your knees toward your chest one at a time at a brisk pace.',
          modifications: 'March in place with high knees for gentler option.',
          icon: '⛰️'
        },
        {
          name: 'Plank Hold',
          duration: '45 seconds',
          description: 'Forearms or hands on the floor, body in a straight line from head to heels. Engage your core and glutes.',
          modifications: 'Drop to your knees to modify.',
          icon: '🏋️'
        }
      ]
    },
    {
      id: 'cooldown',
      title: 'Cool-Down',
      duration: '2 minutes',
      description: 'Bring your heart rate back to baseline and aid recovery',
      color: 'blue',
      exercises: [
        {
          name: 'Standing Forward Fold',
          duration: '30 seconds',
          description: 'With feet hip-width apart, hinge at the hips and let your upper body relax. Feel the stretch in the hamstrings and lower back.',
          icon: '🧘'
        },
        {
          name: 'Quad Stretch',
          duration: '30 seconds per leg',
          description: 'Stand on one leg, hold the opposite foot behind you and gently press the hips forward to stretch the thigh.',
          modifications: 'Use a wall for balance if needed.',
          icon: '🦵'
        },
        {
          name: 'Chest Opener with Deep Breathing',
          duration: '30 seconds',
          description: 'Interlace your fingers behind your back, gently straighten your arms and lift your chest. Take slow, deep breaths.',
          icon: '🫁'
        }
      ]
    }
  ];

  const customizationTips = [
    {
      title: 'Progress gradually',
      description: 'If you\'re new to exercise or returning after a break, begin with shorter intervals (20–30 seconds) and longer rest periods.',
      icon: '📈'
    },
    {
      title: 'Mix and match',
      description: 'Swap in other body-weight exercises such as glute bridges, plank shoulder taps, or step-ups to keep the routine interesting.',
      icon: '🔄'
    },
    {
      title: 'Add mindfulness',
      description: 'Paying attention to your breathing and the sensations in your body can amplify the mood-boosting effects of exercise.',
      icon: '🧠'
    },
    {
      title: 'Be consistent',
      description: 'Start with one 10-minute session a day and gradually aim for the recommended 30 minutes of moderate exercise most days of the week.',
      icon: '📅'
    }
  ];

  const handleTimerStart = () => {
    setTimerActive(true);
    setCurrentPhase('Workout in Progress');
  };

  const handleTimerPause = () => {
    setTimerActive(false);
  };

  const handleTimerReset = () => {
    setTimerActive(false);
    setTimeLeft(600);
    setCurrentPhase('Ready to Start');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
            ⚡
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            10-Minute Energy Boost Workout
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A quick workout routine designed to improve energy and mood when you're feeling low. 
            Short bursts of physical activity can revitalize both body and mind, with research showing 
            that even 10-minute sessions deliver significant mental health benefits.
          </p>
        </motion.div>

        {/* Research Evidence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-orange-800 dark:text-orange-300">
            <strong>Evidence-based:</strong> Studies show that 30 minutes of moderate exercise can be broken into 
            three 10-minute sessions with equivalent benefits. Healthcare workers found that short 10-minute 
            physical-activity breaks improved attention and cognitive performance.
          </p>
        </motion.div>
      </div>

      {/* Safety Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-8"
      >
        <div className="flex items-start gap-3">
          <div className="text-red-500 text-xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">Safety First</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">
              Consult your doctor before beginning any new exercise routine, especially if you have a medical condition 
              or are pregnant. Warm up properly, move within your limits, and stop if you feel pain or dizziness.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Workout Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Workout Overview
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">⏱️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">10 minutes total</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Intensity</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Moderate - still able to speak</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Frequency</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Up to 3x daily for 30 min total</p>
          </div>
        </div>
      </motion.div>

      {/* Timer */}
      <WorkoutTimer
        isActive={timerActive}
        timeLeft={timeLeft}
        phase={currentPhase}
        onStart={handleTimerStart}
        onPause={handleTimerPause}
        onReset={handleTimerReset}
      />

      {/* Workout Phases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Workout Phases
        </h2>
        {workoutPhases.map((phase) => (
          <WorkoutPhase
            key={phase.id}
            title={phase.title}
            duration={phase.duration}
            description={phase.description}
            exercises={phase.exercises}
            color={phase.color}
            isActive={activePhase === phase.id}
            onToggle={() => setActivePhase(
              activePhase === phase.id ? '' : phase.id
            )}
          />
        ))}
      </div>

      {/* Customization Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Making It Your Own
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {customizationTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
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
        transition={{ delay: 1 }}
        className="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Build Your Energy & Resilience
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Regular movement is one of the best ways to lift energy and mood. Short, effective workouts like this 
          can fit into busy schedules and provide immediate cognitive benefits. Over time, consistent exercise 
          builds resilience, improves mental health, and helps you sleep better.
        </p>
      </motion.div>
    </div>
  );
}