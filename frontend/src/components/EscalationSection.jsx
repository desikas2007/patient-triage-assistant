import React from 'react'

export default function EscalationSection({ reason, ruleIds }) {
  return (
    <div className="bg-amber-50/70 backdrop-blur-md border border-amber-200/60 rounded-2xl p-6 md:p-8 shadow-glass animate-fade-in">
      <div className="flex items-start space-x-4">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-md shadow-amber-400/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-sm text-amber-700 mb-4 leading-relaxed">
            This case requires review by a human triage professional.
            The automated system cannot safely determine the appropriate routing.
          </p>

          {reason && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-amber-100/60 p-4 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1.5">
                Reason
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{reason}</p>
            </div>
          )}

          {ruleIds && ruleIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Relevant rules:</span>
              <div className="flex flex-wrap gap-1.5">
                {ruleIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center bg-amber-100/80 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-lg border border-amber-200/60"
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
