import React from 'react'

export default function SafetyNotice() {
  return (
    <div className="bg-clinical-50 border border-clinical-200 rounded-clinical p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-clinical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-clinical-600">
            <span className="font-medium text-clinical-700">Important: </span>
            This tool supports intake routing and does not diagnose medical conditions.
          </p>
          <p className="text-xs text-clinical-500 mt-1">
            All recommendations are preliminary and require professional medical evaluation.
            Every recommendation references specific local triage rules.
          </p>
        </div>
      </div>
    </div>
  )
}
