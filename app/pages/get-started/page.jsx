'use client'

import Link from 'next/link'
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
} from 'react-icons/fa'

const puppers = [
  {
    name: 'Bolt',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425730/paws-landing/paws-landing/puppers/bolt.jpg',
    title: 'Speed Demon',
    description: 'This pupper craves fast-paced challenges and reflex-driven games.',
    icon: <FaBolt className="text-red-500 text-3xl" />,
  },
  {
    name: 'Luna',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425731/paws-landing/paws-landing/puppers/luna.jpg',
    title: 'Mystic Wanderer',
    description: 'Explore deep lore and hidden truths through her spiritual path.',
    icon: <FaMapMarkedAlt className="text-red-500 text-3xl" />,
  },
  {
    name: 'Maxx',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425743/paws-landing/paws-landing/puppers/maxx.jpg',
    title: 'Battle Born',
    description: 'Gear up for tactical duels and intense arena clashes.',
    icon: <FaCogs className="text-red-500 text-3xl" />,
  },
  {
    name: 'Nova',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425744/paws-landing/paws-landing/puppers/nova.jpg',
    title: 'Galactic Scout',
    description: 'Blast off into exploration mode and interdimensional discovery.',
    icon: <FaRocket className="text-red-500 text-3xl" />,
  },
  {
    name: 'Zeek',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425746/paws-landing/paws-landing/puppers/zeek.jpg',
    title: 'Loyal Healer',
    description: 'Support your squad with compassion and powerful restoration.',
    icon: <FaHeartbeat className="text-red-500 text-3xl" />,
  },
  {
    name: 'Rexx',
    image: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758425747/paws-landing/paws-landing/puppers/rexx.jpg',
    title: 'Alpha Tracker',
    description: 'Lead your pack through quests and dominate the leaderboard.',
    icon: <FaPaw className="text-red-500 text-3xl" />,
  },
]

export default function GetStarted() {
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
                className="bg-zinc-900 border border-red-600 rounded-xl p-6 shadow-lg flex flex-col items-center text-center glow-box"
              >
                <Link href="/dashboard">
                  <img
                    src={pup.image}
                    alt={pup.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-red-500 cursor-pointer hover:scale-105 transition-transform"
                  />
                </Link>
                <h2 className="text-xl font-primary mb-2">{pup.name}</h2>
                <div className="mt-4">
                  <h3 className="text-lg font-button mb-1">{pup.title}</h3>
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
    </div>
  )
}