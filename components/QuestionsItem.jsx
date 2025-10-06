const QuestionsItem = ({ currentQ, showResult, selectedAnswer, handleAnswerSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {currentQ.options.map((option, index) => {
        let buttonClass =
          "flex w-full h-[100px] sm:h-[160px] lg:h-[160px] bg-red items-center justify-center text-xl font-semibold rounded-lg shadow-sm";

        if (showResult) {
          if (option.romaji === currentQ.correctAnswer.romaji) {
            buttonClass += " bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600";
          } else if (option.romaji === selectedAnswer.romaji) {
            buttonClass += " bg-rose-500 dark:bg-rose-600 text-white border-rose-600";
          } else {
            buttonClass += " bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600";
          }
        } else {
          if(selectedAnswer != null) {
            if(option.romaji === selectedAnswer.romaji) {
              buttonClass += " bg-sky-100 dark:bg-sky-900 border-sky-400 dark:border-sky-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer text-blue-400 dark:text-blue-300";
            } else {
              buttonClass += " bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 cursor-pointer text-gray-800 dark:text-gray-200";
            }
          } else {
            buttonClass += " bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 cursor-pointer text-gray-800 dark:text-gray-200";
          }
        }

        return (
          <div key={index} className="flex items-center justify-center rounded-lg shadow-md">
            <button
              onClick={() => !showResult && handleAnswerSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              {(() => {
                switch (currentQ.type) {
                  case 'romajiToKana':
                    return option.character;
                  case 'kanaToRomaji':
                    return option.romaji;
                  case 'soundToKana':
                    return option.character;
                  case 'kanaToSound':
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

export default QuestionsItem;