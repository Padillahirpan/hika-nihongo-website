'use client';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import ProgressBar from '../../components/ProgressBar';
import BackButton from '../../components/BackButton';
import LoadingQuestions from '../../components/LoadingQuestions';
import DrillingFinished from './components/DrillingFinished';
import DrillingQuestionCard from './components/DrillingQuestionCard';
import { useLanguage } from '../../contexts/language-context';
import { useDrillingLogic } from '../../hooks/use-drilling-logic';
import { LoadingStates, LoadingMessage } from '../../components/LoadingState';

export default function HiraganaDrilling() {
  const { t } = useLanguage();

  // Extract all drilling logic into custom hook
  const {
    currentQ,
    isFinished,
    progressCurrent,
    progressTotal,
    score,
    showResult,
    selectedAnswer,
    previousResults,
    loadingState,
    error,
    loadingMessage,
    isLoading,
    isError,
    isRetrying,
    handleAnswerSelect,
    checkAnswer,
    handleNextQuestion,
    handleBackToHome,
    handleRestartDrilling,
    pronounceHiragana,
    handleRetry,
  } = useDrillingLogic();

  // Show loading states
  if (isLoading || isRetrying) {
    return <LoadingQuestions message={loadingMessage || 'Loading...'} />;
  }

  // Show error state
  if (isError) {
    return (
      <LoadingMessage
        state={LoadingStates.ERROR}
        message={loadingMessage || 'An error occurred'}
        error={error}
        onRetry={handleRetry}
      />
    );
  }

  // Show basic loading if no current question yet
  if (!currentQ) {
    return <LoadingQuestions message="Preparing your learning session..." />;
  }

  if (isFinished) {
    return (
      <DrillingFinished
        score={score}
        previousResults={previousResults}
        onRestartDrilling={handleRestartDrilling}
        onBackToHome={handleBackToHome}
        t={t}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <BackButton isClose={true} handleBackToHome={handleBackToHome} />
          </div>

          <ProgressBar current={progressCurrent} total={progressTotal + 1} />

          {/* Question Card */}
          <DrillingQuestionCard
            currentQ={currentQ}
            showResult={showResult}
            selectedAnswer={selectedAnswer}
            progress={progressCurrent}
            onAnswerSelect={handleAnswerSelect}
            onCheckAnswer={checkAnswer}
            onNextQuestion={handleNextQuestion}
            onPronounceHiragana={pronounceHiragana}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
