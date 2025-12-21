'use client';

import Image from 'next/image';
import BubbleGradient from '../components/BubbleGradient';
import NavigationCard from '../components/NavigationCard';
import WelcomeText from '../components/WelcomeText';
import SettingsButton from '../components/SettingsButton';
import { useKanaProgress } from '../hooks/use-kana-progress';

export default function HomePage() {
  const { hiragana, katakana } = useKanaProgress();

  const { masteredKana: hiraganaKana, totalKana: hiraganaTotal } = hiragana;
  const { masteredKana: katakanaKana, totalKana: katakanaTotal } = katakana;

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
    // {
    //   href: '/kanji',
    //   title: 'Kanji',
    // },
    // {
    //   href: '/kana-animated',
    //   title: 'Writing',
    // },
  ];

  return (
    <div className="min-h-screen bg-grey-50 dark:bg-gray-900">
      <BubbleGradient />

      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-2 md:p-4">
        <SettingsButton />

        <div className="relative items-center justify-center text-center">
          <h1 className="mb-6 text-center text-6xl font-bold text-gray-800 dark:text-gray-100 font-noto-jp">
            Hika no Gakusei
          </h1>
          <WelcomeText />
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
          {navigationSections.map(({ href, title, progress }) => {
            console.log(`ini data progress: ${JSON.stringify(progress)}`);
            return (
              <NavigationCard
                key={href}
                href={href}
                title={title}
                progress={progress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
