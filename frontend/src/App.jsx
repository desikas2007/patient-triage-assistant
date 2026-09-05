import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PatientIntake from './components/PatientIntake'
import DemoCases from './components/DemoCases'
import FollowUpSection from './components/FollowUpSection'
import TriageResult from './components/TriageResult'
import EvidenceSection from './components/EvidenceSection'
import EscalationSection from './components/EscalationSection'
import ReasoningSection from './components/ReasoningSection'
import SafetyNotice from './components/SafetyNotice'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import { checkHealth, processTriage, processFollowUp, resetSession } from './api'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)
  const [triageResult, setTriageResult] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [currentStep, setCurrentStep] = useState('intake') // intake | follow_up | result

  useEffect(() => {
    async function checkApiHealth() {
      try {
        const result = await checkHealth()
        setHealthStatus(result)
      } catch (err) {
        console.error('Health check failed:', err)
        setHealthStatus({ status: 'error' })
      }
    }
    checkApiHealth()
  }, [])

  const handleAnalyze = async (patientText) => {
    setIsLoading(true)
    setError(null)
    setTriageResult(null)

    try {
      const result = await processTriage(patientText)
      setTriageResult(result)
      setSessionId(result.session_id)

      if (result.status === 'follow_up_required') {
        setCurrentStep('follow_up')
      } else {
        setCurrentStep('result')
      }
    } catch (err) {
      setError(err.message || 'Failed to analyze patient intake')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowUp = async (answers) => {
    if (!sessionId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await processFollowUp(sessionId, answers)
      setTriageResult(result)

      if (result.status === 'follow_up_required') {
        setCurrentStep('follow_up')
      } else {
        setCurrentStep('result')
      }
    } catch (err) {
      setError(err.message || 'Failed to process follow-up answers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewIntake = async () => {
    if (sessionId) {
      try {
        await resetSession(sessionId)
      } catch (e) {
        // Ignore reset errors
      }
    }
    setTriageResult(null)
    setSessionId(null)
    setError(null)
    setCurrentStep('intake')
  }

  const handleSelectDemo = (text) => {
    setTriageResult(null)
    setError(null)
    setCurrentStep('intake')
    // The PatientIntake component will receive this via a prop
    // We'll use a key trick to reset it
  }

  const handleRetry = () => {
    setError(null)
    setTriageResult(null)
    setCurrentStep('intake')
  }

  return (
    <div className="min-h-screen bg-clinical-50 flex flex-col">
      <Header healthStatus={healthStatus} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Warning */}
        {healthStatus && healthStatus.status !== 'ok' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-clinical">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-amber-800">
                <span className="font-medium">Warning: </span>
                Backend API is not responding. Some features may be unavailable.
                {healthStatus.status === 'error' && ' Make sure GEMINI_API_KEY is set.'}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Step 1: Patient Intake */}
          {currentStep === 'intake' && (
            <>
              <PatientIntake onSubmit={handleAnalyze} isLoading={isLoading} />
              <DemoCases onSelect={(text) => {
                // We need to set the textarea value
                // Use a custom event or state lift
                const textarea = document.getElementById('patientText')
                if (textarea) {
                  // Use React's internal setter
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype, 'value'
                  ).set
                  nativeInputValueSetter.call(textarea, text)
                  textarea.dispatchEvent(new Event('input', { bubbles: true }))
                }
              }} />
            </>
          )}

          {/* Loading */}
          {isLoading && (
            <LoadingState
              message={currentStep === 'follow_up' ? 'Processing follow-up answers...' : 'Analyzing patient information...'}
            />
          )}

          {/* Error */}
          {error && (
            <ErrorState message={error} onRetry={handleRetry} />
          )}

          {/* Step 2: Follow-Up Questions */}
          {currentStep === 'follow_up' && triageResult && !isLoading && (
            <FollowUpSection
              questions={triageResult.follow_up_questions || []}
              onSubmit={handleFollowUp}
              isLoading={isLoading}
            />
          )}

          {/* Step 3: Results */}
          {currentStep === 'result' && triageResult && !isLoading && (
            <>
              {/* Escalation Warning (if applicable) */}
              {triageResult.escalation && (
                <EscalationSection
                  reason={triageResult.escalation_reason}
                  ruleIds={triageResult.rule_ids}
                />
              )}

              {/* Triage Result — shown when we have a complete recommendation */}
              {triageResult.status === 'complete' && (
                <TriageResult
                  urgency={triageResult.urgency}
                  department={triageResult.department}
                  ruleIds={triageResult.rule_ids}
                  status={triageResult.status}
                />
              )}

              {/* Evidence Section */}
              <EvidenceSection
                reported={triageResult.reported}
                established={triageResult.established}
                unknown={triageResult.unknown}
              />

              {/* Reasoning */}
              <ReasoningSection
                reasoning={triageResult.reasoning}
                ruleIds={triageResult.rule_ids}
              />

              {/* New Intake Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleNewIntake}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Patient Intake
                </button>
              </div>
            </>
          )}

          {/* Safety Notice (always shown) */}
          <SafetyNotice />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-clinical-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-clinical-500 text-center">
            Patient Intake Triage Assistant &bull; AI-assisted intake routing &bull; Not a diagnostic tool
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
