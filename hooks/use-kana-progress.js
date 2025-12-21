import { useHiraganaProgress } from '../stores/hiragana-store';
import { useKatakanaProgress } from '../stores/katakana-store';

/**
 * Unified hook to get progress for both hiragana and katakana
 * This replaces the legacy localStorage hooks with Zustand store hooks
 */
export const useKanaProgress = () => {
  try {
    const hiraganaProgress = useHiraganaProgress();
    const katakanaProgress = useKatakanaProgress();

    return {
      hiragana: hiraganaProgress() || { masteredKana: 0, totalKana: 0 },
      katakana: katakanaProgress() || { masteredKana: 0, totalKana: 0 },
    };
  } catch (error) {
    console.error('Error in useKanaProgress:', error);
    // Fallback to default values to prevent infinite loops
    return {
      hiragana: { masteredKana: 0, totalKana: 0 },
      katakana: { masteredKana: 0, totalKana: 0 },
    };
  }
};

/**
 * Individual hooks for each kana type
 */
export const useHiraganaKanaProgress = () => {
  try {
    return useHiraganaProgress() || { masteredKana: 0, totalKana: 0 };
  } catch (error) {
    console.error('Error in useHiraganaKanaProgress:', error);
    return { masteredKana: 0, totalKana: 0 };
  }
};

export const useKatakanaKanaProgress = () => {
  try {
    return useKatakanaProgress() || { masteredKana: 0, totalKana: 0 };
  } catch (error) {
    console.error('Error in useKatakanaKanaProgress:', error);
    return { masteredKana: 0, totalKana: 0 };
  }
};

/**
 * Legacy-compatible function that matches the old getCurrentKanaProgress signature
 * for backward compatibility with existing components
 */
export const getCurrentKanaProgress = (type) => {
  // This is kept for backward compatibility
  // The new hooks should be preferred: useHiraganaKanaProgress() and useKatakanaKanaProgress()
  console.warn(
    'getCurrentKanaProgress is deprecated. Use useHiraganaKanaProgress() or useKatakanaKanaProgress() hooks instead.',
  );

  // Return a default progress object for now
  // Components should be updated to use the new hooks
  return { masteredKana: 0, totalKana: 0 };
};
