'use client';

import { useState, useEffect } from 'react';
import { KANA_GLYPHS } from '../data/kana-strokes';
import KanaStrokePlayer from './KanaStrokePlayer';
import { useJapaneseSpeech } from '../hooks/useSpeechService';
import { SPEECH } from '../constants';

const KanaStrokeModal = ({ isOpen, onClose, kana, script = 'hiragana' }) => {
  const [glyph, setGlyph] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const { canSpeak, speakKana, isSpeaking } = useJapaneseSpeech({
    rate: SPEECH.RATE,
    pitch: SPEECH.PITCH,
    volume: SPEECH.VOLUME,
    voiceName: SPEECH.VOICE_NAME,
  });

  useEffect(() => {
    if (!isOpen || !kana) {
      setGlyph(null);
      setIsLoading(true);
      return;
    }

    setIsLoading(true);

    // Simulate async processing of glyph data
    const processGlyph = async () => {
      try {
        // Add a small delay to show loading state for better UX
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Find the glyph data for the given kana
        const foundGlyph = KANA_GLYPHS.find(
          (g) => g.kana === kana && g.script === script,
        );
        setGlyph(foundGlyph);
      } catch (error) {
        console.error('Error processing glyph data:', error);
        setGlyph(null);
      } finally {
        setIsLoading(false);
      }
    };

    processGlyph();
  }, [isOpen, kana, script]);

  const handleRerender = () => {
    setAnimationKey((prev) => prev + 1);
  };

  // Function to pronounce the hiragana using new SpeechService
  const handlePronounce = (e) => {
    e.stopPropagation();
    if (!canSpeak) {
      console.warn('Speech synthesis is not supported in this browser');
      return;
    }

    // Create kana object for speech service
    console.log(`this is kana: ${JSON.stringify(glyph)}`);
    const kanaObj = { character: glyph.kana, romaji: glyph.romaji };

    speakKana(kanaObj, {
      onError: (error) => {
        console.error('Speech service error:', error);
      },
      onStart: () => {
        console.log('Pronouncing:', kana);
      },
      onEnd: () => {
        console.log('Pronunciation completed for:', kana);
      },
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !kana) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stroke-modal-title"
    >
      <div className="relative mx-4 max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 shadow-2xl dark:bg-gray-900/95 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              id="stroke-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jakarta"
            >
              Stroke Order
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {kana}{' '}
              {isLoading ? 'Loading...' : `(${glyph?.romaji || 'Unknown'})`}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Stroke Player */}
        <div className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-rose-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                Loading stroke order data...
              </p>
            </div>
          ) : glyph ? (
            <div className="w-full">
              <KanaStrokePlayer
                key={animationKey}
                glyph={glyph}
                strokeColor="#f43f5e"
                strokeWidth={4}
                gap={0.2}
                autoPlay={true}
              />
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={handleRerender}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  onClick={handlePronounce}
                  disabled={!canSpeak || isSpeaking}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    !canSpeak
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isSpeaking
                        ? 'bg-neutral-400 text-white hover:bg-neutral-500'
                        : 'bg-sky-400 text-white hover:bg-sky-500'
                  }`}
                  title={`Pronounce ${kana}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Stroke order data not available for {kana}
              </p>
            </div>
          )}
        </div>

        {/* Footer with tips */}
        {glyph && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <p className="mb-1">
                💡 Follow the numbers and arrows to learn the correct stroke
                order
              </p>
              <p>Click anywhere outside to close</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanaStrokeModal;
