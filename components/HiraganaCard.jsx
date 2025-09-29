"use client";

import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "../util/use-speech-synthesis.js";

/**
 * HiraganaCard Component
 *
 * @param {Object} props
 * @param {string} props.kana - The hiragana character to display
 * @param {string} props.romaji - The romaji (romanized) version of the hiragana
 * @param {number} props.masteryLevel - The mastery level (0-100) of this character
 */
const HiraganaCard = ({ kana, romaji, masteryLevel = 0 , unlocked = false}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { supported, speak } = useSpeechSynthesis("ja-JP");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle card flip
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  //   // Function to pronounce the hiragana using Web Speech API
  const pronounceHiragana = (e) => {
    e.stopPropagation();
    if (!supported) {
      console.error("Web Speech API is not supported in this browser");
      return;
    }
    speak(kana, {
      lang: "ja-JP",
      rate: 0.8,
      pitch: 1,
      volume: 5,
      voiceName: "Google 日本語", // optionally lock a specific voice
      onStart: () => console.log("Pronouncing:", kana),
      onEnd: () => console.log("Done"),
      onError: (e) => console.error("TTS error:", e.error),
    });
  };

  // Determine background color based on mastery level
  const getBackgroundColor = () => {
    // During SSR, return a safe default to prevent hydration mismatch
    if (!isMounted) return "bg-white";
    
    if (masteryLevel === 0) return "bg-white";
    if (masteryLevel >= 1 && masteryLevel <= 19) return "bg-rose-100";
    if (masteryLevel >= 20 && masteryLevel <= 39) return "bg-rose-300";
    if (masteryLevel >= 40 && masteryLevel <= 59) return "bg-rose-500";
    if (masteryLevel >= 60 && masteryLevel <= 79) return "bg-rose-700";
    return "bg-rose-600"; // masteryLevel >= 80
  };

  // Determine text color based on mastery level
  const getTextColor = () => {
    // During SSR, return a safe default to prevent hydration mismatch
    if (!isMounted) return "text-black";
    
    if (masteryLevel === 0) return "text-black";
    if (masteryLevel < 20) return "text-rose-800";
    if (masteryLevel < 40) return "text-rose-600";
    return "text-white"; // masteryLevel >= 40
  };

  if (!unlocked) {
    return (
      <div className="flex w-full h-[80px] md:w-full md:h-[190px] lg:w-full cursor-pointer">
        <div
          className="flex w-full h-full flex flex-col items-center justify-center rounded-lg shadow-md bg-gray-200"
        >
          <span className="text-xs sm:text-6xl font-bold text-gray-400 font-noto-jp">
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
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "",
        }}
      >
        {/* Front of card (Hiragana) */}
        <div
          className={`flex w-full h-full flex flex-col items-center justify-center rounded-lg shadow-md ${getBackgroundColor()} [backface-visibility:hidden]`}
        >
          <span className={`text-lg sm:text-8xl font-bold ${getTextColor()} font-noto-jp`}>
            {kana}
          </span>
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4">
            <button
              onClick={pronounceHiragana}
              className="p-1 bg-sky-400 text-white rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
              aria-label="Pronounce"
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
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Back of card (Romaji) */}
        <div
          className={`absolute w-full h-full flex items-center justify-center rounded-lg shadow-md ${getBackgroundColor()} [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <span className={`text-lg sm:text-4xl font-bold ${getTextColor()} font-noto-jp`}>
            {romaji}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HiraganaCard;
