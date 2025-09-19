import { useState, useEffect, useRef } from 'react'

export default function useGameState() {
  const [cleanliness, setCleanliness] = useState(87)
  const [streak, setStreak] = useState(5)
  const [dogz, setDogz] = useState(3)
  const dogzRef = useRef(dogz)
  const [boostCooldown, setBoostCooldown] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())

  const [characterX, setCharacterX] = useState(0)
  const [bullets, setBullets] = useState([])

  // 🟨 Active powerups (e.g., bulletBoost, shield)
  const [activePowerups, setActivePowerups] = useState({
    bulletBoost: false,
    shield: false,
  })

  // 🔋 Activate timed powerups
  const activatePowerup = (type, duration = 8000) => {
    setActivePowerups((prev) => ({ ...prev, [type]: true }))
    setTimeout(() => {
      setActivePowerups((prev) => ({ ...prev, [type]: false }))
    }, duration)
  }

  useEffect(() => {
    dogzRef.current = dogz
  }, [dogz])

  useEffect(() => {
    if (boostCooldown) {
      const timer = setTimeout(() => setBoostCooldown(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [boostCooldown])

  // 🚀 Bullet movement
  useEffect(() => {
    let animationFrameId

    const updateBullets = () => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, top: b.top - 10 }))
          .filter((b) => b.top > -50)
      )
      animationFrameId = requestAnimationFrame(updateBullets)
    }

    animationFrameId = requestAnimationFrame(updateBullets)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // ⬅️ ➡️ Responsive Movement (75% width range)
  const moveLeft = () => {
    const minX = -(window.innerWidth * 0.375)
    setCharacterX((prev) => Math.max(prev - 30, minX))
    setLastMoveTime(Date.now()) // ⏱️ updated here
  }
  
  const moveRight = () => {
    const maxX = window.innerWidth * 0.375
    setCharacterX((prev) => Math.min(prev + 30, maxX))
    setLastMoveTime(Date.now()) // ⏱️ updated here
  }

  // 🔫 Shoot (powered)
  const bulletIdRef = useRef(0)

  const shootBullet = () => {
    const id = bulletIdRef.current++
    setBullets((prev) => [
      ...prev,
      {
        id,
        offsetX: characterX,
        top: window.innerHeight - 120,
        damage: activePowerups.bulletBoost ? 3 : 1,
        knockback: activePowerups.bulletBoost ? 15 : 5,
      },
    ])
  }

  const reduceDogLife = () => {
    setDogz((prev) => Math.max(prev - 1, 0))
  }

  const handleBoost = () => {
    if (boostCooldown) return
    setBoostCooldown(true)
    setCleanliness((prev) => Math.min(prev + 10, 100))
  }

  // 🎮 Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'a' || e.key === 'ArrowLeft') moveLeft()
      if (key === 'd' || e.key === 'ArrowRight') moveRight()
      if (key === 'w' || e.key === ' ' || e.key === 'ArrowUp') shootBullet()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [characterX])

  return {
    cleanliness,
    setCleanliness,
    streak,
    setStreak,
    dogz,
    setDogz,
    dogzRef,
    boostCooldown,
    characterX,
    bullets,
    setBullets,
    moveLeft,
    moveRight,
    lastMoveTime,
    shootBullet,
    handleBoost,
    reduceDogLife,
    gameOver,
    setGameOver,
    activePowerups,
    activatePowerup,
  }
}