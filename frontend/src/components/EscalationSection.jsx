import React from 'react'

export default function EscalationSection({ reason, ruleIds }) {
  return (
    <div className="card border-amber-300 bg-amber-50 p-6 md:p-8">
      <div className="flex items-start space-x-4">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">
            Human Review Recommended
          </h2>
          <p className="text-sm text-amber-800 mb-4">
            This case requires review by a human triage professional.
            The automated system cannot safely determine the appropriate routing.
          </p>

          {reason && (
            <div className="bg-white rounded-clinical border border-amber-200 p-4 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                Reason
              </p>
              <p className="text-sm text-clinical-800">{reason}</p>
            </div>
          )}

          {ruleIds && ruleIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-clinical-500">Relevant rules:</span>
              <div className="flex flex-wrap gap-1">
                {ruleIds.map((id) => (
                  <span
                    key={id}
                    className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
