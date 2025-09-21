// Test Discord notifications on live site
const BASE_URL = 'https://www.breedpuppers.xyz';

async function testLiveDiscordNotifications() {
  try {
    console.log('🚀 Testing Live Discord Notifications...');
    
    // Test webhook status
    console.log('🔧 Checking webhook status...');
    const statusResponse = await fetch(`${BASE_URL}/api/discord/test-notifications`);
    const statusData = await statusResponse.json();
    console.log('📊 Webhook status:', statusData);
    
    if (!statusData.discordWebhook.configured) {
      console.log('❌ Discord webhook not configured');
      return;
    }
    
    console.log('✅ Discord webhook is configured and ready!');
    console.log('🎉 Discord notification system is ready for testing!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Go to your Discord server');
    console.log('2. Navigate to the Games channel');
    console.log('3. Create a webhook for the Games channel');
    console.log('4. Set the webhook URL in Vercel environment variables');
    console.log('5. Test level up notifications by playing the game');
    console.log('');
    console.log('🔗 Test URLs:');
    console.log(`- Webhook Status: ${BASE_URL}/api/discord/test-notifications`);
    console.log(`- Database Test: ${BASE_URL}/api/test`);
    console.log(`- Wallet Check: ${BASE_URL}/api/auth/wallet?address=0x1234567890123456789012345678901234567890`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLiveDiscordNotifications();
