import React from 'react'

export default function Header({ healthStatus, onGoHome, currentPage }) {
  const isReady = healthStatus && healthStatus.status === 'ok'

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5">
          <div className="flex justify-between items-center px-5 py-3">
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onGoHome}
                className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-xl"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </button>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-900 leading-tight">
                  Patient Intake Triage Assistant
                </h1>
                <p className="text-[10px] font-medium tracking-widest text-teal-600 uppercase">
                  Listen &bull; Understand &bull; Guide &bull; Care
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xs font-semibold text-gray-900">Triage</h1>
              </div>
            </div>

            {/* Center: Back to Home */}
            {currentPage === 'intake' && (
              <button
                onClick={onGoHome}
                className="hidden md:inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
            )}

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Status Badge */}
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                {isReady ? 'System Ready' : 'Connecting...'}
              </span>

              {/* Start Triage / Back Home for mobile */}
              {currentPage === 'home' && (
                <button
                  onClick={onGoHome}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-xl shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Start Triage
                </button>
              )}
              {currentPage === 'intake' && (
                <button
                  onClick={onGoHome}
                  className="md:hidden inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
