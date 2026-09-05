import React from 'react'

/**
 * Header component displaying product name and status
 */
export default function Header() {
  return (
    <header className="bg-white border-b border-clinical-200 shadow-clinical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {/* Logo/Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-600 rounded-clinical flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <h1 className="text-xl font-semibold text-clinical-900">
                Patient Intake Triage Assistant
              </h1>
              <p className="text-sm text-clinical-500">
                AI-assisted patient intake routing
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className="status-badge bg-medical-100 text-medical-800">
              <span className="w-2 h-2 bg-medical-500 rounded-full mr-2 animate-pulse"></span>
              Rules Engine Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
