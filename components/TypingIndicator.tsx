import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-2xl rounded-tl-sm w-fit shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4 transition-all duration-300">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
        <Sparkles size={14} fill="currentColor" className="animate-pulse" />
      </div>
      <div className="flex items-center gap-2 pr-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">AI is thinking</span>
        <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-typing-bounce [animation-delay:-0.32s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-typing-bounce [animation-delay:-0.16s]"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-typing-bounce"></div>
        </div>
      </div>
    </div>
  );
};