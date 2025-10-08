"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import KanaStrokePlayer from "../../components/KanaStrokePlayer";
import { getAllKanji } from "../../data/kanji-data";
import { useLanguage } from "../../contexts/language-context";
import { useSpeechSynthesis } from "../../util/use-speech-synthesis";

const buildGlyphFromKanji = (kanjiItem) => {
  if (!kanjiItem?.kanji) {
    return null;
  }

  const trimmed = kanjiItem.kanji.trim();
  if (!trimmed) {
    return null;
  }

  const primaryChar = Array.from(trimmed)[0];
  if (!primaryChar) {
    return null;
  }

  const codePoint = primaryChar.codePointAt(0);
  if (!codePoint) {
    return null;
  }

  return {
    id: `kanji-${codePoint.toString(16)}`,
    kana: primaryChar,
    romaji: kanjiItem.romaji,
    script: "kanji",
    codepoint: codePoint.toString(16).toUpperCase(),
  };
};

const SoundIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 md:h-5 md:w-5"
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
);

const KanjiCard = ({ item, onPronounce, onShowDetail }) => (
  <div className="group relative flex flex-col justify-between rounded-2xl border border-rose-100 bg-white/80 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-rose-900/40 dark:bg-gray-900/70">
    <div>
      <div className="flex items-start justify-between">
        <span className="text-4xl font-bold text-gray-900 transition group-hover:text-rose-500 dark:text-gray-100 font-noto-jp">
          {item.kanji}
        </span>
        <button
          type="button"
          onClick={(e) => onPronounce(e, item)}
          className="rounded-full bg-sky-400 p-2 text-white shadow-inner transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
          aria-label="Play pronunciation"
        >
          <SoundIcon />
        </button>
      </div>
      {item.character && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 font-noto-jp">{item.character}</p>
      )}
      {item.romaji && (
        <p className="mt-1 text-xs uppercase tracking-wide text-rose-500 dark:text-rose-300">{item.romaji}</p>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-semibold text-gray-700 dark:text-gray-100">Meaning (ID): </span>
        {item.indonesia || "-"}
      </p>
    </div>
    <button
      type="button"
      onClick={() => onShowDetail(item)}
      className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-300 to-rose-500 px-3 py-2 text-sm font-semibold text-white shadow transition hover:from-rose-400 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
    >
      View details
    </button>
  </div>
);

const KanjiDetailModal = ({ kanjiItem, onClose }) => {
  if (!kanjiItem) {
    return null;
  }

  const glyph = buildGlyphFromKanji(kanjiItem);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-3xl border border-rose-100/40 bg-white/95 p-6 shadow-2xl dark:border-rose-900/40 dark:bg-gray-900/95">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 text-gray-600 transition hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex justify-center">
            <KanaStrokePlayer glyph={glyph} strokeColor="#fb7185" strokeWidth={10} />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-rose-400 dark:text-rose-300">Kanji</p>
              <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 font-noto-jp">{kanjiItem.kanji}</h2>
            </div>
            {kanjiItem.character && (
              <div>
                <p className="text-sm uppercase tracking-wide text-rose-400 dark:text-rose-300">Kana</p>
                <p className="text-2xl text-gray-700 dark:text-gray-200 font-noto-jp">{kanjiItem.character}</p>
              </div>
            )}
            {kanjiItem.romaji && (
              <div>
                <p className="text-sm uppercase tracking-wide text-rose-400 dark:text-rose-300">Romaji</p>
                <p className="text-xl text-gray-700 dark:text-gray-200">{kanjiItem.romaji}</p>
              </div>
            )}
            <div>
              <p className="text-sm uppercase tracking-wide text-rose-400 dark:text-rose-300">Meaning (ID)</p>
              <p className="text-base text-gray-700 dark:text-gray-200">{kanjiItem.indonesia || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KanjiGrid = ({ kanjiList }) => {
  const { supported, speak } = useSpeechSynthesis("ja-JP");
  const [selectedKanji, setSelectedKanji] = useState(null);

  if (!Array.isArray(kanjiList) || kanjiList.length === 0) {
    return null;
  }

  const handlePronounce = (event, item) => {
    event.stopPropagation();
    if (!supported) {
      console.error("Web Speech API is not supported in this browser");
      return;
    }
    speak(item.kanji, {
      lang: "ja-JP",
      rate: 0.6,
      pitch: 1,
      volume: 5,
      voiceName: "Google 日本語",
      onStart: () => console.log("Pronouncing:", item.kanji),
      onEnd: () => console.log("Done"),
      onError: (error) => console.error("TTS error:", error.error),
    });
  };

  const handleOpenDetail = (item) => {
    setSelectedKanji(item);
  };

  const handleCloseDetail = () => {
    setSelectedKanji(null);
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-20">
        {kanjiList.map((item) => (
          <KanjiCard
            key={`${item.kanji}-${item.romaji}`}
            item={item}
            onPronounce={handlePronounce}
            onShowDetail={handleOpenDetail}
          />
        ))}
      </div>
      {/* <ButtonDrilling /> */}
      {selectedKanji && <KanjiDetailModal kanjiItem={selectedKanji} onClose={handleCloseDetail} />}
    </>
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
      className="fixed bottom-6 left-1/2 z-50 flex w-11/12 max-w-4xl -translate-x-1/2 transform items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-rose-200 to-rose-400 px-6 py-4 text-white opacity-95 shadow-lg transition-all duration-300 hover:scale-105 hover:from-rose-400 hover:to-rose-500"
    >
      <svg
        className="h-5 w-5"
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
      <span className="font-semibold sm:text-xl xl:text-2xl">
        Let's start drilling
      </span>
    </button>
  );
};

export default function KanjiPage() {
  const router = useRouter();
  const { language } = useLanguage();

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
    <main className="min-h-screen bg-white p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        <BackButton handleBackToHome={handleBackToHome} />

        <h1 className="mt-8 mb-4 text-left text-6xl font-bold text-gray-800 dark:text-gray-100 font-jakarta">
          Kanji
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 font-jakarta">
          {description}
        </p>

        <KanjiGrid kanjiList={kanjiList} />
      </div>
    </main>
  );
}
