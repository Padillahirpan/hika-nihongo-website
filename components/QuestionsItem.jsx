const QuestionsItem = ({ currentQ, showResult, selectedAnswer, handleAnswerSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {currentQ.options.map((option, index) => {
        let buttonClass =
          "flex w-full h-[100px] sm:h-[160px] lg:h-[160px] bg-red items-center justify-center text-xl font-semibold rounded-lg shadow-sm";

        if (showResult) {
          if (option.romaji === currentQ.correctAnswer.romaji) {
            buttonClass += " bg-green-500 text-white border-green-500";
          } else if (option.romaji === selectedAnswer.romaji) {
            buttonClass += " bg-rose-500 text-white border-rose-600";
          } else {
            buttonClass += " bg-gray-200 text-gray-500 border-gray-300";
          }
        } else {
          if(selectedAnswer != null) {
            if(option.romaji === selectedAnswer.romaji) {
              buttonClass += " bg-sky-100 border-sky-400 hover:border-blue-400 cursor-pointer text-blue-400";
            } else {
              buttonClass += " bg-yellow hover:bg-gray-50 border-gray-300 hover:border-blue-500 cursor-pointer";
            }
          } else {
            buttonClass += " bg-yellow hover:bg-blue-50 border-gray-300 hover:border-blue-500 cursor-pointer";
          }
        }

        return (
          <div key={index} className="flex items-center justify-center rounded-lg shadow-md">

          {/* <div key={index} className="flex w-full h-[80px] sm:h-[160px] lg:h-[160px] items-center justify-center rounded-lg shadow-md"> */}
            <button
              onClick={() => !showResult && handleAnswerSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              {currentQ.type === 'romajiToKana' ? option.character : option.romaji}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionsItem;