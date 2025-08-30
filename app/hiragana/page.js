"use client";

import { useState, useEffect } from "react";
import HiraganaCard from "../../components/HiraganaCard";
import EmptyCard from "../../components/EmptyCard";
import { hiraganaData } from "../../data/hiraganaData";
import { useRouter } from "next/navigation";

export default function HiraganaPage() {
  const router = useRouter();
  const [updatedHiraganaData, setUpdatedHiraganaData] = useState(hiraganaData);

  // Function to load mastery levels from localStorage
  const loadMasteryLevels = () => {
    const savedMasteryLevels = JSON.parse(
      localStorage.getItem("hiraganaProgress") || "{}",
    );

    // Update hiraganaData with saved mastery levels
    const updatedData = hiraganaData.map((item) => ({
      ...item,
      masteryLevel: savedMasteryLevels[item.romaji] || item.masteryLevel,
    }));

    setUpdatedHiraganaData(updatedData);
  };

  // Load saved mastery levels from localStorage on component mount
  useEffect(() => {
    loadMasteryLevels();

    // Add event listener to reload data when window gains focus (user returns from drilling)
    const handleFocus = () => {
      loadMasteryLevels();
    };

    window.addEventListener("focus", handleFocus);

    // Cleanup event listener
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleDrillingClick = () => {
    router.push("/drilling");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-8 font-jakarta">
          Hiragana Learning Cards
        </h1>
        <p className="text-2xl font-regular text-gray-500 text-center mb-8 font-jakarta">
          Click on a card to flip it and see the romaji. Click the sound icon to
          hear pronunciation.
        </p>

        <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-4">
          {updatedHiraganaData.map((item, index) => (
            <div key={index} className="flex justify-center">
              {item.hiragana !== " " ? (
                <HiraganaCard
                  hiragana={item.hiragana}
                  romaji={item.romaji}
                  masteryLevel={item.masteryLevel}
                />
              ) : (
                <EmptyCard />
              )}
            </div>
          ))}
        </div>
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
          Let's start Drilling
        </span>
      </button>
    </main>
  );
}
