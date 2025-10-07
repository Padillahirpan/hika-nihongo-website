"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import formatDateTime from "../../util/date-format";
import ProgressBar from "../../components/ProgressBar";
import BackButton from "../../components/BackButton";
import { useLocalStorage } from "../../hooks/user-local-storage";
import { getAllKanji } from "../../data/kanji-data";
import { useSpeechSynthesis } from "../../util/use-speech-synthesis";
import { DRILLING_RESULT, KANJI_DATA_PROGRESS } from "../../hooks/cons-storage";
import { testType } from "../../data/kana-data";

const QUESTION_TYPES = [
  "kanjiToRomaji",
  "kanjiToKana",
  "kanjiToMeaning",
  "meaningToKanji",
  "romajiToKanji",
  "kanjiToSound",
  "soundToKanji",
];

const QUESTION_PROMPTS = {
  kanjiToRomaji: "Choose the romaji reading",
  kanjiToKana: "Choose the kana reading",
  kanjiToMeaning: "Choose the correct meaning",
  meaningToKanji: "Select the kanji for this meaning",
  romajiToKanji: "Select the kanji for this reading",
  kanjiToSound: "Select the sound for this kanji",
  soundToKanji: "Select the kanji for this sound",
};

const getQuestionText = (type, item) => {
  switch (type) {
    case "romajiToKanji":
      return item.romaji;
    case "meaningToKanji":
      return item.english;
    default:
      return item.kanji;
  }
};

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const buildKanjiQuestions = (data, count = 10) => {
  const unlocked = data.filter((item) => item.unlocked !== false);
  if (unlocked.length === 0) {
    return [];
  }

  const questions = [];
  const target = Math.min(count, unlocked.length);

  while (questions.length < target) {
    const correctAnswer = unlocked[Math.floor(Math.random() * unlocked.length)];
    const questionType = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

    const incorrectPool = unlocked.filter((item) => item.kanji !== correctAnswer.kanji);
    const incorrectOptions = shuffle(incorrectPool).slice(0, Math.min(3, incorrectPool.length));
    const options = shuffle([correctAnswer, ...incorrectOptions]);


    questions.push({
      id: `${correctAnswer.kanji}-${questionType}-${questions.length}`,
      type: questionType,
      prompt: QUESTION_PROMPTS[questionType],
      question: getQuestionText(questionType, correctAnswer),
      correctAnswer,
      options,
    });
  }

  return questions;
};

const getOptionLabel = (type, option) => {
  switch (type) {
    case "kanjiToKana":
      return option.character;
    case "kanjiToMeaning":
      return option.english;
    case "meaningToKanji":
    case "romajiToKanji":
      return option.kanji;
    case "kanjiToRomaji":
    case "romajiToSound":
    case "soundToRomaji":
    default:
      return option.romaji;
  }
};

