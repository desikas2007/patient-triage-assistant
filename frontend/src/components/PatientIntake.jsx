import React, { useState, useEffect, useRef } from 'react'

export default function PatientIntake({ onSubmit, isLoading }) {
  const [patientText, setPatientText] = useState('')
  const textareaRef = useRef(null)

  // Allow demo cases to set the textarea value
  useEffect(() => {
    const handler = (e) => {
      if (e.detail !== undefined) {
        setPatientText(e.detail)
      }
    }
    window.addEventListener('set-patient-text', handler)
    return () => window.removeEventListener('set-patient-text', handler)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (patientText.trim() && onSubmit) {
      onSubmit(patientText.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-clinical-900 mb-2">
          Patient Intake
        </h2>
        <p className="text-clinical-600">
          Describe the patient's situation in your own words.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="patientText" className="label">
            Patient Description
          </label>
          <textarea
            ref={textareaRef}
            id="patientText"
            className="textarea-field h-40"
            placeholder="Example: I've had chest discomfort since this morning and I'm feeling short of breath."
            value={patientText}
            onChange={(e) => setPatientText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            required
          />
          <p className="mt-2 text-sm text-clinical-500">
            Press Ctrl+Enter to submit
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary min-w-[160px]"
            disabled={isLoading || !patientText.trim()}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Analyze Intake
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
