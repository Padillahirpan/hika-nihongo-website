export default function LoadingQuestions({ message = 'Loading questions...', showSpinner = true }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        {showSpinner && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="text-xl text-gray-800 dark:text-gray-200">
          {message}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Preparing your learning session...
        </div>
      </div>
    </div>
  );
}