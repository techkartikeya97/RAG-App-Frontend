import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, Square } from 'lucide-react';
import { Message, ChatResponse, ChatRequest } from '../types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatInterfaceProps {
  session: any;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, messages, setMessages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputValue((prev) => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + transcript);
        inputRef.current?.focus();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const payload: ChatRequest = { query: userText };
      
      const response = await fetch('https://rag-app-woli.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // SECURE: Adding the Supabase JWT to verify user on the backend
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
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
    } catch (error: any) {
      if (error.name === 'AbortError') return;
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
      abortControllerRef.current = null;
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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth z-10">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl border-t border-white/40 dark:border-gray-700/40 relative z-20">
        <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Message..."}
            disabled={isLoading}
            className="w-full pl-6 pr-28 py-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/60 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 rounded-[1.25rem] outline-none transition-all focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button onClick={handleVoiceInput} disabled={isLoading} className={`p-2.5 rounded-xl transition-all ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400'}`}>
              <Mic size={18} />
            </button>
            <button onClick={isLoading ? handleStopGeneration : handleSendMessage} disabled={!inputValue.trim() && !isLoading} className={`p-2.5 text-white rounded-xl shadow-md transition-all ${isLoading ? 'bg-red-500' : 'bg-blue-600'}`}>
              {isLoading ? <Square size={16} fill="currentColor" /> : <Send size={18} />}
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-3 gap-1.5 text-[10px] text-gray-400 font-medium">
          <Sparkles size={11} className="text-blue-500" />
          <span>AI-generated content may be inaccurate.</span>
        </div>
      </div>
    </div>
  );
};