'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FaHome,
  FaSignInAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaLock,
} from 'react-icons/fa'

export default function Custom404() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-10 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ 
          backgroundImage: 'url("https://res.cloudinary.com/dncbk5sac/image/upload/v1758321417/paws-landing/paws-landing/backgrounds/Future9.png")', 
          opacity: 0.25 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 border-4 border-red-600 rounded-full glow-box">
            <FaExclamationTriangle className="text-6xl text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-primary mb-4 text-red-500">404</h1>
        <h2 className="text-3xl font-primary mb-6">Access Denied</h2>
        
        <div className="bg-zinc-900 border border-red-600 rounded-xl p-8 mb-8 glow-box max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <FaLock className="text-2xl text-red-500 mr-3" />
            <h3 className="text-xl font-primary">Authentication Required</h3>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            This area requires authentication. Please sign in or create an account to access the full experience.
          </p>

          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-300">
              <strong>Security Notice:</strong> All protected routes require valid authentication. 
              Your session may have expired or you may not have the necessary permissions.
            </p>
          </div>

          {/* Auto-redirect countdown */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm">
              Redirecting to homepage in <span className="text-red-500 font-bold text-lg">{countdown}</span> seconds...
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-medium glow-box hover:scale-105"
          >
            <FaHome className="text-xl" />
            Go to Homepage
          </Link>
          
          <Link
            href="/auth/signup"
            className="flex items-center gap-3 px-8 py-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all duration-300 font-medium border border-red-600 hover:border-red-500"
          >
            <FaSignInAlt className="text-xl" />
            Sign In / Sign Up
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mx-auto"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>
        </div>
      </div>

      {/* Security Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-gray-500">
          Protected by authentication middleware • Session timeout: 30 minutes
        </p>
      </div>
    </div>
  )
}
