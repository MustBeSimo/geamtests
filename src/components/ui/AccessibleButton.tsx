'use client';

import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface AccessibleButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | 'className'
      | 'onAnimationStart'
      | 'onAnimationEnd'
      | 'onDrag'
      | 'onDragEnd'
      | 'onDragStart'
      | 'style'
    >,
    Omit<MotionProps, 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

const variants = {
  primary:
    'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
  secondary:
    'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500',
  ghost:
    'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400',
  danger:
    'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText = 'Loading...',
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = cn(
      // Base styles
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
      // Variant styles
      variants[variant],
      // Size styles
      sizes[size],
      // Disabled styles
      isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      // Custom className
      className
    );

    const MotionButton = motion.button;

    return (
      <MotionButton
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...(!isDisabled && {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
        })}
        aria-disabled={isDisabled}
        aria-describedby={loading ? 'loading-indicator' : undefined}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span aria-hidden="true">{icon}</span>
        )}

        {/* Button text */}
        <span>{loading ? loadingText : children}</span>

        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span aria-hidden="true">{icon}</span>
        )}

        {/* Screen reader only loading indicator */}
        {loading && (
          <span className="sr-only" id="loading-indicator">
            Loading, please wait
          </span>
        )}
      </MotionButton>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
