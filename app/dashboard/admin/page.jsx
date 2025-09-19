'use client'

import { useState, useEffect } from 'react'
import { FaUserSecret, FaUsers, FaChartPie, FaCoins, FaClipboardList, FaEdit, FaTrash, FaLock } from 'react-icons/fa'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getEnv } from '@/lib/env'

const dummyStats = {
  totalStakers: 1489,
  totalLogins: 9632,
  pawsSupply: 10000000,
  circulating: 6200000,
  LP: 1.2,
  POL: '56.3%',
}

const dummyMilestones = [
  { id: 1, text: 'Launch staking', status: 'Complete' },
  { id: 2, text: 'Token activation event', status: 'In Progress' },
  { id: 3, text: 'Breeding system v1', status: 'Pending' },
]

const chartData = [
  { name: 'Week 1', paws: 500000 },
  { name: 'Week 2', paws: 1000000 },
  { name: 'Week 3', paws: 1800000 },
  { name: 'Week 4', paws: 2400000 },
  { name: 'Week 5', paws: 3000000 },
]

export default function AdminPage() {
  const [milestones, setMilestones] = useState(dummyMilestones)
  const [newNote, setNewNote] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  // Check if admin panel is enabled
  useEffect(() => {
    const adminEnabled = getEnv('ENABLE_ADMIN_PANEL')
    if (!adminEnabled) {
      setIsLoading(false)
      return
    }
    
    // Check for existing session (in a real app, this would check a token)
    const session = localStorage.getItem('admin_session')
    if (session) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    
    // Basic authentication (in production, use proper auth)
    const adminEmail = getEnv('ADMIN_EMAIL')
    if (loginData.email === adminEmail && loginData.password === 'admin123') {
      setIsAuthenticated(true)
      localStorage.setItem('admin_session', 'true')
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_session')
    setLoginData({ email: '', password: '' })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show disabled message if admin panel is not enabled
  if (!getEnv('ENABLE_ADMIN_PANEL')) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <FaLock className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Admin Panel Disabled</h1>
          <p className="text-gray-400">The admin panel is currently disabled.</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 border border-red-600 rounded-xl p-6">
            <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <FaLock className="text-red-500" />
              Admin Login
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 bg-zinc-800 rounded-md text-sm border border-red-600"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 bg-zinc-800 rounded-md text-sm border border-red-600"
                  required
                />
              </div>
              
              {loginError && (
                <p className="text-red-400 text-sm">{loginError}</p>
              )}
              
              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-md font-button transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    if (newNote.trim()) {
      setMilestones([...milestones, { id: Date.now(), text: newNote, status: 'Pending' }])
      setNewNote('')
    }
  }

  const handleDelete = (id) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-primary flex items-center gap-2">
          <FaUserSecret className="text-red-500" /> Dev Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-button transition flex items-center gap-2"
        >
          <FaLock className="text-sm" />
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatBox label="Total Stakers" value={dummyStats.totalStakers} Icon={FaUsers} />
        <StatBox label="Total Logins" value={dummyStats.totalLogins} Icon={FaClipboardList} />
        <StatBox label="$PAWS Supply" value={dummyStats.pawsSupply.toLocaleString()} Icon={FaCoins} />
        <StatBox label="Circulating" value={dummyStats.circulating.toLocaleString()} Icon={FaCoins} />
        <StatBox label="LP Ratio" value={`${dummyStats.LP}x`} Icon={FaChartPie} />
        <StatBox label="POL Coverage" value={dummyStats.POL} Icon={FaChartPie} />
      </div>

      {/* Chart */}
      <div className="bg-zinc-900 border border-red-600 rounded-xl p-4 mb-8">
        <h2 className="font-button text-lg mb-4 text-red-400">Circulating Supply Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPaws" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#f87171" />
            <YAxis stroke="#f87171" />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Tooltip />
            <Area type="monotone" dataKey="paws" stroke="#facc15" fillOpacity={1} fill="url(#colorPaws)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Notes + Milestones */}
      <div className="bg-zinc-900 border border-red-600 rounded-xl p-4">
        <h2 className="font-button text-lg mb-4 text-red-400">Milestones & Notes</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="w-full p-2 rounded-md bg-zinc-800 text-white border border-red-600"
            placeholder="Add new milestone or note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-400"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {milestones.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between bg-zinc-800 px-4 py-2 rounded-md border border-red-600"
            >
              <span className="text-white">{m.text} <span className="text-sm text-gray-400">({m.status})</span></span>
              <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-white">
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatBox({ label, value, Icon }) {
  return (
    <div className="bg-zinc-900 border border-red-600 rounded-xl p-4 flex items-center gap-4">
      <div className="text-red-500 text-2xl">
        <Icon />
      </div>
      <div>
        <div className="font-button text-sm text-gray-400">{label}</div>
        <div className="text-lg font-bold text-yellow-400">{value}</div>
      </div>
    </div>
  )
}