'use client';

import { Component } from 'react';
import { Button } from './Button';

// Error severity levels for different types of errors
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorSeverity: ERROR_SEVERITY.MEDIUM,
    };
  }

  static getDerivedStateFromError(error) {
    // Determine error severity based on error type
    let severity = ERROR_SEVERITY.MEDIUM;

    if (error.name === 'ChunkLoadError') {
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.message?.includes('Network')) {
      severity = ERROR_SEVERITY.LOW;
    } else if (error.message?.includes('QuotaExceededError')) {
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.message?.includes('SecurityError')) {
      severity = ERROR_SEVERITY.CRITICAL;
    }

    return {
      hasError: true,
      error,
      errorSeverity: severity,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Report to error monitoring service in production
    if (typeof window !== 'undefined' && window.location?.hostname !== 'localhost') {
      // Here you could integrate with services like Sentry, LogRocket, etc.
      // Example: window.analytics?.track('Error occurred', { error: error.message });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorSeverity: ERROR_SEVERITY.MEDIUM,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  getErrorMessage = () => {
    const { error, errorSeverity } = this.state;

    // User-friendly messages based on error type and severity
    if (error.name === 'ChunkLoadError') {
      return 'Failed to load application resources. Please refresh the page.';
    }

    if (error.message?.includes('Network')) {
      return 'Network connection issue. Please check your internet connection.';
    }

    if (error.message?.includes('QuotaExceededError')) {
      return 'Storage quota exceeded. Please clear browser data and try again.';
    }

    if (errorSeverity === ERROR_SEVERITY.CRITICAL) {
      return 'A critical error occurred. Please reload the page.';
    }

    return 'Something went wrong. Please try again or refresh the page.';
  };

  getErrorIcon = () => {
    const { errorSeverity } = this.state;

    switch (errorSeverity) {
      case ERROR_SEVERITY.CRITICAL:
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case ERROR_SEVERITY.HIGH:
        return (
          <svg className="w-16 h-16 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ERROR_SEVERITY.LOW:
        return (
          <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  render() {
    const { hasError, errorSeverity } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          retry: this.handleRetry,
          reload: this.handleReload,
        });
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              {this.getErrorIcon()}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.getErrorMessage()}
            </p>

            <div className="space-y-3">
              {errorSeverity !== ERROR_SEVERITY.CRITICAL && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try Again
                </Button>
              )}

              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  Technical Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};