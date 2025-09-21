/**
 * Bulldog Community Bot
 * Main community management bot for Puppers Discord
 * Handles community management, moderation, and announcements
 */

import { Client, GatewayIntentBits, Partials, EmbedBuilder, ChannelType } from 'discord.js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

class BulldogCommunityBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User],
    });

    // Use the community bot token
    this.token = process.env.DISCORD_BOT_TOKEN;
    this.guildId = process.env.DISCORD_GUILD_ID;
    this.gamesChannelId = process.env.DISCORD_GAMES_CHANNEL_ID;

    this.client.once('ready', () => {
      console.log(`🐕 Bulldog Community Bot Ready! Logged in as ${this.client.user.tag}`);
    });

    this.client.on('error', error => {
      console.error('🐕 Bulldog Community Bot Error:', error);
    });
  }

  async connect() {
    if (!this.token) {
      console.error('🐕 Bulldog Community Bot Token not found. Please set DISCORD_BOT_TOKEN in your environment variables.');
      return false;
    }
    
    try {
      await this.client.login(this.token);
      return true;
    } catch (error) {
      console.error('🐕 Failed to connect Bulldog Community Bot:', error);
      return false;
    }
  }

  async disconnect() {
    this.client.destroy();
    console.log('🐕 Bulldog Community Bot disconnected.');
  }

  async getGuild() {
    if (!this.client.isReady()) {
      console.error('🐕 Bulldog Community Bot is not ready.');
      return null;
    }
    if (!this.guildId) {
      console.error('🐕 Discord Guild ID not set.');
      return null;
    }
    return this.client.guilds.fetch(this.guildId);
  }

  /**
   * Create red notification badge on a specific channel
   * Note: Discord native notification badges are created by Discord when there are unread messages
   * This method is for reference only - actual badges are managed by Discord's native system
   * @param {string} channelId - Channel ID to create badge on
   * @param {number} count - Number of notifications
   * @param {string} reason - Reason for the notification
   */
  async createChannelNotificationBadge(channelId, count = 1, reason = 'New notification') {
    console.log(`🐕 Channel notification badge requested for channel ${channelId}`);
    console.log(`   - Count: ${count}`);
    console.log(`   - Reason: ${reason}`);
    console.log(`   - Note: Discord native badges appear automatically when users have unread messages`);
    
    // Discord native notification badges are managed by Discord itself
    // They appear when users have unread messages in channels
    // Bots cannot directly create these badges - they're a Discord client feature
    
    return true; // Return success for API compatibility
  }

  /**
   * Create red notification badge on server icon
   * Note: Discord native notification badges are created by Discord when there are unread messages
   * This method is for reference only - actual badges are managed by Discord's native system
   * @param {number} count - Number of notifications
   * @param {string} reason - Reason for the notification
   */
  async createServerNotificationBadge(count = 1, reason = 'Server update') {
    console.log(`🐕 Server notification badge requested`);
    console.log(`   - Count: ${count}`);
    console.log(`   - Reason: ${reason}`);
    console.log(`   - Note: Discord native badges appear automatically when users have unread messages`);
    
    // Discord native notification badges are managed by Discord itself
    // They appear when users have unread messages in channels
    // Bots cannot directly create these badges - they're a Discord client feature
    
    return true; // Return success for API compatibility
  }

  /**
   * Post community announcement
   * @param {string} channelId - Channel ID to post to
   * @param {string} title - Announcement title
   * @param {string} description - Announcement description
   * @param {string} color - Embed color (hex)
   */
  async postCommunityAnnouncement(channelId, title, description, color = 0x0099FF) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`🐕 Channel ${channelId} not found or not a text channel`);
        return false;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: 'Bulldog Community Bot • Community Management' })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      console.log(`🐕 Posted community announcement to ${channel.name}`);
      return true;

    } catch (error) {
      console.error(`🐕 Error posting community announcement:`, error);
      return false;
    }
  }

  /**
   * Get all text channels in the guild
   */
  async getAllTextChannels() {
    try {
      const guild = await this.getGuild();
      if (!guild) return [];

      const channels = guild.channels.cache
        .filter(channel => channel.type === ChannelType.GuildText)
        .map(channel => ({
          id: channel.id,
          name: channel.name,
          type: channel.type
        }));

      return channels;

    } catch (error) {
      console.error('🐕 Error getting text channels:', error);
      return [];
    }
  }

  /**
   * Post important community announcement
   * @param {Object} config - Announcement configuration
   */
  async postImportantAnnouncement(config) {
    try {
      const {
        title = 'Community Update',
        description = 'Important community information',
        channelId = this.gamesChannelId,
        color = 0x0099FF,
        useMention = false
      } = config;

      if (!channelId) {
        console.error('🐕 No channel ID provided for announcement');
        return false;
      }

      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`🐕 Channel ${channelId} not found or not a text channel`);
        return false;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: 'Bulldog Community Bot • Important Announcement' })
        .setTimestamp();

      const content = useMention ? '@everyone' : '';
      
      await channel.send({ 
        content: content,
        embeds: [embed]
      });

      console.log(`🐕 Posted important announcement to ${channel.name}`);
      return true;

    } catch (error) {
      console.error('🐕 Error posting important announcement:', error);
      return false;
    }
  }
}

export default BulldogCommunityBot;
