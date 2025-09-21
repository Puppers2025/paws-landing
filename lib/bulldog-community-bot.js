/**
 * Bulldog Community Bot
 * Main community management bot for Puppers Discord
 * Handles red notification badges for channels and server icon
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
   * @param {string} channelId - Channel ID to create badge on
   * @param {number} count - Number of notifications
   * @param {string} reason - Reason for the notification
   */
  async createChannelNotificationBadge(channelId, count = 1, reason = 'New notification') {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        console.error(`🐕 Channel ${channelId} not found or not a text channel`);
        return false;
      }

      // Create a notification message that will trigger the red badge
      const embed = new EmbedBuilder()
        .setTitle('🔔 Channel Notification')
        .setDescription(`**${count}** new notification${count > 1 ? 's' : ''} in this channel`)
        .setColor(0xFF0000) // Red color
        .addFields({
          name: '📋 Reason',
          value: reason,
          inline: true
        })
        .setFooter({ text: 'Bulldog Community Bot • Notification System' })
        .setTimestamp();

      await channel.send({ 
        content: `🔔 **${count}** notification${count > 1 ? 's' : ''} - ${reason}`,
        embeds: [embed]
      });

      console.log(`🐕 Created notification badge on channel ${channel.name} (${channelId}) with count ${count}`);
      return true;

    } catch (error) {
      console.error(`🐕 Error creating channel notification badge:`, error);
      return false;
    }
  }

  /**
   * Create red notification badge on server icon by posting to general channels
   * @param {number} count - Number of notifications
   * @param {string} reason - Reason for the notification
   */
  async createServerNotificationBadge(count = 1, reason = 'Server update') {
    try {
      const guild = await this.getGuild();
      if (!guild) {
        console.error('🐕 Could not access guild');
        return false;
      }

      // Find suitable channels to post notifications
      const channels = guild.channels.cache.filter(channel => 
        channel.type === ChannelType.GuildText && 
        channel.permissionsFor(guild.members.me).has('SendMessages')
      );

      if (channels.size === 0) {
        console.error('🐕 No accessible text channels found');
        return false;
      }

      // Post to multiple channels to ensure server icon badge appears
      const promises = [];
      let postedCount = 0;

      for (const [channelId, channel] of channels) {
        if (postedCount >= 3) break; // Limit to 3 channels to avoid spam

        const embed = new EmbedBuilder()
          .setTitle('🔔 Server Notification')
          .setDescription(`**${count}** new server notification${count > 1 ? 's' : ''}`)
          .setColor(0xFF0000) // Red color
          .addFields({
            name: '📋 Reason',
            value: reason,
            inline: true
          })
          .setFooter({ text: 'Bulldog Community Bot • Server Notifications' })
          .setTimestamp();

        promises.push(
          channel.send({ 
            content: `🔔 **${count}** server notification${count > 1 ? 's' : ''} - ${reason}`,
            embeds: [embed]
          }).then(() => {
            postedCount++;
            console.log(`🐕 Posted server notification to ${channel.name}`);
          }).catch(error => {
            console.warn(`🐕 Failed to post to ${channel.name}:`, error.message);
          })
        );
      }

      await Promise.allSettled(promises);

      console.log(`🐕 Created server notification badge with count ${count} across ${postedCount} channels`);
      return postedCount > 0;

    } catch (error) {
      console.error('🐕 Error creating server notification badge:', error);
      return false;
    }
  }

  /**
   * Create notification badges for specific channels
   * @param {Array} channelConfigs - Array of {channelId, count, reason}
   */
  async createMultipleChannelBadges(channelConfigs) {
    try {
      const results = [];
      
      for (const config of channelConfigs) {
        const { channelId, count = 1, reason = 'Channel notification' } = config;
        const success = await this.createChannelNotificationBadge(channelId, count, reason);
        results.push({ channelId, success });
        
        // Small delay between channels to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`🐕 Created badges for ${successCount}/${results.length} channels`);
      
      return results;

    } catch (error) {
      console.error('🐕 Error creating multiple channel badges:', error);
      return [];
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
   * Create a comprehensive notification system
   * @param {Object} config - Notification configuration
   */
  async createComprehensiveNotification(config) {
    try {
      const {
        serverBadge = { count: 1, reason: 'Server update' },
        channelBadges = [],
        gamesChannelBadge = { count: 1, reason: 'Game event' }
      } = config;

      const results = {
        serverBadge: false,
        channelBadges: [],
        gamesChannelBadge: false
      };

      // Create server icon badge
      if (serverBadge.count > 0) {
        results.serverBadge = await this.createServerNotificationBadge(
          serverBadge.count, 
          serverBadge.reason
        );
      }

      // Create channel-specific badges
      if (channelBadges.length > 0) {
        results.channelBadges = await this.createMultipleChannelBadges(channelBadges);
      }

      // Create games channel badge specifically
      if (gamesChannelBadge.count > 0 && this.gamesChannelId) {
        results.gamesChannelBadge = await this.createChannelNotificationBadge(
          this.gamesChannelId,
          gamesChannelBadge.count,
          gamesChannelBadge.reason
        );
      }

      console.log('🐕 Comprehensive notification system activated:', results);
      return results;

    } catch (error) {
      console.error('🐕 Error creating comprehensive notification:', error);
      return null;
    }
  }
}

export default BulldogCommunityBot;
