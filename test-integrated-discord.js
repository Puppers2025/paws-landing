/**
 * Test Integrated Discord Service with Native Notification Badges
 * Tests the updated webhook service with Discord bot integration
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

async function testIntegratedDiscord() {
  console.log('🤖 Testing Integrated Discord Service with Native Notification Badges...\n');

  const webhookService = new DiscordWebhookService();

  if (!webhookService.isConfigured()) {
    console.error('❌ Discord service not configured. Please check environment variables.');
    return;
  }

  console.log('✅ Discord service is configured\n');

  try {
    // Test 1: Level Up Notification with Native Badge
    console.log('🔴 Test 1: Level Up Notification with Native Badge');
    console.log('================================================');
    
    const levelUpSuccess = await webhookService.postLevelUpNotification(testUser, testLevelUpData);
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
    
    const roleChangeSuccess = await webhookService.postRoleChangeNotification(testUser, testRoleChangeData);
    if (roleChangeSuccess) {
      console.log('✅ Role change notification with native badge posted successfully\n');
    } else {
      console.log('❌ Failed to post role change notification\n');
    }

    console.log('🎉 Integrated Discord Service Tests Complete!');
    console.log('============================================');
    console.log('✅ Check your Discord server for:');
    console.log('   • Red notification badges on the games channel');
    console.log('   • Red notification badges on your server icon');
    console.log('   • Clean embed messages (like Puppers Game Bot)');
    console.log('\n🔴 The native Discord notification badges should now appear!');
    console.log('🎯 This is exactly what you wanted - native Discord notification badges!');

  } catch (error) {
    console.error('❌ Error during integrated Discord testing:', error);
  }
}

// Run the test
testIntegratedDiscord().catch(console.error);
