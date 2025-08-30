"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hiraganaData } from "../../data/hiraganaData";
import formatDateTime from "../../util/DateFormat";
import ProgressBar from "../../components/ProgressBar";
import QuestionsItem from "../../components/QuestionsItem";

export default function Drilling() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [previousResults, setPreviousResults] = useState([]);

  // Generate random questions on component mount
  useEffect(() => {
    generateQuestions();
    loadPreviousResults();
  }, []);

  const loadPreviousResults = () => {
    const results = JSON.parse(localStorage.getItem("drillingResults") || "[]");
    // Get last 5 results
    setPreviousResults(results.slice(-5).reverse());
  };

  const generateQuestions = () => {
    const newQuestions = [];
    const availableHiragana = hiraganaData.filter(
      (item) => item.hiragana !== " ",
    );

    for (let i = 0; i < 10; i++) {
      // Randomly select a hiragana character
      const randomIndex = Math.floor(Math.random() * availableHiragana.length);
      const correctAnswer = availableHiragana[randomIndex];

      // Generate 3 random incorrect answers
      const incorrectAnswers = [];
      while (incorrectAnswers.length < 3) {
        const randomIncorrect =
          availableHiragana[
            Math.floor(Math.random() * availableHiragana.length)
          ];
        if (
          randomIncorrect.romaji !== correctAnswer.romaji &&
          !incorrectAnswers.some((ans) => ans.romaji === randomIncorrect.romaji)
        ) {
          incorrectAnswers.push(randomIncorrect);
        }
      }

      // Combine and shuffle options
      const options = [correctAnswer, ...incorrectAnswers];
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      newQuestions.push({
        hiragana: correctAnswer.hiragana,
        correctRomaji: correctAnswer.romaji,
        options: shuffledOptions,
        correctIndex: shuffledOptions.findIndex(
          (opt) => opt.romaji === correctAnswer.romaji,
        ),
      });
    }

    setQuestions(newQuestions);
  };

  const handleAnswerSelect = (selectedIndex) => {
    setSelectedAnswer(selectedIndex);
    setShowResult(true);

    // Update score if correct
    if (selectedIndex === questions[currentQuestion].correctIndex) {
      setScore(score + 1);
      // Update mastery level for correct answer
      updateMasteryLevel(questions[currentQuestion].correctRomaji, true);
    } else {
      // Update mastery level for incorrect answer
      updateMasteryLevel(questions[currentQuestion].correctRomaji, false);
    }
  };

  const updateMasteryLevel = (romaji, isCorrect) => {
    // Get current mastery levels from localStorage
    const savedMasteryLevels = JSON.parse(
      localStorage.getItem("hiraganaProgress") || "{}",
    );

    // Update mastery level
    const currentLevel = savedMasteryLevels[romaji] || 0;
    if (isCorrect) {
      savedMasteryLevels[romaji] = Math.min(100, currentLevel + 20);
    } else {
      savedMasteryLevels[romaji] = Math.max(0, currentLevel - 5);
    }

    // Save back to localStorage
    localStorage.setItem(
      "hiraganaProgress",
      JSON.stringify(savedMasteryLevels),
    );

    // Also update the hiraganaData array for immediate UI updates
    const characterIndex = hiraganaData.findIndex(
      (item) => item.romaji === romaji,
    );
    if (characterIndex !== -1) {
      hiraganaData[characterIndex].masteryLevel = savedMasteryLevels[romaji];
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
    };

    // Get existing results from localStorage
    const existingResults = JSON.parse(
      localStorage.getItem("drillingResults") || "[]",
    );

    // Add new result
    existingResults.push(result);

    // Keep only the last 50 results to prevent localStorage from getting too large
    if (existingResults.length > 50) {
      existingResults.splice(0, existingResults.length - 50);
    }

    // Save back to localStorage
    localStorage.setItem("drillingResults", JSON.stringify(existingResults));

    // Update previous results display
    loadPreviousResults();
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
            Drilling Complete!
          </h2>
          <p className="text-xl mb-2">Your Score: {score}/10</p>
          <p className="text-lg mb-6 text-gray-600">
            {Math.round((score / 10) * 100)}% -{" "}
            {score >= 8
              ? "Excellent work!"
              : score >= 6
                ? "Good job!"
                : "Keep practicing!"}
          </p>

          {/* Previous Results */}
          {previousResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Recent Scores
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
    <div className=" bg-red p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackToHome}
            className="bg-gray-200 hover:bg-gray-400 text-black h-10 w-10 rounded-full transition-colors"
          >
            ←
          </button>
          
        </div>
        <ProgressBar current={currentQuestion + 1} total={11} />
        

        {/* Question Card */}
        <div className="min-h-full items-center justify-center">
          <h2 className="text-2xl font-medium my-4 font-jakarta">
              Select the correct one?
            </h2>
          <div className="w-full h-full bg-yellow rounded-lg shadow-sm p-8 mb-8">
            
            <div className="text-8xl text-center mb-8 font-bold text-sky-900">
              {currentQ.hiragana}
            </div>

            {/* Answer Options */}
            <QuestionsItem
              currentQ={currentQ}
              showResult={showResult}
              selectedAnswer={selectedAnswer}
              handleAnswerSelect={handleAnswerSelect}
            />

            {/* Result and Next Button */}
            {showResult && (
              <div className="mt-6 text-center">
                {selectedAnswer !== currentQ.correctIndex ? (
                  <div>
                    <p className="text-red-600 font-bold">
                      Incorrect. 
                    </p>
                    <p className="text-red-600 font-bold">
                      The correct answer is: {currentQ.correctRomaji}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 font-bold">Correct! 🎉</p>
                )}
                
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r mt-4 from-rose-200 to-rose-300 hover:from-rose-400 hover:to-rose-500 text-white px-6 py-4 shadow-lg transition-all duration-300 text-white px-8 py-3 rounded-lg text-sm transition-colors text-jakarta"
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
