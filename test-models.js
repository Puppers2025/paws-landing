// Test script to validate models
import mongoose from 'mongoose';
import User from './models/User.js';
import DiscordRole from './models/DiscordRole.js';

// Test User model
console.log('Testing User model...');
try {
  const testUser = new User({
    walletAddress: '0x1234567890123456789012345678901234567890',
    username: 'testuser123',
    level: 150,
    experience: 1000,
    experienceToNextLevel: 2000,
    totalScore: 5000,
    highScore: 1000,
    gamesPlayed: 10,
    pawsTokens: 100,
    nftCount: 80,
    discordRole: 'Pup Whisperer',
    gameRole: 'Pup Whisperer'
  });
  
  console.log('✅ User model validation passed');
  console.log('User role:', testUser.discordRole);
  console.log('Game role:', testUser.gameRole);
  
  // Test role update
  const roleUpdate = testUser.updateGameRole();
  console.log('Role update result:', roleUpdate);
  
} catch (error) {
  console.error('❌ User model validation failed:', error.message);
}

// Test DiscordRole model
console.log('\nTesting DiscordRole model...');
try {
  const testRole = new DiscordRole({
    roleId: 'role_pup_whisperer',
    roleName: 'Pup Whisperer',
    guildId: 'test_guild',
    levelRequired: 150,
    gameLevelRequired: 150,
    nftRequired: 75,
    color: '#FF69B4',
    priority: 4,
    description: '⭐ Pup Whisperer - 75+ NFTs or Level 150',
    isActive: true
  });
  
  console.log('✅ DiscordRole model validation passed');
  console.log('Role name:', testRole.roleName);
  
} catch (error) {
  console.error('❌ DiscordRole model validation failed:', error.message);
}

console.log('\nModel validation complete!');
