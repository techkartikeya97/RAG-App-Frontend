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

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up mb-2`}>
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm text-base leading-relaxed transition-colors duration-300
          ${isUser 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm shadow-blue-500/20 hover:shadow-md' 
            : isError
              ? 'bg-red-50/90 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-tl-sm'
              : 'bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
          }
        `}
      >
        <div className={`
          prose max-w-none transition-colors duration-300
          ${isUser 
            ? 'prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-white/90 prose-code:text-white prose-code:bg-white/20 prose-pre:bg-black/20' 
            : isError 
              ? 'prose-red' 
              : 'prose-slate dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-pre:bg-gray-800 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100'
          }
          prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
          prose-headings:font-semibold prose-headings:my-3
          prose-strong:font-semibold
          hover:prose-a:underline
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
          prose-pre:p-3 prose-pre:rounded-xl prose-pre:shadow-inner
        `}>
          <Markdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </Markdown>
        </div>
      </div>
    </div>
  );
};