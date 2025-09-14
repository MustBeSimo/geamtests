'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'skeleton';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  if (variant === 'dots') {
    return (
      <div
        className={cn('flex items-center justify-center space-x-2', className)}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        {text && (
          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div
          className={cn(
            'bg-blue-500 rounded-full animate-pulse',
            sizeClasses[size]
          )}
        ></div>
        {text && (
          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/2"></div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-500',
          sizeClasses[size]
        )}
      ></div>
      {text && (
        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
          {text}
        </span>
      )}
    </div>
  );
}

// Skeleton components for different UI elements
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full mb-4"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/2"></div>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 dark:bg-gray-700 rounded-lg h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full',
        sizeClasses[size],
        className
      )}
    ></div>
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-24',
        className
      )}
    ></div>
  );
}
