import React from 'react'

export default function ReasoningSection({ reasoning, ruleIds }) {
  if (!reasoning) return null

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h2 className="text-xl font-semibold text-clinical-900">
          Why This Recommendation Was Made
        </h2>
      </div>

      <div className="bg-clinical-50 rounded-clinical border border-clinical-200 p-4">
        <p className="text-sm text-clinical-700 leading-relaxed">
          {reasoning}
        </p>
      </div>

      {ruleIds && ruleIds.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-clinical-500 mb-2">
            Referenced Rules
          </p>
          <div className="flex flex-wrap gap-2">
            {ruleIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Triage Note */}
      <div className="mt-6 bg-clinical-50 rounded-clinical border border-clinical-200 p-5">
        <h3 className="text-sm font-semibold text-clinical-700 mb-3 uppercase tracking-wider">
          Triage Note
        </h3>
        <div className="text-sm text-clinical-600 space-y-2">
          <p>
            <span className="font-medium text-clinical-700">Safety: </span>
            This tool supports intake routing and does not diagnose medical conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
