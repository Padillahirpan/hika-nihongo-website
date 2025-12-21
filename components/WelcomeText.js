import { useEffect, useState } from 'react';
import { welcomeText } from '../data/welcome-data';
import { useLanguage } from '../contexts/language-context';

const WelcomeText = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    let timeoutId;
    const intervalId = setInterval(() => {
      setShowText(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setCurrentTextIndex(
          (prevIndex) => (prevIndex + 1) % welcomeText.length,
        );
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

  return (
    <div className="typewriter-container flex min-h-[4.5rem] flex-col items-center justify-center text-center text-xl">
      {showText && (
        <>
          <div className="typewriter mb-2 text-xl text-gray-800 dark:text-gray-100 font-jakarta">
            {welcomeText[currentTextIndex].japanese}
          </div>
          <div className="mt-1 text-gray-600 dark:text-gray-400 font-jakarta">
            {language === 'id'
              ? welcomeText[currentTextIndex].id
              : welcomeText[currentTextIndex].english}
          </div>
        </>
      )}
    </div>
  );
};

export default WelcomeText;