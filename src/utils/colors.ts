// Unified Mind Gleam color palette and gradient system
export const mindgleamColors = {
  mint: {
    light: 'from-mindgleam-mint-100 to-mindgleam-mint-200',
    medium: 'from-mindgleam-mint-300 to-mindgleam-mint-400',
    dark: 'from-mindgleam-mint-500 to-mindgleam-mint-600',
    bg: 'bg-mindgleam-mint-50',
    text: 'text-mindgleam-mint-600',
    border: 'border-mindgleam-mint-200',
  },
  peach: {
    light: 'from-mindgleam-peach-100 to-mindgleam-peach-200',
    medium: 'from-mindgleam-peach-300 to-mindgleam-peach-400',
    dark: 'from-mindgleam-peach-500 to-mindgleam-peach-600',
    bg: 'bg-mindgleam-peach-50',
    text: 'text-mindgleam-peach-600',
    border: 'border-mindgleam-peach-200',
  },
  lavender: {
    light: 'from-mindgleam-lavender-100 to-mindgleam-lavender-200',
    medium: 'from-mindgleam-lavender-300 to-mindgleam-lavender-400',
    dark: 'from-mindgleam-lavender-500 to-mindgleam-lavender-600',
    bg: 'bg-mindgleam-lavender-50',
    text: 'text-mindgleam-lavender-600',
    border: 'border-mindgleam-lavender-200',
  },
  gold: {
    light: 'from-mindgleam-gold-100 to-mindgleam-gold-200',
    medium: 'from-mindgleam-gold-300 to-mindgleam-gold-400',
    dark: 'from-mindgleam-gold-500 to-mindgleam-gold-600',
    bg: 'bg-mindgleam-gold-50',
    text: 'text-mindgleam-gold-600',
    border: 'border-mindgleam-gold-200',
  }
};

// Unified gradient combinations for consistent branding
export const mindgleamGradients = {
  primary: 'from-mindgleam-mint-300 via-mindgleam-peach-200 to-mindgleam-lavender-300',
  secondary: 'from-mindgleam-lavender-200 via-mindgleam-gold-200 to-mindgleam-mint-200',
  accent: 'from-mindgleam-peach-300 via-mindgleam-gold-300 to-mindgleam-mint-300',
  subtle: 'from-mindgleam-mint-50 via-mindgleam-peach-50 to-mindgleam-lavender-50',
  hero: 'from-mindgleam-mint-100 via-mindgleam-peach-100 to-mindgleam-lavender-100',
  card: 'from-mindgleam-mint-50/80 via-mindgleam-peach-50/80 to-mindgleam-lavender-50/80',
};

// Avatar-specific color schemes using unified palette
export const avatarColorSchemes = {
  gigi: {
    gradient: mindgleamColors.peach.light,
    primary: mindgleamColors.peach.medium,
    bg: mindgleamColors.peach.bg,
    text: mindgleamColors.peach.text,
    border: mindgleamColors.peach.border,
  },
  vee: {
    gradient: mindgleamColors.lavender.light,
    primary: mindgleamColors.lavender.medium,
    bg: mindgleamColors.lavender.bg,
    text: mindgleamColors.lavender.text,
    border: mindgleamColors.lavender.border,
  },
  lumo: {
    gradient: mindgleamColors.mint.light,
    primary: mindgleamColors.mint.medium,
    bg: mindgleamColors.mint.bg,
    text: mindgleamColors.mint.text,
    border: mindgleamColors.mint.border,
  },
};

// Component-specific color schemes
export const componentColors = {
  hero: {
    background: `bg-gradient-to-br ${mindgleamGradients.hero}`,
    accent: `bg-gradient-to-r ${mindgleamColors.mint.medium}`,
    text: 'text-gray-900 dark:text-white',
  },
  card: {
    background: `bg-gradient-to-br ${mindgleamGradients.card}`,
    border: 'border-gray-200/50 dark:border-gray-700/50',
    text: 'text-gray-900 dark:text-white',
  },
  button: {
    primary: `bg-gradient-to-r ${mindgleamColors.mint.medium} hover:${mindgleamColors.mint.dark}`,
    secondary: `bg-gradient-to-r ${mindgleamColors.peach.light} hover:${mindgleamColors.peach.medium}`,
    accent: `bg-gradient-to-r ${mindgleamColors.lavender.light} hover:${mindgleamColors.lavender.medium}`,
  },
};

// Utility function to get avatar colors
export const getAvatarColors = (avatarId: string) => {
  return avatarColorSchemes[avatarId as keyof typeof avatarColorSchemes] || avatarColorSchemes.gigi;
};

// Utility function to get component colors
export const getComponentColors = (component: string) => {
  return componentColors[component as keyof typeof componentColors] || componentColors.card;
}; 