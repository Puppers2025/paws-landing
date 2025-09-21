'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, requireAuth = true }) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth) {
      if (!user && !isAdmin) {
        console.log('🚫 Unauthorized access attempt, redirecting to signup')
        router.push('/auth/signup')
      }
    }
  }, [user, isLoading, isAdmin, requireAuth, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !user && !isAdmin) {
    return null // Will redirect via useEffect
  }

  return children
}
