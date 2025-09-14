'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { AvatarId, getAvatarClasses } from '@/utils/avatarThemes';
import { mindgleamGradients, getAvatarColors } from '@/utils/colors';

interface SimpleCardProps {
  title: string;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  avatarId?: AvatarId;
}

export default function SimpleCard({
  title,
  subtitle,
  children,
  className = '',
  borderColor = 'border-blue-500',
  avatarId,
}: SimpleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get avatar-specific colors if avatarId is provided
  const avatarClasses = avatarId ? getAvatarClasses(avatarId, isDark) : null;

  // Map border colors to different animation types
  const getBorderAnimation = () => {
    // If avatar theme is provided, use avatar-specific colors
    if (avatarClasses) {
      switch (avatarId) {
        case 'gigi':
          return {
            gradient: 'from-mindgleam-peach-200 via-mindgleam-peach-300 to-mindgleam-gold-200',
            hoverGradient: 'from-mindgleam-peach-200/30 via-mindgleam-peach-300/30 to-mindgleam-gold-200/30'
          };
        case 'vee':
          return {
            gradient: 'from-mindgleam-lavender-200 via-mindgleam-lavender-300 to-mindgleam-peach-200',
            hoverGradient: 'from-mindgleam-lavender-200/30 via-mindgleam-lavender-300/30 to-mindgleam-peach-200/30'
          };
        case 'lumo':
          return {
            gradient: 'from-mindgleam-mint-200 via-mindgleam-mint-300 to-mindgleam-lavender-200',
            hoverGradient: 'from-mindgleam-mint-200/30 via-mindgleam-mint-300/30 to-mindgleam-lavender-200/30'
          };
        default:
          return {
            gradient: mindgleamGradients.secondary,
            hoverGradient: `${mindgleamGradients.secondary}/30`
          };
      }
    }

    // Default border color animations using unified palette
    switch (borderColor) {
      case 'border-emerald-500':
        return {
          gradient: mindgleamGradients.primary,
          hoverGradient: `${mindgleamGradients.primary}/30`
        };
      case 'border-purple-500':
        return {
          gradient: mindgleamGradients.accent,
          hoverGradient: `${mindgleamGradients.accent}/30`
        };
      case 'border-blue-500':
        return {
          gradient: mindgleamGradients.secondary,
          hoverGradient: `${mindgleamGradients.secondary}/30`
        };
      case 'border-green-500':
        return {
          gradient: mindgleamGradients.primary,
          hoverGradient: `${mindgleamGradients.primary}/30`
        };
      case 'border-orange-500':
        return {
          gradient: mindgleamGradients.accent,
          hoverGradient: `${mindgleamGradients.accent}/30`
        };
      default:
        return {
          gradient: mindgleamGradients.subtle,
          hoverGradient: `${mindgleamGradients.subtle}/30`
        };
    }
  };

  const { gradient, hoverGradient } = getBorderAnimation();

  return (
    <div 
      className={`
        relative
        ${avatarClasses ? '' : 'bg-white dark:bg-gray-800'}
        rounded-2xl 
        shadow-lg 
        transition-all duration-700 ease-in-out
        hover:shadow-xl 
        hover:scale-[1.02] 
        overflow-hidden
        group
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border */}
      <div className={`
        absolute inset-0 rounded-2xl p-[2px] 
        bg-gradient-to-r ${gradient}
        ${isHovered ? 'animate-gentle-glow' : ''}
        transition-all duration-700 ease-in-out
      `}>
        <div className={`
          h-full w-full rounded-2xl transition-all duration-700 ease-in-out
          ${avatarClasses ? `${avatarClasses.animatedBackground}` : 'bg-white dark:bg-gray-800'}
        `} />
      </div>

      {/* Corner Sparkles */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"></div>
      </div>
      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
        <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-ping"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`
            text-xl transition-all duration-300 
            ${isHovered ? 'scale-110 rotate-12 drop-shadow-lg' : ''}
          `}>
            ✨
          </span>
          <h3 className={`
            text-xl font-bold transition-colors duration-700 ease-in-out
            ${avatarClasses ? avatarClasses.textPrimary : 'text-gray-900 dark:text-white'}
          `}>
            {title}
          </h3>
        </div>
        
        {subtitle && (
          <div className={`
            mb-4 ml-8 transition-colors duration-700 ease-in-out
            ${avatarClasses ? avatarClasses.textSecondary : 'text-gray-600 dark:text-gray-400'}
          `}>
            {typeof subtitle === 'string' ? (
              <p>{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
        )}
        
        <div className={`
          transition-colors duration-700 ease-in-out
          ${avatarClasses ? avatarClasses.textPrimary : 'text-gray-900 dark:text-white'}
        `}>
          {children}
        </div>
      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className={`
          absolute inset-0 rounded-2xl 
          bg-gradient-to-r ${hoverGradient}
          animate-pulse-glow
        `} />
      )}

      {/* Subtle Shine Effect */}
      <div className={`
        absolute inset-0 rounded-2xl
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        transform -skew-x-12 -translate-x-full
        group-hover:translate-x-full
        transition-transform duration-1000 ease-out
      `} />
    </div>
  );
} 