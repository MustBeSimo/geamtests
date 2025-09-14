'use client';

import React, { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export default function ResponsiveGrid({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const gridClasses = useMemo(() => {
    const colClasses = [];

    if (cols.default) colClasses.push(`grid-cols-${cols.default}`);
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);

    return cn('grid', ...colClasses, gapClasses[gap], className);
  }, [cols, gap, className]);

  return <div className={gridClasses}>{children}</div>;
}
