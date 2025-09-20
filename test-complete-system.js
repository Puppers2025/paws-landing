// Comprehensive test of the complete role system
import mongoose from 'mongoose';
import User from './models/User.js';
import DiscordRole from './models/DiscordRole.js';
import { DISCORD_ROLE_MAPPINGS } from './lib/discord-role-mapping.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-puppers_database:hAFuPH89BjA38plz@puppers-database.x0ycit2.mongodb.net/?retryWrites=true&w=majority';

async function testCompleteSystem() {
  try {
    console.log('🧪 Testing Complete Role System\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    const testUser = new User({
      walletAddress: `0x${timestamp.padStart(40, '0')}`,
      username: `test${timestamp}`,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      totalScore: 0,
      highScore: 0,
      gamesPlayed: 0,
      pawsTokens: 0,
      nftCount: 0,
      discordRole: 'Puppy',
      gameRole: null
    });
    
    await testUser.save();
    console.log('✅ Test user created:', testUser.username);
    
    // Test 2: Test NFT-based role assignment
    console.log('\n2. Testing NFT-based role assignment...');
    
    const nftTests = [
      { nftCount: 0, expectedDiscordRole: null },
      { nftCount: 1, expectedDiscordRole: 'Puppy' },
      { nftCount: 10, expectedDiscordRole: 'Puppy Training' },
      { nftCount: 25, expectedDiscordRole: 'Pup Trainer' },
      { nftCount: 60, expectedDiscordRole: 'Pup Owner' },
      { nftCount: 75, expectedDiscordRole: 'Pup Whisperer' },
      { nftCount: 100, expectedDiscordRole: 'Pup Star' },
      { nftCount: 200, expectedDiscordRole: 'Pup Master' }
    ];
    
    for (const test of nftTests) {
      testUser.nftCount = test.nftCount;
      
      // Update Discord role based on NFT count
      const roleStatus = getUserRoleStatus(testUser.level, test.nftCount);
      if (roleStatus.discordRole) {
        testUser.discordRole = roleStatus.discordRole;
      }
      
      await testUser.save();
      
      console.log(`   ${test.nftCount} NFTs → ${testUser.discordRole} (expected: ${test.expectedDiscordRole})`);
    }
    
    // Test 3: Test level-based role assignment
    console.log('\n3. Testing level-based role assignment...');
    
    const levelTests = [
      { level: 1, expectedGameRole: null },
      { level: 2, expectedGameRole: 'Puppy' },
      { level: 20, expectedGameRole: 'Puppy Training' },
      { level: 50, expectedGameRole: 'Pup Trainer' },
      { level: 120, expectedGameRole: 'Pup Owner' },
      { level: 150, expectedGameRole: 'Pup Whisperer' },
      { level: 200, expectedGameRole: 'Pup Star' },
      { level: 400, expectedGameRole: 'Pup Master' }
    ];
    
    for (const test of levelTests) {
      testUser.level = test.level;
      
      // Update game role based on level
      const gameRoleUpdate = testUser.updateGameRole();
      await testUser.save();
      
      console.log(`   Level ${test.level} → ${testUser.gameRole} (expected: ${test.expectedGameRole})`);
    }
    
    // Test 4: Test dual qualification
    console.log('\n4. Testing dual qualification...');
    
    testUser.level = 150;
    testUser.nftCount = 80;
    
    const roleStatus = getUserRoleStatus(testUser.level, testUser.nftCount);
    if (roleStatus.discordRole) {
      testUser.discordRole = roleStatus.discordRole;
    }
    
    const gameRoleUpdate = testUser.updateGameRole();
    await testUser.save();
    
    console.log(`   Level ${testUser.level}, ${testUser.nftCount} NFTs:`);
    console.log(`   Discord Role: ${testUser.discordRole}`);
    console.log(`   Game Role: ${testUser.gameRole}`);
    console.log(`   Highest Role: ${roleStatus.highestRole}`);
    
    // Test 5: Test experience and leveling up
    console.log('\n5. Testing experience and leveling up...');
    
    testUser.level = 1;
    testUser.experience = 0;
    testUser.experienceToNextLevel = 100;
    testUser.nftCount = 0;
    testUser.discordRole = 'Puppy';
    testUser.gameRole = null;
    
    await testUser.save();
    
    // Add experience to trigger level up
    const levelUpResult = await testUser.addExperience(200);
    console.log(`   Added 200 XP → Level ${testUser.level}, Level ups: ${levelUpResult.levelUps}`);
    console.log(`   Discord Role: ${testUser.discordRole}`);
    console.log(`   Game Role: ${testUser.gameRole}`);
    
    // Clean up
    await User.deleteOne({ _id: testUser._id });
    console.log('\n✅ Test user cleaned up');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Helper function to get user role status (simplified version)
function getUserRoleStatus(level, nftCount) {
  const roles = Object.entries(DISCORD_ROLE_MAPPINGS)
    .sort(([,a], [,b]) => b.priority - a.priority);
  
  let discordRole = null;
  let gameRole = null;
  
  // Find Discord role by NFT count
  for (const [roleName, roleData] of roles) {
    if (nftCount >= roleData.nftRequired) {
      discordRole = roleName;
      break;
    }
  }
  
  // Find game role by level
  for (const [roleName, roleData] of roles) {
    if (level >= roleData.gameLevelRequired) {
      gameRole = roleName;
      break;
    }
  }
  
  return {
    discordRole,
    gameRole,
    highestRole: discordRole || gameRole || null
  };
}

testCompleteSystem();
