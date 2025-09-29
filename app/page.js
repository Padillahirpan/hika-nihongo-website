'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BubbleGradient from '../components/BubbleGradient';
import ProgressBar from '../components/ProgressBar';
import { welcomeText } from '../data/welcome-data';
import { HIRAGANA_DATA_PROGRESS, KATAKANA_DATA_PROGRESS } from '../hooks/cons-storage';
import { getCurrentKanaProgress } from '../hooks/user-local-storage';
import { useLanguage } from '../contexts/language-context';

export default function HomePage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const { language } = useLanguage();
  
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
    <div className="min-h-screen bg-grey-50 dark:bg-gray-900">
      <BubbleGradient/>

      <div className="relative flex flex-col items-center justify-center min-w-sm min-h-screen p-2 md:p-4">
        {/* Settings Button */}
        <div className="w-11/12 max-w-4xl flex justify-end">
          <Link
            href="/settings"
            className="p-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-gray-800 dark:text-gray-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
        <div className='relative items-center justify-center text-center'>
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center font-noto-jp">HikaGo Nihongo N5</h1>
          <div className="typewriter-container text-xl min-h-[4.5rem] text-center flex flex-col items-center justify-center">
            {showText && (
              <>
                <div className="typewriter text-xl text-gray-800 dark:text-gray-100 font-jakarta mb-2">
                  {welcomeText[currentTextIndex].japanese}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-1 font-jakarta">
                  {language === 'id' ? welcomeText[currentTextIndex].id : welcomeText[currentTextIndex].english}
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
                {hiraganaTotal > 0 && (
                  <>
                    <ProgressBar 
                      current={hiraganaKana}
                      total={hiraganaTotal}
                      baseColor={"bg-gray-200"}
                      progressColor={"bg-rose-500"}
                      size={0}
                    />
                    <div className='text-sm'>{hiraganaKana}/{hiraganaTotal}</div>
                  </>
                )
                }
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
                {katakanaTotal > 0 && (
                  <>
                    <ProgressBar 
                      current={katakanaKana}
                      total={katakanaTotal}
                      baseColor={"bg-gray-200"}
                      progressColor={"bg-rose-500"}
                      size={0}
                    />
                    <div className='text-sm'>{katakanaKana}/{katakanaTotal}</div>
                  </>
                )
                }
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}