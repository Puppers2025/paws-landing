'use client'

import { useState } from 'react'
import { FaGift, FaWrench, FaTrophy } from 'react-icons/fa'

export default function DnaModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('daily')

  if (!isOpen) return null

  const tabs = [
    { key: 'daily', label: 'Daily', icon: <FaGift /> },
    { key: 'upgrades', label: 'Upgrades', icon: <FaWrench /> },
    { key: 'rewards', label: 'Rewards', icon: <FaTrophy /> },
  ]

  const content = {
    daily: [
      { name: 'DNA Sample Pack', cost: '100 $PAWS', desc: 'Open for random DNA boosts' },
      { name: 'Trait Reshuffle', cost: '50 $PAWS', desc: 'Reset and re-roll minor DNA traits' },
    ],
    upgrades: [
      { name: 'Mutation Slot', cost: '200 $PAWS', desc: 'Add extra mutation capacity' },
      { name: 'Cooldown Reducer', cost: '150 $PAWS', desc: 'Breed again faster than usual' },
    ],
    rewards: [
      { name: 'Elite Gene Chip', cost: '300 $PAWS', desc: 'Insert rare hereditary trait' },
      { name: 'Breed Ticket', cost: '500 $PAWS', desc: 'Free entry to next breeding cycle' },
    ],
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-red-600 rounded-xl w-full max-w-xl p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-lg hover:text-red-500 transition"
          aria-label="Close DNA Modal"
        >
          ✕
        </button>

        {/* Header / Main Content */}
        <h2 className="text-2xl font-primary mb-4 text-center text-red-500">🧬 DNA Lab</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">
          Enhance or manipulate your pup’s DNA using $PAWS. Explore options by category.
        </p>

        {/* Content Section */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
          {content[activeTab].map((item, idx) => (
            <div
              key={idx}
              className="border border-zinc-700 rounded-md p-3 bg-zinc-800 hover:border-red-500 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-button">{item.name}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                <span className="text-yellow-400 font-bold text-sm">{item.cost}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-t border-red-600 pt-4">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center py-2 px-2 transition ${
                activeTab === key ? 'text-yellow-400' : 'text-red-500'
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