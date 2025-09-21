// Simple webhook test
const webhookUrl = 'https://discord.com/api/webhooks/1419156503470018680/uHFjqLLh1SZ6eskzHVDF0iAZaJDDfFVjJyJmz79Ba5fys93xOoO7okoQo8K0fVfelqyH';

const testMessage = {
  content: "✅ **Webhook Test with Updated Bot Name**",
  embeds: [{
    title: "🎮 Puppers Game Bot - Name Updated!",
    description: "The webhook is working perfectly with the updated bot name!",
    color: 0x00FF00,
    fields: [
      {
        name: "🤖 Bot Name",
        value: "Puppers Game Bot",
        inline: true
      },
      {
        name: "🔧 Status",
        value: "Fully Operational",
        inline: true
      }
    ],
    footer: {
      text: "Puppers Game • Discord Integration Active"
    },
    timestamp: new Date().toISOString()
  }]
};

async function testWebhook() {
  try {
    console.log('🧪 Testing webhook with updated bot name...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log('📨 Test message sent to Games channel');
      console.log('🤖 Bot name: Puppers Game Bot');
      console.log('🔧 Status: Fully operational');
    } else {
      const error = await response.text();
      console.log('❌ Webhook test failed');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testWebhook();
