'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const IDLE_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes warning before timeout

export function useSessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef(null)
  const warningTimeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  const resetTimeout = () => {
    lastActivityRef.current = Date.now()
    
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }

    // Set warning timeout (5 minutes before full timeout)
    warningTimeoutRef.current = setTimeout(() => {
      console.log('⚠️ Session warning: 5 minutes until timeout')
      // You could show a warning modal here if needed
    }, IDLE_TIMEOUT - WARNING_TIME)

    // Set full timeout
    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Session expired due to inactivity')
      // Clear auth token
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // Redirect to 404 page
      router.push('/404')
    }, IDLE_TIMEOUT)
  }

  const handleActivity = () => {
    resetTimeout()
  }

  useEffect(() => {
    // Set up activity listeners
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial timeout setup
    resetTimeout()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }, [router])

  return {
    resetTimeout,
    lastActivity: lastActivityRef.current
  }
}
