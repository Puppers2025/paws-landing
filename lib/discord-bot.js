/**
 * Discord Bot for Native Notification Badges
 * Creates actual Discord notification badges on server and channels
 */

import { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } from 'discord.js';

export class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });

    this.guildId = process.env.DISCORD_GUILD_ID;
    this.gamesChannelId = process.env.DISCORD_GAMES_CHANNEL_ID || '1412288663190245478';
    this.announcementsChannelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID || '1412285717412843681';
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.once('ready', () => {
      console.log(`✅ Discord bot logged in as ${this.client.user.tag}`);
      console.log(`🎮 Connected to guild: ${this.guildId}`);
    });

    this.client.on('error', (error) => {
      console.error('Discord bot error:', error);
    });
  }

  /**
   * Connect to Discord
   */
  async connect() {
    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      return true;
    } catch (error) {
      console.error('Failed to connect Discord bot:', error);
      return false;
    }
  }

  /**
   * Disconnect from Discord
   */
  async disconnect() {
    try {
      await this.client.destroy();
      return true;
    } catch (error) {
      console.error('Failed to disconnect Discord bot:', error);
      return false;
    }
  }

  /**
   * Create notification badge by sending a message to a channel
   * This will create the red notification badge on the channel
   * @param {string} channelId - Channel ID to send message to
   * @param {string} content - Message content
   * @param {Object} embed - Embed object
   * @returns {Promise<boolean>} Success status
   */
  async createChannelNotificationBadge(channelId, content, embed = null) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (!channel) {
        console.error(`Channel ${channelId} not found`);
        return false;
      }

      const messageOptions = { content };
      if (embed) {
        messageOptions.embeds = [embed];
      }

      await channel.send(messageOptions);
      console.log(`✅ Created notification badge in channel ${channelId}`);
      return true;
    } catch (error) {
      console.error('Failed to create channel notification badge:', error);
      return false;
    }
  }

  /**
   * Create level up notification with badge
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Promise<boolean>} Success status
   */
  async postLevelUpNotification(user, levelUpData) {
    try {
      const { levelUps, newLevel, gameRoleUpdate } = levelUpData;
      
      // Create level up message
      const message = this.createLevelUpMessage(user, levelUpData);
      
      // Send to games channel to create notification badge
      const success = await this.createChannelNotificationBadge(
        this.gamesChannelId,
        message.content,
        message.embeds[0]
      );

      return success;
    } catch (error) {
      console.error('Error posting level up notification:', error);
      return false;
    }
  }

  /**
   * Create role change notification with badge
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Promise<boolean>} Success status
   */
  async postRoleChangeNotification(user, roleChangeData) {
    try {
      const { oldRole, newRole, level, nftCount } = roleChangeData;
      
      // Create role change message
      const message = this.createRoleChangeMessage(user, roleChangeData);
      
      // Send to games channel to create notification badge
      const success = await this.createChannelNotificationBadge(
        this.gamesChannelId,
        message.content,
        message.embeds[0]
      );

      return success;
    } catch (error) {
      console.error('Error posting role change notification:', error);
      return false;
    }
  }

  /**
   * Create level up message for Discord
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Object} Discord message
   */
  createLevelUpMessage(user, levelUpData) {
    const { levelUps, newLevel, gameRoleUpdate } = levelUpData;
    
    // Determine level up emoji and color based on level
    const emoji = this.getLevelUpEmoji(newLevel);
    const color = this.getLevelUpColor(newLevel);
    
    let description = `**${user.username}** has leveled up!`;
    
    // Add special message for milestone levels
    const milestoneMessage = this.getMilestoneMessage(newLevel);
    if (milestoneMessage) {
      description += `\n\n${milestoneMessage}`;
    }

    const embed = {
      title: `${emoji} Level Up! ${emoji}`,
      description: description,
      color: color,
      fields: [
        {
          name: '🎯 New Level',
          value: `**${newLevel}**`,
          inline: true
        },
        {
          name: '📈 Levels Gained',
          value: `**+${levelUps}**`,
          inline: true
        },
        {
          name: '🎮 Game Role',
          value: `**${user.gameRole || 'Puppy'}**`,
          inline: true
        }
      ],
      footer: {
        text: 'Puppers Game • Level Progression'
      },
      timestamp: new Date().toISOString()
    };

    // Add role update information if applicable
    if (gameRoleUpdate && gameRoleUpdate.roleChanged) {
      embed.fields.push({
        name: '🎭 Role Update',
        value: `**${gameRoleUpdate.oldRole}** → **${gameRoleUpdate.newRole}**`,
        inline: false
      });
    }

    // Add experience progress
    const progressBar = this.createProgressBar(user.experience, user.experienceToNextLevel);
    embed.fields.push({
      name: '📊 Experience Progress',
      value: `${progressBar} (${user.experience}/${user.experienceToNextLevel} XP)`,
      inline: false
    });

    return {
      content: `🎉 **${user.username}** leveled up to level **${newLevel}**!`,
      embeds: [embed]
    };
  }

  /**
   * Create role change message for Discord
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Object} Discord message
   */
  createRoleChangeMessage(user, roleChangeData) {
    const { oldRole, newRole, level, nftCount } = roleChangeData;
    
    const embed = {
      title: '🎭 Role Promotion!',
      description: `**${user.username}** has earned a new role!`,
      color: 0x00FF00,
      fields: [
        {
          name: '🔄 Role Change',
          value: `**${oldRole || 'None'}** → **${newRole}**`,
          inline: true
        },
        {
          name: '🎯 Current Level',
          value: `**${level}**`,
          inline: true
        },
        {
          name: '🎮 Game Role',
          value: `**${newRole}**`,
          inline: true
        }
      ],
      footer: {
        text: 'Puppers Game • Role Management'
      },
      timestamp: new Date().toISOString()
    };

    // Add congratulations message
    embed.fields.push({
      name: '🎉 Congratulations!',
      value: `You now have access to additional features and rewards with your **${newRole}** role!`,
      inline: false
    });

    return {
      content: `🎭 **${user.username}** earned the **${newRole}** role!`,
      embeds: [embed]
    };
  }

  /**
   * Get emoji for level up based on level
   * @param {number} level - User's level
   * @returns {string} Emoji
   */
  getLevelUpEmoji(level) {
    if (level >= 1000) return '🌟';
    if (level >= 500) return '🎖️';
    if (level >= 200) return '🏆';
    if (level >= 100) return '👑';
    if (level >= 50) return '💎';
    if (level >= 25) return '🔥';
    if (level >= 10) return '🌟';
    return '🎮';
  }

  /**
   * Get color for level up based on level
   * @param {number} level - User's level
   * @returns {number} Color code
   */
  getLevelUpColor(level) {
    if (level >= 1000) return 0xFFD700; // Gold
    if (level >= 500) return 0xC0C0C0;  // Silver
    if (level >= 200) return 0xFF6B6B;  // Red
    if (level >= 100) return 0x4ECDC4;  // Teal
    if (level >= 50) return 0x45B7D1;   // Blue
    if (level >= 25) return 0x96CEB4;   // Green
    if (level >= 10) return 0xFFEAA7;   // Yellow
    return 0x74B9FF; // Light blue
  }

  /**
   * Get milestone message for special levels
   * @param {number} level - User's level
   * @returns {string|null} Milestone message or null
   */
  getMilestoneMessage(level) {
    const milestones = {
      10: '🌟 First major milestone! You\'re getting the hang of this!',
      25: '🔥 Quarter century! You\'re becoming a true gamer!',
      50: '💎 Half century! You\'re officially a veteran!',
      100: '👑 Century mark! You\'re a legend in the making!',
      200: '🏆 Double century! You\'re among the elite!',
      500: '🎖️ Half millennium! You\'re a gaming god!',
      1000: '🌟 MILLENNIUM CLUB! You\'ve reached the ultimate level!'
    };

    return milestones[level] || null;
  }

  /**
   * Create progress bar for experience
   * @param {number} current - Current experience
   * @param {number} max - Max experience for next level
   * @returns {string} Progress bar string
   */
  createProgressBar(current, max) {
    const percentage = Math.min(100, Math.floor((current / max) * 100));
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
  }

  /**
   * Check if bot is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.client.readyAt !== null;
  }
}

export default DiscordBot;