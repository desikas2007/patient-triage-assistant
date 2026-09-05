import React from 'react'

/**
 * ErrorState component for displaying error messages
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="card p-8 border-red-200 bg-red-50">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Error Icon */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        {/* Error Message */}
        <div className="text-center">
          <p className="text-lg font-medium text-red-800">
            Unable to Process Request
          </p>
          <p className="text-sm text-red-600 mt-1">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        
        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary border-red-300 text-red-700 hover:bg-red-100"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
