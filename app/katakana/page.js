"use client";

import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import { KanaSection } from "../../components/kana-section";
import { getLocalHiraganaData } from "../../hooks/user-local-storage";
import { getAllKatakana} from "../../data/katakana-data";
import { KATAKANA_DATA_PROGRESS } from "../../hooks/cons-storage";

export default function KatakanaPage() {
  const router = useRouter();

  const [dataKana, setDataKana] = getLocalHiraganaData(KATAKANA_DATA_PROGRESS, getAllKatakana());    

  const handleBackToHome = () => {
    router.back();
  };

  const handleDrillingClick = () => {
    router.push("/katakana-drill");
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <BackButton 
          handleBackToHome={handleBackToHome}
        />
        
        <h1 className="text-6xl font-bold mt-8 text-left mb-8 font-jakarta">
          Katakana
        </h1>
        <p className="text-l font-regular text-gray-500 text-left mb-8 font-jakarta">
          Click on a card to flip it and see the romaji. Click the sound icon to
          hear pronunciation.
        </p>

        <KanaSection
          title="Katakana"
          data={dataKana}
        />

        <div className="w-full h-[20px] mt-16 rounded-lg mb-4 flex items-center justify-center" />

      </div>

      {/* Drilling Button */}
      <button
        onClick={handleDrillingClick}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-4xl w-11/12 rounded-lg opacity-95 bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white px-6 py-4 shadow-lg transition-all duration-300 hover:scale-105 z-50 flex items-center justify-center space-x-2"
        aria-label="Start Drilling"
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
    </main>
  );
}