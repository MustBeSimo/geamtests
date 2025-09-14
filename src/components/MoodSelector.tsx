'use client';

import React, { memo } from 'react';

interface MoodEmoji {
  emoji: string;
  label: string;
}

interface MoodSelectorProps {
  selectedEmoji: string;
  moodRating: number;
  moodNote: string;
  onEmojiSelect: (emoji: string) => void;
  onRatingChange: (rating: number) => void;
  onNoteChange: (note: string) => void;
  disabled?: boolean;
}

const moodEmojis: MoodEmoji[] = [
  { emoji: '😢', label: 'Very Sad' },
  { emoji: '😞', label: 'Sad' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🙂', label: 'Happy' },
  { emoji: '😊', label: 'Very Happy' },
  { emoji: '😍', label: 'Excited' },
  { emoji: '🤗', label: 'Grateful' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '💪', label: 'Energized' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🏃‍♀️', label: 'Active' },
  { emoji: '🎉', label: 'Celebrating' }
];

const MoodSelector = memo(function MoodSelector({
  selectedEmoji,
  moodRating,
  moodNote,
  onEmojiSelect,
  onRatingChange,
  onNoteChange,
  disabled = false
}: MoodSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Tips for better AI interaction */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="text-xs text-blue-800 dark:text-blue-200">
          <div className="font-medium mb-1">💡 Tips for better AI insights:</div>
          <div className="text-left space-y-1">
            • Share what influenced your mood (work, relationships, events)
            <br />
            • Mention specific emotions (anxious, excited, frustrated, grateful)
            <br />
            • Include context about your day or recent experiences
            <br />
            • Be honest about challenges or wins you're experiencing
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Choose your mood:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodEmojis.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => onEmojiSelect(mood.emoji)}
              disabled={disabled}
              className={`p-3 rounded-lg text-2xl transition-all duration-200 ${
                selectedEmoji === mood.emoji
                  ? 'bg-blue-500 text-white scale-105 border-2 border-blue-600'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent hover:border-blue-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Rate your mood (1-10):
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">1</span>
          <input
            type="range"
            min="1"
            max="10"
            value={moodRating}
            onChange={(e) => onRatingChange(Number(e.target.value))}
            disabled={disabled}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">10</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium">
            {moodRating}
          </span>
        </div>
      </div>

      {/* Mood Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          What's on your mind? (optional)
        </label>
        <textarea
          value={moodNote}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={disabled}
          placeholder="Share what influenced your wellness today... Examples:
• 'Had a great workout this morning and feeling energized mentally'
• 'Feeling anxious about presentation, also didn't sleep well'
• 'Grateful for family time + took a nice walk together'
• 'Stressed about work but yoga helped me feel more centered'
• 'Ate healthy meals today and noticed better mood'"
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm disabled:opacity-50"
        />
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💭 The more context you share about your mind and body, the more personalized your wellness insights will be
        </div>
      </div>
    </div>
  );
});

export default MoodSelector;
export { moodEmojis };
export type { MoodEmoji }; 