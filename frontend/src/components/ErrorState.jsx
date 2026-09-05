import React from 'react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card p-8 border-red-200 bg-red-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-red-800">
            Unable to Process Request
          </p>
          <p className="text-sm text-red-600 mt-1 max-w-md">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700
                       rounded-clinical hover:bg-red-50 focus:outline-none focus:ring-2
                       focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
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
