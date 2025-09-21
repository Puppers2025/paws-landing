'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FaKey, FaUnlock, FaLock, FaHome, FaArrowLeft } from 'react-icons/fa'

export default function AdminBypass() {
  const [key, setKey] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [attemptedRoute, setAttemptedRoute] = useState('')
  const { enableAdminBypass, isAdmin, deactivateAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is trying to access protected route without auth
    const checkUnauthorizedAccess = () => {
      const currentPath = window.location.pathname
      const publicRoutes = ['/', '/auth/signup', '/auth/wallet', '/404']
      
      // Only show modal if not on public route AND not admin AND not already showing modal
      if (!publicRoutes.includes(currentPath) && !isAdmin && !showModal) {
        console.log('Unauthorized access detected for route:', currentPath)
        setAttemptedRoute(currentPath)
        setShowModal(true)
      }
    }

    // Only check on mount, not every time isAdmin changes
    if (!isAdmin) {
      checkUnauthorizedAccess()
    }
  }, []) // Empty dependency array - only run on mount

  // Hide modal when admin mode becomes active
  useEffect(() => {
    if (isAdmin && showModal) {
      setShowModal(false)
    }
  }, [isAdmin, showModal])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Attempting admin key:', key)
    console.log('Expected key:', process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY)
    console.log('Attempted route:', attemptedRoute)
    
    if (enableAdminBypass(key)) {
      console.log('Admin key accepted, activating admin mode')
      setShowModal(false)
      setKey('')
      
      // Redirect to the originally attempted route after a short delay
      // to ensure admin mode is fully activated
      setTimeout(() => {
        if (attemptedRoute && attemptedRoute !== window.location.pathname) {
          console.log('Redirecting to attempted route:', attemptedRoute)
          router.push(attemptedRoute)
        } else {
          console.log('Already on attempted route or no route to redirect to')
        }
      }, 100)
    } else {
      console.log('Invalid admin key provided')
      // Clear the key and show error, but don't activate admin mode
      setKey('')
      alert('Invalid admin key')
    }
  }

  const handleDeactivate = () => {
    deactivateAdmin()
    router.push('/') // Redirect to home page when deactivated
  }

  const handleGoHome = () => {
    setShowModal(false)
    router.push('/')
  }

  // Show admin indicator only when admin mode is active
  if (isAdmin) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-900 border border-green-500 rounded-lg p-3 text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FaUnlock className="text-green-400" />
            <span>Admin Mode Active</span>
          </div>
          <button
            onClick={handleDeactivate}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
            title="Deactivate Admin Mode"
          >
            Deactivate
          </button>
        </div>
      </div>
    )
  }

  // Show full-page admin modal only for unauthorized access
  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{ 
            backgroundImage: 'url("https://res.cloudinary.com/dncbk5sac/image/upload/v1758321417/paws-landing/paws-landing/backgrounds/Future9.png")', 
            opacity: 0.25 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm z-0" />

        {/* Modal Content */}
        <div className="relative z-10 bg-zinc-900 border-2 border-red-600 rounded-xl p-8 max-w-md w-full mx-4 glow-box">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-red-600 rounded-full glow-box mb-4">
              <FaLock className="text-3xl text-red-500" />
            </div>
            <h2 className="text-2xl font-primary text-white mb-2">Admin Access Required</h2>
            <p className="text-gray-300 text-sm">
              This area requires admin privileges to access.
            </p>
            {attemptedRoute && (
              <p className="text-red-400 text-xs mt-2">
                Attempted to access: {attemptedRoute}
              </p>
            )}
          </div>

          {/* Admin Key Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full px-4 py-3 bg-zinc-800 border border-red-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGoHome}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaHome className="text-sm" />
                Go Home
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FaKey className="text-sm" />
                Unlock Access
              </button>
            </div>
            
            {/* Debug Info */}
            {attemptedRoute && (
              <div className="mt-4 p-2 bg-zinc-800 rounded text-xs text-gray-400">
                <p>Attempted route: {attemptedRoute}</p>
                <p>Current route: {window.location.pathname}</p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Admin access required for development and testing
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Debug: Expected key starts with: {process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY?.slice(0, 10)}...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Don't show anything if no unauthorized access
  return null
}
