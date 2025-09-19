import { useEffect } from 'react'

export default function useCharacterCollision({
  items,
  setItems,
  characterX,
  dogz,
  dogzRef,
  setDogz,
  onCollision,
  setGameOver,
}) {
  useEffect(() => {
    const updatedItems = []
    let dogzLost = 0

    const characterCenterX = window.innerWidth / 2 + characterX
    const characterBottomY = window.innerHeight - 120 // character's top

    for (let item of items) {
      const dx = Math.abs(item.left - characterCenterX)
      const dy = item.top + (item.scale * 20) // approximates enemy “feet”

      const isColliding =
        dx < 40 && dy >= characterBottomY && dy <= window.innerHeight

      if (isColliding) {
        onCollision?.(item)

        // 🔥 If it's a damaging item
        if (item.type === 'trash' || item.type.includes('zombie') || item.type === 'boss_zombie') {
          dogzLost += 1
        }

        // 💡 If it's a harmless item (bone, etc), do nothing to DOGZ
        // 💥 DO remove all collided items (even bone or powerups)
        continue // skip pushing to updatedItems = remove it
      }

      // 🟢 Not colliding, keep item
      updatedItems.push(item)
    }

    if (dogzLost > 0) {
      const current = dogzRef?.current ?? dogz
      const newCount = Math.max(current - dogzLost, 0)
      dogzRef.current = newCount
      setDogz(newCount)

      if (newCount <= 0) {
        setGameOver?.(true)
      }
    }

    setItems(updatedItems)
  }, [characterX])
}