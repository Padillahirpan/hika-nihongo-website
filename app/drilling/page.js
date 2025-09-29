"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import formatDateTime from "../../util/date-format";
import ProgressBar from "../../components/ProgressBar";
import QuestionsItem from "../../components/QuestionsItem";
import BackButton from "../../components/BackButton";
import { useLocalStorage } from "../../hooks/user-local-storage";
import { getAllHiragana } from "../../data/kana-data";
import { generatePrioritizedQuestions } from "../../util/question-generator";
import { useSpeechSynthesis } from "../../util/use-speech-synthesis";
import { HIRAGANA_DATA_PROGRESS, DRILLING_RESULT } from "../../hooks/cons-storage";
import { testType } from "../../data/kana-data";
import { useLanguage } from '../../contexts/language-context';


export default function HiraganaDrilling() {
  const router = useRouter();
  const { supported, speak } = useSpeechSynthesis("ja-JP");
  const { t } = useLanguage();

  const [storedData, setStoredData] = useLocalStorage(HIRAGANA_DATA_PROGRESS, getAllHiragana());  

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);

  // Function to pronounce the hiragana using Web Speech API
  const pronounceHiragana = (kana) => {
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

  const loadPreviousResults = () => {
    const results = JSON.parse(localStorage.getItem(DRILLING_RESULT) || "[]");
    // Get last 5 results
    setPreviousResults(results.slice(-5).reverse());
  };

  const generateQuestions = async () => {
    const updatedHiraganaData = storedData.filter(item => item.unlocked);
    const newQuestions = generatePrioritizedQuestions(updatedHiraganaData, 10);
    
    setQuestions(newQuestions);
  };

  // Generate random questions on component mount
  useEffect(() => {
    generateQuestions();
    loadPreviousResults();
  }, []);

  const checkAnswer = () => {
    if(selectedAnswer != null) {
      setShowResult(true);
      if (selectedAnswer.romaji === questions[currentQuestion].correctAnswer.romaji) {
        setScore(score + 1);
        // Update mastery level for correct answer
        updateMasteryLevel(selectedAnswer, true);
      } else {
        // Update mastery level for incorrect answer
        updateMasteryLevel(selectedAnswer, false);
      }
    }
  }

  const handleAnswerSelect = (selectedOption) => {
    setSelectedAnswer(selectedOption);

    const question = questions[currentQuestion];

    if(question.type === "soundToKana" || question.type === "kanaToSound") {
      pronounceHiragana(selectedOption.character);
    }
  };

  const updateMasteryLevel = (kana, isCorrect) => {
    // Update points in stored data

    const updatedData = storedData.map(item => {
      let points = item.points;

      if (isCorrect) {
        points = Math.min(100, item.points + 30);
      } else {
        points = Math.max(0, item.points - 5);
      }

      if (item.character === kana.character) {
        return { ...item, points: points };
      }
      return item;
    });

    setStoredData(updatedData);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);

      const nextQuestion = questions[currentQuestion + 1];
      const questionsType = questions[currentQuestion].type
      
      // Pronounce the next question's correct answer
      if (questionsType === "soundToKana" || questionsType === "kanaToSound") {
        pronounceHiragana(nextQuestion.correctAnswer.character);
      }

    } else {
      setIsFinished(true);
      saveDrillingResult();
    }
  };

  const saveDrillingResult = () => {
    const result = {
      score: score,
      totalQuestions: 10,
      percentage: Math.round((score / 10) * 100),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      type: testType.HIRAGANA.toString(),
    };

    // Get existing results from localStorage
    const existingResults = JSON.parse(
      localStorage.getItem(DRILLING_RESULT) || "[]",
    );

    // Add new result
    existingResults.push(result);

    // Keep only the last 50 results to prevent localStorage from getting too large
    if (existingResults.length > 50) {
      existingResults.splice(0, existingResults.length - 50);
    }

    // Save back to localStorage
    localStorage.setItem(DRILLING_RESULT, JSON.stringify(existingResults));

    // Update previous results display
    loadPreviousResults();
  };

  const handleBackToHome = () => {
    router.back();
  };

  const handleRestartDrilling = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsFinished(false);
    generateQuestions();
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 text-sky-600">
            {t('drilling.complete.title')}
            {t('instructions.flip')}
          </h2>
          <p className="text-xl mb-2">
            {t('drilling.complete.yourscore')} {score}/10
          </p>
          <p className="text-lg mb-6 text-gray-600">
            {Math.round((score / 10) * 100)}% -{" "}
            {score >= 8
              ? t('drilling.complete.level-1')
              : score >= 6
                ? t('drilling.complete.level-2')
                : t('drilling.complete.level-3')}
          </p>

          {/* Previous Results */}
          {previousResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {t('drilling.complete.recentscores')}
              </h3>
              <div className="space-y-2">
                {previousResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-600">
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
                      {result.score}/10 ({result.percentage}%)
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
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <BackButton 
            isClose={true}
            handleBackToHome={handleBackToHome}
          />
        </div>
        
        <ProgressBar current={currentQuestion + 1} total={11} />
        
        {/* Question Card */}
        <div className="min-h-full items-center justify-center">
          <div className="text-xl sm:text-2xl my-4 text-gray-900 font-jakarta">
            {(() => {
              switch (currentQ.type) {
                case 'romajiToKana':
                  return "Select the correct kana for this romaji:";
                case 'kanaToRomaji':
                  return "Select the correct romaji for this kana:";
                case 'soundToKana':
                  return "Listen to the sound and select the correct kana:";
                case 'kanaToSound':
                  return "Select the correct pronunciation for this kana:";
                default:
                  return "Select the correct one:";
              }
            })()}
          </div>
          <div className="w-full h-full items-center justify-center rounded-lg shadow-sm p-2">
            <div className="w-full h-lg flex items-center justify-center text-xl text-center p-4 mb-4 font-bold text-sky-900">
              <button
                  onClick={() => {
                    if (currentQ.type === 'soundToKana') {
                      pronounceHiragana(currentQ.correctAnswer.character);
                    } else if (currentQ.type === 'kanaToSound') {
                      pronounceHiragana(currentQ.question);
                    }
                  }}
                  className={`group flex w-fit h-[100px] sm:w-[100px] sm:h-[100px] justify-center items-center 
                    gap-6 px-12 py-4 bg-rose-500 text-white font-mono font-semibold text-2xl relative overflow-hidden 
                    rounded-xl border-4 border-black hover:border-rose-500 shadow-[4px_8px_0px_#000] 
                    hover:shadow-[0px_0px_0px_#000] transition-all duration-200 uppercase
                    ${(currentQ.type === "soundToKana" || currentQ.type === "kanaToSound") ? "cursor-pointer hover:scale-105" : ""}`}
                  aria-label="Pronounce"
                >
                  <div className="relative transition-all duration-200">
                    {currentQ.type === 'soundToKana' ? (
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                        </svg>
                        {/* <span className="text-sm">Click to Play</span> */}
                      </div>
                    ) : (
                      <span className="inline-block transition-all duration-200 font-noto-jp">
                        {currentQ.question}
                      </span>
                    )}
                  </div>
                </button>
            </div>

            {/* Answer Options */}
            <QuestionsItem
              currentQ={currentQ}
              showResult={showResult}
              selectedAnswer={selectedAnswer}
              handleAnswerSelect={handleAnswerSelect}
            />
            
            {
              !showResult && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={checkAnswer}
                    className={`w-full rounded-lg opacity-95 ${
                      selectedAnswer == null 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-200 to-green-400 hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:scale-105 z-50'
                      } text-white px-6 py-4 shadow-lg  flex items-center justify-center space-x-2`}
                    aria-label="Start Drilling"
                  >
                    <span className="text-sm xl:text-l font-semibold">
                      Check
                    </span>
                  </button>
                </div>
              )
            }

            {/* Result and Next Button */}
            {showResult && (
              <div className="mt-6 text-center">
                {selectedAnswer.romaji !== currentQ.correctAnswer.romaji ? (
                  <div>
                    <p className="text-red-600 font-bold">
                      Incorrect. 
                    </p>
                    <p className="text-red-600 font-bold">
                      The correct answer is: { currentQ.type == 'romajiToKana' ? currentQ.correctAnswer.character : currentQ.correctAnswer.romaji }
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 font-bold">Correct! 🎉</p>
                )}
                
                <button
                  onClick={handleNextQuestion}
                  className={`w-full mt-4 bg-gradient-to-r ${
                    selectedAnswer.romaji === currentQ.correctAnswer.romaji 
                      ? "from-green-400 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "from-rose-400 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                  } text-white px-6 py-4 shadow-lg transition-all duration-300 rounded-lg text-sm font-jakarta`}
                >
                  <span className=" font-semibold">
                    {currentQuestion < 9 ? "Next Question" : "Finish"}
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
