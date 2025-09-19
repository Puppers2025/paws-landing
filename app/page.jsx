'use client'

import { useRouter } from 'next/navigation'  // ← NEW
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTwitter, FaTelegramPlane, FaDiscord, FaShoppingBag } from 'react-icons/fa'
import Image from 'next/image'

export default function Home() {
  const [showText, setShowText] = useState(false)
  const router = useRouter() // ← NEW

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden text-white"
      style={{
        backgroundImage: 'url("/images/Future9.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      {/* Dark overlay with opacity */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Debug: Test if image loads */}
      <img 
        src="/images/Future9-backup.png" 
        alt="Debug" 
        className="absolute top-4 right-4 w-16 h-16 opacity-50 z-50"
        onLoad={() => console.log('Image loaded successfully')}
        onError={() => console.log('Image failed to load')}
      />
      
      {/* Debug: Test with data URL */}
      <div 
        className="absolute top-4 left-4 w-16 h-16 bg-red-500 z-50"
        style={{
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmVkIi8+PC9zdmc+")',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Debug: Test with Next.js Image */}
      <div className="absolute top-20 right-4 w-16 h-16 z-50">
        <Image
          src="/images/Future9-backup.png"
          alt="Next.js Image Test"
          width={64}
          height={64}
          className="opacity-50"
          onLoad={() => console.log('Next.js Image loaded successfully')}
          onError={() => console.log('Next.js Image failed to load')}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-6">
                Who Let The Dogs Out..
              </h1>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5, duration: 2.0 }}
                className="relative px-8 py-3 font-semibold text-red-400 rounded-md overflow-hidden group border-2 border-red-600 glow-pulse flicker button-hover-glow"
                onClick={() => router.push('/auth/signup')} // ← GO TO SIGNUP PAGE
              >
                <span className="absolute inset-0 border-2 border-red-500 z-0 border-repair pointer-events-none" />
                <span className="font-button relative z-10 group-hover:text-white transition duration-300">
                  Continue
                </span>
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition duration-300 z-0" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Social Icons */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="grid grid-cols-4 gap-6 text-red-500">
          {[
            { icon: <FaTwitter />, href: 'https://x.com/BreedPuppers' },
            { icon: <FaTelegramPlane />, href: '#' },
            { icon: <FaDiscord />, href: 'https://discord.com/invite/EbxDQVBkzM' },
            { icon: <FaShoppingBag />, href: 'https://magiceden.us/collections/apechain/0x942e4b97b9bad206b2e1333be7747fd27eaaab6c' }
          ].map(({ icon, href }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl p-4 border-2 border-red-600 rounded-full neon-shadow repair-icon transition-all duration-500 hover:text-white hover:scale-110 hover:shadow-red-500/70"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}