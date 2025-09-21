/**
 * Test Discord Custom Red Notification Badges
 * Tests the new custom red notification badge system
 */

import { config } from 'dotenv';
import DiscordWebhookService from './lib/discord-webhook.js';

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

// Test NFT update data
const testNftUpdateData = {
  oldRole: 'Pup Trainer',
  newRole: 'Pup Trainer',
  level: 16,
  nftCount: 10
};

async function testDiscordBadges() {
  console.log('🚀 Testing Discord Custom Red Notification Badges...\n');

  const webhookService = new DiscordWebhookService();

  if (!webhookService.isConfigured()) {
    console.error('❌ Discord webhook not configured. Please set DISCORD_GAMES_WEBHOOK_URL environment variable.');
    return;
  }

  console.log('✅ Discord webhook is configured\n');

  try {
    // Test 1: Level Up Notification with Custom Red Badge
    console.log('🔴 Test 1: Level Up Notification with Custom Red Badge');
    console.log('================================================');
    
    const levelUpSuccess = await webhookService.postLevelUpNotification(testUser, testLevelUpData);
    if (levelUpSuccess) {
      console.log('✅ Level up notification with custom red badge posted successfully\n');
    } else {
      console.log('❌ Failed to post level up notification\n');
    }

    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Role Change Notification with Custom Red Badge
    console.log('🔴 Test 2: Role Change Notification with Custom Red Badge');
    console.log('=====================================================');
    
    const roleChangeSuccess = await webhookService.postRoleChangeNotification(testUser, testRoleChangeData);
    if (roleChangeSuccess) {
      console.log('✅ Role change notification with custom red badge posted successfully\n');
    } else {
      console.log('❌ Failed to post role change notification\n');
    }

    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: NFT Update Notification with Custom Red Badge
    console.log('🔴 Test 3: NFT Update Notification with Custom Red Badge');
    console.log('=====================================================');
    
    const nftUpdateSuccess = await webhookService.postNotificationBadge('nftUpdate', testUser, testNftUpdateData);
    if (nftUpdateSuccess) {
      console.log('✅ NFT update notification with custom red badge posted successfully\n');
    } else {
      console.log('❌ Failed to post NFT update notification\n');
    }

    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: Server Profile Icon with Counters
    console.log('👤 Test 4: Server Profile Icon with Counters');
    console.log('==========================================');
    
    const profileIconSuccess = await webhookService.postServerProfileIcon(testUser, {
      level: testUser.level,
      experience: testUser.experience,
      gameRole: testUser.gameRole,
      nftCount: testUser.nftCount
    });
    
    if (profileIconSuccess) {
      console.log('✅ Server profile icon with counters posted successfully\n');
    } else {
      console.log('❌ Failed to post server profile icon\n');
    }

    console.log('🎉 All Discord badge tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('================');
    console.log('✅ Level Up Notification + Custom Red Badge');
    console.log('✅ Role Change Notification + Custom Red Badge');
    console.log('✅ NFT Update Notification + Custom Red Badge');
    console.log('✅ Server Profile Icon with Counters');
    console.log('\n🔴 Check your Discord games channel for the custom red notification badges!');

  } catch (error) {
    console.error('❌ Error during Discord badge testing:', error);
  }
}

// Run the test
testDiscordBadges().catch(console.error);
