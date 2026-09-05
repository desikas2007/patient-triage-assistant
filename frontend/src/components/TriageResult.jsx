import React from 'react'

const URGENCY_STYLES = {
  immediate: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-500',
    label: 'Immediate',
  },
  urgent: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
    label: 'Urgent',
  },
  'semi-urgent': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
    label: 'Semi-Urgent',
  },
  'non-urgent': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot: 'bg-green-500',
    label: 'Non-Urgent',
  },
}

export default function TriageResult({ urgency, department, ruleIds, status }) {
  if (status !== 'complete') return null

  const style = URGENCY_STYLES[urgency] || URGENCY_STYLES['semi-urgent']

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-clinical-900 mb-1">
          Triage Recommendation
        </h2>
        <p className="text-sm text-clinical-500">
          Based on local triage rules
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Urgency */}
        <div className="bg-clinical-50 rounded-clinical p-4 border border-clinical-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-clinical-500 mb-2">
            Urgency Level
          </p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot} mr-2`}></span>
            <span className="font-semibold">{style.label}</span>
          </div>
        </div>

        {/* Department */}
        <div className="bg-clinical-50 rounded-clinical p-4 border border-clinical-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-clinical-500 mb-2">
            Recommended Department
          </p>
          <p className="text-sm font-semibold text-clinical-800">
            {department || 'Not determined'}
          </p>
        </div>

        {/* Rules Applied */}
        <div className="bg-clinical-50 rounded-clinical p-4 border border-clinical-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-clinical-500 mb-2">
            Rules Applied
          </p>
          <div className="flex flex-wrap gap-1">
            {(ruleIds || []).map((id) => (
              <span
                key={id}
                className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
