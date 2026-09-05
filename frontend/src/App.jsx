import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
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
  /* ── Navigation ── */
  const [currentPage, setCurrentPage] = useState('home') // home | intake

  /* ── Existing state (preserved) ── */
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

  /* ── Navigation handlers ── */
  const handleStartTriage = () => {
    setCurrentPage('intake')
    setCurrentStep('intake')
    setTriageResult(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoHome = () => {
    setCurrentPage('home')
    setTriageResult(null)
    setSessionId(null)
    setError(null)
    setCurrentStep('intake')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Existing handlers (preserved exactly) ── */
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
  }

  const handleRetry = () => {
    setError(null)
    setTriageResult(null)
    setCurrentStep('intake')
  }

  /* ── Render ── */
  return (
    <div className="min-h-screen relative">
      {/* ── Landing Page ── */}
      {currentPage === 'home' && (
        <LandingPage onStartTriage={handleStartTriage} healthStatus={healthStatus} />
      )}

      {/* ── Intake Flow ── */}
      {currentPage === 'intake' && (
        <div className="min-h-screen relative">
          {/* Background */}
          <div className="fixed inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/healthcare-hero.jpg')" }}
            />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/30 via-transparent to-emerald-50/20" />
          </div>

          <div className="relative z-10">
            <Header
              healthStatus={healthStatus}
              onGoHome={handleGoHome}
              currentPage={currentPage}
            />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Health Warning */}
              {healthStatus && healthStatus.status !== 'ok' && (
                <div className="mb-6 p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl">
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
                      const textarea = document.getElementById('patientText')
                      if (textarea) {
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
                    {triageResult.escalation && (
                      <EscalationSection
                        reason={triageResult.escalation_reason}
                        ruleIds={triageResult.rule_ids}
                      />
                    )}

                    {triageResult.status === 'complete' && (
                      <TriageResult
                        urgency={triageResult.urgency}
                        department={triageResult.department}
                        ruleIds={triageResult.rule_ids}
                        status={triageResult.status}
                      />
                    )}

                    <EvidenceSection
                      reported={triageResult.reported}
                      established={triageResult.established}
                      unknown={triageResult.unknown}
                    />

                    <ReasoningSection
                      reasoning={triageResult.reasoning}
                      ruleIds={triageResult.rule_ids}
                    />

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={handleNewIntake}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium rounded-2xl shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Patient Intake
                      </button>
                      <button
                        onClick={handleGoHome}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white/70 backdrop-blur-sm text-gray-700 font-medium rounded-2xl border border-gray-200/60 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Back to Home
                      </button>
                    </div>
                  </>
                )}

                {/* Safety Notice */}
                <SafetyNotice />
              </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/40 bg-white/30 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-xs text-gray-400 text-center">
                  Patient Intake Triage Assistant &bull; AI-assisted intake routing &bull; Not a diagnostic tool
                </p>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
