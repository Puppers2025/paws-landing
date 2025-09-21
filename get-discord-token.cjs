/**
 * Get Discord Bot Token from Secure Credentials
 */

const { getProjectCredentials } = require('../secure-credentials.js');

// Get credentials for Puppers Discord project
const puppersDiscordCreds = getProjectCredentials('Puppers Discord');

if (puppersDiscordCreds && puppersDiscordCreds.DISCORD_BOT_TOKEN) {
  console.log('🤖 Discord Bot Token found!');
  console.log('Token:', puppersDiscordCreds.DISCORD_BOT_TOKEN);
  
  // Also check for other Discord-related credentials
  if (puppersDiscordCreds.DISCORD_CLIENT_ID) {
    console.log('Client ID:', puppersDiscordCreds.DISCORD_CLIENT_ID);
  }
  
  if (puppersDiscordCreds.DISCORD_GUILD_ID) {
    console.log('Guild ID:', puppersDiscordCreds.DISCORD_GUILD_ID);
  }
} else {
  console.log('❌ Discord Bot Token not found in secure credentials');
  console.log('Available projects:', Object.keys(getProjectCredentials() || {}));
}
