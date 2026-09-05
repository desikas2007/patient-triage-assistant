import React from 'react'

const DEMO_CASES = [
  {
    id: 'fever',
    label: 'Fever',
    text: "I've had a fever since yesterday. My temperature was 102°F this morning. I also have a headache and my whole body aches. I took some ibuprofen but it's not helping much.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    color: 'text-orange-500',
    bg: 'bg-orange-50/80',
  },
  {
    id: 'injury',
    label: 'Injury',
    text: "I fell off my bike about an hour ago and hurt my wrist. It's swollen and I can't move it properly. The pain is pretty bad and there's some bruising.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'text-blue-500',
    bg: 'bg-blue-50/80',
  },
  {
    id: 'chest-pain',
    label: 'Chest Pain',
    text: "I've been having chest pain since this morning. It feels like pressure, and it sometimes spreads to my left arm. I'm also a bit short of breath and sweating.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: 'text-red-500',
    bg: 'bg-red-50/80',
  },
  {
    id: 'breathing',
    label: 'Breathing Difficulty',
    text: "I'm having trouble breathing. It started about 3 hours ago and it's getting worse. I have asthma but I can't find my inhaler. I can barely speak in full sentences.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-cyan-500',
    bg: 'bg-cyan-50/80',
  },
  {
    id: 'abdominal',
    label: 'Abdominal Pain',
    text: "I have severe pain in my lower right abdomen. It started last night and has gotten much worse. I feel nauseous and I haven't been able to eat since yesterday.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'text-amber-500',
    bg: 'bg-amber-50/80',
  },
  {
    id: 'uncertain',
    label: 'Uncertain Case',
    text: "I don't feel well. Something is wrong but I'm not sure what.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-gray-500',
    bg: 'bg-gray-50/80',
  },
  {
    id: 'high-risk',
    label: 'High-Risk / Human Review',
    text: "I'm 78 years old with diabetes. I have a high fever, my lips are blue, and I'm having trouble breathing. My family says I was confused earlier.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    color: 'text-orange-600',
    bg: 'bg-orange-50/80',
  },
]

export default function DemoCases({ onSelect }) {
  const handleClick = (text) => {
    window.dispatchEvent(new CustomEvent('set-patient-text', { detail: text }))
    if (onSelect) onSelect(text)
  }

  return (
    <div className="card p-6 md:p-8 animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50/80 px-2.5 py-1 rounded-lg">
            Demo Cases
          </span>
        </div>
        <p className="text-sm text-gray-500">
          These are synthetic examples, not real patient records. Select one to pre-fill the form.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEMO_CASES.map((demo) => (
          <button
            key={demo.id}
            onClick={() => handleClick(demo.text)}
            className="group text-left p-4 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl
                       hover:bg-white/80 hover:border-teal-200/50 hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-2
                       transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-9 h-9 ${demo.bg} rounded-lg flex items-center justify-center ${demo.color}`}>
                {demo.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700">
                  {demo.label}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {demo.text.substring(0, 80)}...
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
