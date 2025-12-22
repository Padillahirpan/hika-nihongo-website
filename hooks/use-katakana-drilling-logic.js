import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJapaneseSpeech } from './useSpeechService';
import { useKatakanaStore } from '../stores/katakana-store';
import { useDrillingState, useDrillingActions } from '../stores/drilling-store';
import { testType } from '../data/kana-data';
import { LEARNING, SPEECH } from '../constants';
import { LoadingStates } from '../components/LoadingState';

export function useKatakanaDrillingLogic() {
  const router = useRouter();
  const {
    canSpeak,
    speakKana,
    isSpeaking,
    error: speechError,
  } = useJapaneseSpeech({
    rate: SPEECH.RATE,
    pitch: SPEECH.PITCH,
    volume: SPEECH.VOLUME,
    voiceName: SPEECH.VOICE_NAME,
    autoRetry: SPEECH.AUTO_RETRY,
    maxRetries: SPEECH.MAX_RETRIES,
    retryDelay: SPEECH.RETRY_DELAY,
  });

  // Error and loading state management
  const [loadingState, setLoadingState] = useState(LoadingStates.IDLE);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Store hooks
  const { currentKatakanaData, updateKanaByCharacter } = useKatakanaStore();
  const {
    progressCurrent,
    progressTotal,
    score,
    selectedAnswer,
    showResult,
    isFinished,
    currentQuestion: currentQ,
    previousResults,
  } = useDrillingState();

  const {
    updateKatakanaData,
    generateQuestions,
    selectAnswer,
    checkAnswer: checkAnswerAction,
    nextQuestion,
    restartDrilling,
    loadPreviousResults: loadPreviousResultsAction,
    getCurrentQuestion: getCurrentQuestionAction,
    resetDrilling: resetDrillingAction,
    setTestType,
  } = useDrillingActions();

  // Speech synthesis functionality using new SpeechService
  const pronounceKatakana = (kana, options = {}) => {
    try {
      if (!canSpeak) {
        console.warn('Speech synthesis is not supported in this browser');
        return;
      }

      if (!kana) {
        console.warn(
          `Invalid kana character provided for pronunciation: ${kana.character}`,
        );
        return;
      }

      speakKana(kana, {
        onError: (error) => {
          console.error('Speech service error:', error);
          setError(error);
          setLoadingState(LoadingStates.ERROR);
          if (options.onError) options.onError(error);
        },
        onEnd: () => {
          if (options.onEnd) options.onEnd();
        },
        onStart: () => {
          if (options.onStart) options.onStart();
        },
        ...options,
      });
    } catch (error) {
      console.error('Error in pronounceKatakana:', error);
      setError(error);
      setLoadingState(LoadingStates.ERROR);
      if (options.onError) options.onError(error);
    }
  };

  // Optimized mastery level calculation - O(1) instead of O(3n) with error handling
  const updateMasteryLevel = (kana, isCorrect) => {
    try {
      if (!kana || !kana.character) {
        console.error('Invalid kana data provided to updateMasteryLevel');
        return;
      }

      // Find current kana to get existing points
      const currentKana = currentKatakanaData.find(
        (item) => item.character === kana.character,
      );
      if (!currentKana) {
        console.warn(`Kana ${kana.character} not found in katakana data`);
        return;
      }

      // Calculate new points efficiently using constants
      const pointsChange = isCorrect
        ? LEARNING.MASTERY_POINTS_CORRECT
        : -LEARNING.MASTERY_POINTS_INCORRECT;
      const newPoints = Math.max(
        LEARNING.MASTERY_MIN_POINTS,
        Math.min(
          LEARNING.MASTERY_MAX_POINTS,
          currentKana.points + pointsChange,
        ),
      );

      // Direct update - O(1) operation instead of O(n) filter + map
      updateKanaByCharacter(kana.character, kana, { points: newPoints });
    } catch (error) {
      console.error('Error in updateMasteryLevel:', error);
      setError(error);
      setLoadingState(LoadingStates.ERROR);
    }
  };

  // Load previous results
  const loadPreviousResults = () => {
    loadPreviousResultsAction();
  };

  // Initialize drilling session with loading state
  useEffect(() => {
    const initializeDrilling = async () => {
      try {
        setLoadingState(LoadingStates.LOADING);
        setLoadingMessage('Loading kana data...');

        // Set the test type to katakana first
        setTestType(testType.KATAKANA);

        await updateKatakanaData(currentKatakanaData);

        setLoadingMessage('Generating questions...');
        await generateQuestions();

        setLoadingMessage('Loading previous results...');
        loadPreviousResults();

        setLoadingState(LoadingStates.SUCCESS);
      } catch (error) {
        console.error('Error initializing drilling session:', error);
        setError(error);
        setLoadingState(LoadingStates.ERROR);
      }
    };

    initializeDrilling();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Answer checking logic
  const checkAnswer = () => {
    if (selectedAnswer != null) {
      checkAnswerAction((kana, isCorrect) =>
        updateMasteryLevel(kana, isCorrect),
      );
    }
  };

  // Handle answer selection with pronunciation
  const handleAnswerSelect = (selectedOption) => {
    selectAnswer(selectedOption);

    if (currentQ) {
      if (currentQ.type === 'kanaToSound') {
        pronounceKatakana(selectedOption); // Pass the full option object, not just character
      }
    }
  };

  // Handle next question with pronunciation
  const handleNextQuestion = () => {
    nextQuestion();

    const currentQuestionNew = getCurrentQuestionAction();

    if (currentQuestionNew) {
      if (currentQuestionNew.type === 'soundToKana') {
        pronounceKatakana(currentQuestionNew.correctAnswer); // Pass full object, not just character
      } else if (currentQuestionNew.type === 'kanaToSound') {
        pronounceKatakana(currentQuestionNew.question); // question should be the full kana object
      }
    }
  };

  // Navigation handlers
  const handleBackToHome = () => {
    resetDrillingAction();
    router.back();
  };

  const handleRestartDrilling = () => {
    restartDrilling();
  };

  // Error retry handler
  const handleRetry = () => {
    setLoadingState(LoadingStates.RETRYING);
    setError(null);

    // Retry initialization
    const initializeDrilling = async () => {
      try {
        setLoadingMessage('Retrying initialization...');
        await generateQuestions();
        loadPreviousResults();
        setLoadingState(LoadingStates.SUCCESS);
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        setError(retryError);
        setLoadingState(LoadingStates.ERROR);
      }
    };

    initializeDrilling();
  };

  return {
    // State
    currentQ,
    isFinished,
    progressCurrent,
    progressTotal,
    score,
    showResult,
    selectedAnswer,
    previousResults,

    // Loading and error states
    loadingState,
    error: error || speechError, // Combine drilling and speech errors
    loadingMessage,
    isLoading: loadingState === LoadingStates.LOADING,
    isError: loadingState === LoadingStates.ERROR || !!speechError,
    isRetrying: loadingState === LoadingStates.RETRYING,

    // Speech states
    canSpeak,
    isSpeaking,

    // Actions
    handleAnswerSelect,
    checkAnswer,
    handleNextQuestion,
    handleBackToHome,
    handleRestartDrilling,
    pronounceKatakana,
    handleRetry,
    loadPreviousResultsAction,
  };
}
