'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  showReload?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to analytics service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }

    this.setState({ errorInfo });

    // Only call onError if we're in the browser (not during SSG)
    if (typeof window !== 'undefined' && this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className={`p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 ${this.props.className || ''}`}
        >
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {this.props.fallbackTitle || 'Something went wrong'}
              </h3>
            </div>
          </div>

          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            {this.props.fallbackDescription ||
              'An unexpected error occurred while rendering this component.'}
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4 text-xs text-red-600 dark:text-red-400">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-800 rounded overflow-auto">
                {this.state.error.message}
                {this.state.error.stack && `\n${this.state.error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={this.handleRetry}
              className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>

            {this.props.showReload && (
              <button
                onClick={this.handleReload}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reload Page
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different use cases
export class ChatErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chat error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <p>Chat is temporarily unavailable.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry Chat
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export class MoodTrackingErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mood tracking error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p>Mood tracking is temporarily unavailable.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Retry Mood Tracking
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
