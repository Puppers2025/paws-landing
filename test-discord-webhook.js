import connectDB from './lib/database.js';
import User from './models/User.js';
import DiscordWebhookService from './lib/discord-webhook.js';

async function testDiscordNotifications() {
  try {
    console.log('🚀 Testing Discord Notifications...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Database connected');
    
    // Find or create a test user
    let user = await User.findByWallet('0x1234567890123456789012345678901234567890');
    
    if (!user) {
      console.log('📝 Creating test user...');
      user = new User({
        walletAddress: '0x1234567890123456789012345678901234567890',
        username: 'testuser_discord_' + Date.now(),
        discordId: '123456789012345678',
        discordUsername: 'testuser_discord',
        level: 1,
        experience: 0,
        nftCount: 0
      });
      await user.save();
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found:', user.username);
    }
    
    // Test Discord webhook service
    const webhookService = new DiscordWebhookService();
    console.log('🔧 Webhook service configured:', webhookService.isConfigured());
    
    // Test level up notification
    console.log('🎮 Testing level up notification...');
    const levelUpResult = await user.addExperience(150); // Should trigger level up
    console.log('📈 Level up result:', levelUpResult);
    
    // Test role change notification
    console.log('🎭 Testing role change notification...');
    const roleChangeResult = user.updateGameRole();
    if (roleChangeResult.roleChanged) {
      await user.save();
      await webhookService.postRoleChangeNotification(user, roleChangeResult);
      console.log('✅ Role change notification sent');
    } else {
      console.log('ℹ️ No role change occurred');
    }
    
    // Test NFT count update
    console.log('🖼️ Testing NFT count update...');
    const oldNftCount = user.nftCount;
    user.nftCount = 25; // Should trigger role change
    await user.save();
    
    await webhookService.postRoleChangeNotification(user, {
      oldRole: oldNftCount < 1 ? 'None' : 'Previous Role',
      newRole: user.discordRole || 'Puppy',
      level: user.level,
      nftCount: user.nftCount
    });
    console.log('✅ NFT update notification sent');
    
    console.log('🎉 All Discord notification tests completed!');
    console.log('📊 Final user status:');
    console.log('  - Level:', user.level);
    console.log('  - Experience:', user.experience);
    console.log('  - NFT Count:', user.nftCount);
    console.log('  - Discord Role:', user.discordRole);
    console.log('  - Game Role:', user.gameRole);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDiscordNotifications();
