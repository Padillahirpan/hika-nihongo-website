"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../../components/BackButton";
import KanaStrokePlayer from "../../components/KanaStrokePlayer";
import { KANA_GLYPHS, groupOrder } from "../../data/kana-strokes";
import { useSpeechSynthesis } from "../../util/use-speech-synthesis";

const scripts = [
  { key: "hiragana", label: "Hiragana" },
  { key: "katakana", label: "Katakana" }
];

export default function KanaAnimatePage() {
  const router = useRouter();
  const { supported, speak } = useSpeechSynthesis("ja-JP");
  const [script, setScript] = useState("hiragana");
  const [query, setQuery] = useState("");
  const glyphs = useMemo(
    () =>
      KANA_GLYPHS.filter((glyph) => glyph.script === script && glyph.kana && glyph.kana !== "-"),
    [script]
  );
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return glyphs;
    return glyphs.filter(
      (glyph) =>
        glyph.romaji.includes(trimmed) ||
        glyph.kana.includes(trimmed) ||
        glyph.group.includes(trimmed)
    );
  }, [glyphs, query]);
  const [selectedId, setSelectedId] = useState(() => glyphs[0]?.id);
  const selectedGlyph = useMemo(
    () => KANA_GLYPHS.find((glyph) => glyph.id === selectedId),
    [selectedId]
  );

  const handleBackToHome = () => router.back();

  const pronounce = () => {
    if (!selectedGlyph || !supported) return;
    speak(selectedGlyph.kana, { rate: 0.85, pitch: 1, lang: "ja-JP" });
  };

  return (
    <main className="min-h-screen bg-rose-50 dark:bg-gray-950/90">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <BackButton handleBackToHome={handleBackToHome} />
        <header className="mt-6 mb-8 text-left sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl font-jakarta">
            Kana Stroke Animations
          </h1>
          <p className="mt-4 max-w-3xl text-left text-sm text-gray-600 dark:text-gray-300 sm:text-base md:text-lg">
            Choose any hiragana or katakana character to watch its stroke order courtesy of
            <span className="font-semibold"> KanjiVG</span>. Filter by romaji, tap a kana, and use the
            speaker button to practise pronunciation.
          </p>
        </header>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {scripts.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setScript(key);
                setQuery("");
                const first = KANA_GLYPHS.find((glyph) => glyph.script === key);
                setSelectedId(first?.id);
              }}
              className={`w-full rounded-full px-4 py-2 text-center text-sm font-semibold transition sm:w-auto ${
                script === key
                  ? "bg-rose-500 text-white shadow-md"
                  : "border border-rose-200/50 bg-white/80 text-gray-700 hover:border-rose-300 dark:border-rose-900/50 dark:bg-gray-900/60 dark:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="w-full sm:ml-auto sm:w-64">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search kana or romaji"
              className="w-full rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm outline-none transition focus:ring-2 focus:ring-rose-400 dark:border-rose-900/40 dark:bg-gray-900/60 dark:text-gray-200"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
          <div className="rounded-2xl bg-white/85 p-4 shadow-lg sm:p-6 dark:bg-gray-900/60">
            <KanaStrokePlayer glyph={selectedGlyph} />
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={pronounce}
                disabled={!supported}
                className="flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 5L6 9H3v6h3l5 4z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                </svg>
                Play Sound
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white/85 p-4 shadow-lg sm:p-6 dark:bg-gray-900/60">
            <div className="max-h-[60vh] overflow-y-auto pr-1 sm:max-h-[70vh]">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
                {groupOrder.flatMap((group) =>
                  filtered
                    .filter((glyph) => glyph.group === group)
                    .map((glyph) => (
                      <button
                        key={glyph.id}
                        onClick={() => setSelectedId(glyph.id)}
                        className={`aspect-square rounded-2xl border text-lg font-semibold font-noto-jp transition sm:text-xl ${
                          glyph.id === selectedId
                            ? "border-rose-500 bg-rose-500 text-white shadow-md"
                            : "border-rose-200/80 bg-white/70 text-gray-700 hover:border-rose-400 dark:border-rose-900/60 dark:bg-gray-800/60 dark:text-gray-100"
                        }`}
                      >
                        <span>{glyph.kana}</span>
                        <span className="block text-xs uppercase text-gray-500 dark:text-gray-400">
                          {glyph.romaji}
                        </span>
                      </button>
                    ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
