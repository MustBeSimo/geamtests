'use client';

import React, { lazy, Suspense, ComponentType } from 'react';
import { motion } from 'framer-motion';

interface LoadableOptions {
  fallback?: React.ComponentType;
  delay?: number;
  timeout?: number;
}

interface LoadingProps {
  delay?: number;
}

// Default loading component with skeleton
const DefaultLoading: React.FC<LoadingProps> = ({ delay = 200 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="animate-pulse"
    >
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 w-full" />
    </motion.div>
  );
};

// Advanced loadable function with timeout and error handling
export function loadable<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LoadableOptions = {}
): React.FC<React.ComponentProps<T>> {
  const {
    fallback: FallbackComponent = DefaultLoading,
    delay = 200,
    timeout = 10000,
  } = options;

  const LazyComponent = lazy(() => {
    const importPromise = importFunc();

    // Add timeout to prevent indefinite loading
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Component import timed out after ${timeout}ms`));
      }, timeout);
    });

    return Promise.race([importPromise, timeoutPromise]);
  });

  return function LoadableComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<FallbackComponent delay={delay} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload function for important components
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  // Use requestIdleCallback if available, otherwise setTimeout
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFunc().catch(() => {
          // Silently handle preload errors
        });
      });
    } else {
      setTimeout(() => {
        importFunc().catch(() => {
          // Silently handle preload errors
        });
      }, 1);
    }
  }
}

// Route-based code splitting utility
export function createRouteComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  preload = false
): React.FC<React.ComponentProps<T>> {
  // Preload on route hover/focus
  if (preload) {
    preloadComponent(importFunc);
  }

  return loadable(importFunc, {
    fallback: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading page...</p>
        </div>
      </div>
    ),
    timeout: 15000, // Longer timeout for routes
  });
}

// Component-based code splitting with intersection observer
export function createIntersectionLoadable<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LoadableOptions & { rootMargin?: string } = {}
): React.FC<React.ComponentProps<T> & { triggerRef?: React.RefObject<HTMLElement> }> {
  const { rootMargin = '50px', ...loadableOptions } = options;

  return function IntersectionLoadableComponent({
    triggerRef,
    ...props
  }: React.ComponentProps<T> & { triggerRef?: React.RefObject<HTMLElement> }) {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const defaultRef = React.useRef<HTMLDivElement>(null);
    const observerRef = triggerRef || defaultRef;

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );

      if (observerRef.current) {
        observer.observe(observerRef.current);
      }

      return () => observer.disconnect();
    }, [observerRef, rootMargin]);

    if (!shouldLoad) {
      return <div ref={!triggerRef ? defaultRef : undefined} className="h-64" />;
    }

    const LoadableComponent = loadable(importFunc, loadableOptions);
    return <LoadableComponent {...(props as React.ComponentProps<T>)} />;
  };
}

// Bundle analyzer helper
export function logBundleInfo(componentName: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Loaded component: ${componentName}`);
  }
}

// Prefetch on hover utility
export function usePrefetchOnHover<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const [prefetched, setPrefetched] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    if (!prefetched) {
      preloadComponent(importFunc);
      setPrefetched(true);
    }
  }, [importFunc, prefetched]);

  return { onMouseEnter: handleMouseEnter, onFocus: handleMouseEnter };
}