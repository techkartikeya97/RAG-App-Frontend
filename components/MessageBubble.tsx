import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;
  const isInitial = message.isInitial;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${isInitial ? 'animate-greeting' : 'animate-fade-in-up'} mb-8`}>
      <div
        className={`
          ${isUser ? 'max-w-[85%] sm:max-w-[75%]' : 'w-full max-w-[96%] sm:max-w-[94%]'} 
          p-5 sm:p-8 rounded-3xl shadow-sm text-base leading-relaxed transition-colors duration-300
          ${isUser 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-blue-500/10 hover:shadow-lg' 
            : isError
              ? 'bg-red-50/90 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm'
              : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-white/60 dark:border-gray-700/60 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.08)]'
          }
        `}
      >
        <div className={`
          prose !max-w-none w-full transition-colors duration-300
          ${isUser 
            ? 'prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-white/90 prose-code:text-white prose-code:bg-white/20 prose-pre:bg-black/20' 
            : isError 
              ? 'prose-red' 
              : 'prose-slate dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-strong:text-blue-700 dark:prose-strong:text-blue-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-pre:bg-gray-800 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100'
          }
          prose-p:leading-8 prose-p:mb-6 prose-p:w-full
          prose-ol:my-8 prose-ol:w-full
          prose-li:mb-10 prose-li:w-full
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-6
          prose-strong:font-bold
          hover:prose-a:underline
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
          prose-pre:p-6 prose-pre:rounded-2xl prose-pre:shadow-inner prose-pre:my-6
        `}>
          <Markdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </Markdown>
        </div>
      </div>
    </div>
  );
};