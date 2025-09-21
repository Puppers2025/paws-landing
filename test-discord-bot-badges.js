/**
 * Test Discord Bot for Native Notification Badges
 * Tests the Discord bot to create actual notification badges
 */

import { config } from 'dotenv';
import DiscordBot from './lib/discord-bot.js';

// Load environment variables
config({ path: '.env.local' });

// Test user data
const testUser = {
  username: 'TestUser123',
  level: 15,
  experience: 1250,
  experienceToNextLevel: 1500,
  gameRole: 'Puppy Training',
  nftCount: 5,
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678'
};

// Test level up data
const testLevelUpData = {
  levelUps: 1,
  newLevel: 16,
  gameRoleUpdate: {
    roleChanged: false,
    oldRole: 'Puppy Training',
    newRole: 'Puppy Training'
  }
};

// Test role change data
const testRoleChangeData = {
  oldRole: 'Puppy Training',
  newRole: 'Pup Trainer',
  level: 16,
  nftCount: 5
};

async function testDiscordBotBadges() {
  console.log('🤖 Testing Discord Bot for Native Notification Badges...\n');

  const bot = new DiscordBot();

  // Check if bot token is configured
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('❌ DISCORD_BOT_TOKEN not configured. Please set the Discord bot token.');
    return;
  }

  if (!process.env.DISCORD_GUILD_ID) {
    console.error('❌ DISCORD_GUILD_ID not configured. Please set the Discord guild ID.');
    return;
  }

  try {
    // Connect to Discord
    console.log('🔌 Connecting to Discord...');
    const connected = await bot.connect();
    
    if (!connected) {
      console.error('❌ Failed to connect to Discord');
      return;
    }

    // Wait for bot to be ready
    console.log('⏳ Waiting for bot to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!bot.isConnected()) {
      console.error('❌ Bot is not connected');
      return;
    }

    console.log('✅ Discord bot connected successfully\n');

    // Test 1: Level Up Notification with Native Badge
    console.log('🔴 Test 1: Level Up Notification with Native Badge');
    console.log('================================================');
    
    const levelUpSuccess = await bot.postLevelUpNotification(testUser, testLevelUpData);
    if (levelUpSuccess) {
      console.log('✅ Level up notification with native badge posted successfully\n');
    } else {
      console.log('❌ Failed to post level up notification\n');
    }

    // Wait 3 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 2: Role Change Notification with Native Badge
    console.log('🔴 Test 2: Role Change Notification with Native Badge');
    console.log('==================================================');
    
    const roleChangeSuccess = await bot.postRoleChangeNotification(testUser, testRoleChangeData);
    if (roleChangeSuccess) {
      console.log('✅ Role change notification with native badge posted successfully\n');
    } else {
      console.log('❌ Failed to post role change notification\n');
    }

    console.log('🎉 Discord Bot Badge Tests Complete!');
    console.log('====================================');
    console.log('✅ Check your Discord server for:');
    console.log('   • Red notification badges on the games channel');
    console.log('   • Red notification badges on your server icon');
    console.log('   • Clean embed messages (no custom red badges)');
    console.log('\n🔴 The native Discord notification badges should now appear!');

    // Disconnect bot
    await bot.disconnect();
    console.log('\n🔌 Discord bot disconnected');

  } catch (error) {
    console.error('❌ Error during Discord bot testing:', error);
  }
}

// Run the test
testDiscordBotBadges().catch(console.error);
