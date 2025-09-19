export default function handlePowerupCollisions(
    powerups,
    characterX,
    onPowerupCollected
  ) {
    return powerups.filter(powerup => {
      const dx = Math.abs(powerup.left - (window.innerWidth / 2 + characterX))
      const isColliding = powerup.top > window.innerHeight - 150 && dx < 40
  
      if (isColliding) {
        onPowerupCollected?.(powerup)
        return false // Remove collected powerup
      }
  
      return true
    })
  }