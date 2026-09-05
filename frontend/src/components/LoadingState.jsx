import React from 'react'

export default function LoadingState({ message = 'Processing...' }) {
  return (
    <div className="card p-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center space-y-5">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-14 h-14 border-4 border-teal-100 rounded-full"></div>
          <div className="w-14 h-14 border-4 border-teal-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{message}</p>
          <p className="text-sm text-gray-400 mt-1">
            This may take a moment...
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-teal-500 rounded-full mr-1.5"></span>
            Extracting facts
          </span>
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-1.5"></span>
            Matching rules
          </span>
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-1.5"></span>
            Recommendation
          </span>
        </div>
      </div>
    </div>
  )
}
