const ProgressBar = ({ current, total, baseColor, progressColor, size = 1 }) => {
  const progress = (current / total) * 100;
  const baseColorClass = baseColor || "bg-rose-100";
  const progressColorClass = progressColor || "bg-gradient-to-r bg-rose-400 to-rose-500";
  const sizeClass = size === 1 ? "h-5 lg:h-8" : "h-3 lg:h-4";

  return (
    <div className={`w-full ${baseColorClass} rounded-full ${sizeClass} `}>
      <div 
        className={`${progressColorClass} ${sizeClass} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;