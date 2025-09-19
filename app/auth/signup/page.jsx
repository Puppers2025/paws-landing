'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaTwitter, FaTelegramPlane, FaDiscord, FaShoppingBag } from 'react-icons/fa'
import { InputValidator } from '../../lib/security'

export default function AuthTabs() {
  const [tab, setTab] = useState('signin')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate username
    if (tab === 'signup') {
      const usernameValidation = InputValidator.validateUsername(formData.username)
      if (!usernameValidation.isValid) {
        newErrors.username = usernameValidation.error
      }
    }
    
    // Validate email
    const emailValidation = InputValidator.validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error
    }
    
    // Validate password
    if (tab === 'signup') {
      const passwordValidation = InputValidator.validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.error
      }
      
      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Here you would typically send the data to your API
      console.log('Form data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect based on tab
      if (tab === 'signin') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/pages/get-started'
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 overflow-hidden">
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("/images/Future9.png")', opacity: 0.25 }}
      />

      {/* ✅ Blur Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm z-0" />

      {/* ✅ Auth Box */}
      <div className="relative z-10 w-full max-w-md p-6 bg-zinc-900 border border-red-600 rounded-xl shadow-lg glow-box">
        {/* Tabs */}
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 py-2 font-button transition-colors ${
              tab === 'signin' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'
            }`}
            onClick={() => setTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`w-1/2 py-2 font-button transition-colors ${
              tab === 'signup' ? 'text-white border-b-2 border-red-500' : 'text-gray-400'
            }`}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {tab === 'signin' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.email ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.password ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              
              {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-button"
              >
                {isSubmitting ? 'Signing In...' : 'Continue Journey'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.username ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
              </div>
              
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.email ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.password ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full p-3 bg-zinc-800 rounded-md text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-transparent'
                  }`}
                  required
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              
              {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-button transition"
              >
                {isSubmitting ? 'Creating Account...' : 'Start Life'}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* ✅ Social Icons */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <div className="grid grid-cols-4 gap-6 text-red-500">
          {[
            { icon: <FaTwitter />, href: 'https://x.com' },
            { icon: <FaTelegramPlane />, href: 'https://t.me' },
            { icon: <FaDiscord />, href: 'https://discord.com' },
            { icon: <FaShoppingBag />, href: 'https://magiceden.io' },
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