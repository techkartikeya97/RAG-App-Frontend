import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-0 sm:p-6 transition-colors duration-300">
      <div className="w-full h-screen sm:h-[85vh] sm:max-w-3xl bg-white dark:bg-gray-900 sm:rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              AI
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 dark:text-gray-100 text-lg leading-tight transition-colors">Cybersecurity Assistant</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Always active
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        
        <main className="flex-1 overflow-hidden relative bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

export default App;