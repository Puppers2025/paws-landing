'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionTimeout } from '../hooks/useSessionTimeout'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  
  // Initialize session timeout
  useSessionTimeout()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check for admin bypass
      const adminKey = localStorage.getItem('admin-bypass')
      if (adminKey === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY) {
        setIsAdmin(true)
        setUser({ isAdmin: true, walletAddress: 'admin' })
        setIsLoading(false)
        return
      }

      // Check for auth token
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token and get user data
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Invalid token, clear it
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    localStorage.removeItem('admin-bypass')
    router.push('/auth/signup')
  }

  const enableAdminBypass = (key) => {
    if (key === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY) {
      localStorage.setItem('admin-bypass', key)
      setIsAdmin(true)
      setUser({ isAdmin: true, walletAddress: 'admin' })
      return true
    }
    return false
  }

  const value = {
    user,
    isLoading,
    isAdmin,
    login,
    logout,
    enableAdminBypass,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
