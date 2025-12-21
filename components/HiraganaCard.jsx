'use client';

import { useState, useEffect } from 'react';
import { useJapaneseSpeech } from '../hooks/useSpeechService';
import { SPEECH } from '../constants';
import { useKanaStrokeData } from '../stores/kana-stroke-store';

/**
 * HiraganaCard Component
 *
 * @param {Object} props
 * @param {string} props.kana - The hiragana character to display
 * @param {string} props.romaji - The romaji (romanized) version of the hiragana
 * @param {number} props.masteryLevel - The mastery level (0-100) of this character
 */
const HiraganaCard = ({ kana, romaji, masteryLevel = 0, unlocked = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { canSpeak, speakKana, isSpeaking } = useJapaneseSpeech({
    rate: SPEECH.RATE,
    pitch: SPEECH.PITCH,
    volume: SPEECH.VOLUME,
    voiceName: SPEECH.VOICE_NAME,
  });

  const { setShowStrokeModal } = useKanaStrokeData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showStrokes = (e) => {
    e.stopPropagation();
    setShowStrokeModal(true, kana);
  };

  // Function to handle card flip
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Determine background color based on mastery level
  const getBackgroundColor = () => {
    // During SSR, return a safe default to prevent hydration mismatch
    if (!isMounted) return 'bg-white dark:bg-gray-800';

    if (masteryLevel === 0) return 'bg-white dark:bg-gray-800';
    if (masteryLevel >= 1 && masteryLevel <= 19)
      return 'bg-rose-100 dark:bg-rose-900';
    if (masteryLevel >= 20 && masteryLevel <= 39)
      return 'bg-rose-300 dark:bg-rose-700';
    if (masteryLevel >= 40 && masteryLevel <= 59)
      return 'bg-rose-500 dark:bg-rose-600';
    if (masteryLevel >= 60 && masteryLevel <= 79)
      return 'bg-rose-600 dark:bg-rose-500';
    return 'bg-rose-700 dark:bg-rose-400'; // masteryLevel >= 80
  };

  // Determine text color based on mastery level
  const getTextColor = () => {
    // During SSR, return a safe default to prevent hydration mismatch
    if (!isMounted) return 'text-black dark:text-white';

    if (masteryLevel === 0) return 'text-black dark:text-white';
    if (masteryLevel < 20) return 'text-rose-800 dark:text-rose-200';
    if (masteryLevel < 40) return 'text-rose-600 dark:text-rose-300';
    return 'text-white'; // masteryLevel >= 40
  };

  if (!unlocked) {
    return (
      <div className="flex w-full h-[80px] md:w-full md:h-[190px] lg:w-full cursor-pointer">
        <div className="flex w-full h-full flex-col items-center justify-center rounded-lg shadow-md bg-gray-200 dark:bg-gray-700">
          <span className="text-2xl sm:text-6xl font-bold text-gray-400 dark:text-gray-500 font-noto-jp">
            {kana}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full h-[80px] md:w-full md:h-[190px] lg:w-full cursor-pointer"
      onClick={handleCardFlip}
    >
      <div
        className="flex w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : '',
        }}
      >
        {/* Front of card (Hiragana) */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center rounded-lg shadow-xl ${getBackgroundColor()} [backface-visibility:hidden]`}
        >
          <span
            className={`text-2xl sm:text-6xl font-bold ${getTextColor()} font-noto-jp`}
          >
            {kana}
          </span>
        </div>

        {/* Back of card (Romaji) */}
        <div
          className={`absolute w-full h-full flex items-center justify-center rounded-lg shadow-xl ${getBackgroundColor()} [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 flex gap-1">
            <button
              onClick={showStrokes}
              className="p-1 rounded-full bg-purple-400 text-white hover:bg-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label="Show stroke order"
              title="Show stroke order"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lg:h-6 lg:w-6 md:h-4 md:w-4 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>
          <span
            className={`text-lg sm:text-4xl font-bold ${getTextColor()} font-noto-jp`}
          >
            {romaji}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HiraganaCard;
