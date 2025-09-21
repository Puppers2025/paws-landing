'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FaPaw,
  FaCompass,
  FaCogs,
  FaLock,
  FaWallet,
  FaComments,
  FaHome,
  FaTwitter,
  FaTelegramPlane,
  FaDiscord,
  FaShoppingBag,
  FaSignOutAlt,
} from 'react-icons/fa'

import { useOverviewModals } from '@/components/overview/hooks/overviewModals'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

function DashboardContent() {
  const { user, logout } = useAuth()
  const [selectedPupper, setSelectedPupper] = useState(null)
  
  const {
    openShop,
    openEnergy,
    openStaking,
    openDna,
    openMission,
    shopModal,
    energyModal,
    stakingModal,
    dnaModal,
    missionModal,
  } = useOverviewModals()

  useEffect(() => {
    // Load selected pupper from localStorage
    const pupperData = localStorage.getItem('selectedPupper')
    if (pupperData) {
      setSelectedPupper(JSON.parse(pupperData))
    }
  }, [])

  // Default theme colors if no character selected
  const themeColors = selectedPupper ? {
    borderColor: selectedPupper.borderColor || 'border-red-500',
    textColor: selectedPupper.textColor || 'text-red-500',
    bgColor: selectedPupper.bgColor || 'bg-red-500/10',
    glowColor: selectedPupper.glowColor || 'shadow-red-500/50',
    themeColor: selectedPupper.themeColor || 'red'
  } : {
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    glowColor: 'shadow-red-500/50',
    themeColor: 'red'
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Status Bar */}
      <div className={`w-full fixed top-0 left-0 right-0 bg-zinc-900 border-b ${themeColors.borderColor} z-30 px-4 py-3 flex justify-between items-center shadow-md`}>
        <div className="font-button text-sm sm:text-base">
          👤 Name: <span className={themeColors.textColor}>
            {selectedPupper?.customName || user?.username || 'Pupper001'}
          </span>
        </div>
        <div className="font-button text-sm sm:text-base">
          ⭐ Level: {user?.level || 1} → {user?.level ? user.level + 1 : 2}
        </div>
        <div className="font-button text-sm sm:text-base text-yellow-400">$PAWS: 1,250</div>
        <div className="font-button text-sm sm:text-base">
          Wallet: {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : '0xABC...123'}
        </div>
        <div className="flex items-center gap-2">
          <div className="font-button text-sm sm:text-base bg-zinc-800 px-2 py-1 rounded-md">Global Chat</div>
          <button
            onClick={logout}
            className={`${themeColors.textColor} hover:text-white transition-colors p-1`}
            title="Sign Out"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        </div>
      </div>

      <div className="flex pt-16 pb-20 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-zinc-900 border-r ${themeColors.borderColor} p-6 flex flex-col justify-between`}>
          <div>
            <img
              src={selectedPupper?.image || "/images/bolt.jpg"}
              alt="Profile"
              className={`w-24 h-24 rounded-full mx-auto border-4 ${themeColors.borderColor} mb-6`}
            />
            <nav className="space-y-4">
              {[
                { label: 'Home', icon: <FaHome />, href: '/' },
                { label: 'Profile', icon: <FaCompass />, href: '/coming-soon' },
                { label: 'Upgrades', icon: <FaCogs />, href: '/coming-soon' },
                { label: 'Stats', icon: <FaLock />, href: '/coming-soon' },
                { label: 'Wallet', icon: <FaWallet />, href: '/coming-soon' },
                { label: 'Community', icon: <FaComments />, href: '/coming-soon' },
                { label: 'Staking', icon: <FaPaw />, href: '/staking' },
              ].map(({ label, icon, href }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className="w-full flex items-center gap-3 text-left py-2 px-3 rounded-md hover:bg-zinc-800 transition"
                >
                  <span className={themeColors.textColor}>{icon}</span>
                  <span className="font-button text-sm">{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Icons */}
          <div className={`grid grid-cols-4 gap-4 mt-10 ${themeColors.textColor}`}>
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
                  className={`text-2xl p-2 border ${themeColors.borderColor} rounded-full neon-shadow transition hover:text-white hover:scale-110`}
                >
                  <Icon />
                </a>
              ))}
          </div>
        </aside>

        {/* Main Stats Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-primary mb-6">High-Level Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`bg-zinc-900 border ${themeColors.borderColor} rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition`}
              onClick={openStaking}
            >
              <h3 className={`font-button text-lg mb-2 ${themeColors.textColor}`}>Staking</h3>
              <p className="text-sm text-gray-300">You have 3 Puppers staked. 180 $PAWS/day earned.</p>
            </div>

            <div
              className={`bg-zinc-900 border ${themeColors.borderColor} rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition`}
              onClick={openDna}
            >
              <h3 className={`font-button text-lg mb-2 ${themeColors.textColor}`}>DNA Level</h3>
              <p className="text-sm text-gray-300">Current DNA Tier: 2 - Evolving to Tier 3 in 4 days.</p>
            </div>

            <div
              className={`bg-zinc-900 border ${themeColors.borderColor} rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition`}
              onClick={openMission}
            >
              <h3 className={`font-button text-lg mb-2 ${themeColors.textColor}`}>Mission Progress</h3>
              <p className="text-sm text-gray-300">2 of 5 Journey milestones completed.</p>
            </div>

            <div
              className={`bg-zinc-900 border ${themeColors.borderColor} rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition`}
              onClick={openEnergy}
            >
              <h3 className={`font-button text-lg mb-2 ${themeColors.textColor}`}>Energy</h3>
              <p className="text-sm text-gray-300">Energy Level: 72% — Rest recommended soon.</p>
            </div>

            <div
              className={`bg-zinc-900 border ${themeColors.borderColor} rounded-xl p-4 cursor-pointer hover:border-yellow-500 transition`}
              onClick={openShop}
            >
              <h3 className={`font-button text-lg mb-2 ${themeColors.textColor}`}>Shop</h3>
              <p className="text-sm text-gray-300">Tap to explore $PAWS shop deals.</p>
            </div>

            {/* Render centralized modals */}
            {shopModal}
            {energyModal}
            {stakingModal}
            {dnaModal}
            {missionModal}
          </div>
        </main>
      </div>

        {/* Bottom Menu */}
        <nav className={`fixed bottom-0 left-0 right-0 bg-zinc-900 border-t ${themeColors.borderColor} px-4 py-2 z-30`}>
          <div className={`flex justify-between items-center border ${themeColors.borderColor} rounded-xl overflow-hidden`}>
          {[
            { icon: FaHome, href: '/coming-soon', highlight: false },
            { icon: FaLock, href: '/coming-soon', highlight: false },
            { icon: FaPaw, href: '/puppyworld', highlight: true },
            { icon: FaCompass, href: '/coming-soon', highlight: false },
            { icon: FaCogs, href: '/coming-soon', highlight: false },
            ].map(({ icon: Icon, href, highlight }, idx) => (
              <Link
                key={idx}
                href={href}
                className={`flex-1 flex justify-center items-center p-3 hover:bg-zinc-800 transition ${
                  idx < 4 ? `${themeColors.borderColor} border-r` : ''
                }`}
              >
                <Icon
                  className={`text-2xl hover:text-white transition ${
                    highlight ? 'text-yellow-400' : themeColors.textColor
                  }`}
                />
              </Link>
            ))}
        </div>
      </nav>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}