declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      },
      HTMLElement
    >;
  }
}

interface Window {
  'elevenlabs-widget:start': CustomEvent;
  'elevenlabs-widget:end': CustomEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'elevenlabs-convai': HTMLElement & {
      'agent-id': string;
    };
  }
}
