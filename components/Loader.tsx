import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC<{ fullScreen?: boolean; text?: string }> = ({ fullScreen = false, text }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-24 h-24 perspective-1000">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin-slow shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
        <div className="absolute inset-4 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-blue-500 border-l-transparent animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)] direction-reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>
        </div>
      </div>
      {text && (
        <p className="text-blue-200 font-light tracking-widest text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;