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
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
      itemColor: 'text-blue-700',
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
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-800',
      itemColor: 'text-green-700',
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
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      titleColor: 'text-amber-800',
      itemColor: 'text-amber-700',
    },
  ]

  return (
    <div className="card p-6 md:p-8">
      <h2 className="text-xl font-semibold text-clinical-900 mb-4">
        Evidence Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`${section.bgColor} border ${section.borderColor} rounded-clinical p-4`}
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className={section.titleColor}>{section.icon}</span>
              <h3 className={`text-sm font-semibold ${section.titleColor}`}>
                {section.title}
              </h3>
            </div>

            <p className="text-xs text-clinical-500 mb-3">
              {section.description}
            </p>

            {section.items.length > 0 ? (
              <ul className="space-y-1.5">
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    className={`text-sm ${section.itemColor} flex items-start space-x-1.5`}
                  >
                    <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-current opacity-40"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-clinical-400 italic">
                None recorded
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
