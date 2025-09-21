'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaMapMarkedAlt,
  FaHeartbeat,
  FaCogs,
  FaRocket,
  FaPaw,
  FaBolt,
  FaTwitter,
  FaTelegramPlane,
  FaDiscord,
  FaShoppingBag,
  FaArrowLeft,
  FaTimes,
  FaCheck,
} from 'react-icons/fa'

const puppers = [
  {
    name: 'Bolt',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425747/paws-landing/paws-landing/puppers/rexx.jpg',
    title: 'Speed Demon',
    description: 'This pupper craves fast-paced challenges and reflex-driven games.',
    icon: <FaBolt className="text-yellow-500 text-3xl" />,
    themeColor: 'yellow',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
    glowColor: 'shadow-yellow-500/50',
    textColor: 'text-yellow-500',
  },
  {
    name: 'Luna',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425731/paws-landing/paws-landing/puppers/luna.jpg',
    title: 'Mystic Wanderer',
    description: 'Explore deep lore and hidden truths through her spiritual path.',
    icon: <FaMapMarkedAlt className="text-purple-500 text-3xl" />,
    themeColor: 'purple',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    glowColor: 'shadow-purple-500/50',
    textColor: 'text-purple-500',
  },
  {
    name: 'Maxx',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425743/paws-landing/paws-landing/puppers/maxx.jpg',
    title: 'Battle Born',
    description: 'Gear up for tactical duels and intense arena clashes.',
    icon: <FaCogs className="text-red-500 text-3xl" />,
    themeColor: 'red',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'shadow-red-500/50',
    textColor: 'text-red-500',
  },
  {
    name: 'Nova',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425744/paws-landing/paws-landing/puppers/nova.jpg',
    title: 'Galactic Scout',
    description: 'Blast off into exploration mode and interdimensional discovery.',
    icon: <FaRocket className="text-cyan-500 text-3xl" />,
    themeColor: 'cyan',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-500/10',
    glowColor: 'shadow-cyan-500/50',
    textColor: 'text-cyan-500',
  },
  {
    name: 'Zeek',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425746/paws-landing/paws-landing/puppers/zeek.jpg',
    title: 'Loyal Healer',
    description: 'Support your squad with compassion and powerful restoration.',
    icon: <FaHeartbeat className="text-green-500 text-3xl" />,
    themeColor: 'green',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    glowColor: 'shadow-green-500/50',
    textColor: 'text-green-500',
  },
  {
    name: 'Rexx',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425730/paws-landing/paws-landing/puppers/bolt.jpg',
    title: 'Alpha Tracker',
    description: 'Lead your pack through quests and dominate the leaderboard.',
    icon: <FaPaw className="text-orange-500 text-3xl" />,
    themeColor: 'orange',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    glowColor: 'shadow-orange-500/50',
    textColor: 'text-orange-500',
  },
]

export default function GetStarted() {
  const [selectedPupper, setSelectedPupper] = useState(null)
  const [customName, setCustomName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handlePupperSelect = (pupper) => {
    setSelectedPupper(pupper)
    setCustomName(pupper.name) // Default to original name
    setShowModal(true)
  }

  const handleConfirmSelection = () => {
    if (customName.trim()) {
      // Store the selected character and custom name in localStorage
      localStorage.setItem('selectedPupper', JSON.stringify({
        ...selectedPupper,
        customName: customName.trim()
      }))
      
      // Redirect to dashboard
      router.push('/dashboard')
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPupper(null)
    setCustomName('')
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-10 overflow-hidden">
      {/* ✅ Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-30 text-red-500 hover:text-white transition-all duration-300"
      >
        <div className="p-3 border-2 border-red-600 rounded-full neon-shadow repair-icon transition-all duration-500 hover:scale-110 hover:shadow-red-500/70">
          <FaArrowLeft className="text-2xl" />
        </div>
      </Link>

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dncbk5sac/image/upload/v1758321417/paws-landing/paws-landing/backgrounds/Future9.png")', opacity: 0.25 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-center text-4xl font-primary mb-16 mt-4">Choose Your Pupper</h1>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
            {puppers.map((pup, idx) => (
              <div
                key={idx}
                className={`bg-zinc-900 border ${pup.borderColor} rounded-xl p-6 shadow-lg flex flex-col items-center text-center glow-box ${pup.bgColor} hover:${pup.glowColor} transition-all duration-300`}
              >
                <button
                  onClick={() => handlePupperSelect(pup)}
                  className={`w-32 h-32 rounded-full object-cover mb-4 border-4 ${pup.borderColor} cursor-pointer hover:scale-105 transition-transform overflow-hidden hover:${pup.glowColor}`}
                >
                  <img
                    src={pup.image}
                    alt={pup.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <h2 className={`text-xl font-primary mb-2 ${pup.textColor}`}>{pup.name}</h2>
                <div className="mt-4">
                  <h3 className={`text-lg font-button mb-1 ${pup.textColor}`}>{pup.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{pup.description}</p>
                  {pup.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="relative z-20 mt-16 mb-2.5 flex justify-center">
        <div className="grid grid-cols-4 gap-6 text-red-500">
          {[
            { Icon: FaTwitter, href: 'https://x.com/BreedPuppers' },
            { Icon: FaTelegramPlane, href: '#' },
            { Icon: FaDiscord, href: 'https://discord.com/invite/EbxDQVBkzM' },
            { Icon: FaShoppingBag, href: 'https://magiceden.us/collections/apechain/0x942e4b97b9bad206b2e1333be7747fd27eaaab6c' }
          ].map(({ Icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl p-4 border-2 border-red-600 rounded-full neon-shadow repair-icon transition-all duration-500 hover:text-white hover:scale-110 hover:shadow-red-500/70"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Character Customization Modal */}
      {showModal && selectedPupper && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-zinc-900 border-2 ${selectedPupper.borderColor} rounded-xl p-8 max-w-md w-full mx-4 glow-box ${selectedPupper.bgColor}`}>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-primary ${selectedPupper.textColor}`}>Customize Your Pupper</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Character Preview */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={selectedPupper.image}
                alt={selectedPupper.name}
                className={`w-24 h-24 rounded-full object-cover border-4 ${selectedPupper.borderColor} mb-4`}
              />
              <h3 className={`text-lg font-primary ${selectedPupper.textColor}`}>{selectedPupper.title}</h3>
              <p className="text-sm text-gray-300 text-center">{selectedPupper.description}</p>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Character Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter your character's name"
                className={`w-full px-4 py-3 bg-zinc-800 border ${selectedPupper.borderColor} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${selectedPupper.themeColor}-500 focus:border-transparent`}
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">
                This name will appear in your dashboard
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!customName.trim()}
                className={`flex-1 px-6 py-3 bg-${selectedPupper.themeColor}-600 hover:bg-${selectedPupper.themeColor}-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2`}
              >
                <FaCheck className="text-sm" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}