import { Client, GatewayIntentBits } from 'discord.js';
import DiscordLevelNotifications from './discord-level-notifications.js';

/**
 * Discord Bot Service
 * Handles Discord bot connection and notification posting
 */
class DiscordBotService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.levelNotifications = new DiscordLevelNotifications();
  }

  /**
   * Initialize Discord bot connection
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      if (this.isConnected) {
        return true;
      }

      // Check for required environment variables
      if (!process.env.DISCORD_BOT_TOKEN) {
        console.error('DISCORD_BOT_TOKEN environment variable is required');
        return false;
      }

      // Create Discord client
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers
        ]
      });

      // Set up event handlers
      this.setupEventHandlers();

      // Login to Discord
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      
      return true;

    } catch (error) {
      console.error('Failed to initialize Discord bot:', error);
      return false;
    }
  }

  /**
   * Set up Discord client event handlers
   */
  setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`✅ Discord bot logged in as ${this.client.user.tag}`);
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      console.error('Discord bot error:', error);
      this.isConnected = false;
    });

    this.client.on('disconnect', () => {
      console.log('Discord bot disconnected');
      this.isConnected = false;
    });
  }

  /**
   * Post level up notification to Discord
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Promise<boolean>} Success status
   */
  async postLevelUpNotification(user, levelUpData) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('Discord bot not connected, skipping level up notification');
        return false;
      }

      return await this.levelNotifications.postLevelUpNotification(this.client, user, levelUpData);

    } catch (error) {
      console.error('Error posting level up notification:', error);
      return false;
    }
  }

  /**
   * Post role change notification to Discord
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Promise<boolean>} Success status
   */
  async postRoleChangeNotification(user, roleChangeData) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('Discord bot not connected, skipping role change notification');
        return false;
      }

      return await this.levelNotifications.postRoleChangeNotification(this.client, user, roleChangeData);

    } catch (error) {
      console.error('Error posting role change notification:', error);
      return false;
    }
  }

  /**
   * Get Discord client (for advanced usage)
   * @returns {Client|null} Discord client or null
   */
  getClient() {
    return this.client;
  }

  /**
   * Check if bot is connected
   * @returns {boolean} Connection status
   */
  isBotConnected() {
    return this.isConnected && this.client !== null;
  }

  /**
   * Disconnect from Discord
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.destroy();
        this.client = null;
        this.isConnected = false;
        console.log('Discord bot disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting Discord bot:', error);
    }
  }
}

// Create singleton instance
const discordBotService = new DiscordBotService();

export default discordBotService;
