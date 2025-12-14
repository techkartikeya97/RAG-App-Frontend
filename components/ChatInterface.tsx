import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Paperclip } from 'lucide-react';
import { Message, ChatResponse, ChatRequest } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I am your professional assistant. I can help you with analysis, coding, and general questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add User Message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const payload: ChatRequest = { query: userText };
      
      const response = await fetch('https://rag-app-woli.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "I received an empty response.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't reach the server. It might be waking up or offline. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus input again for better UX on desktop
      if (window.matchMedia('(min-width: 768px)').matches) {
        inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth z-10">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Glassy Input Area */}
      <div className="p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border-t border-white/40 dark:border-gray-700/40 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] relative z-20 transition-colors duration-300">
        <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
          
          <div className="relative w-full group flex items-center gap-3">
             {/* Decorative Clip Button */}
            <button className="p-2.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-800 transition-all duration-200 hidden sm:block">
               <Paperclip size={20} strokeWidth={2} />
            </button>

            <div className="relative w-full transition-transform duration-200">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                disabled={isLoading}
                className="w-full pl-6 pr-14 py-4 
                          bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl 
                          border border-white/60 dark:border-gray-700/50
                          text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base
                          rounded-[1.25rem] 
                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none
                          transition-all duration-300 ease-out
                          hover:bg-white/60 dark:hover:bg-gray-800/60 hover:border-white/80 dark:hover:border-gray-600 hover:shadow-sm
                          focus:bg-white/80 dark:focus:bg-gray-800/80 focus:border-blue-400/30 dark:focus:border-blue-500/30
                          focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20
                          focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] 
                          outline-none
                          disabled:opacity-60 disabled:cursor-not-allowed"
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 transition-all duration-200 shadow-md flex items-center justify-center z-10"
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-3 gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">
          <Sparkles size={11} className="text-blue-500 dark:text-blue-400" />
          <span>AI-generated content may be inaccurate.</span>
        </div>
      </div>
    </div>
  );
};