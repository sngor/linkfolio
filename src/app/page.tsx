"use client";
import { MockAuthenticator } from '@/components/MockAuthenticator';

export default function HomePage() {

  return (
    <main className="antialiased bg-animated-gradient min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center animate-slide-up delay-100">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-gray-100 mb-3 animate-slide-up delay-200">Linkfolio</h1>
          <p className="text-lg text-slate-600 dark:text-gray-300 mb-2 animate-slide-up delay-300">Your Digital Business Card</p>
          <p className="text-sm text-slate-500 dark:text-gray-400 animate-slide-up delay-400">Create, customize, and share your professional profile</p>
        </div>

        {/* Auth Container */}
        <div className="glass-card rounded-3xl overflow-hidden animate-slide-up delay-500">
          <div className="p-8">
            <MockAuthenticator>
              {/* This will redirect to dashboard, so this content won't be seen */}
              <div className="text-center text-slate-600 dark:text-gray-300">
                Redirecting to dashboard...
              </div>
            </MockAuthenticator>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up delay-600">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">Mobile Ready</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">Easy Sharing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">Secure</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-slide-up delay-700">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Powered by AWS Cognito • Built with Next.js
          </p>
        </div>
      </div>
    </main>
  );
}
