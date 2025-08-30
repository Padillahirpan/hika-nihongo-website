const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-5 mb-2 lg:h-8 lg:mb-4">
      <div 
        className="bg-sky-600 h-5 mb-2 lg:h-8 lg:mb-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;