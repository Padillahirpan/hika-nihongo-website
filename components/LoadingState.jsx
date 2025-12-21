import React from 'react';
import { ERROR_SEVERITY } from './ErrorBoundary';

export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  RETRYING: 'retrying',
};

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]} ${className}`}
    />
  );
};

export const LoadingMessage = ({ state, message, error, onRetry }) => {
  switch (state) {
    case LoadingStates.LOADING:
      return (
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <div className="text-xl text-gray-800 dark:text-gray-200">
            {message || 'Loading...'}
          </div>
        </div>
      );

    case LoadingStates.RETRYING:
      return (
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <div className="text-xl text-gray-800 dark:text-gray-200">
            Retrying...
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Please wait while we try again...
          </div>
        </div>
      );

    case LoadingStates.ERROR:
      return (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xl text-red-600 dark:text-red-400 mb-2">
            Error
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || 'Something went wrong'}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );

    case LoadingStates.SUCCESS:
      return (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xl text-green-600 dark:text-green-400">
            Success!
          </div>
        </div>
      );

    default:
      return null;
  }
};

// Hook for managing loading states with error handling
export const useLoadingState = (initialState = LoadingStates.IDLE) => {
  const [state, setState] = React.useState(initialState);
  const [error, setError] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const setLoading = (msg = '') => {
    setState(LoadingStates.LOADING);
    setMessage(msg);
    setError(null);
  };

  const setSuccess = () => {
    setState(LoadingStates.SUCCESS);
    setError(null);
  };

  const setErrorState = (error, msg = 'An error occurred') => {
    setState(LoadingStates.ERROR);
    setError(error);
    setMessage(msg);
  };

  const setRetrying = (msg = 'Retrying...') => {
    setState(LoadingStates.RETRYING);
    setMessage(msg);
    setError(null);
  };

  const reset = () => {
    setState(LoadingStates.IDLE);
    setError(null);
    setMessage('');
  };

  return {
    state,
    error,
    message,
    isLoading: state === LoadingStates.LOADING,
    isError: state === LoadingStates.ERROR,
    isSuccess: state === LoadingStates.SUCCESS,
    isRetrying: state === LoadingStates.RETRYING,
    setLoading,
    setSuccess,
    setError: setErrorState,
    setRetrying,
    reset,
  };
};

// Higher-order component for loading states
export const withLoadingState = (Component) => {
  return ({ loadingState, loadingMessage, error, onRetry, ...props }) => {
    if (loadingState === LoadingStates.ERROR) {
      return (
        <LoadingMessage
          state={loadingState}
          message={loadingMessage}
          error={error}
          onRetry={onRetry}
        />
      );
    }

    if (loadingState === LoadingStates.LOADING || loadingState === LoadingStates.RETRYING) {
      return (
        <LoadingMessage
          state={loadingState}
          message={loadingMessage}
        />
      );
    }

    return <Component {...props} />;
  };
};