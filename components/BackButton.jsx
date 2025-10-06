const BackButton = ({ isClose = false,handleBackToHome }) => {
  return (
    <button
      name="back-button"
      onClick={handleBackToHome}
      className="flex items-center rounded-full border border-slate-300 dark:border-slate-600 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-600 hover:border-slate-100 dark:hover:border-slate-500 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="button"
    >
      {isClose ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ): (
        <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      )}
      <span className="sr-only">Back</span>
    </button>
  );
};

export default BackButton;