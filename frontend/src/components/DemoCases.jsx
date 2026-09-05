import React from 'react'

const DEMO_CASES = [
  {
    id: 'fever',
    label: 'Fever',
    text: "I've had a fever since yesterday. My temperature was 102°F this morning. I also have a headache and my whole body aches. I took some ibuprofen but it's not helping much.",
    icon: '🌡️',
  },
  {
    id: 'injury',
    label: 'Injury',
    text: "I fell off my bike about an hour ago and hurt my wrist. It's swollen and I can't move it properly. The pain is pretty bad and there's some bruising.",
    icon: '🩹',
  },
  {
    id: 'chest-pain',
    label: 'Chest Pain',
    text: "I've been having chest pain since this morning. It feels like pressure, and it sometimes spreads to my left arm. I'm also a bit short of breath and sweating.",
    icon: '💓',
  },
  {
    id: 'breathing',
    label: 'Breathing Difficulty',
    text: "I'm having trouble breathing. It started about 3 hours ago and it's getting worse. I have asthma but I can't find my inhaler. I can barely speak in full sentences.",
    icon: '🫁',
  },
  {
    id: 'abdominal',
    label: 'Abdominal Pain',
    text: "I have severe pain in my lower right abdomen. It started last night and has gotten much worse. I feel nauseous and I haven't been able to eat since yesterday.",
    icon: '🏥',
  },
  {
    id: 'uncertain',
    label: 'Uncertain Case',
    text: "I don't feel well. Something is wrong but I'm not sure what.",
    icon: '❓',
  },
  {
    id: 'high-risk',
    label: 'High-Risk / Human Review',
    text: "I'm 78 years old with diabetes. I have a high fever, my lips are blue, and I'm having trouble breathing. My family says I was confused earlier.",
    icon: '⚠️',
  },
]

export default function DemoCases({ onSelect }) {
  const handleClick = (text) => {
    // Dispatch custom event for the textarea
    window.dispatchEvent(new CustomEvent('set-patient-text', { detail: text }))
    if (onSelect) onSelect(text)
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-clinical-500 bg-clinical-100 px-2 py-1 rounded">
            Demo Cases
          </span>
        </div>
        <p className="text-sm text-clinical-600">
          These are synthetic examples, not real patient records. Select one to pre-fill the form.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEMO_CASES.map((demo) => (
          <button
            key={demo.id}
            onClick={() => handleClick(demo.text)}
            className="group text-left p-3 border border-clinical-200 rounded-clinical
                       hover:border-primary-300 hover:bg-primary-50
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       transition-colors duration-150"
          >
            <div className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0 mt-0.5">{demo.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-clinical-800 group-hover:text-primary-700">
                  {demo.label}
                </p>
                <p className="text-xs text-clinical-500 mt-1 line-clamp-2">
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
