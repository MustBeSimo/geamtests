export const COLORS = {
  neonPink: 'var(--neon-pink)',
  neonPurple: 'var(--neon-purple)',
  neonBlue: 'var(--neon-blue)',
  neonYellow: 'var(--neon-yellow)',
} as const;

export const ANIMATION_SETTINGS = {
  scrollMargin: '-100px',
  defaultDuration: 0.6,
  defaultStagger: 0.2,
  defaultEase: 'easeInOut',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const SOCIAL_LINKS = [
  {
    icon: 'instagram',
    color: 'pink',
    url: 'https://www.instagram.com/mind_gleam_app/',
  },
  { icon: 'twitter', color: 'blue', url: 'https://x.com/mindgleamai' },
  {
    icon: 'tiktok',
    color: 'purple',
    url: 'https://www.tiktok.com/@heyitsgigiai',
  },
  {
    icon: 'pinterest',
    color: 'red',
    url: 'https://au.pinterest.com/HeyItsGigiAi/',
  },
] as const;
