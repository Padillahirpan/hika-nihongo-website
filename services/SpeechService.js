import { SPEECH } from '../constants';

/**
 * Speech Service - Centralized text-to-speech functionality
 * Provides reusable API for Japanese pronunciation with error handling
 */
export class SpeechService {
  constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.supported = this.checkSupport();
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.utteranceQueue = [];
    this.currentUtterance = null;
    this.settings = {
      ...SPEECH,
      autoRetry: true,
      maxRetries: 3,
      retryDelay: 1000,
    };

    // Initialize voices when available
    this.initializeVoices();
  }

  /**
   * Check if speech synthesis is supported
   */
  checkSupport() {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  /**
   * Initialize available voices
   */
  initializeVoices() {
    if (!this.supported) return;

    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
      this.selectBestVoice();
    };

    // Voices might load asynchronously
    updateVoices();

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  /**
   * Select the best available voice for Japanese
   */
  selectBestVoice() {
    if (!this.voices.length) return null;

    // Try to find exact Japanese voice first
    const exactMatch = this.voices.find(voice =>
      voice.lang === 'ja-JP' && voice.name.includes('Google')
    );

    if (exactMatch) {
      this.selectedVoice = exactMatch;
      return exactMatch;
    }

    // Try any Japanese voice
    const japaneseVoice = this.voices.find(voice =>
      voice.lang.startsWith('ja')
    );

    if (japaneseVoice) {
      this.selectedVoice = japaneseVoice;
      return japaneseVoice;
    }

    // Fallback to first available voice
    this.selectedVoice = this.voices[0];
    return this.selectedVoice;
  }

  /**
   * Update speech settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current settings
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * Validate speech input
   */
  validateInput(textOrKana) {
    if (!this.supported) {
      throw new Error('Speech synthesis is not supported in this browser');
    }

    if (!textOrKana) {
      throw new Error('No text or kana provided for speech');
    }

    let text = textOrKana;

    // Extract character if kana object is provided
    if (typeof textOrKana === 'object' && textOrKana.character) {
      text = textOrKana.character;
    }

    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided for speech synthesis');
    }

    if (text.trim().length === 0) {
      throw new Error('Empty text provided for speech synthesis');
    }

    return text.trim();
  }

  /**
   * Create and configure speech utterance
   */
  createUtterance(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply settings
    utterance.lang = this.settings.language;
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = Math.min(1, Math.max(0, this.settings.volume / 10)); // Convert to 0-1 range

    // Set voice if available
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    return utterance;
  }

  /**
   * Add error handling to utterance
   */
  addErrorHandling(utterance, options = {}) {
    const { onError, onEnd, onStart, retryCount = 0 } = options;

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
      this.currentUtterance = null;

      // Auto-retry logic
      if (this.settings.autoRetry && retryCount < this.settings.maxRetries) {
        console.log(`Retrying speech synthesis (attempt ${retryCount + 1})`);
        setTimeout(() => {
          this.speak(utterance.text, {
            ...options,
            retryCount: retryCount + 1
          });
        }, this.settings.retryDelay);
      } else {
        const error = new Error(`Speech synthesis failed: ${event.error}`);
        if (onError) onError(error);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;

      // Process next in queue
      if (this.utteranceQueue.length > 0) {
        const next = this.utteranceQueue.shift();
        this.synthesis.speak(next.utterance);
      }

      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      if (onStart) onStart();
    };

    return utterance;
  }

  /**
   * Speak text with options
   */
  speak(textOrKana, options = {}) {
    try {
      const text = this.validateInput(textOrKana);
      const utterance = this.createUtterance(text);

      // Add event handlers
      const enhancedUtterance = this.addErrorHandling(utterance, options);

      // Queue management
      if (this.isSpeaking && !options.immediate) {
        this.utteranceQueue.push({ utterance: enhancedUtterance, options });
        return enhancedUtterance;
      }

      // Stop current speech if immediate flag is set
      if (options.immediate) {
        this.stop();
      }

      this.synthesis.speak(enhancedUtterance);
      return enhancedUtterance;

    } catch (error) {
      console.error('SpeechService.speak error:', error);
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    }
  }

  /**
   * Stop current speech and clear queue
   */
  stop() {
    if (!this.supported) return;

    this.synthesis.cancel();
    this.utteranceQueue = [];
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  /**
   * Pause current speech
   */
  pause() {
    if (!this.supported || !this.isSpeaking) return;
    this.synthesis.pause();
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (!this.supported) return;
    this.synthesis.resume();
  }

  /**
   * Get available voices
   */
  getVoices() {
    return [...this.voices];
  }

  /**
   * Set voice by index
   */
  setVoiceByIndex(index) {
    if (index >= 0 && index < this.voices.length) {
      this.selectedVoice = this.voices[index];
      return true;
    }
    return false;
  }

  /**
   * Get speaking status
   */
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  /**
   * Get queue length
   */
  getQueueLength() {
    return this.utteranceQueue.length;
  }

  /**
   * Dispose service
   */
  dispose() {
    this.stop();
    this.voices = [];
    this.selectedVoice = null;
  }
}

// Singleton instance for global use
let speechServiceInstance = null;

/**
 * Get or create the speech service singleton
 */
export function getSpeechService() {
  if (!speechServiceInstance) {
    speechServiceInstance = new SpeechService();
  }
  return speechServiceInstance;
}

/**
 * Reset the speech service singleton
 */
export function resetSpeechService() {
  if (speechServiceInstance) {
    speechServiceInstance.dispose();
  }
  speechServiceInstance = null;
}