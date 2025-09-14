export interface ElevenLabsWidget {
  on: (event: string, callback: (error?: Error) => void) => void;
  destroy: () => void;
}

export interface ElevenLabsWindow {
  ElevenLabs: {
    init: (config: {
      apiKey: string | undefined;
      voiceId: string;
      container: HTMLDivElement;
    }) => ElevenLabsWidget;
  };
}

declare global {
  interface Window extends ElevenLabsWindow {}
}
