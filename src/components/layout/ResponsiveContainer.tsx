'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-4 py-4 sm:px-6 sm:py-6',
  lg: 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12',
  xl: 'px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16',
};

export default function ResponsiveContainer({
  children,
  size = 'xl',
  padding = 'md',
  className,
}: ResponsiveContainerProps) {
  const containerClasses = useMemo(
    () =>
      cn(
        'container mx-auto',
        sizeClasses[size],
        paddingClasses[padding],
        className
      ),
    [size, padding, className]
  );

  return <div className={containerClasses}>{children}</div>;
}
