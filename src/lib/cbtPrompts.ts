// CBT-inspired prompts and exercises for thought-shift coaching
// This library contains evidence-based cognitive behavioral techniques
// adapted for AI-assisted self-reflection and mood support

export interface ThoughtRecord {
  situation: string;
  emotion: string;
  intensity: number; // 1-10
  automaticThought: string;
  evidence: string[];
  balancedThought: string;
}

export interface CBTPrompt {
  id: string;
  category: 'thought-record' | 'mood-tracking' | 'behavioral-activation' | 'mindfulness';
  title: string;
  prompt: string;
  followUp?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Core CBT-inspired prompts for thought-shift exercises
export const cbtPrompts: CBTPrompt[] = [
  {
    id: 'thought-record-basic',
    category: 'thought-record',
    title: 'Basic Thought Record',
    prompt: "Let's explore that thought together. What specific situation triggered this feeling? Describe what happened in just a few words.",
    followUp: [
      "What emotion are you experiencing? How intense is it on a scale of 1-10?",
      "What thought went through your mind when you felt this way?",
      "What evidence supports this thought? What evidence challenges it?",
      "If a friend had this same thought, what would you tell them?"
    ],
    difficulty: 'beginner'
  },
  {
    id: 'catastrophic-thinking',
    category: 'thought-record',
    title: 'Challenging Catastrophic Thoughts',
    prompt: "I notice you might be imagining the worst-case scenario. Let's pause and examine this thought. What's the most realistic outcome here?",
    followUp: [
      "What's the best-case scenario?",
      "What's the most likely scenario based on your past experience?",
      "How would you cope if the worst case actually happened?",
      "What would you tell a friend who had this same worry?"
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'all-or-nothing',
    category: 'thought-record',
    title: 'Finding the Gray Area',
    prompt: "It sounds like you're seeing this situation in black and white terms. What might be some middle ground or gray areas here?",
    followUp: [
      "On a scale of 1-100, where does this situation really fall?",
      "What are some partial successes you can acknowledge?",
      "How might someone neutral view this situation?"
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'behavioral-activation-small',
    category: 'behavioral-activation',
    title: 'Small Step Forward',
    prompt: "When we're feeling low, small actions can create positive momentum. What's one tiny thing you could do today that might bring you a small sense of accomplishment?",
    followUp: [
      "How could you make this even smaller and more manageable?",
      "When specifically will you do this today?",
      "How will you celebrate this small win?"
    ],
    difficulty: 'beginner'
  },
  {
    id: 'mindful-breathing',
    category: 'mindfulness',
    title: 'Mindful Breathing Check-in',
    prompt: "Let's take a moment to ground ourselves. Can you take three deep breaths with me? Notice how your body feels right now.",
    followUp: [
      "What do you notice in your body? Any tension or relaxation?",
      "What thoughts are passing through your mind right now?",
      "Can you observe these thoughts without judging them as good or bad?"
    ],
    difficulty: 'beginner'
  }
];

// Thought-shift exercise templates
export const thoughtShiftExercises = {
  fiveStep: {
    title: "5-Step Thought-Shift Exercise",
    steps: [
      "NOTICE: What situation triggered this feeling?",
      "FEEL: What emotion am I experiencing and how intense is it?",
      "THINK: What automatic thought went through my mind?",
      "EXAMINE: What evidence supports or challenges this thought?",
      "SHIFT: What's a more balanced, realistic way to think about this?"
    ]
  },
  quickShift: {
    title: "Quick Thought-Shift",
    steps: [
      "What am I thinking right now?",
      "Is this thought helpful or unhelpful?",
      "What would I tell a good friend in this situation?"
    ]
  }
};

// Mood-supportive responses based on CBT principles
export const moodSupportResponses = {
  anxious: [
    "I hear that you're feeling anxious. That's a completely normal human experience. Let's explore what might be driving these feelings.",
    "Anxiety often comes from our mind trying to protect us by imagining potential problems. What specific worry is on your mind right now?"
  ],
  depressed: [
    "It sounds like you're going through a really tough time. Depression can make everything feel heavy and overwhelming.",
    "When we're feeling low, our thoughts can become very critical. Let's gently examine some of these thoughts together."
  ],
  overwhelmed: [
    "Feeling overwhelmed is your mind's way of saying there's too much to process at once. Let's break this down into smaller, manageable pieces.",
    "When everything feels like too much, sometimes the best thing we can do is focus on just the next small step."
  ],
  angry: [
    "Anger is often a signal that something important to us feels threatened or violated. What do you think might be underneath this anger?",
    "It's completely valid to feel angry. Let's explore what this emotion might be trying to tell you."
  ]
};

// Helper function to get appropriate prompt based on mood/situation
export function getCBTPrompt(category: string, mood?: string): CBTPrompt | null {
  const categoryPrompts = cbtPrompts.filter(p => p.category === category);
  if (categoryPrompts.length === 0) return null;
  
  // Return a random prompt from the category
  return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
}

// Helper function to get mood-supportive response
export function getMoodSupportResponse(mood: string): string {
  const responses = moodSupportResponses[mood as keyof typeof moodSupportResponses];
  if (!responses) return "I'm here to listen and support you. What's on your mind?";
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// CBT (Cognitive Behavioral Therapy) inspired prompts and techniques for holistic wellness coaching

export const CBT_TECHNIQUES = {
  // Cognitive Restructuring
  thoughtChallenging: {
    name: "Thought Challenging",
    description: "Examine and question negative thought patterns",
    prompts: [
      "What evidence supports this thought?",
      "What evidence contradicts this thought?", 
      "How would I advise a friend having this thought?",
      "What would be a more balanced way to think about this?",
      "Is this thought helpful or harmful to me right now?"
    ]
  },

  // Behavioral Activation (Mind-Body Integration)
  behavioralActivation: {
    name: "Mind-Body Activation",
    description: "Engage in meaningful activities that boost both mental and physical wellbeing",
    activities: [
      "Take a 10-minute mindful walk in nature",
      "Do 5 minutes of gentle stretching or yoga",
      "Call or text someone you care about while moving around",
      "Complete one small physical task (organize a space, prepare healthy food)",
      "Dance to your favorite song for 3 minutes",
      "Practice deep breathing with gentle movement",
      "Do something creative with your hands (draw, cook, garden)"
    ]
  },

  // Physical Wellness Integration
  physicalWellness: {
    name: "Body-Mind Connection",
    description: "Use physical practices to support mental health",
    activities: [
      "Progressive muscle relaxation (tense and release each muscle group)",
      "Take 10 deep breaths focusing on how your body feels",
      "Do wall push-ups or gentle strength exercises",
      "Drink a glass of water mindfully",
      "Step outside for fresh air and sunlight",
      "Gentle neck and shoulder rolls to release tension",
      "Quick energy boost: jumping jacks or marching in place"
    ]
  },

  // Mindfulness & Grounding
  grounding: {
    name: "Grounding Techniques",
    description: "Anchor yourself in the present moment",
    techniques: [
      "5-4-3-2-1: Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
      "Deep breathing: 4 counts in, 4 counts hold, 4 counts out",
      "Body scan: Notice tension and consciously relax each muscle group",
      "Name 3 things you're grateful for right now",
      "Describe your surroundings in detail"
    ]
  },

  // Problem Solving
  problemSolving: {
    name: "Problem Solving",
    description: "Break down challenges into manageable steps",
    steps: [
      "Define the problem clearly and specifically",
      "Brainstorm all possible solutions (even unrealistic ones)",
      "Evaluate pros and cons of each solution",
      "Choose the most realistic solution to try first",
      "Make a specific plan with small, actionable steps"
    ]
  }
};

export const MOOD_SPECIFIC_GUIDANCE = {
  lowMood: {
    range: [0, 4],
    focus: "Behavioral activation and self-compassion",
    techniques: [
      "Start with very small, achievable activities",
      "Practice self-compassion - treat yourself as you would a good friend",
      "Challenge negative self-talk with evidence-based thinking",
      "Engage in gentle movement or fresh air",
      "Connect with supportive people"
    ],
    affirmations: [
      "This feeling is temporary and will pass",
      "I am worthy of care and compassion",
      "Small steps forward are still progress",
      "I have overcome difficult times before",
      "It's okay to not be okay right now"
    ]
  },

  neutralMood: {
    range: [5, 6],
    focus: "Mindfulness and maintaining balance",
    techniques: [
      "Practice gratitude for the stability you're experiencing",
      "Use this calm space to plan for future challenges",
      "Engage in mindful activities that bring you joy",
      "Reflect on what's working well in your life",
      "Set realistic goals for personal growth"
    ],
    affirmations: [
      "I appreciate this moment of calm and stability",
      "I am building resilience for future challenges",
      "Balance is a valuable state to cultivate",
      "I can use this time to nurture myself",
      "Contentment is a form of happiness"
    ]
  },

  highMood: {
    range: [7, 10],
    focus: "Grounding and sustainable practices",
    techniques: [
      "Stay grounded while enjoying positive emotions",
      "Share your positive energy with others",
      "Document what's contributing to this good mood",
      "Plan how to maintain these positive patterns",
      "Practice gratitude for this uplifting experience"
    ],
    affirmations: [
      "I deserve to feel good and celebrate my wins",
      "I can maintain balance even in positive states",
      "This positive energy can be shared with others",
      "I'm learning what works well for my mental health",
      "Joy and happiness are my natural states"
    ]
  }
};

export const CRISIS_RESOURCES = {
  disclaimer: "🩺 Not a therapist • 18+ • Crisis? 988 (US) | 13 11 14 (AU)",
  resources: {
    us: {
      crisis: "988 - National Suicide Prevention Lifeline",
      text: "Text HOME to 741741 - Crisis Text Line",
      website: "suicidepreventionlifeline.org"
    },
    australia: {
      crisis: "13 11 14 - Lifeline Australia", 
      text: "Text 0477 13 11 14",
      website: "lifeline.org.au"
    },
    uk: {
      crisis: "116 123 - Samaritans",
      text: "Text SHOUT to 85258",
      website: "samaritans.org"
    }
  }
};

export const THOUGHT_PATTERNS = {
  common: [
    {
      name: "All-or-Nothing Thinking",
      description: "Seeing things in black and white, no middle ground",
      challenge: "Look for the gray areas and nuances in the situation"
    },
    {
      name: "Catastrophizing", 
      description: "Expecting the worst possible outcome",
      challenge: "Consider more realistic and likely outcomes"
    },
    {
      name: "Mind Reading",
      description: "Assuming you know what others are thinking",
      challenge: "Focus on facts rather than assumptions"
    },
    {
      name: "Emotional Reasoning",
      description: "Believing that feelings reflect reality",
      challenge: "Separate emotions from facts and evidence"
    },
    {
      name: "Should Statements",
      description: "Rigid expectations about how things 'should' be",
      challenge: "Replace 'should' with 'could' or 'prefer'"
    }
  ]
};

export const DAILY_PRACTICES = {
  morning: [
    "Set three realistic intentions for the day",
    "Practice 5 minutes of mindful breathing",
    "Write down one thing you're looking forward to",
    "Do gentle stretching or movement",
    "Eat a nourishing breakfast mindfully"
  ],
  
  midday: [
    "Take a brief mental health check-in",
    "Step outside for fresh air and sunlight",
    "Practice gratitude for something in your day",
    "Connect with a friend or loved one",
    "Do one small act of self-care"
  ],
  
  evening: [
    "Reflect on three positive moments from your day",
    "Practice progressive muscle relaxation",
    "Write in a journal about your thoughts and feelings",
    "Prepare for tomorrow with gentle planning",
    "Engage in a calming bedtime routine"
  ]
};

// Helper function to get mood-specific guidance
export function getMoodGuidance(rating: number) {
  if (rating <= 4) return MOOD_SPECIFIC_GUIDANCE.lowMood;
  if (rating <= 6) return MOOD_SPECIFIC_GUIDANCE.neutralMood;
  return MOOD_SPECIFIC_GUIDANCE.highMood;
}

// Helper function to get random technique from category
export function getRandomTechnique(category: keyof typeof CBT_TECHNIQUES) {
  const technique = CBT_TECHNIQUES[category];
  if ('prompts' in technique) {
    return technique.prompts[Math.floor(Math.random() * technique.prompts.length)];
  }
  if ('activities' in technique) {
    return technique.activities[Math.floor(Math.random() * technique.activities.length)];
  }
  if ('techniques' in technique) {
    return technique.techniques[Math.floor(Math.random() * technique.techniques.length)];
  }
  return technique.description;
} 