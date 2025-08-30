'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hiraganaData } from '../data/hiraganaData';
import BubbleGradient from '../components/BubbleGradient';

export default function HomePage() {
  const [masteredCount, setMasteredCount] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const totalHiragana = hiraganaData.filter(char => char.hiragana !== ' ').length;

  const animatedTexts = [
    {
      japanese: "おはようございます 🌞",
      english: "Good Morning!"
    },
    {
      japanese: "こんにちは 👋",
      english: "Hello!"
    },
    {
      japanese: "がんばりましょう ✨",
      english: "Let's do our best!"
    },
    {
      japanese: "ようこそ 🎉",
      english: "Welcome!"
    },
    {
      japanese: "いっしょにべんきょうしましょう 📚",
      english: "Let's study together!"
    }
  ];

  useEffect(() => {
    // Count mastered hiragana from localStorage
    try {
      const savedProgress = localStorage.getItem('hiraganaProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        const mastered = typeof parsedProgress === 'object'
          ? Object.values(parsedProgress).filter(level => level >= 100).length
          : 0;
        setMasteredCount(mastered);
      }
    } catch (error) {
      console.error("Failed to load mastery data:", error);
      setMasteredCount(0);
    }
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setShowText(false);
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
        setShowText(true);
      }, 2000);
    }, 6000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <BubbleGradient/>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center font-noto-jp">ヒカ 日本語 N5</h1>
        <div className="typewriter-container text-xl min-h-[4.5rem] text-center flex flex-col items-center justify-center">
          {showText && (
            <>
              <div className="typewriter text-xl text-gray-800 font-noto-jp mb-2">
                {animatedTexts[currentTextIndex].japanese}
              </div>
              <div className="text-gray-600 mt-1">
                {animatedTexts[currentTextIndex].english}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 sm:bottom-4 xl:bottom-32 left-0 right-0 flex justify-center items-center gap-4 px-4 z-50">
        <div className="flex flex-col w-11/12 max-w-4xl gap-4 items-center">
          <Link
            href="/hiragana"
            className="flex-1 w-full max-w-lm bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 rounded-lg px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-center font-semibold text-white"
          >
            Hiragana <span className="font-semibold">{masteredCount}/{totalHiragana}</span>
          </Link>
          <Link
            href="/drilling"
            className="flex-1 w-full max-w-lm bg-gradient-to-r from-sky-200 to-sky-400 hover:from-sky-400 hover:to-sky-500 rounded-lg px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-center font-semibold text-white"
          >
            Start Drilling
          </Link>
        </div>
      </div>
    </div>
  );
}