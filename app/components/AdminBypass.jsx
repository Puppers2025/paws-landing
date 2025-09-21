'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaKey, FaUnlock, FaLock } from 'react-icons/fa'

export default function AdminBypass() {
  const [key, setKey] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { enableAdminBypass, isAdmin, deactivateAdmin } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (enableAdminBypass(key)) {
      setShowForm(false)
      setKey('')
    } else {
      alert('Invalid admin key')
    }
  }

  const handleDeactivate = () => {
    deactivateAdmin() // This will clear admin mode without redirecting
  }

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

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="fixed top-4 right-4 z-50 bg-zinc-800 border border-red-500 rounded-lg p-2 text-white hover:bg-zinc-700 transition-colors"
        title="Admin Bypass"
      >
        <FaKey className="text-lg" />
      </button>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-red-500 rounded-lg p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <FaLock className="text-red-400" />
        <span className="text-sm font-medium">Admin Bypass</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter admin key"
          className="w-full px-3 py-2 bg-zinc-800 border border-red-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          autoFocus
        />
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
          >
            Activate
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
