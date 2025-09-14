'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  cls: number | null; // Cumulative Layout Shift
  fid: number | null; // First Input Delay
  ttfb: number | null; // Time to First Byte
}

interface RenderMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

// Core Web Vitals monitoring
export function useWebVitals() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Function to update metrics
    const updateMetric = (name: keyof PerformanceMetrics, value: number) => {
      setMetrics((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    // Observer for LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      updateMetric('lcp', lastEntry.startTime);
    });

    // Observer for FID
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        updateMetric('fid', entry.processingStart - entry.startTime);
      });
    });

    // Observer for CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      updateMetric('cls', clsValue);
    });

    // Start observing
    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    // Get FCP and TTFB from navigation timing
    const getNavigationTiming = () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        updateMetric('ttfb', navigation.responseStart - navigation.fetchStart);
      }

      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === 'first-contentful-paint'
      );
      if (fcpEntry) {
        updateMetric('fcp', fcpEntry.startTime);
      }
    };

    // Wait for page load to get timing data
    if (document.readyState === 'complete') {
      getNavigationTiming();
    } else {
      window.addEventListener('load', getNavigationTiming);
    }

    // Cleanup
    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener('load', getNavigationTiming);
    };
  }, []);

  return metrics;
}

// Component render performance monitoring
export function useRenderMetrics(componentName?: string) {
  const [metrics, setMetrics] = useState<RenderMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    renderTimes.current.push(renderTime);

    // Keep only last 100 render times for average calculation
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }

    const averageRenderTime =
      renderTimes.current.reduce((sum, time) => sum + time, 0) /
      renderTimes.current.length;

    setMetrics((prev) => ({
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      averageRenderTime,
    }));

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `Slow render detected ${componentName ? `in ${componentName}` : ''}: ${renderTime.toFixed(2)}ms`
      );
    }
  });

  return metrics;
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return;
    }

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    };

    // Update immediately
    updateMemoryInfo();

    // Update every 5 seconds
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Network performance monitoring
export function useNetworkMonitor() {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const connection = (navigator as any).connection;

    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    };

    updateNetworkInfo();
    connection.addEventListener('change', updateNetworkInfo);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return networkInfo;
}

// Resource loading monitoring
export function useResourceMonitor() {
  const [resources, setResources] = useState<PerformanceResourceTiming[]>([]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      setResources((prev) => [...prev, ...entries]);
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  const analyzeResources = useCallback(() => {
    const analysis = resources.reduce(
      (acc, resource) => {
        const size = resource.transferSize || 0;
        const duration = resource.responseEnd - resource.startTime;

        acc.totalSize += size;
        acc.totalDuration += duration;

        if (resource.name.includes('.js')) {
          acc.jsSize += size;
          acc.jsCount++;
        } else if (resource.name.includes('.css')) {
          acc.cssSize += size;
          acc.cssCount++;
        } else if (resource.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
          acc.imageSize += size;
          acc.imageCount++;
        }

        if (duration > acc.slowestResource.duration) {
          acc.slowestResource = { name: resource.name, duration };
        }

        return acc;
      },
      {
        totalSize: 0,
        totalDuration: 0,
        jsSize: 0,
        jsCount: 0,
        cssSize: 0,
        cssCount: 0,
        imageSize: 0,
        imageCount: 0,
        slowestResource: { name: '', duration: 0 },
      }
    );

    return analysis;
  }, [resources]);

  return { resources, analyzeResources };
}

// Performance budget checker
export function usePerformanceBudget(budgets: {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  totalSize?: number;
}) {
  const webVitals = useWebVitals();
  const { analyzeResources } = useResourceMonitor();

  const checkBudget = useCallback(() => {
    const analysis = analyzeResources();
    const violations: string[] = [];

    if (budgets.fcp && webVitals.fcp && webVitals.fcp > budgets.fcp) {
      violations.push(`FCP: ${webVitals.fcp}ms > ${budgets.fcp}ms`);
    }

    if (budgets.lcp && webVitals.lcp && webVitals.lcp > budgets.lcp) {
      violations.push(`LCP: ${webVitals.lcp}ms > ${budgets.lcp}ms`);
    }

    if (budgets.cls && webVitals.cls && webVitals.cls > budgets.cls) {
      violations.push(`CLS: ${webVitals.cls} > ${budgets.cls}`);
    }

    if (budgets.fid && webVitals.fid && webVitals.fid > budgets.fid) {
      violations.push(`FID: ${webVitals.fid}ms > ${budgets.fid}ms`);
    }

    if (budgets.totalSize && analysis.totalSize > budgets.totalSize) {
      violations.push(
        `Total Size: ${analysis.totalSize} bytes > ${budgets.totalSize} bytes`
      );
    }

    return { violations, analysis };
  }, [webVitals, analyzeResources, budgets]);

  return { webVitals, checkBudget };
}
