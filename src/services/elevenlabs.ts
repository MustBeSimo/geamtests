interface Voice {
  voice_id: string;
  name: string;
  samples: Array<{
    sample_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    hash: string;
  }>;
  category: string;
  fine_tuning: {
    model_id: string;
    language: string;
    is_fine_tuning_complete: boolean;
    verification_attempts: number;
    verification_failures: number;
    verification_attempts_remaining: number;
  };
  labels: Record<string, string>;
  description: string;
  preview_url: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true,
};

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error('Missing ELEVENLABS_API_KEY environment variable');
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY as string;
  }

  async textToSpeech(
    text: string,
    voiceId: string,
    settings: Partial<VoiceSettings> = {}
  ): Promise<ArrayBuffer> {
    const voiceSettings = { ...DEFAULT_VOICE_SETTINGS, ...settings };

    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2',
        voice_settings: voiceSettings,
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  async getVoices(): Promise<Voice[]> {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const elevenLabsService = new ElevenLabsService();
