import formatDateTime from '../../../util/date-format';

export default function DrillingFinished({
  score,
  previousResults,
  onRestartDrilling,
  onBackToHome,
  t,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4 text-sky-600 dark:text-sky-400">
          {t('drilling.complete.title')}
        </h2>
        <p className="text-xl mb-2 text-gray-800 dark:text-gray-200">
          {t('drilling.complete.yourscore')} {score}/10
        </p>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
          {Math.round((score / 10) * 100)}% -{' '}
          {score >= 8
            ? t('drilling.complete.level-1')
            : score >= 6
              ? t('drilling.complete.level-2')
              : t('drilling.complete.level-3')}
        </p>

        {/* Previous Results */}
        {previousResults.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
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
                        ? 'text-green-600'
                        : result.percentage >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
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
            onClick={onRestartDrilling}
            className="w-full bg-gradient-to-r from-rose-200 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onBackToHome}
            className="w-full bg-gray-300 hover:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}