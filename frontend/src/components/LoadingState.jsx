import React from 'react'

export default function LoadingState({ message = 'Processing...' }) {
  return (
    <div className="card p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-clinical-200 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-clinical-700">{message}</p>
          <p className="text-sm text-clinical-500 mt-1">
            This may take a moment...
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-clinical-500">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-medical-500 rounded-full mr-1"></span>
            Extracting facts
          </span>
          <span>&rarr;</span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-clinical-300 rounded-full mr-1"></span>
            Matching rules
          </span>
          <span>&rarr;</span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-clinical-300 rounded-full mr-1"></span>
            Recommendation
          </span>
        </div>
      </div>
    </div>
  )
}
