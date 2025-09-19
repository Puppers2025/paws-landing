// Cloudinary Image Mapping
// This file contains all image URLs for easy reference and updates

export const cloudinaryImages = {
  // Background Images
  backgrounds: {
    future9: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321417/paws-landing/paws-landing/backgrounds/Future9.png',
    future9Backup: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321413/paws-landing/paws-landing/backgrounds/Future9-backup.png',
    gold3: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321421/paws-landing/paws-landing/backgrounds/Gold3.png',
    ape: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321423/paws-landing/paws-landing/backgrounds/ape.jpg',
    backgroundCity: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321426/paws-landing/paws-landing/backgrounds/background-city.png',
    backgroundPlaceholder: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321432/paws-landing/paws-landing/backgrounds/background-placeholder.png',
    bgLoopSampleJpg: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321435/paws-landing/paws-landing/backgrounds/bg-loop-sample.jpg',
    bgLoopSamplePng: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321436/paws-landing/paws-landing/backgrounds/bg-loop-sample.png',
    bone: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321439/paws-landing/paws-landing/backgrounds/bone.jpg',
    bossZombie: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321444/paws-landing/paws-landing/backgrounds/boss_zombie.png',
    loadingPupper: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321502/paws-landing/paws-landing/backgrounds/loading-pupper.gif',
    loadingPupper2: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321449/paws-landing/paws-landing/backgrounds/loading-pupper2.png',
    poodle: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321452/paws-landing/paws-landing/backgrounds/poodle.png',
    powerupBoost: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321455/paws-landing/paws-landing/backgrounds/powerup-boost.png',
    powerupBulletBoost: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321458/paws-landing/paws-landing/backgrounds/powerup-bulletBoost.png',
    powerupShield: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321461/paws-landing/paws-landing/backgrounds/powerup-shield.png',
    trash: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321464/paws-landing/paws-landing/backgrounds/trash.png',
    vortex: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321467/paws-landing/paws-landing/backgrounds/vortex.png'
  },
  
  // Zombie Sprites
  zombies: {
    zombie1_1: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321470/paws-landing/paws-landing/backgrounds/zombie1_1.png',
    zombie1_2: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321472/paws-landing/paws-landing/backgrounds/zombie1_2.png',
    zombie1_3: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321475/paws-landing/paws-landing/backgrounds/zombie1_3.png',
    zombie2_1: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321477/paws-landing/paws-landing/backgrounds/zombie2_1.png',
    zombie2_2: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321480/paws-landing/paws-landing/backgrounds/zombie2_2.png',
    zombie2_3: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321483/paws-landing/paws-landing/backgrounds/zombie2_3.png',
    zombie3_1: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321485/paws-landing/paws-landing/backgrounds/zombie3_1.png',
    zombie3_2: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321488/paws-landing/paws-landing/backgrounds/zombie3_2.png',
    zombie3_3: 'https://res.cloudinary.com/dncbk5sac/image/upload/v1758321491/paws-landing/paws-landing/backgrounds/zombie3_3.png'
  }
};

// Helper function to get image URL
export function getImageUrl(category, imageName) {
  if (cloudinaryImages[category] && cloudinaryImages[category][imageName]) {
    return cloudinaryImages[category][imageName];
  }
  console.warn(`Image not found: ${category}.${imageName}`);
  return null;
}

// Helper function to get background image URL
export function getBackgroundImage(imageName = 'future9') {
  return getImageUrl('backgrounds', imageName);
}

// Helper function to get zombie sprite URL
export function getZombieSprite(zombieType, frame) {
  return getImageUrl('zombies', `zombie${zombieType}_${frame}`);
}

export default cloudinaryImages;
