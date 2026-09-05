import React from 'react'

const URGENCY_STYLES = {
  immediate: {
    badge: 'urgency-badge-immediate',
    dot: 'bg-red-500',
    label: 'Immediate',
    gradient: 'from-red-500 to-rose-500',
    shadow: 'shadow-red-500/20',
  },
  urgent: {
    badge: 'urgency-badge-urgent',
    dot: 'bg-orange-500',
    label: 'Urgent',
    gradient: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/20',
  },
  'semi-urgent': {
    badge: 'urgency-badge-semi-urgent',
    dot: 'bg-yellow-500',
    label: 'Semi-Urgent',
    gradient: 'from-yellow-500 to-amber-500',
    shadow: 'shadow-yellow-500/20',
  },
  'non-urgent': {
    badge: 'urgency-badge-non-urgent',
    dot: 'bg-green-500',
    label: 'Non-Urgent',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/20',
  },
}

export default function TriageResult({ urgency, department, ruleIds, status }) {
  if (status !== 'complete') return null

  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES['semi-urgent']

  return (
    <div className="card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Triage Recommendation
            </h2>
            <p className="text-sm text-gray-500">
              Based on local triage rules
            </p>
          </div>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 p-6 shadow-glass mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Urgency - Prominent */}
          <div className="sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Urgency Level
            </p>
            <div className={`urgency-badge ${style.badge}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${style.dot} mr-2`}></span>
              <span>{style.label}</span>
            </div>
          </div>

          {/* Department */}
          <div className="sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Recommended Department
            </p>
            <p className="text-base font-semibold text-gray-800">
              {department || 'Not determined'}
            </p>
          </div>

          {/* Rules Applied */}
          <div className="sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Rules Applied
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(ruleIds || []).map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center bg-teal-50/80 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-teal-100/60"
                >
                  <svg className="w-3 h-3 mr-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {id}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
