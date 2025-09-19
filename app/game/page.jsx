'use client'

import { useEffect, useRef, useState } from 'react'
import useGameState from './hooks/useGameState'
import useGameCollision, {
  killedRef,
  resetKilledRef,
  resetMissedRef
} from './hooks/useGameCollision'
import { FaRedo, FaHome } from 'react-icons/fa'

export default function GamePage() {
  const [showGame, setShowGame] = useState(false)
  const [vortexAnim, setVortexAnim] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [killCount, setKillCount] = useState(0)
  const [streakFlash, setStreakFlash] = useState(false)

  const lastMoveTimeRef = useRef(Date.now()) // 🟩 track activity

  const {
    cleanliness,
    setCleanliness,
    streak,
    setStreak,
    dogz,
    setDogz,
    boostCooldown,
    characterX,
    bullets,
    setBullets,
    moveLeft,
    moveRight,
    shootBullet,
    handleBoost,
    activePowerups,
    activatePowerup,
  } = useGameState()

  const dogzRef = useRef(dogz)
  useEffect(() => {
    dogzRef.current = dogz
  }, [dogz])

  useEffect(() => {
    if (dogz <= 0) {
      setGameOver(true)
    }
  }, [dogz])

  const lastKillCountRef = useRef(0)

  const { items, powerups } = useGameCollision({
    characterX,
    bullets,
    setBullets,
    dogz,
    dogzRef,
    setDogz,
    onCollision: (item) => {
      if (item.type === 'bone') return
      setStreak(0)
      setKillCount(0)
    },
    onBulletHit: (item, bullet) => {},
    onEnemyKilled: () => {
      setKillCount((prev) => {
        const newCount = prev + 1
        if (newCount % 5 === 0 && newCount !== lastKillCountRef.current) {
          setStreak((prev) => prev + 1)
          lastKillCountRef.current = newCount
          setStreakFlash(true)
        }
        return newCount
      })
    },
    onPowerupCollected: (powerup) => {
      if (powerup.type === 'boost') {
        setCleanliness((prev) => Math.min(prev + 15, 100))
      } else {
        activatePowerup(powerup.type)
      }
    },
    setGameOver,
    killedRef,
    lastMoveTime: lastMoveTimeRef.current,
  })

  useEffect(() => {
    if (streakFlash) {
      const timer = setTimeout(() => setStreakFlash(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [streakFlash])

  useEffect(() => {
    const timer = setTimeout(() => {
      resetKilledRef()
      resetMissedRef()
      lastMoveTimeRef.current = Date.now() // ✅ reset on game start
      setVortexAnim(false)
      setShowGame(true)
      setStreak(0)
      setKillCount(0)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (gameOver) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameOver])


  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {vortexAnim && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black">
          <img src="/images/vortex.png" alt="Vortex" className="w-full h-full object-cover animate-spinFast" />
        </div>
      )}

      <div className="absolute bottom-2 left-2 z-50 text-xs bg-black bg-opacity-50 text-white p-2 rounded shadow-md font-mono">
        <div>🎯 Kills: {killCount}</div>
        <div>🔥 Streak: {streak}</div>
        <div>🐾 Killed IDs: {killedRef.current.size}</div>
      </div>

      {showGame && (
        <div
          className="relative z-10 flex flex-col items-center justify-between min-h-screen py-8 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/background-city.png)' }}
        >
          <div className="w-full px-6 flex justify-between text-yellow-400 font-button text-sm">
            <span>🧼 CLEAN: {cleanliness}%</span>
            <span className={`transition-all duration-500 font-bold ${
              streakFlash
                ? 'text-yellow-300 text-xl scale-125 drop-shadow-[0_0_6px_rgba(255,204,0,0.8)]'
                : 'text-orange-400 text-sm'
            }`}>
              🔥 STREAK: {streak}x
            </span>
            <span>🌭 DOGZ: {dogz}</span>
          </div>

          {/* Enemies */}
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`}
              className="absolute transition-transform duration-150 ease-in-out"
              style={{
                top: `${item.top}px`,
                left: `${item.left + (item.knockback || 0)}px`,
                transform: `translateX(-50%) scale(${item.scale})`,
              }}>
              <div className="w-12 h-1 bg-red-800 mb-1 rounded">
                <div className="h-full bg-green-500 rounded"
                  style={{ width: `${(item.health / item.maxHealth) * 100}%` }} />
              </div>
              <img
                src={
                  item.type.startsWith('zombie')
                    ? `/images/${item.type}_${item.frameIndex + 1}.png`
                    : `/images/${item.type}.png`
                }
                alt={item.type}
                className={`w-12 h-auto ${item.wasHit ? 'brightness-125 scale-110' : ''}`}
              />
            </div>
          ))}

          {/* Powerups */}
          {powerups.map((powerup) => (
            <img key={powerup.id}
              src={`/images/powerup-${powerup.type}.png`}
              alt={powerup.type}
              className="absolute w-10 h-auto drop-shadow-lg"
              style={{
                top: `${powerup.top}px`,
                left: `${powerup.left}px`,
                transform: 'translateX(-50%)',
              }}
            />
          ))}

          {/* Bullets */}
          {bullets.map((b) => (
            <div key={b.id}
              className={`absolute z-30 rounded-full ${activePowerups?.bulletBoost ? 'w-3 h-8 bg-red-400' : 'w-2 h-6 bg-yellow-400'}`}
              style={{
                top: `${b.top}px`,
                left: '50%',
                transform: `translateX(${b.offsetX}px)`,
              }}
            />
          ))}

          {/* Character */}
          <div
            className="absolute left-1/2 bottom-20 pointer-events-none"
            style={{ transform: `translateX(${characterX}px)` }}
          >
            {activePowerups?.shield && (
              <div className="absolute -top-1 -left-1 w-14 h-14 border-4 border-blue-300 rounded-full animate-pulse blur-sm" />
            )}
            <img src="/images/poodle.jpg" alt="Pupper" className="w-12 h-auto drop-shadow-xl" />
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-center text-white">
          <h1 className="text-3xl font-bold text-yellow-400">💀 GAME OVER</h1>
          <p className="text-lg">Returning in {countdown} seconds...</p>
          <div className="flex space-x-4 pt-2">
            <button onClick={() => window.location.reload()} className="bg-yellow-500 p-3 rounded-full">
              <FaRedo className="text-black" />
            </button>
            <button onClick={() => (window.location.href = '/') } className="bg-yellow-500 p-3 rounded-full">
              <FaHome className="text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}