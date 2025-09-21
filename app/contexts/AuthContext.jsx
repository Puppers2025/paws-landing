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
      // Check for admin bypass (localStorage and cookie)
      const adminKey = localStorage.getItem('admin-bypass')
      const adminCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-bypass='))
        ?.split('=')[1]
      
      if ((adminKey && adminKey === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY) ||
          (adminCookie && adminCookie === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY)) {
        console.log('Valid admin key found, activating admin mode')
        setIsAdmin(true)
        setUser({ isAdmin: true, walletAddress: 'admin' })
        setIsLoading(false)
        return
      } else if (adminKey || adminCookie) {
        console.log('Invalid admin key found, clearing it')
        localStorage.removeItem('admin-bypass')
        document.cookie = 'admin-bypass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
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
    console.log('enableAdminBypass called with key:', key)
    console.log('Expected key:', process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY)
    console.log('Keys match:', key === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY)
    
    if (key === process.env.NEXT_PUBLIC_ADMIN_BYPASS_KEY) {
      console.log('Admin key is valid, setting admin mode')
      localStorage.setItem('admin-bypass', key)
      // Set cookie for middleware
      document.cookie = `admin-bypass=${key}; path=/; max-age=86400` // 24 hours
      setIsAdmin(true)
      setUser({ isAdmin: true, walletAddress: 'admin' })
      return true
    }
    console.log('Admin key is invalid, not setting admin mode')
    return false
  }

  const deactivateAdmin = () => {
    setIsAdmin(false)
    setUser(null)
    localStorage.removeItem('admin-bypass')
    // Clear admin bypass cookie
    document.cookie = 'admin-bypass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    // Will redirect via component
  }

  const value = {
    user,
    isLoading,
    isAdmin,
    login,
    logout,
    enableAdminBypass,
    deactivateAdmin,
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
