import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5 p-4 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/50 rounded-2xl rounded-tl-sm w-fit shadow-sm mb-4 transition-colors duration-300">
      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  );
};