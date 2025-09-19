import { useState, useEffect, useRef } from 'react'
import useCharacterCollision from './collisions/handleCharacterCollisions'
import useBulletCollision from './collisions/handleBulletCollisions'
import usePowerupCollision from './usePowerupCollision'

// ✅ Shared kill tracker
const killedRef = { current: new Set() }
export const resetKilledRef = () => {
  killedRef.current = new Set()
}

// ✅ Track idle misses
const missedRef = { current: 0 }
export const resetMissedRef = () => {
  missedRef.current = 0
}

export default function useGameCollision({
  characterX,
  bullets,
  setBullets,
  dogz,
  dogzRef,
  setDogz,
  onCollision,
  onBulletHit,
  onEnemyKilled,
  onPowerupCollected,
  setGameOver,
  lastMoveTime,
}) {
  const [items, setItems] = useState([])
  const itemIdRef = useRef(0)

  const { powerups } = usePowerupCollision({
    characterX,
    onPowerupCollected,
  })

  // 🧟 Spawn items
  useEffect(() => {
    const interval = setInterval(() => {
      const id = itemIdRef.current++
      const rand = Math.random()
      let type = 'bone', isBoss = false, baseHealth = 1

      if (rand > 0.95) {
        type = 'boss_zombie'
        isBoss = true
        baseHealth = 10
      } else if (rand < 0.3) {
        type = 'bone'
      } else if (rand < 0.6) {
        type = 'trash'
        baseHealth = 2
      } else {
        const variant = Math.floor(Math.random() * 3) + 1
        type = `zombie${variant}`
        baseHealth = 3
      }

      const spawnRange = window.innerWidth * 0.75
      const spawnCenter = window.innerWidth / 2
      const spawnOffset = spawnCenter - spawnRange / 2
      const left = spawnOffset + Math.random() * spawnRange

      const newItem = {
        id,
        type,
        isBoss,
        top: -100,
        left,
        scale: isBoss ? 1 : 0.5,
        speed: isBoss ? 0.6 : 1 + Math.random() * 1.5,
        hitCount: 0,
        health: baseHealth,
        maxHealth: baseHealth,
        spawnAt: Date.now(),
        visible: false,
        frameIndex: 0,
      }

      setItems(prev => [...prev, newItem])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // 🎯 Item movement logic
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev =>
        prev
          .map((item) => {
            const screenCenterX = window.innerWidth / 2
            const targetX = screenCenterX + characterX
            const dx = targetX - item.left

            const driftX = dx * 0.01 * item.speed
            const newTop = item.top + 2 * item.speed
            const newScale = item.type.includes('boss')
              ? item.scale
              : Math.min((item.top + 300) / window.innerHeight, 2.5)

            return {
              ...item,
              left: item.left + driftX,
              top: newTop,
              scale: newScale,
            }
          })
          .filter(item => {
            const offScreen = item.top > window.innerHeight + 100
            const isEnemy = item.type === 'trash' || item.type.includes('zombie')

            if (
              offScreen &&
              isEnemy &&
              !item.wasHit &&
              item.health > 0 &&
              Date.now() - lastMoveTime > 3000
            ) {
              missedRef.current += 1
              if (missedRef.current >= 5) {
                setGameOver?.(true)
              }
            }

            return !offScreen
          })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [characterX, lastMoveTime])

  // 👻 Show after 500ms
  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev =>
        prev.map(item =>
          !item.visible && Date.now() - item.spawnAt > 500
            ? { ...item, visible: true }
            : item
        )
      )
    }, 100)

    return () => clearInterval(timer)
  }, [])

  // 🧍 Collisions
  useCharacterCollision({
    items,
    setItems,
    characterX,
    dogz,
    dogzRef,
    setDogz,
    onCollision,
    setGameOver,
  })

  // 🔫 Bullet collisions
  useBulletCollision({
    items,
    setItems,
    bullets,
    setBullets,
    onBulletHit,
    onEnemyKilled,
    killedRef,
  })

  // 🧟 Animate zombies
  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev =>
        prev.map(item =>
          item.visible && item.type.startsWith('zombie')
            ? { ...item, frameIndex: (item.frameIndex + 1) % 3 }
            : item
        )
      )
    }, 150)

    return () => clearInterval(timer)
  }, [])

  return { items, powerups }
}

export { killedRef }