const BubbleGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-1/3 w-[24rem] h-[24rem] bg-sky-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute -right-10 top-1/3 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute left-1/3 bottom-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute left-20 top-1/2 bottom-1/4 w-[30%] h-[60%] bg-violet-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-6000"></div>
        <div className="absolute right-20 -top-10 w-[30%] h-[60%] bg-sky-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute start1/2 -top-10 w-[30%] h-[60%] bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute right-10 -bottom-40 w-[20%] h-[20%] bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute right-1/4 -top-[10%] lg:w-[20rem] lg:h-[20rem] bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>
  );
};

export default BubbleGradient;