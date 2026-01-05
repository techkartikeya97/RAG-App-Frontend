import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Success! Check your email for the confirmation link.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during authentication.' });
    } finally {
      setLoading(false);
    }
  };

  const logoUrl = "https://chdlpyhzxdsyalzpyrwh.supabase.co/storage/v1/object/sign/CPT%20Images/CPT%20logo%20Color.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85N2FmMTNlOC0yMjVhLTQ1ZWEtYWM2MC03Y2U5MTBjYTc0YzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDUFQgSW1hZ2VzL0NQVCBsb2dvIENvbG9yLnBuZyIsImlhdCI6MTc2NzU2MTA0MCwiZXhwIjoxNzk5MDk3MDQwfQ.-hyACc-zsnqS4n_yTVhLG_JgKJ8JqZjkXOWhsVolshs";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo/Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="CPT Logo" 
              className="w-32 h-32 object-contain drop-shadow-xl transition-transform hover:scale-105 duration-300"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Centre For Police Technology</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">LOGIN PAGE</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@cpt.gov"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-black"
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${
                  message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 text-center border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};