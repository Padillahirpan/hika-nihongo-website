/**
 * Application Constants
 * Centralized configuration for magic numbers and values
 */

// Learning System Constants
export const LEARNING = {
  // Mastery thresholds and scoring
  MASTERY_POINTS_CORRECT: 20,
  MASTERY_POINTS_INCORRECT: 5,
  MASTERY_MAX_POINTS: 100,
  MASTERY_MIN_POINTS: 0,
  PASS_THRESHOLD: 80,

  // Initial character points
  INITIAL_POINTS: 0,

  // Unlock conditions
  ROW_UNLOCK_THRESHOLD: 80,
};

// Speech Synthesis Constants
export const SPEECH = {
  // Voice settings
  RATE: 0.8,
  PITCH: 1,
  VOLUME: 5,
  DEFAULT_VOLUME: 1,
  DEFAULT_RATE: 1,
  DEFAULT_PITCH: 1,

  // Language settings
  LANGUAGE: 'ja-JP',
  VOICE_NAME: 'Google 日本語',

  // Error handling
  AUTO_RETRY: true,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // Queue management
  MAX_QUEUE_SIZE: 10,

  // Volume range (0-10, converted to 0-1 for Web Speech API)
  VOLUME_MIN: 0,
  VOLUME_MAX: 10,

  // Rate range (0.1-10)
  RATE_MIN: 0.1,
  RATE_MAX: 10,

  // Pitch range (0-2)
  PITCH_MIN: 0,
  PITCH_MAX: 2,
};

// Drilling System Constants
export const DRILLING = {
  // Question configuration
  QUESTIONS_PER_DRILL: 10,
  MAX_RESULTS: 50,

  // Question priority ratios (7:2:1)
  HIGH_PRIORITY_COUNT: 7,
  MEDIUM_PRIORITY_COUNT: 2,
  LOW_PRIORITY_COUNT: 1,

  // Priority thresholds
  HIGH_PRIORITY_THRESHOLD: 80,
  MEDIUM_PRIORITY_MIN: 50,
  MEDIUM_PRIORITY_MAX: 80,

  // Options per question
  OPTIONS_COUNT: 4,

  // Progress tracking
  INITIAL_SCORE: 0,
  PROGRESS_PERCENTAGE_MULTIPLIER: 100,
};

// UI Constants
export const UI = {
  // Progress bar
  PROGRESS_PERCENTAGE_MULTIPLIER: 100,
  PROGRESS_BAR_HEIGHT_SMALL: 3,
  PROGRESS_BAR_HEIGHT_LARGE: 5,
  PROGRESS_BAR_HEIGHT_LARGE_LG: 8,
  PROGRESS_BAR_HEIGHT_SMALL_LG: 4,

  // Grid layout
  GRID_COLS: 5,

  // Modal
  MODAL_OPACITY: 50,
  MODAL_Z_INDEX: 50,

  // Date formatting
  DATE_PAD_LENGTH: 2,

  // SVG stroke width
  STROKE_WIDTH_DEFAULT: 1.5,

  // Component sizing
  ICON_SIZE_DEFAULT: 6,
};

// Animation Constants
export const ANIMATION = {
  // Blob animation keyframes
  SCALE_INITIAL: 1,
  SCALE_LARGE: 1.1,
  SCALE_SMALL: 0.9,

  // Translation values
  TRANSLATE_X_POSITIVE: 30,
  TRANSLATE_X_NEGATIVE: -20,
  TRANSLATE_Y_NEGATIVE: -50,
  TRANSLATE_Y_POSITIVE: 20,

  // Keyframe percentages
  KEYFRAME_START: 0,
  KEYFRAME_25: 25,
  KEYFRAME_50: 50,
  KEYFRAME_75: 75,
  KEYFRAME_END: 100,
};

// Data Categories
export const CATEGORIES = {
  GOJUON: 1,
  SOKUON: 2,
  DAKUON: 3,
  YOUON: 4,
};

// Random Constants
export const RANDOM = {
  // Math.random() center point for shuffling
  SHUFFLE_CENTER: 0.5,

  // Padding for random operations
  RANDOM_OFFSET: 0.5,
};

// Performance Constants
export const PERFORMANCE = {
  // Debounce and timeout values
  DEFAULT_TIMEOUT: 10000,

  // Operation thresholds
  MIN_ARRAY_LENGTH: 0,
  SINGLE_ITEM_COUNT: 1,
};