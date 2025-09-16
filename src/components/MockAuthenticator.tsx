"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth, type MockUser } from '@/lib/mockAuth';

interface MockAuthenticatorProps {
  children: React.ReactNode;
}

export function MockAuthenticator({ children }: MockAuthenticatorProps) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await mockAuth.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
      
      // Redirect to dashboard if already authenticated
      if (currentUser) {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      const user = isSignUp 
        ? await mockAuth.signUp(email, password)
        : await mockAuth.signIn(email, password);
      setUser(user);
      
      // Redirect to dashboard after successful authentication
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSignOut = async () => {
    await mockAuth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 dark:bg-gray-700 rounded-xl p-1 flex">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !isSignUp 
                    ? 'bg-white dark:bg-gray-600 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSignUp 
                    ? 'bg-white dark:bg-gray-600 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-xl text-sm">
            <strong>Demo Mode:</strong> Use any email and password to {isSignUp ? 'sign up' : 'sign in'}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="demo@example.com"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="password"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  // Pass mock authenticator context to children
  return (
    <div data-mock-auth="true">
      {typeof children === 'function' 
        ? children({ user, signOut: handleSignOut })
        : children
      }
    </div>
  );
}