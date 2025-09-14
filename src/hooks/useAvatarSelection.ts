'use client';

import { useState, useCallback, useMemo } from 'react';

export type AvatarId = 'gigi' | 'vee' | 'lumo';

export interface Avatar {
  id: AvatarId;
  name: string;
  description: string;
  src: string;
  gradient: string;
}

export interface AvatarColorScheme {
  gradient: string;
  primaryColor: string;
  accentColor: string;
  bgPrimary: string;
  borderColor: string;
  textColor: string;
  buttonColor: string;
}

const AVATARS: Avatar[] = [
  {
    id: 'gigi',
    name: 'Gigi',
    description: 'Your holistic AI wellness companion',
    src: '/images/avatars/Gigi_avatar.png',
    gradient: 'from-pink-200 to-purple-200',
  },
  {
    id: 'vee',
    name: 'Vee',
    description: 'Your evidence-based AI wellness coach',
    src: '/images/avatars/Vee_avatar.png',
    gradient: 'from-blue-200 to-cyan-200',
  },
  {
    id: 'lumo',
    name: 'Lumo',
    description: 'Your AI creative movement & wellness guide',
    src: '/images/avatars/Lumo_avatar.png',
    gradient: 'from-teal-200 to-emerald-200',
  },
];

const COLOR_SCHEMES: Record<AvatarId, AvatarColorScheme> = {
  gigi: {
    gradient: 'from-pink-400 to-purple-400',
    primaryColor: 'pink',
    accentColor: 'purple',
    bgPrimary: 'bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40',
    borderColor: 'border-pink-400 dark:border-pink-500',
    textColor: 'text-pink-800 dark:text-pink-200',
    buttonColor: 'from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
  },
  vee: {
    gradient: 'from-blue-400 to-cyan-400',
    primaryColor: 'blue',
    accentColor: 'cyan',
    bgPrimary: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40',
    borderColor: 'border-blue-400 dark:border-blue-500',
    textColor: 'text-blue-800 dark:text-blue-200',
    buttonColor: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
  },
  lumo: {
    gradient: 'from-teal-400 to-emerald-400',
    primaryColor: 'teal',
    accentColor: 'emerald',
    bgPrimary: 'bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40',
    borderColor: 'border-teal-400 dark:border-teal-500',
    textColor: 'text-teal-800 dark:text-teal-200',
    buttonColor: 'from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600',
  },
};

export function useAvatarSelection(initialAvatar: AvatarId = 'gigi') {
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>(initialAvatar);

  const currentAvatar = useMemo(
    () => AVATARS.find((avatar) => avatar.id === selectedAvatarId) || AVATARS[0],
    [selectedAvatarId]
  );

  const colorScheme = useMemo(
    () => COLOR_SCHEMES[selectedAvatarId],
    [selectedAvatarId]
  );

  const selectAvatar = useCallback((avatarId: AvatarId) => {
    setSelectedAvatarId(avatarId);
  }, []);

  const getAvatarById = useCallback(
    (id: AvatarId) => AVATARS.find((avatar) => avatar.id === id),
    []
  );

  const getColorSchemeById = useCallback(
    (id: AvatarId) => COLOR_SCHEMES[id],
    []
  );

  return {
    avatars: AVATARS,
    selectedAvatarId,
    currentAvatar,
    colorScheme,
    selectAvatar,
    getAvatarById,
    getColorSchemeById,
  };
}