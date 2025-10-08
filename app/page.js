'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BubbleGradient from '../components/BubbleGradient';
import ProgressBar from '../components/ProgressBar';
import { welcomeText } from '../data/welcome-data';
import { HIRAGANA_DATA_PROGRESS, KATAKANA_DATA_PROGRESS } from '../hooks/cons-storage';
import { getCurrentKanaProgress } from '../hooks/user-local-storage';
import { useLanguage } from '../contexts/language-context';

const NavigationCard = ({ href, title, progress }) => {
  const hasProgress = progress && progress.total > 0;

  return (
    <Link
      href={href}
      className="w-full flex-1 max-w-lg rounded-lg bg-gradient-to-r from-rose-200 to-rose-400 px-4 py-2 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:from-rose-400 hover:to-rose-500 hover:shadow-xl"
    >
      <div className="flex flex-col">
        <div className="text-xl font-bold font-jakarta">{title}</div>
        {hasProgress && (
          <div className="mt-2 flex flex-row items-center justify-center gap-2">
            <ProgressBar
              current={progress.current}
              total={progress.total}
              baseColor="bg-gray-200"
              progressColor="bg-rose-500"
              size={0}
            />
            <div className="text-sm">
              {progress.current}/{progress.total}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default function HomePage() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const { language } = useLanguage();

  const { masteredKana: hiraganaKana, totalKana: hiraganaTotal } = getCurrentKanaProgress(HIRAGANA_DATA_PROGRESS);
  const { masteredKana: katakanaKana, totalKana: katakanaTotal } = getCurrentKanaProgress(KATAKANA_DATA_PROGRESS);

  useEffect(() => {
    let timeoutId;
    const intervalId = setInterval(() => {
      setShowText(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % welcomeText.length);
        setShowText(true);
      }, 2000);
    }, 6000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const navigationSections = [
    {
      href: '/hiragana',
      title: 'Hiragana',
      progress: { current: hiraganaKana, total: hiraganaTotal },
    },
    {
      href: '/katakana',
      title: 'Katakana',
      progress: { current: katakanaKana, total: katakanaTotal },
    },
    {
      href: '/kanji',
      title: 'Kanji',
    },
    {
      href: '/kana-animated',
      title: 'Writing',
    },
  ];

  return (
    <div className="min-h-screen bg-grey-50 dark:bg-gray-900">
      <BubbleGradient />

      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-2 md:p-4">
        <div className="flex w-11/12 max-w-4xl justify-end">
          <Link
            href="/settings"
            className="rounded-lg p-8 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-gray-800 dark:text-gray-100"
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
        <div className="relative items-center justify-center text-center">
          <h1 className="mb-6 text-center text-6xl font-bold text-gray-800 dark:text-gray-100 font-noto-jp">HikaGo Nihongo N5</h1>
          <div className="typewriter-container flex min-h-[4.5rem] flex-col items-center justify-center text-center text-xl">
            {showText && (
              <>
                <div className="typewriter mb-2 text-xl text-gray-800 dark:text-gray-100 font-jakarta">
                  {welcomeText[currentTextIndex].japanese}
                </div>
                <div className="mt-1 text-gray-600 dark:text-gray-400 font-jakarta">
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
          priority
        />
      </div>

      <div className="fixed left-0 right-0 bottom-8 flex items-center justify-center gap-4 px-4 sm:bottom-4 xl:bottom-32 z-50">
        <div className="flex w-11/12 max-w-4xl flex-col items-center gap-4">
          {navigationSections.map(({ href, title, progress }) => (
            <NavigationCard key={href} href={href} title={title} progress={progress} />
          ))}
        </div>
      </div>
    </div>
  );
}
