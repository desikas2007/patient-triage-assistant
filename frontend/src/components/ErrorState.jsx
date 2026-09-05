import React from 'react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50/70 backdrop-blur-md border border-red-200/60 rounded-2xl p-8 shadow-glass animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-5">
        <div className="w-14 h-14 bg-red-100/80 rounded-xl flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-red-800">
            Unable to Process Request
          </p>
          <p className="text-sm text-red-600 mt-1.5 max-w-md leading-relaxed">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-red-200/60 text-red-700
                       rounded-xl hover:bg-white hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                       transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
