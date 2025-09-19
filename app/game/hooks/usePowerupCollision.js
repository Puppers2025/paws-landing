import { useEffect, useState } from 'react'
import handlePowerupCollisions from '@/game/hooks/collisions/handlePowerupCollisions'

export default function usePowerupCollision({
  characterX,
  onPowerupCollected,
}) {
  const [powerups, setPowerups] = useState([])

  // 🪂 Spawn powerups randomly every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now()
      const rand = Math.random()
      let type = 'boost'

      if (rand < 0.33) type = 'bulletBoost'
      else if (rand < 0.66) type = 'shield'

      // 🔄 Restrict spawn to 75% screen range
      const spawnRange = window.innerWidth * 0.75
      const spawnCenter = window.innerWidth / 2
      const spawnOffset = spawnCenter - spawnRange / 2
      const left = spawnOffset + Math.random() * spawnRange

      const newPowerup = {
        id,
        type,
        left,
        top: -50,
      }

      setPowerups((prev) => [...prev, newPowerup])
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  // ⬇️ Move down screen
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerups((prev) =>
        prev
          .map((p) => ({ ...p, top: p.top + 3 }))
          .filter((p) => p.top < window.innerHeight + 50)
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // 🧲 Handle collisions
  useEffect(() => {
    setPowerups((prev) =>
      handlePowerupCollisions(prev, characterX, onPowerupCollected)
    )
  }, [characterX])

  return { powerups }
}