const KanjiOptions = ({ currentQ, showResult, selectedAnswer, handleAnswerSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {currentQ.options.map((option) => {
        const isCorrect = option.kanji === currentQ.correctAnswer.kanji;
        const isSelected = selectedAnswer?.kanji === option.kanji;

        let buttonClass =
          "flex w-full h-[100px] sm:h-[160px] lg:h-[160px] items-center justify-center text-xl font-semibold rounded-lg shadow-sm";

        if (showResult) {
          if (isCorrect) {
            buttonClass += " bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600";
          } else if (isSelected) {
            buttonClass += " bg-rose-500 dark:bg-rose-600 text-white border-rose-600";
          } else {
            buttonClass += " bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600";
          }
        } else {
          if (isSelected) {
            buttonClass += " bg-sky-100 dark:bg-sky-900 border-sky-400 dark:border-sky-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer text-blue-400 dark:text-blue-300";
          } else {
            buttonClass += " bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 cursor-pointer text-gray-800 dark:text-gray-200";
          }
        }

        return (
          <div key={option.kanji} className="flex items-center justify-center rounded-lg shadow-md">
            <button
              onClick={() => !showResult && handleAnswerSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              {(() => {
                switch (currentQ.type) {
                  case 'kanjiToKana':
                    return (
                      <div className="font-noto-jp">
                        { option.character }
                      </div>
                    );
                  case 'kanjiToMeaning':
                    return (
                      <div className="font-noto-jp">
                        { option.romaji }
                      </div>
                    );
                  case 'meaningToKanji':
                    return (
                      <div className="font-noto-jp">
                        { option.character }
                      </div>
                    );
                  case 'romajiToKanji':
                  case 'soundToKanji':
                    return (
                      <div className="font-noto-jp">
                        { option.kanji }
                      </div>
                    );
                  case 'kanjiToSound':
                    return (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                      </div>
                    );
                  default:
                    return option.romaji;
                }
              })()}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function KanjiDrilling() {
  const router = useRouter();
  const { supported, speak } = useSpeechSynthesis("ja-JP");

  const initialKanjiData = useMemo(
    () =>
      getAllKanji().map((item) => ({
        ...item,
        unlocked: item.unlocked ?? true,
        points: item.points ?? 0,
      })),
    []
  );

  const [storedData, setStoredData] = useLocalStorage(KANJI_DATA_PROGRESS, initialKanjiData);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const pronounceKanji = (reading) => {
    if (!supported || !reading) {
      return;
    }

    speak(reading, {
      lang: "ja-JP",
      rate: 0.8,
      pitch: 1,
      volume: 1,
    });
  };

  const loadPreviousResults = () => {
    try {
      const results = JSON.parse(localStorage.getItem(DRILLING_RESULT) || "[]");
      const filtered = results
        .filter((result) => result.type === testType.KANJI.toString())
        .slice(-5)
        .reverse();
      setPreviousResults(filtered);
    } catch (error) {
      console.error("Failed to load previous results", error);
    }
  };

  const generateQuestions = () => {
    const newQuestions = buildKanjiQuestions(storedData, 10);
    setQuestions(newQuestions);
    return newQuestions;
  };

  useEffect(() => {
    if (initialized || !Array.isArray(storedData) || storedData.length === 0) {
      return;
    }

    loadPreviousResults();

    setInitialized(true);
  }, [initialized, storedData]);

  const checkAnswer = () => {
    if (!selectedAnswer) {
      return;
    }

    setShowResult(true);
    const isCorrect = selectedAnswer.kanji === questions[currentQuestion].correctAnswer.kanji;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    updateMasteryLevel(selectedAnswer, isCorrect);
  };

  const handleAnswerSelect = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    if (currentQ.type === "kanjiToSound" || currentQ.type === "soundToKanji") {
      pronounceKanji(selectedOption.kanji);
    }
  };

  const updateMasteryLevel = (kanjiItem, isCorrect) => {
    const updatedData = storedData.map((item) => {
      if (item.kanji === kanjiItem.kanji) {
        const updatedPoints = isCorrect
          ? Math.min(100, (item.points ?? 0) + 20)
          : Math.max(0, (item.points ?? 0) - 5);
        return { ...item, points: updatedPoints };
      }
      return item;
    });

    setStoredData(updatedData);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);

    } else {
      setIsFinished(true);
      saveDrillingResult();
    }
  };

  const saveDrillingResult = () => {
    const result = {
      score,
      totalQuestions: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      type: testType.KANJI.toString(),
    };

    try {
      const existingResults = JSON.parse(localStorage.getItem(DRILLING_RESULT) || "[]");
      existingResults.push(result);

      if (existingResults.length > 50) {
        existingResults.splice(0, existingResults.length - 50);
      }

      localStorage.setItem(DRILLING_RESULT, JSON.stringify(existingResults));
      loadPreviousResults();
    } catch (error) {
      console.error("Failed to save drilling result", error);
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRestartDrilling = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsFinished(false);
    const newQuestions = generateQuestions();
    // if (newQuestions.length > 0) {
    //   pronounceKanji(newQuestions[0].correctAnswer.kanji);
    // }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 text-sky-600">
            Drilling Complete!
          </h2>
          <p className="text-xl mb-2">Your Score: {score}/{questions.length}</p>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            {questions.length ? Math.round((score / questions.length) * 100) : 0}% -{" "}
            {score >= Math.ceil(questions.length * 0.8)
              ? "Excellent work!"
              : score >= Math.ceil(questions.length * 0.6)
              ? "Good job!"
              : "Keep practicing!"}
          </p>

          {previousResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
                Recent Scores
              </h3>
              <div className="space-y-2">
                {previousResults.map((result, index) => (
                  <div
                    key={`${result.timestamp}-${index}`}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDateTime(result.date)}
                    </span>
                    <span
                      className={`font-semibold ${
                        result.percentage >= 80
                          ? "text-green-600"
                          : result.percentage >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.score}/{result.totalQuestions} ({result.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleRestartDrilling}
              className="w-full bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-300 hover:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <BackButton
            isClose={true}
            handleBackToHome={handleBackToHome}
          />
        </div>

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        <div className="min-h-full items-center justify-center">
          <div className="text-xl sm:text-2xl my-4 text-gray-900 dark:text-gray-100 font-jakarta">
            {currentQ.prompt}
          </div>
          <div className="w-full h-full items-center justify-center rounded-lg shadow-sm p-2">
          <div className="w-full h-lg flex items-center justify-center text-xl text-center p-4 mb-4 font-bold text-sky-900">
              <button
                  onClick={() => {
                    if (currentQ.type === 'soundToKanji') {
                      pronounceKanji(currentQ.correctAnswer.kanji);
                    }
                  }}
                  className={`group flex w-fit h-[100px] sm:w-[100px] sm:h-[100px] justify-center items-center 
                    gap-6 px-12 py-4 bg-rose-500 text-white font-mono font-semibold text-2xl relative overflow-hidden 
                    rounded-xl border-4 border-black hover:border-rose-500 shadow-[4px_8px_0px_#000] 
                    hover:shadow-[0px_0px_0px_#000] transition-all duration-200 uppercase
                    ${(currentQ.type === "soundToKanji" || currentQ.type === "kanjiToSound") ? "cursor-pointer hover:scale-105" : ""}`}
                  aria-label="Pronounce"
                >
                  <div className="relative transition-all duration-200">
                    {currentQ.type === 'soundToKanji' ? (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                      </div>
                    ) : (
                      <span className="inline-block transition-all duration-200 font-noto-jp">
                        {currentQ.question}
                      </span>
                    )}
                  </div>
                </button>
            </div>

            <KanjiOptions
              currentQ={currentQ}
              showResult={showResult}
              selectedAnswer={selectedAnswer}
              handleAnswerSelect={handleAnswerSelect}
            />

            {!showResult && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={checkAnswer}
                  className={`w-full rounded-lg opacity-95 ${
                    selectedAnswer == null
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-200 to-green-400 hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:scale-105 z-50"
                  } text-white px-6 py-4 shadow-lg flex items-center justify-center space-x-2`}
                  aria-label="Check answer"
                  disabled={!selectedAnswer}
                >
                  <span className="text-sm xl:text-lg font-semibold">
                    Check
                  </span>
                </button>
              </div>
            )}

            {showResult && (
              <div className="mt-6 text-center">
                {selectedAnswer.kanji !== currentQ.correctAnswer.kanji ? (
                  <div className="space-y-2">
                    <p className="text-red-600 dark:text-red-400 font-bold">
                      Incorrect.
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-bold">
                      The correct answer is: {getOptionLabel(currentQ.type, currentQ.correctAnswer)}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 dark:text-green-400 font-bold">Correct! Great job!</p>
                )}

                <button
                  onClick={handleNextQuestion}
                  className={`w-full mt-4 bg-gradient-to-r ${
                    selectedAnswer.kanji === currentQ.correctAnswer.kanji
                      ? "from-green-400 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "from-rose-400 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                  } text-white px-6 py-4 shadow-lg transition-all duration-300 rounded-lg text-sm font-jakarta`}
                >
                  <span className="font-semibold">
                    {currentQuestion < questions.length - 1 ? "Next Question" : "Finish"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








