// Discord Role Mapping System
// Maps Discord NFT requirements to Game Level requirements (2x multiplier)

export const DISCORD_ROLE_MAPPINGS = {
  // Discord Role Name: { nftRequired, gameLevelRequired, description }
  'Puppy': {
    nftRequired: 1,
    gameLevelRequired: 2,
    description: '🐕 Puppy - 1+ NFTs or Level 2',
    color: '#808080', // Gray
    priority: 0
  },
  'Puppy Training': {
    nftRequired: 10,
    gameLevelRequired: 20,
    description: '🎓 Puppy Training - 10+ NFTs or Level 20',
    color: '#00FF00', // Green
    priority: 1
  },
  'Pup Trainer': {
    nftRequired: 25,
    gameLevelRequired: 50,
    description: '🏆 Pup Trainer - 25+ NFTs or Level 50',
    color: '#0000FF', // Blue
    priority: 2
  },
  'Pup Owner': {
    nftRequired: 60,
    gameLevelRequired: 120,
    description: '👑 Pup Owner - 60+ NFTs or Level 120',
    color: '#FFD700', // Gold
    priority: 3
  },
  'Pup Whisperer': {
    nftRequired: 75,
    gameLevelRequired: 150,
    description: '⭐ Pup Whisperer - 75+ NFTs or Level 150',
    color: '#FF69B4', // Hot Pink
    priority: 4
  },
  'Pup Star': {
    nftRequired: 100,
    gameLevelRequired: 200,
    description: '🌟 Pup Star - 100+ NFTs or Level 200',
    color: '#8A2BE2', // Blue Violet
    priority: 5
  },
  'Pup Master': {
    nftRequired: 200,
    gameLevelRequired: 400,
    description: '👑 Pup Master - 200+ NFTs or Level 400',
    color: '#DC143C', // Crimson
    priority: 6
  }
};

// Helper function to get role by game level
export function getRoleByGameLevel(level) {
  const roles = Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => b.priority - a.priority); // Sort by priority (highest first)
  
  for (const [roleName, roleData] of roles) {
    if (level >= roleData.gameLevelRequired) {
      return {
        roleName,
        ...roleData,
        achievedAt: level
      };
    }
  }
  
  return null; // No role achieved
}

// Helper function to get next role by game level
export function getNextRoleByGameLevel(level) {
  const roles = Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => a.priority - b.priority); // Sort by priority (lowest first)
  
  for (const [roleName, roleData] of roles) {
    if (level < roleData.gameLevelRequired) {
      return {
        roleName,
        ...roleData,
        levelsNeeded: roleData.gameLevelRequired - level
      };
    }
  }
  
  return null; // Already at highest role
}

// Helper function to get role by NFT count (Discord verification)
export function getRoleByNFTCount(nftCount) {
  const roles = Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => b.priority - a.priority); // Sort by priority (highest first)
  
  for (const [roleName, roleData] of roles) {
    if (nftCount >= roleData.nftRequired) {
      return {
        roleName,
        ...roleData,
        achievedAt: nftCount
      };
    }
  }
  
  return null; // No role achieved
}

// Helper function to get all roles
export function getAllRoles() {
  return Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => a.priority - b.priority)
    .map(([roleName, roleData]) => ({
      roleName,
      ...roleData
    }));
}

// Helper function to check if user qualifies for role
export function userQualifiesForRole(userLevel, userNFTCount, roleName) {
  const roleData = DISCORD_ROLE_MAPPINGS[roleName];
  if (!roleData) return false;
  
  return userLevel >= roleData.gameLevelRequired || userNFTCount >= roleData.nftRequired;
}

// Helper function to get user's current status
export function getUserRoleStatus(userLevel, userNFTCount) {
  const discordRole = getRoleByNFTCount(userNFTCount);
  const gameRole = getRoleByGameLevel(userLevel);
  const nextGameRole = getNextRoleByGameLevel(userLevel);
  
  return {
    discordRole: discordRole ? discordRole.roleName : null,
    gameRole: gameRole ? gameRole.roleName : null,
    nextGameRole: nextGameRole ? nextGameRole.roleName : null,
    levelsToNextRole: nextGameRole ? nextGameRole.levelsNeeded : null,
    canAchieveViaGame: gameRole !== null,
    canAchieveViaNFT: discordRole !== null,
    highestRole: discordRole && gameRole 
      ? (discordRole.priority > gameRole.priority ? discordRole.roleName : gameRole.roleName)
      : (discordRole ? discordRole.roleName : gameRole ? gameRole.roleName : null)
  };
}

// Helper function to get role hierarchy for Discord
export function getRoleHierarchy() {
  return Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => a.priority - b.priority)
    .map(([roleName, roleData]) => ({
      name: roleName,
      position: roleData.priority,
      color: roleData.color,
      nftRequired: roleData.nftRequired,
      gameLevelRequired: roleData.gameLevelRequired
    }));
}

export default DISCORD_ROLE_MAPPINGS;
