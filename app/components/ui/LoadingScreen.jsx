// components/ui/LoadingScreen.tsx
'use client'

export default function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
      <img
        src="/images/loading-pupper2.png"
        alt="Loading..."
        className="w-32 h-32 animate-pulse"
      />
    </div>
  )
}