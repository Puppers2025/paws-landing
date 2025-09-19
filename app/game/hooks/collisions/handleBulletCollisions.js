import { useEffect } from 'react'

export default function useBulletCollision({
  items,
  setItems,
  bullets,
  setBullets,
  onBulletHit,
  onEnemyKilled,
  killedRef, // ✅ persistent tracker
}) {
  useEffect(() => {
    const updatedItems = [...items]
    const updatedBullets = [...bullets]
    const hitItemIds = new Set()
    const bulletsToRemove = new Set()
    const itemsToRemove = new Set()

    for (let bullet of bullets) {
      const bulletX = bullet.offsetX + window.innerWidth / 2
      const bulletY = bullet.top

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i]

        if (itemsToRemove.has(item.id)) continue // Already marked for removal

        const itemX = item.left
        const itemY = item.top

        const withinX = Math.abs(bulletX - itemX) < 25
        const withinY = Math.abs(bulletY - itemY) < 40

        if (withinX && withinY) {
          const damage = bullet.damage || 1
          item.health = (item.health ?? 2) - damage
          item.wasHit = true
          item.knockback = (Math.random() < 0.5 ? -1 : 1) * (bullet.knockback || 5)

          hitItemIds.add(item.id)
          bulletsToRemove.add(bullet.id)

          onBulletHit?.(item, bullet)

          if (item.health <= 0) {
            if (
              (item.type === 'trash' || item.type.startsWith('zombie')) &&
              !killedRef.current.has(item.id)
            ) {
              killedRef.current.add(item.id)
              onEnemyKilled?.()
            }
            itemsToRemove.add(item.id)
          }

          break // Bullet hits only one item
        }
      }
    }

    const newItems = updatedItems.filter(item => !itemsToRemove.has(item.id))
    const newBullets = updatedBullets.filter(bullet => !bulletsToRemove.has(bullet.id))

    if (hitItemIds.size > 0) {
      setTimeout(() => {
        setItems(prev =>
          prev.map(item =>
            hitItemIds.has(item.id)
              ? { ...item, wasHit: false, knockback: 0 }
              : item
          )
        )
      }, 150)
    }

    if (itemsToRemove.size > 0) setItems(newItems)
    if (bulletsToRemove.size > 0) setBullets(newBullets)
  }, [bullets])
}