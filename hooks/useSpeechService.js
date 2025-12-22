import { useEffect, useRef, useState, useCallback } from 'react';
import { getSpeechService } from '../services/SpeechService';
import { logger } from '../util/logger';

/**
 * React hook for SpeechService
 * Provides convenient API for speech synthesis with React lifecycle management
 */
export function useSpeechService(options = {}) {
  const serviceRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Initialize service
  useEffect(() => {
    const service = getSpeechService();
    serviceRef.current = service;
    setIsSupported(service.supported);
    setVoices(service.getVoices());
    setSelectedVoice(service.selectedVoice);

    // Apply initial options
    if (Object.keys(options).length > 0) {
      service.updateSettings(options);
    }

    return () => {
      // Don't dispose on unmount to keep singleton alive
    };
  }, []);

  // Update voices when they change
  const updateVoices = useCallback(() => {
    if (serviceRef.current) {
      const currentVoices = serviceRef.current.getVoices();
      setVoices(currentVoices);
      setSelectedVoice(serviceRef.current.selectedVoice);
    }
  }, []);

  // Listen for voice changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const handleVoicesChanged = () => {
        updateVoices();
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [updateVoices]);

  // Speak function with React state management
  const speak = useCallback((textOrKana, speakOptions = {}) => {
    if (!serviceRef.current) {
      const error = new Error('Speech service not initialized');
      setError(error);
      if (speakOptions.onError) speakOptions.onError(error);
      return null;
    }

    setError(null);

    const enhancedOptions = {
      ...speakOptions,
      onStart: () => {
        setIsSpeaking(true);
        if (speakOptions.onStart) speakOptions.onStart();
      },
      onEnd: () => {
        setIsSpeaking(false);
        if (speakOptions.onEnd) speakOptions.onEnd();
      },
      onError: (error) => {
        setError(error);
        setIsSpeaking(false);
        if (speakOptions.onError) speakOptions.onError(error);
      },
    };

    try {
      return serviceRef.current.speak(textOrKana, enhancedOptions);
    } catch (err) {
      setError(err);
      setIsSpeaking(false);
      if (speakOptions.onError) speakOptions.onError(err);
      return null;
    }
  }, []);

  // Stop function
  const stop = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
      setIsSpeaking(false);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.pause();
    }
  }, []);

  // Resume function
  const resume = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resume();
    }
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    if (serviceRef.current) {
      serviceRef.current.updateSettings(newSettings);
    }
  }, []);

  // Set voice
  const setVoice = useCallback((voiceIndex) => {
    if (serviceRef.current) {
      const success = serviceRef.current.setVoiceByIndex(voiceIndex);
      if (success) {
        setSelectedVoice(serviceRef.current.selectedVoice);
      }
      return success;
    }
    return false;
  }, []);

  // Get settings
  const getSettings = useCallback(() => {
    return serviceRef.current ? serviceRef.current.getSettings() : {};
  }, []);

  // Get queue length
  const getQueueLength = useCallback(() => {
    return serviceRef.current ? serviceRef.current.getQueueLength() : 0;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset service
  const reset = useCallback(() => {
    stop();
    setError(null);
  }, [stop]);

  return {
    // State
    isSupported,
    isSpeaking,
    error,
    voices,
    selectedVoice,

    // Actions
    speak,
    stop,
    pause,
    resume,
    updateSettings,
    setVoice,
    getSettings,
    getQueueLength,
    clearError,
    reset,

    // Direct service access (for advanced usage)
    service: serviceRef.current,
  };
}

/**
 * Simple hook that only returns basic speak functionality
 * Good for components that just need basic TTS
 */
export function useSimpleSpeech(settings = {}) {
  const { isSupported, isSpeaking, speak, error } = useSpeechService(settings);

  return {
    canSpeak: isSupported,
    isSpeaking,
    speak,
    error,
  };
}

/**
 * Hook for Japanese speech specifically
 * Optimized for kana pronunciation
 */
export function useJapaneseSpeech(kanaSettings = {}) {
  const japaneseSettings = {
    language: 'ja-JP',
    rate: 0.8,
    pitch: 1,
    volume: 5,
    voiceName: 'Google 日本語',
    ...kanaSettings,
  };

  const {
    isSupported,
    isSpeaking,
    speak,
    error,
    voices,
    selectedVoice,
    setVoice,
  } = useSpeechService(japaneseSettings);

  // Speak kana character
  const speakKana = useCallback(
    (kana, options = {}) => {
      return speak(kana, {
        ...options,
        onStart: () => {
          logger.info('Pronouncing kana:', kana.character || kana);
          if (options.onStart) options.onStart();
        },
        onEnd: () => {
          logger.info('Pronunciation completed for:', kana.character || kana);
          if (options.onEnd) options.onEnd();
        },
      });
    },
    [speak],
  );

  return {
    canSpeak: isSupported,
    isSpeaking,
    speakKana,
    speak,
    error,
    voices,
    selectedVoice,
    setVoice,
  };
}
