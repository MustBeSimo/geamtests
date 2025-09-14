export interface Profile {
  id: string;
  updated_at: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  subscription_status: 'free' | 'premium';
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  avatar_style: 'friend' | 'professional' | 'minimal' | null;
  created_at: string;
}

export interface UserBalance {
  id: string;
  user_id: string;
  balance: number;
  mood_checkins_remaining: number;
  voice_time_remaining: number | null;
  updated_at: string;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood_emoji: string | null;
  mood_rating: number | null;
  mood_note: string | null;
  insight: string | null;
  cbt_technique: string | null;
  affirmation: string | null;
  action_step: string | null;
  created_at: string;
}

export interface MoodReport {
  insight: string;
  cbtTechnique: string;
  affirmation: string;
  actionStep: string;
  date?: string;
  mood_emoji?: string;
  mood_rating?: number;
  mood_note?: string;
}

export interface PeriodMoodReport {
  overview: string;
  insights: string[];
  cbtTechnique: string;
  affirmation: string;
  recommendations: string[];
  statistics: {
    averageMood: number;
    moodRange: {
      min: number;
      max: number;
    };
    mostCommonEmoji: string;
    trend: string;
    moodSummary: string;
    totalEntries: number;
  };
  period: string;
  dateRange: string;
  totalEntries: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  cancel_at: string | null;
  canceled_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created: string;
  ended_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}

export interface BalanceResponse {
  balance: number;
  moodCheckins: number;
}

export interface ChatResponse {
  message: string;
  remaining_balance: number;
  fallback?: boolean;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Component Props Types
export interface ChatCardProps {
  selectedAvatar: 'gigi' | 'vee' | 'lumo';
  colorScheme: {
    gradient: string;
    primaryColor: string;
    accentColor: string;
    bgPrimary: string;
    borderColor: string;
    textColor: string;
    buttonColor: string;
  };
  balance: number;
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface ThoughtRecordData {
  situation: string;
  mood: string;
  thoughts: string;
  evidence: string;
  balanced_thought: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'id'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      user_balances: {
        Row: UserBalance;
        Insert: Omit<UserBalance, 'id' | 'created_at'>;
        Update: Partial<Omit<UserBalance, 'id' | 'user_id'>>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created'>;
        Update: Partial<Omit<Subscription, 'id' | 'user_id'>>;
      };
      mood_logs: {
        Row: MoodLog;
        Insert: Omit<MoodLog, 'id' | 'created_at'>;
        Update: Partial<Omit<MoodLog, 'id' | 'user_id'>>;
      };
    };
    Functions: {
      is_subscription_active: (user_id: string) => boolean;
    };
  };
}
