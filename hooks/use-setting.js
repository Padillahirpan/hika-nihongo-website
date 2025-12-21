import { useResetHiraganaData } from '../stores/hiragana-store';
import { useResetKatakanaData } from '../stores/katakana-store';

export const useSetting = () => {
  const resetHiraganaData = useResetHiraganaData();
  const resetKatakanaData = useResetKatakanaData();

  const resetAllData = () => {
    resetHiraganaData();
    resetKatakanaData();
  };

  return {
    resetHiraganaData,
    resetKatakanaData,
    resetAllData,
  };
};
