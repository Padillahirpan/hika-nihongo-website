"use client";

import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import { getAllKanji } from "../../data/kanji-data";
import { useLanguage } from "../../contexts/language-context";
import { useSpeechSynthesis } from "../../util/use-speech-synthesis";

const KanjiTable = ({ kanjiList }) => {
  const { supported, speak } = useSpeechSynthesis("ja-JP");


  if (!kanjiList || kanjiList.length === 0) {
    return null;
  }

  //   // Function to pronounce the hiragana using Web Speech API
  const pronounceHiragana = (e, kana) => {
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

  return (
    <div className="overflow-x-auto rounded-xl border border-rose-100 dark:border-rose-900/40 bg-white/60 dark:bg-gray-900/60 shadow-sm">
      <table className="min-w-full divide-y divide-rose-100 dark:divide-rose-900/40">
        <thead className="bg-rose-200/40 dark:bg-rose-900/20">
          <tr className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            <th scope="col" className="px-4 py-3">No</th>
            <th scope="col" className="px-4 py-3">Kanji</th>
            <th scope="col" className="px-4 py-3">Kana</th>
            <th scope="col" className="px-4 py-3">Romaji</th>
            <th scope="col" className="px-4 py-3">Meaning (EN)</th>
            <th scope="col" className="px-4 py-3">Meaning (ID)</th>
            <th scope="col" className="px-4 py-3">Pronounce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-100 dark:divide-rose-900/40">
          {kanjiList.map((item, index) => (
            <tr key={`${item.kanji}-${item.romaji}`} className="text-sm sm:text-base text-gray-700 dark:text-gray-100">
              <td className="px-4 py-3 font-semibold text-2xl sm:text-3xl text-gray-900 dark:text-gray-50 font-noto-jp">{index + 1}</td>
              <td className="px-4 py-3 font-semibold text-2xl sm:text-3xl text-gray-900 dark:text-gray-50 font-noto-jp">{item.kanji}</td>
              <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 font-noto-jp">{item.character}</td>
              <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">{item.romaji}</td>
              <td className="px-4 py-3">{item.english}</td>
              <td className="px-4 py-3">{item.indonesia}</td>
              <td className="px-4 py-3">
                <button
                    onClick={(e) => pronounceHiragana(e, item.kanji)}
                    className="p-1 bg-sky-400 text-white rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    aria-label="Pronounce"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:h-4 lg:w-4 md:h-4 md:w-4 h-4 w-4"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full h-[20px] mt-16 rounded-lg mb-4 flex items-center justify-center" />

    </div>
  );
};

const ButtonDrilling = () => {
  const router = useRouter();

  const handleDrillingClick = () => {
    router.push("/kanji-drill");
  };

  return (
    <button
      onClick={handleDrillingClick}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-4xl w-11/12 rounded-lg opacity-95 bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white px-6 py-4 shadow-lg transition-all duration-300 hover:scale-105 z-50 flex items-center justify-center space-x-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span className="sm:text-xl xl:text-2xl font-semibold">
        Let's start drilling
      </span>
    </button>
  );
}

export default function KanjiPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const kanjiList = getAllKanji();
  const descriptions = {
    en: "Browse the full list of starter kanji with their readings and meanings.",
    id: "Jelajahi daftar lengkap kanji dasar beserta cara baca dan artinya.",
  };
  const description = descriptions[language] || descriptions.en;

  const handleBackToHome = () => {
    router.back();
  };

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <BackButton handleBackToHome={handleBackToHome} />

        <h1 className="text-6xl font-bold mt-8 text-left mb-4 font-jakarta text-gray-800 dark:text-gray-100">
          Kanji
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-jakarta">
          {description}
        </p>

        <KanjiTable kanjiList={kanjiList} />
        {/* Drilling Button */}
        <ButtonDrilling />
      </div>
    </main>
  );
}
