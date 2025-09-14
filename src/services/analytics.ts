import { supabase } from '@/utils/supabase';

export enum AnalyticsEventType {
  MOOD_CHECKIN = 'mood_checkin',
  VOICE_CHAT_START = 'voice_chat_start',
  VOICE_CHAT_END = 'voice_chat_end',
  CHAT_MESSAGE = 'chat_message',
  REPORT_DOWNLOAD = 'report_download',
  SUBSCRIPTION_PURCHASE = 'subscription_purchase',
  CREDITS_PURCHASE = 'credits_purchase',
}

class AnalyticsService {
  async trackEvent(
    eventType: AnalyticsEventType,
    metadata?: Record<string, any>
  ) {
    try {
      const { error } = await supabase.from('analytics_events').insert({
        event_type: eventType,
        metadata: metadata,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error('Analytics error:', error);
      }
    } catch (err) {
      console.error('Failed to track analytics event:', err);
    }
  }

  async trackWidgetLoad(userId: string, success: boolean, error?: string) {
    await this.trackEvent(AnalyticsEventType.MOOD_CHECKIN, { success, error });
  }

  async trackWidgetError(userId: string, error: Error) {
    await this.trackEvent(AnalyticsEventType.MOOD_CHECKIN, {
      error_message: error.message,
      error_stack: error.stack,
    });
  }

  async trackVoiceChatSession(userId: string, startTime: Date, endTime?: Date) {
    if (!endTime) {
      await this.trackEvent(AnalyticsEventType.VOICE_CHAT_START, {
        timestamp: startTime.toISOString(),
      });
    } else {
      await this.trackEvent(AnalyticsEventType.VOICE_CHAT_END, {
        duration_seconds: Math.round(
          (endTime.getTime() - startTime.getTime()) / 1000
        ),
      });
    }
  }

  async trackMicrophonePermission(userId: string, granted: boolean) {
    if (!granted) {
      await this.trackEvent(AnalyticsEventType.MOOD_CHECKIN, {
        mic_permission_denied: true,
      });
    }
  }
}

export const analytics = new AnalyticsService();
