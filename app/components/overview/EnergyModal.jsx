'use client'

import { useState } from 'react'
import { FaBolt, FaHeart, FaBatteryThreeQuarters } from 'react-icons/fa'

export default function EnergyModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('refill')

  if (!isOpen) return null

  const tabs = [
    { key: 'refill', label: 'Refill', icon: <FaBatteryThreeQuarters /> },
    { key: 'boosts', label: 'Boosts', icon: <FaBolt /> },
    { key: 'recovery', label: 'Recovery', icon: <FaHeart /> },
  ]

  const content = {
    refill: [
      { name: 'Small Energy', cost: '25 $PAWS', desc: 'Refill a small amount of energy' },
      { name: 'Full Energy', cost: '100 $PAWS', desc: 'Restore full energy bar' },
    ],
    boosts: [
      { name: 'Adrenaline Shot', cost: '150 $PAWS', desc: 'Temporarily boosts energy regen' },
    ],
    recovery: [
      { name: 'Energy Nap', cost: '75 $PAWS', desc: 'Recover energy over time' },
    ],
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-yellow-500 rounded-xl w-full max-w-xl p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-lg hover:text-yellow-400 transition"
          aria-label="Close Energy Modal"
        >
          ✕
        </button>

        {/* Header / Main Content */}
        <h2 className="text-2xl font-primary mb-4 text-center text-yellow-400">⚡ Energy Center</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Spend $PAWS to refill or boost your energy.
        </p>

        {/* Content Section */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
          {content[activeTab].map((item, idx) => (
            <div
              key={idx}
              className="border border-zinc-700 rounded-md p-3 bg-zinc-800 hover:border-yellow-400 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-button">{item.name}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                <span className="text-yellow-300 font-bold text-sm">{item.cost}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-t border-yellow-500 pt-4">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center py-2 px-2 transition ${
                activeTab === key ? 'text-yellow-400' : 'text-yellow-200'
              }`}
              aria-pressed={activeTab === key}
            >
              <div className="text-xl mb-1">{icon}</div>
              <span className="text-sm font-button">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}