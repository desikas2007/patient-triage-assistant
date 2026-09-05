import React from 'react'

export default function SafetyNotice() {
  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 bg-gray-100/80 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Important: </span>
            This tool supports intake routing and does not diagnose medical conditions.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            All recommendations are preliminary and require professional medical evaluation.
            Every recommendation references specific local triage rules.
          </p>
        </div>
      </div>
    </div>
  )
}
