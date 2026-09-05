import React from 'react'

export default function EvidenceSection({ reported, established, unknown }) {
  const sections = [
    {
      title: 'Patient Reported',
      description: 'Facts stated by the patient',
      items: reported || [],
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50/60',
      border: 'border-blue-100/60',
      titleColor: 'text-blue-700',
      itemColor: 'text-blue-600',
      dotColor: 'bg-blue-400',
    },
    {
      title: 'Follow-up Established',
      description: 'Facts obtained from follow-up questions',
      items: established || [],
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50/60',
      border: 'border-green-100/60',
      titleColor: 'text-green-700',
      itemColor: 'text-green-600',
      dotColor: 'bg-green-400',
    },
    {
      title: 'Still Unknown',
      description: 'Important information not yet obtained',
      items: unknown || [],
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50/60',
      border: 'border-amber-100/60',
      titleColor: 'text-amber-700',
      itemColor: 'text-amber-600',
      dotColor: 'bg-amber-400',
    },
  ]

  return (
    <div className="card p-6 md:p-8 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">
        Evidence Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`${section.bg} backdrop-blur-sm border ${section.border} rounded-2xl p-5`}
          >
            <div className="flex items-center space-x-2.5 mb-3">
              <div className={`w-7 h-7 bg-gradient-to-br ${section.gradient} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                {section.icon}
              </div>
              <h3 className={`text-sm font-semibold ${section.titleColor}`}>
                {section.title}
              </h3>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              {section.description}
            </p>

            {section.items.length > 0 ? (
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className={`text-sm ${section.itemColor} flex items-start space-x-2`}
                  >
                    <span className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${section.dotColor}`}></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 italic">
                None recorded
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
