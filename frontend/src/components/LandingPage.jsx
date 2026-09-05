import React, { useState, useEffect, useRef, useCallback } from 'react'

/* ─── Intersection Observer Hook ──────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isInView]
}

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
    step: '01',
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
    step: '02',
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
    step: '03',
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
    step: '04',
  },
]

/* ─── Benefits Data ───────────────────────────────────── */
const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Faster Intake',
    description: 'Reduce unnecessary waiting.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Explainable Decisions',
    description: 'Recommendations are linked to defined local rules.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Smarter Routing',
    description: 'Route cases based on available information and rules.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Human Review',
    description: 'Uncertain or high-risk cases can be escalated.',
  },
]

/* ─── Wave Divider Component ──────────────────────────── */
function WaveDivider({ fromColor = '#ffffff', toColor = '#f0fdf4', flip = false }) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`} style={{ marginTop: '-1px' }}>
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 sm:h-20 md:h-24">
        <path
          d="M0 60C240 10 480 90 720 60C960 30 1200 80 1440 40V120H0V60Z"
          fill={toColor}
          fillOpacity="0.6"
        />
        <path
          d="M0 80C320 30 640 100 960 70C1120 55 1280 90 1440 60V120H0V80Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}

/* ─── Floating Decorative Elements ────────────────────── */
function FloatingElements() {
  return (
    <>
      {/* Leaf shape top-right */}
      <div className="absolute top-32 right-12 lg:right-24 opacity-[0.12] pointer-events-none float-slow hidden md:block">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path d="M30 0C30 0 60 30 60 50C60 66.568 46.568 80 30 80C13.432 80 0 66.568 0 50C0 30 30 0 30 0Z" fill="#10b981" />
        </svg>
      </div>
      {/* Soft green circle */}
      <div className="absolute top-48 left-8 lg:left-16 w-20 h-20 rounded-full bg-emerald-200/20 blur-xl pointer-events-none float-medium hidden md:block" />
      {/* Small healthcare cross */}
      <div className="absolute bottom-36 right-16 lg:right-32 opacity-[0.08] pointer-events-none float-slow-delay hidden md:block">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="15" y="0" width="10" height="40" rx="2" fill="#14b8a6" />
          <rect x="0" y="15" width="40" height="10" rx="2" fill="#14b8a6" />
        </svg>
      </div>
      {/* Tiny teal glow */}
      <div className="absolute top-72 left-1/3 w-3 h-3 rounded-full bg-teal-400/30 blur-sm pointer-events-none float-medium hidden lg:block" />
    </>
  )
}

/* ─── Main Landing Page ───────────────────────────────── */
export default function LandingPage({ onStartTriage, healthStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aiTooltipOpen, setAiTooltipOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  const isReady = healthStatus && healthStatus.status === 'ok'

  /* Scroll observer for header */
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Scroll observer for sections */
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 })
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.1 })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.15 })

  const scrollToSection = useCallback((id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* ─── Background ──────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/healthcare-hero.jpg')" }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 hero-green-tint" />
      </div>

      {/* ─── Glass Header ────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerScrolled ? 'py-1' : 'py-3'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`rounded-2xl bg-white/${headerScrolled ? '85' : '70'} backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5 transition-all duration-300 ${headerScrolled ? 'shadow-md' : 'shadow-lg'}`}>
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3">
              {/* Logo + Title */}
              <div className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20 flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <nav className="hidden md:flex items-center space-x-0.5">
                {[
                  { label: 'Home', id: 'hero-section' },
                  { label: 'How It Works', id: 'how-it-works' },
                  { label: 'AI Agents', id: 'benefits' },
                  { label: 'Safety', id: 'cta-section' },
                  { label: 'About', id: 'footer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Status Badge */}
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                  {isReady ? 'System Ready' : 'Connecting...'}
                </span>

                {/* CTA Button */}
                <button
                  onClick={onStartTriage}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs sm:text-sm font-medium rounded-xl shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Start Triage
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="md:hidden border-t border-white/40 px-4 py-3 space-y-1">
                {[
                  { label: 'Home', id: 'hero-section' },
                  { label: 'How It Works', id: 'how-it-works' },
                  { label: 'AI Agents', id: 'benefits' },
                  { label: 'Safety', id: 'cta-section' },
                  { label: 'About', id: 'footer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────── */}
      <section id="hero-section" className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">
        <FloatingElements />
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="hero-eyebrow">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/40 text-emerald-700 text-xs font-semibold tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                Better Care Begins Here
              </span>
            </div>

            {/* Main heading */}
            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Your Health Matters.
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                We're Here to Help.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="hero-subtext mt-6 sm:mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              AI-assisted patient intake and intelligent triage routing for faster,
              safer, and smarter care.
            </p>

            {/* CTAs */}
            <div className="hero-cta mt-8 sm:mt-10 flex flex-wrap gap-4">
              <button
                onClick={onStartTriage}
                className="inline-flex items-center px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 text-base sm:text-lg group"
              >
                Start Triage Assessment
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center px-7 sm:px-8 py-3.5 sm:py-4 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border border-gray-200/60 shadow-sm hover:bg-white/90 hover:shadow-md transition-all duration-200 text-base sm:text-lg"
              >
                Watch Overview
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-decorative absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
          <span className="text-xs font-medium text-gray-400 tracking-wide">Scroll to explore</span>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="scroll-indicator text-teal-500 hover:text-teal-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* ─── Wave Transition: Hero → How It Works ─── */}
      <div className="relative z-10">
        <WaveDivider fromColor="transparent" toColor="#f0fdf4" />
      </div>

      {/* ─── How It Works Section ────────────────── */}
      <section id="how-it-works" className="relative z-10 bg-gradient-to-b from-emerald-50/60 to-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div
            ref={featuresRef}
            className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 animate-on-scroll ${featuresInView ? 'is-visible' : ''}`}
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3">Process</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              How It Works
            </h2>
            <p className="mt-4 sm:mt-5 text-lg text-gray-500 leading-relaxed">
              From your symptoms to the right care &mdash; powered by AI and guided by local triage rules.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className={`feature-card group bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-6 sm:p-7 shadow-sm animate-on-scroll ${featuresInView ? 'is-visible' : ''} stagger-${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="feature-icon w-12 h-12 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center text-teal-600">
                    {feature.icon}
                  </div>
                  <span className="text-3xl font-bold text-emerald-100 group-hover:text-emerald-200 transition-colors select-none">
                    {feature.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wave Transition: How It Works → Benefits ─── */}
      <div className="relative z-10">
        <WaveDivider fromColor="#ffffff" toColor="#f0fdf4" />
      </div>

      {/* ─── Benefits Section ────────────────────── */}
      <section id="benefits" className="relative z-10 bg-gradient-to-b from-emerald-50/40 to-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div
            ref={benefitsRef}
            className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 animate-on-scroll ${benefitsInView ? 'is-visible' : ''}`}
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-3">Benefits</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Better Triage.{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Healthier Tomorrows.
              </span>
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {BENEFITS.map((benefit, idx) => (
              <div
                key={idx}
                className={`benefit-item group bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-6 sm:p-7 text-center shadow-sm animate-on-scroll ${benefitsInView ? 'is-visible' : ''} stagger-${idx + 1}`}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:from-teal-100 group-hover:to-emerald-100 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wave Transition: Benefits → CTA ─── */}
      <div className="relative z-10">
        <WaveDivider fromColor="#ffffff" toColor="#ecfdf5" />
      </div>

      {/* ─── Start Triage CTA Section ────────────── */}
      <section id="cta-section" className="relative z-10 bg-gradient-to-b from-emerald-50/60 to-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={ctaRef}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 p-8 sm:p-12 lg:p-16 text-center shadow-2xl shadow-teal-600/20 animate-on-scroll-scale ${ctaInView ? 'is-visible' : ''}`}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
                Ready to Begin?
              </h2>
              <p className="text-lg sm:text-xl text-teal-100/90 leading-relaxed mb-8 sm:mb-10">
                Describe what you're experiencing and let the assistant organize the information for preliminary intake and routing.
              </p>
              <button
                onClick={onStartTriage}
                className="inline-flex items-center px-8 sm:px-10 py-4 sm:py-4.5 bg-white text-teal-700 font-semibold rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:bg-emerald-50 transition-all duration-200 text-base sm:text-lg cta-glow group"
              >
                Start Triage Assessment
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Safety Notice ──────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-gray-500 leading-relaxed">
              This assistant supports preliminary intake and routing only. It does not diagnose conditions or replace professional medical evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────── */}
      <footer id="footer" className="relative z-10 border-t border-white/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            {/* Left */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Patient Intake Triage Assistant</p>
                <p className="text-xs text-gray-400">AI-assisted intake routing</p>
              </div>
            </div>

            {/* Right */}
            <p className="text-xs text-gray-400">
              AI-assisted intake routing &bull; Not a diagnostic tool &bull; Powered by local triage rules &bull; Gemini AI
            </p>
          </div>
        </div>
      </footer>

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
                <p><span className="font-medium text-gray-800">1. Describe symptoms</span> in your own words.</p>
                <p><span className="font-medium text-gray-800">2. AI extracts key facts</span> from your description.</p>
                <p><span className="font-medium text-gray-800">3. Local rules determine</span> the best triage route.</p>
                <p><span className="font-medium text-gray-800">4. High-risk cases</span> are flagged for human review.</p>
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
            className="w-12 h-12 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-full shadow-lg hover:shadow-xl hover:bg-white transition-all duration-200 flex items-center justify-center text-teal-600 hover:text-teal-700 group"
            title="How the triage assistant works"
          >
            <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
