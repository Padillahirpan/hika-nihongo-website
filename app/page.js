'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BubbleGradient from '../components/BubbleGradient';
import ProgressBar from '../components/ProgressBar';
import { welcomeText } from '../data/welcome-data';
import { HIRAGANA_DATA_PROGRESS, KATAKANA_DATA_PROGRESS } from '../hooks/cons-storage';
import { getCurrentKanaProgress } from '../hooks/user-local-storage';

export default function HomePage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  
  const { masteredKana: hiraganaKana, totalKana: hiraganaTotal } = getCurrentKanaProgress(HIRAGANA_DATA_PROGRESS);
  const { masteredKana: katakanaKana, totalKana: katakanaTotal } = getCurrentKanaProgress(KATAKANA_DATA_PROGRESS);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setShowText(false);
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % welcomeText.length);
        setShowText(true);
      }, 2000);
    }, 6000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="min-h-screen">
      <BubbleGradient/>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        <div className='relative items-center justify-center text-center'>
          <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center font-noto-jp">HikaGo Nihongo N5</h1>
          <div className="typewriter-container text-xl min-h-[4.5rem] text-center flex flex-col items-center justify-center">
            {showText && (
              <>
                <div className="typewriter text-xl text-gray-800 font-jakarta mb-2">
                  {welcomeText[currentTextIndex].japanese}
                </div>
                <div className="text-gray-600 mt-1 font-jakarta">
                  {welcomeText[currentTextIndex].english}
                </div>
              </>
            )}
          </div>
        </div> 
        <Image
          className="mb-8"
          src="/images/hikago_ic.png"
          alt="App Logo"
          width={500}
          height={500}
          priority // Use for above-the-fold images
        />
      </div>

      <div className="fixed bottom-8 sm:bottom-4 xl:bottom-32 left-0 right-0 flex justify-center items-center gap-4 px-4 z-50">
        <div className="flex flex-col w-11/12 max-w-4xl gap-4 items-center">
          <Link
            href="/hiragana"
            className="flex-1 w-full max-w-lm bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 text-center font-semibold text-white"
          >
            <div className='flex flex-col'>
              <div className='text-xl font-bold font-jakarta'>Hiragana</div>
              <div className='flex flex-row items-center mt-2 justify-center gap-2'>
                  <ProgressBar 
                    current={hiraganaKana}
                    total={hiraganaTotal}
                    baseColor={"bg-gray-200"}
                    progressColor={"bg-rose-500"}
                    size={0}
                  />
                  <div className='text-sm'>{hiraganaKana}/{hiraganaTotal}</div>
                </div>
            </div>
          </Link>
          <Link
            href="/katakana"
            className="flex-1 w-full max-w-lm bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 text-center font-semibold text-white"
          >
            <div className='flex flex-col'>
              <div className='text-xl font-bold'>Katakana</div>
              <div className='flex flex-row items-center mt-2 justify-center gap-2'>
                  <ProgressBar 
                    current={katakanaKana}
                    total={katakanaTotal}
                    baseColor={"bg-gray-200"}
                    progressColor={"bg-rose-500"}
                    size={0}
                  />
                  <div className='text-sm'>{katakanaKana}/{katakanaTotal}</div>
                </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}