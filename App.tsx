import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import { Moon, Sun, LogOut } from 'lucide-react';
import { Message } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  // NOTE: This URL contains a signature and WILL expire. 
  // For production, move this image to a Public Bucket and use the permanent public link.
  const logoUrl = "https://chdlpyhzxdsyalzpyrwh.supabase.co/storage/v1/object/sign/CPT%20Images/CPT%20logo%20Color.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85N2FmMTNlOC0yMjVhLTQ1ZWEtYWM2MC03Y2U5MTBjYTc0YzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDUFQgSW1hZ2VzL0NQVCBsb2dvIENvbG9yLnBuZyIsImlhdCI6MTc2NzU2MTA0MCwiZXhwIjoxNzk5MDk3MDQwfQ.-hyACc-zsnqS4n_yTVhLG_JgKJ8JqZjkXOWhsVolshs";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      const storageKey = `chat_history_${session.user.id}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setMessages(parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.warn("Failed to load chat history:", error);
        setMessages([]);
      }
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id && messages.length > 0) {
      const storageKey = `chat_history_${session.user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, session]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessages([]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-0 sm:p-6 transition-colors duration-300">
      <div className="w-full h-screen sm:h-[90vh] sm:max-w-5xl bg-white dark:bg-gray-900 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-5 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <img src={logoUrl} alt="CPT Logo" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight tracking-tight transition-colors">CPT Intelligence Portal</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 transition-colors mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Secure Session: {session.user.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 text-sm font-semibold hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200">
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden relative bg-gray-50/30 dark:bg-gray-950/30 transition-colors duration-300">
          <ChatInterface session={session} messages={messages} setMessages={setMessages} />
        </main>
      </div>
    </div>
  );
};

export default App;