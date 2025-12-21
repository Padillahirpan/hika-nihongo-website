import QuestionsItem from '../../../components/QuestionsItem';

export default function DrillingQuestionCard({
  currentQ,
  showResult,
  selectedAnswer,
  progress,
  onAnswerSelect,
  onCheckAnswer,
  onNextQuestion,
  onPronounceHiragana,
}) {
  const getQuestionText = (type) => {
    switch (type) {
      case 'romajiToKana':
        return 'Select the correct kana for this romaji:';
      case 'kanaToRomaji':
        return 'Select the correct romaji for this kana:';
      case 'soundToKana':
        return 'Listen to the sound and select the correct kana:';
      case 'kanaToSound':
        return 'Select the correct pronunciation for this kana:';
      default:
        return 'Select the correct one:';
    }
  };

  return (
    <div className="min-h-full items-center justify-center">
      <div className="text-xl sm:text-2xl my-4 text-gray-900 font-jakarta">
        {getQuestionText(currentQ.type)}
      </div>
      <div className="w-full h-full items-center justify-center rounded-lg shadow-sm p-2">
        <div className="w-full h-lg flex items-center justify-center text-xl text-center p-4 mb-4 font-bold text-sky-900">
          <button
            onClick={() => {
              if (currentQ.type === 'soundToKana') {
                onPronounceHiragana(currentQ.correctAnswer.character);
              } else if (currentQ.type === 'kanaToSound') {
                onPronounceHiragana(currentQ.question);
              }
            }}
            className={`group flex w-fit h-[100px] sm:w-[100px] sm:h-[100px] justify-center items-center
                gap-6 px-12 py-4 bg-rose-500 text-white font-mono font-semibold text-2xl relative overflow-hidden
                rounded-xl border-4 border-black hover:border-rose-500 shadow-[4px_8px_0px_#000]
                hover:shadow-[0px_0px_0px_#000] transition-all duration-200 uppercase
                ${currentQ.type === 'soundToKana' || currentQ.type === 'kanaToSound' ? 'cursor-pointer hover:scale-105' : ''}`}
            aria-label="Pronounce"
          >
            <div className="relative transition-all duration-200">
              {currentQ.type === 'soundToKana' ? (
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
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

        {/* Answer Options */}
        <QuestionsItem
          currentQ={currentQ}
          showResult={showResult}
          selectedAnswer={selectedAnswer}
          handleAnswerSelect={onAnswerSelect}
        />

        {!showResult && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onCheckAnswer}
              className={`w-full rounded-lg opacity-95 ${
                selectedAnswer == null
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-200 to-green-400 hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:scale-105 z-50'
              } text-white px-6 py-4 shadow-lg  flex items-center justify-center space-x-2`}
              aria-label="Start Drilling"
            >
              <span className="text-sm xl:text-l font-semibold">Check</span>
            </button>
          </div>
        )}

        {/* Result and Next Button */}
        {showResult && (
          <div className="mt-6 text-center">
            {selectedAnswer.romaji !== currentQ.correctAnswer.romaji ? (
              <div>
                <p className="text-red-600 font-bold">Incorrect.</p>
                <p className="text-red-600 font-bold">
                  The correct answer is:{' '}
                  {currentQ.type == 'romajiToKana'
                    ? currentQ.correctAnswer.character
                    : currentQ.correctAnswer.romaji}
                </p>
              </div>
            ) : (
              <p className="text-green-600 font-bold">Correct! 🎉</p>
            )}

            <button
              onClick={onNextQuestion}
              className={`w-full mt-4 bg-gradient-to-r ${
                selectedAnswer.romaji === currentQ.correctAnswer.romaji
                  ? 'from-green-400 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'from-rose-400 to-rose-600 hover:from-rose-600 hover:to-rose-700'
              } text-white px-6 py-4 shadow-lg transition-all duration-300 rounded-lg text-sm font-jakarta`}
            >
              <span className=" font-semibold">
                {progress.current < progress.total
                  ? 'Next Question'
                  : 'Finish'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}