import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeMap = {
    sm:  'w-5 h-5 border-2',
    md:  'w-8 h-8 border-2',
    lg:  'w-12 h-12 border-[3px]',
    xl:  'w-16 h-16 border-[3px]',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size] || sizeMap.md} border-white/10 border-t-blue-500 rounded-full animate-spin`}
        style={{ boxShadow: '0 0 15px rgba(59,130,246,0.2)' }}
      />
      {text && (
        <p className="text-sm text-slate-400 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
