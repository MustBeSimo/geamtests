export type AvatarId = 'gigi' | 'vee' | 'lumo';

export interface AvatarTheme {
  id: AvatarId;
  name: string;
  gradient: string;
  background: {
    light: string;
    dark: string;
  };
  animatedBackground: {
    light: string;
    dark: string;
  };
  border: {
    light: string;
    dark: string;
  };
  accent: {
    light: string;
    dark: string;
  };
  text: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
  };
}

export const avatarThemes: Record<AvatarId, AvatarTheme> = {
  gigi: {
    id: 'gigi',
    name: 'Gigi',
    gradient: 'from-pink-200 to-purple-200',
    background: {
      light: 'bg-gradient-to-br from-pink-50/80 to-purple-50/80',
      dark: 'bg-gradient-to-br from-pink-950/30 to-purple-950/30',
    },
    animatedBackground: {
      light:
        'bg-gradient-to-r from-pink-50/60 via-rose-50/60 via-purple-50/60 to-pink-50/60',
      dark: 'bg-gradient-to-r from-pink-950/20 via-rose-950/20 via-purple-950/20 to-pink-950/20',
    },
    border: {
      light: 'border-pink-100/70',
      dark: 'border-pink-800/30',
    },
    accent: {
      light: 'bg-gradient-to-r from-pink-200 to-purple-200',
      dark: 'bg-gradient-to-r from-pink-300 to-purple-300',
    },
    text: {
      primary: {
        light: 'text-gray-800',
        dark: 'text-gray-200',
      },
      secondary: {
        light: 'text-gray-600',
        dark: 'text-gray-400',
      },
    },
  },
  vee: {
    id: 'vee',
    name: 'Vee',
    gradient: 'from-blue-200 to-cyan-200',
    background: {
      light: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80',
      dark: 'bg-gradient-to-br from-blue-950/30 to-cyan-950/30',
    },
    animatedBackground: {
      light:
        'bg-gradient-to-r from-blue-50/60 via-indigo-50/60 via-cyan-50/60 to-blue-50/60',
      dark: 'bg-gradient-to-r from-blue-950/20 via-indigo-950/20 via-cyan-950/20 to-blue-950/20',
    },
    border: {
      light: 'border-blue-100/70',
      dark: 'border-blue-800/30',
    },
    accent: {
      light: 'bg-gradient-to-r from-blue-200 to-cyan-200',
      dark: 'bg-gradient-to-r from-blue-300 to-cyan-300',
    },
    text: {
      primary: {
        light: 'text-gray-800',
        dark: 'text-gray-200',
      },
      secondary: {
        light: 'text-gray-600',
        dark: 'text-gray-400',
      },
    },
  },
  lumo: {
    id: 'lumo',
    name: 'Lumo',
    gradient: 'from-teal-200 to-emerald-200',
    background: {
      light: 'bg-gradient-to-br from-teal-50/80 to-emerald-50/80',
      dark: 'bg-gradient-to-br from-teal-950/30 to-emerald-950/30',
    },
    animatedBackground: {
      light:
        'bg-gradient-to-r from-teal-50/60 via-emerald-50/60 via-cyan-50/60 to-teal-50/60',
      dark: 'bg-gradient-to-r from-teal-950/20 via-emerald-950/20 via-cyan-950/20 to-teal-950/20',
    },
    border: {
      light: 'border-teal-100/70',
      dark: 'border-teal-800/30',
    },
    accent: {
      light: 'bg-gradient-to-r from-teal-200 to-emerald-200',
      dark: 'bg-gradient-to-r from-teal-300 to-emerald-300',
    },
    text: {
      primary: {
        light: 'text-gray-800',
        dark: 'text-gray-200',
      },
      secondary: {
        light: 'text-gray-600',
        dark: 'text-gray-400',
      },
    },
  },
};

export const getAvatarTheme = (avatarId: AvatarId): AvatarTheme => {
  return avatarThemes[avatarId];
};

export const getAvatarClasses = (
  avatarId: AvatarId,
  isDark: boolean = false
) => {
  const theme = getAvatarTheme(avatarId);
  return {
    background: isDark ? theme.background.dark : theme.background.light,
    animatedBackground: isDark
      ? theme.animatedBackground.dark
      : theme.animatedBackground.light,
    border: isDark ? theme.border.dark : theme.border.light,
    accent: isDark ? theme.accent.dark : theme.accent.light,
    textPrimary: isDark ? theme.text.primary.dark : theme.text.primary.light,
    textSecondary: isDark
      ? theme.text.secondary.dark
      : theme.text.secondary.light,
    gradient: theme.gradient,
  };
};
