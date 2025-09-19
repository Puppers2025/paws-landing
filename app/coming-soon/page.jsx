'use client'

import Link from 'next/link'

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="font-title text-4xl sm:text-5xl text-yellow-400 mb-4">🚧 Coming Soon</h1>
      <p className="font-button text-center text-lg sm:text-xl text-gray-300 max-w-xl">
        We’re building something amazing behind the scenes. Check back soon for the next evolution of Puppers.
      </p>

      <Link href="/dashboard">
        <div className="mt-8 border border-red-600 p-4 rounded-lg shadow-md hover:bg-zinc-800 transition cursor-pointer">
          <span className="text-sm text-red-500 font-mono">← Back to Dashboard</span>
        </div>
      </Link>
    </div>
  )
}