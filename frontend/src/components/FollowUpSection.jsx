import React, { useState } from 'react'

export default function FollowUpSection({ questions, onSubmit, isLoading }) {
  const [answers, setAnswers] = useState({})

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(answers)
    }
  }

  if (!questions || questions.length === 0) return null

  return (
    <div className="card p-6 md:p-8 border-primary-200 bg-primary-50/30">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-clinical-900">
            Additional Information Needed
          </h2>
        </div>
        <p className="text-sm text-clinical-600">
          Please answer the following questions to help complete the triage assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {questions.map((q, idx) => (
            <div key={q.question_id || idx} className="bg-white p-4 rounded-clinical border border-clinical-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`answer-${q.question_id}`}
                    className="block text-sm font-medium text-clinical-800 mb-2"
                  >
                    {q.question_text}
                  </label>
                  {q.priority === 'high' && (
                    <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full mb-2">
                      Important
                    </span>
                  )}
                  <input
                    type="text"
                    id={`answer-${q.question_id}`}
                    className="input-field"
                    placeholder="Type your answer..."
                    value={answers[q.question_id] || ''}
                    onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="btn-primary min-w-[180px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Continue Triage'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
