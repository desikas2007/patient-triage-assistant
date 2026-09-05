import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PatientIntake from './components/PatientIntake'
import SafetyNotice from './components/SafetyNotice'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import { checkHealth, processTriage } from './api'

/**
 * Main Application Component
 * Patient Intake Triage Assistant
 */
function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)
  const [triageResult, setTriageResult] = useState(null)
  
  // Check API health on mount
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
    } catch (err) {
      setError(err.message || 'Failed to analyze patient intake')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRetry = () => {
    setError(null)
    setTriageResult(null)
  }
  
  return (
    <div className="min-h-screen bg-clinical-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health Status Banner */}
        {healthStatus && healthStatus.status !== 'ok' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-clinical">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Warning: </span>
              Backend API is not responding. Some features may be unavailable.
            </p>
          </div>
        )}
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Patient Intake Form */}
          <PatientIntake onSubmit={handleAnalyze} isLoading={isLoading} />
          
          {/* Loading State */}
          {isLoading && (
            <LoadingState message="Analyzing patient information..." />
          )}
          
          {/* Error State */}
          {error && (
            <ErrorState message={error} onRetry={handleRetry} />
          )}
          
          {/* Triage Result Placeholder */}
          {triageResult && !isLoading && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-clinical-900 mb-4">
                Analysis Complete
              </h3>
              <pre className="bg-clinical-50 p-4 rounded-clinical text-sm text-clinical-700 overflow-auto">
                {JSON.stringify(triageResult, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Safety Notice */}
          <SafetyNotice />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-clinical-200 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-clinical-500 text-center">
            Patient Intake Triage Assistant • AI-assisted intake routing
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
