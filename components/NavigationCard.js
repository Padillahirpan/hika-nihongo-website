import Link from 'next/link';
import ProgressBar from './ProgressBar';

const NavigationCard = ({ href, title, progress }) => {
  const hasProgress = progress && progress.total > 0;
  return (
    <Link
      href={href}
      className="w-full flex-1 max-w-lg rounded-lg bg-gradient-to-r from-rose-200 to-rose-400 px-4 py-2 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:from-rose-400 hover:to-rose-400 hover:shadow-xl"
    >
      <div className="flex flex-col">
        <div className="text-xl font-bold font-jakarta">{title}</div>
        {hasProgress && (
          <div className="mt-2 flex flex-row items-center justify-center gap-2">
            <ProgressBar
              current={progress.current}
              total={progress.total}
              baseColor="bg-gray-100"
              progressColor="bg-rose-500"
              size={0}
            />
            <div className="text-sm">
              {progress.current}/{progress.total}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default NavigationCard;
