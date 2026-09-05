import React, { useState } from 'react'

/* ─── Feature Cards Data ──────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Describe Your Symptoms',
    description: 'Share your concerns in simple language.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Analysis',
    description: 'AI understands and extracts key information.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Intelligent Triage',
    description: 'Relevant local rules help route the case appropriately.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Safer Care',
    description: 'High-risk and uncertain cases can be escalated for human review.',
  },
]

/* ─── Trust Bar Items ─────────────────────────────────── */
const TRUST_ITEMS = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Faster Intake',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Explainable Decisions',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    label: 'Rule-Based Routing',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Human Review for Risk',
  },
]

/* ─── Main Landing Page ───────────────────────────────── */
export default function LandingPage({ onStartTriage, healthStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiTooltipOpen, setAiTooltipOpen] = useState(false)

  const isReady = healthStatus && healthStatus.status === 'ok'

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative">
      {/* ─── Background ──────────────────────────── */}
      {/* Layer 1: realistic premium hospital photograph (local asset) */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/healthcare-hero.jpg')" }}
        />
        {/* Layer 2: soft readability veil — calmer on the left/center behind the hero,
            progressively more photo detail visible toward the right (no blur, keeps the photo crisp) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-white/25 to-white/10" />
        {/* Layer 3: subtle blue/teal healthcare ambient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/40 via-transparent to-emerald-50/30" />
      </div>

      {/* ─── Glass Header ────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5">
            <div className="flex items-center justify-between px-5 py-3">
              {/* Logo + Title */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
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

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-1">
                <button onClick={() => scrollToSection('features')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('features')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  AI Agents
                </button>
                <button onClick={() => scrollToSection('trust')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  Safety
                </button>
                <button onClick={() => scrollToSection('disclaimer')} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  About
                </button>
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-3">
                {/* Status Badge */}
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isReady ? 'System Ready' : 'Connecting...'}
                </span>

                {/* CTA Button */}
                <button
                  onClick={onStartTriage}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-xl shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Start Triage
                  <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/40 px-5 py-3 space-y-1">
                <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  AI Agents
                </button>
                <button onClick={() => scrollToSection('trust')} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  Safety
                </button>
                <button onClick={() => scrollToSection('disclaimer')} className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors">
                  About
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
              Your Health Matters.
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                We're Here to Help.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              AI-assisted patient intake and intelligent triage routing for faster,
              safer, and smarter care.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={onStartTriage}
                className="inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 text-base"
              >
                Start Triage Assessment
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="inline-flex items-center px-7 py-3.5 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border border-gray-200/60 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200 text-base"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* ─── Feature Cards ──────────────────────── */}
          <div id="features" className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:bg-white/70 hover:border-teal-200/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center text-teal-600 mb-4 group-hover:from-teal-100 group-hover:to-emerald-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* ─── Trust / Safety Bar ─────────────────── */}
          <div id="trust" className="mt-12 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl px-6 py-4">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {TRUST_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-teal-600">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Safety Disclaimer ──────────────────── */}
          <div id="disclaimer" className="mt-8 text-center">
            <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
              This assistant supports preliminary intake and routing only.
              It does not diagnose conditions or replace professional medical evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* ─── AI Assistant Floating Button ─────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {aiTooltipOpen && (
            <div className="absolute bottom-16 right-0 w-72 bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-xl p-5 mb-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-900">How It Works</h4>
              </div>
              <div className="space-y-2.5 text-xs text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">1. Describe symptoms</span> in your own words.
                </p>
                <p>
                  <span className="font-medium text-gray-800">2. AI extracts key facts</span> from your description.
                </p>
                <p>
                  <span className="font-medium text-gray-800">3. Local rules determine</span> the best triage route.
                </p>
                <p>
                  <span className="font-medium text-gray-800">4. High-risk cases</span> are flagged for human review.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-400">
                  This is not a diagnostic tool. All recommendations require professional evaluation.
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setAiTooltipOpen(!aiTooltipOpen)}
            className="w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 flex items-center justify-center text-teal-600 hover:text-teal-700"
            title="How the triage assistant works"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Footer ───────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-400">
              Patient Intake Triage Assistant &bull; AI-assisted intake routing &bull; Not a diagnostic tool
            </p>
            <p className="text-xs text-gray-400">
              Powered by local triage rules &bull; Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
