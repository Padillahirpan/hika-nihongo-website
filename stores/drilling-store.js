import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { generateOptimizedQuestions } from '../util/question-generator';
import { testType } from '../data/kana-data';
import { getAllHiragana } from '../data/kana-data';
import { getAllKatakana } from '../data/katakana-data';
import { DRILLING } from '../constants';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useDrillingStore = create(
  persist(
    (set, get, store) => ({
      // State

      previousResults: [],

      hiraganaData: [],
      katakanaData: [],
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      selectedAnswer: null,
      showResult: false,
      isFinished: false,
      currentTestType: testType.HIRAGANA,
      currentQuestion: {},

      updateHiraganaData: async (updatedHiraganaData) => {
        const hiragana = updatedHiraganaData || getAllHiragana();
        set({ hiraganaData: hiragana });
      },

      updateKatakanaData: async (updatedKatakanaData) => {
        const katakana = updatedKatakanaData || getAllKatakana();
        set({ katakanaData: katakana });
      },

      updateKanaData: async (kanaData, testType) => {
        if (testType === testType.HIRAGANA) {
          const hiragana = kanaData || getAllHiragana();
          set({ hiraganaData: hiragana });
        } else if (testType === testType.KATAKANA) {
          const katakana = kanaData || getAllKatakana();
          set({ katakanaData: katakana });
        }
      },

      // Actions
      setTestType: (type) => {
        set({ currentTestType: type });
      },

      generateQuestions: async () => {
        const { hiraganaData, katakanaData, currentTestType } = get();
        let kanaData =
          currentTestType === testType.HIRAGANA ? hiraganaData : katakanaData;
        const updatedKanaData = kanaData.filter((item) => item.unlocked);
        const newQuestions = generateOptimizedQuestions(updatedKanaData);

        set({
          questions: newQuestions,
          currentQuestionIndex: 0,
          score: 0,
          selectedAnswer: null,
          showResult: false,
          isFinished: false,
          currentQuestion: newQuestions[0],
        });
      },

      selectAnswer: (answer) => {
        set({ selectedAnswer: answer });
      },

      checkAnswer: (updateMasteryLevel) => {
        const { selectedAnswer, currentQuestion } = get();

        if (selectedAnswer != null) {
          const isCorrect =
            selectedAnswer.romaji === currentQuestion.correctAnswer.romaji;

          set({ showResult: true });

          if (isCorrect) {
            set((state) => ({ score: state.score + 1 }));
          }

          // Update mastery level through callback
          updateMasteryLevel(currentQuestion.correctAnswer, isCorrect);
        }
      },

      nextQuestion: () => {
        const { currentQuestionIndex, score, currentTestType, questions } =
          get();

        if (currentQuestionIndex < DRILLING.QUESTIONS_PER_DRILL - 1) {
          set({
            currentQuestionIndex: currentQuestionIndex + 1,
            selectedAnswer: null,
            showResult: false,
            currentQuestion: questions[currentQuestionIndex + 1],
          });
        } else {
          // Create the result object
          const result = {
            score: score,
            totalQuestions: DRILLING.QUESTIONS_PER_DRILL,
            percentage: Math.round(
              (score / DRILLING.QUESTIONS_PER_DRILL) *
                DRILLING.PROGRESS_PERCENTAGE_MULTIPLIER,
            ),
            date: new Date().toISOString(),
            timestamp: Date.now(),
            type: currentTestType.toString(),
          };

          // Combine isFinished and saveDrillingResult into one atomic update
          set((state) => {
            const existingResults = state.previousResults || [];
            const newResults = [...existingResults, result];

            // Keep only the last MAX_RESULTS
            if (newResults.length > DRILLING.MAX_RESULTS) {
              return {
                isFinished: true,
                previousResults: newResults.slice(-DRILLING.MAX_RESULTS),
              };
            }

            return {
              isFinished: true,
              previousResults: newResults,
            };
          });
        }
      },

      saveDrillingResult: () => {
        const { score, currentTestType } = get();

        const result = {
          score: score,
          totalQuestions: DRILLING.QUESTIONS_PER_DRILL,
          percentage: Math.round(
            (score / DRILLING.QUESTIONS_PER_DRILL) *
              DRILLING.PROGRESS_PERCENTAGE_MULTIPLIER,
          ),
          date: new Date().toISOString(),
          timestamp: Date.now(),
          type: currentTestType.toString(),
        };

        set((state) => {
          const existingResults = state.previousResults || [];
          const newResults = [...existingResults, result];

          // Keep only the last MAX_RESULTS
          if (newResults.length > DRILLING.MAX_RESULTS) {
            return { previousResults: newResults.slice(-DRILLING.MAX_RESULTS) };
          }

          return { previousResults: newResults };
        });
      },

      restartDrilling: () => {
        const { generateQuestions } = get();
        generateQuestions();
      },

      loadPreviousResults: () => {
        // Results are stored in memory only
        return get().previousResults.slice(-5).reverse();
      },

      getRecentResults: (limit = 5) => {
        return get().previousResults.slice(-limit).reverse();
      },

      clearResults: () => {
        set({ previousResults: [] });
      },

      getCurrentQuestion: () => {
        const { currentQuestion, isFinished } = get();
        if (isFinished) {
          return null;
        }
        return currentQuestion;
      },

      resetDrilling: () => {
        store.getInitialState();
      },
    }),
    {
      name: 'drilling-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        previousResults: state.previousResults,
      }),
    },
  ),
);

