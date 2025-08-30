'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hiraganaData } from '../data/hiraganaData';

export default function HomePage() {
  const [masteredCount, setMasteredCount] = useState(0);
  const totalHiragana = hiraganaData.filter(char => char.hiragana !== ' ').length;

  useEffect(() => {
    // Count mastered hiragana from localStorage
    try {
      const savedProgress = localStorage.getItem('hiraganaProgress');
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        // Ensure parsedProgress is an object before counting mastered items
        const mastered = typeof parsedProgress === 'object'
          ? Object.values(parsedProgress).filter(level => level >= 90).length
          : 0;

          
        console.log(`this is mastered: ${mastered} dan ${savedProgress}`);
        setMasteredCount(mastered);
      }
    } catch (error) {
      console.error("Failed to load mastery data:", error);
      setMasteredCount(0); // Set to 0 if there's an error
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-1/3 w-[24rem] h-[24rem] bg-sky-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -right-10 top-1/3 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 bottom-1/4 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute left-20 top-1/2 bottom-1/4 w-[30%] h-[60%] bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-6000"></div>
        <div className="absolute right-20 -top-10 w-[30%] h-[60%] bg-sky-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute start1/2 -top-10 w-[30%] h-[60%] bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-6 font-jakarta">Hiragana</h1>
        <div className="text-2xl text-gray-600 font-jakarta">
          Mastered: <span className="font-semibold">{masteredCount}/{totalHiragana}</span>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center gap-4 px-4 z-50">
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