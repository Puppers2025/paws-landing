'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function PuppyWorld() {
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedChar, setSelectedChar] = useState(null)
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()

  // Simulate loading screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // Show character select modal after 3 seconds
  useEffect(() => {
    if (!loading) {
      const modalTimer = setTimeout(() => setShowModal(true), 3000)
      return () => clearTimeout(modalTimer)
    }
  }, [loading])

  // Handle game start transition
  const handleStartGame = () => {
    setFadeOut(true)
    setTimeout(() => router.push('/game'), 600)
  }

  if (loading) return <LoadingScreen />

  return (
    <div
      className={`min-h-screen text-white flex flex-col relative overflow-hidden transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* ☁️ Floating cloud layer */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-contain animate-float z-0"
        style={{
          backgroundImage: 'url(/images/loading-pupper2.png)',
          backgroundSize: '80%',
        }}
      />

      {/* 🔥 Overlay dim */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* 🧬 Modal */}
      {showModal && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 bg-black/70 animate-fadeIn">
            <div className="relative bg-zinc-900 bg-opacity-90 border border-yellow-500 rounded-2xl p-4 max-w-4xl w-full">

            {/* ❌ Close Button */}
            <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-yellow-400 hover:text-yellow-200 text-xl font-bold"
                aria-label="Close"
            >
                &times;
            </button>

            <h2 className="text-center text-xl font-bold text-yellow-400 mb-4 font-button">
                SELECT YOUR PUP
            </h2>

            {/* Pup Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                    key={num}
                    onClick={() => setSelectedChar(num)}
                    className={`bg-zinc-800 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedChar === num
                        ? 'border-yellow-400 ring-2 ring-yellow-300'
                        : 'border-zinc-700 hover:border-yellow-400'
                    }`}
                >
                    <img
                    src={`/images/char${num}.png`}
                    alt={`Char ${num}`}
                    className="w-full h-auto rounded-md"
                    />
                </div>
                ))}
            </div>

            {/* RUN Button */}
            <div className="text-center">
                <button
                onClick={handleStartGame}
                disabled={!selectedChar}
                className={`inline-block font-button py-2 px-6 rounded-xl text-sm transition ${
                    selectedChar
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 animate-pulse'
                    : 'bg-zinc-600 text-gray-400 cursor-not-allowed'
                }`}
                >
                RUN
                </button>
            </div>
            </div>
        </div>
        )}

      {/* HUD */}
      <div className="absolute top-0 w-full px-4 py-3 flex justify-between items-center z-20">
        <div className="flex gap-3 font-button text-sm">
          <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-400">🔑 7</span>
          <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-400">💰 1,601</span>
          <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-400">🌭 3</span>
        </div>
        <div className="text-yellow-300 text-xl">⭐ x2</div>
      </div>

      {/* Background Pupper */}
      <div className="flex-1 flex items-center justify-center relative z-10 opacity-20">
        <img src="/images/Gold3.png" alt="Puppy Character" className="w-44 h-auto" />
      </div>

      {/* Bottom Nav */}
      <div className="w-full bg-zinc-900 border-t border-yellow-600 py-4 px-6 flex justify-around items-end z-20">
        {[
          { label: 'MISSIONS', notif: 11 },
          { label: 'ME', notif: 0 },
          { label: 'SHOP', notif: 2 },
          { label: 'EVENTS', locked: true },
        ].map(({ label, notif, locked }, idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            {notif > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notif}
              </span>
            )}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                locked ? 'bg-zinc-700 opacity-50' : 'bg-zinc-800'
              } border-2 ${locked ? 'border-zinc-700' : 'border-yellow-500'}`}
            >
              <span className="font-button text-sm text-yellow-400">{label[0]}</span>
            </div>
            <span className="text-xs mt-1 font-button">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}