// Optimized selector hooks for better performance
export const useDrillingHiraganaData = () =>
  useDrillingStore((state) => state.hiraganaData);

export const useDrillingQuestions = () =>
  useDrillingStore((state) => state.questions);

export const useDrillingProgress = () =>
  useDrillingStore(
    useShallow((state) => ({
      current: state.currentQuestionIndex + 1,
      total: state.questions.length || DRILLING.QUESTIONS_PER_DRILL,
    })),
  );

export const useDrillingScore = () => useDrillingStore((state) => state.score);

export const useDrillingAnswerState = () =>
  useDrillingStore(
    useShallow((state) => ({
      selectedAnswer: state.selectedAnswer,
      showResult: state.showResult,
    })),
  );

export const useDrillingFinished = () =>
  useDrillingStore((state) => state.isFinished);

export const useDrillingPreviousResults = () =>
  useDrillingStore((state) => state.previousResults);

export const useDrillingCurrentQuestion = () =>
  useDrillingStore((state) => {
    if (!state.questions.length) return null;
    return state.currentQuestion;
  });

// Combined optimized hooks to reduce re-renders
export const useDrillingState = () =>
  useDrillingStore(
    useShallow((state) => ({
      hiragana: state.hiraganaData,
      progressCurrent: state.currentQuestionIndex + 1,
      progressTotal: state.questions.length || DRILLING.QUESTIONS_PER_DRILL,
      score: state.score,
      selectedAnswer: state.selectedAnswer,
      showResult: state.showResult,
      isFinished: state.isFinished,
      currentQuestion: state.questions.length ? state.currentQuestion : null,
      previousResults: state.previousResults,
    })),
  );

export const useDrillingActions = () =>
  useDrillingStore(
    useShallow((state) => ({
      updateHiraganaData: state.updateHiraganaData,
      updateKatakanaData: state.updateKatakanaData,
      updateKanaData: state.updateKanaData,
      setTestType: state.setTestType,
      generateQuestions: state.generateQuestions,
      selectAnswer: state.selectAnswer,
      checkAnswer: state.checkAnswer,
      nextQuestion: state.nextQuestion,
      restartDrilling: state.restartDrilling,
      resetDrilling: state.resetDrilling,
      loadPreviousResults: state.loadPreviousResults,
      clearResults: state.clearResults,
      getCurrentQuestion: state.getCurrentQuestion,
    })),
  );
