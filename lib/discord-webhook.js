/**
 * Discord Webhook Service
 * Lightweight Discord integration using webhooks with optional Puppers Game Bot for native notification badges
 */

export class DiscordWebhookService {
  constructor() {
    this.gamesChannelWebhook = process.env.DISCORD_GAMES_WEBHOOK_URL;
    this.announcementsWebhook = process.env.DISCORD_ANNOUNCEMENTS_WEBHOOK_URL;
    this.puppersGameBot = null;
    this.botConnected = false;
  }

  /**
   * Initialize Puppers Game Bot (only when needed and available)
   */
  async initializeGameBot() {
    if (!this.puppersGameBot && (process.env.PUPPERS_GAME_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN)) {
      try {
        const { default: PuppersGameBot } = await import('./puppers-game-bot.js');
        this.puppersGameBot = new PuppersGameBot();
        return true;
      } catch (error) {
        console.warn('🎮 Puppers Game Bot not available in this environment:', error.message);
        return false;
      }
    }
    return !!this.puppersGameBot;
  }


  /**
   * Post level up notification to Discord games channel
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Promise<boolean>} Success status
   */
  async postLevelUpNotification(user, levelUpData) {
    try {
      // Try to use Puppers Game Bot for native notification badges
      const botAvailable = await this.initializeGameBot();
      
      if (botAvailable && !this.botConnected) {
        this.botConnected = await this.puppersGameBot.connect();
      }

      if (this.botConnected) {
        // Use Puppers Game Bot for native notification badges
        const success = await this.puppersGameBot.postLevelUpNotification(user, levelUpData);
        
        if (success) {
          console.log(`🎮 Posted level up notification with native badge for ${user.username} (Level ${levelUpData.newLevel})`);
          return true;
        }
      }

      // Fallback to webhook
      console.log('Using webhook fallback for level up notification');
      return await this.fallbackWebhookNotification(user, levelUpData, 'levelUp');

    } catch (error) {
      console.error('Error posting level up notification:', error);
      // Fallback to webhook if bot fails
      return await this.fallbackWebhookNotification(user, levelUpData, 'levelUp');
    }
  }

  /**
   * Post role change notification to Discord games channel
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Promise<boolean>} Success status
   */
  async postRoleChangeNotification(user, roleChangeData) {
    try {
      // Try to use Puppers Game Bot for native notification badges
      const botAvailable = await this.initializeGameBot();
      
      if (botAvailable && !this.botConnected) {
        this.botConnected = await this.puppersGameBot.connect();
      }

      if (this.botConnected) {
        // Use Puppers Game Bot for native notification badges
        const success = await this.puppersGameBot.postRoleChangeNotification(user, roleChangeData);
        
        if (success) {
          console.log(`🎮 Posted role change notification with native badge for ${user.username}`);
          return true;
        }
      }

      // Fallback to webhook
      console.log('Using webhook fallback for role change notification');
      return await this.fallbackWebhookNotification(user, roleChangeData, 'roleChange');

    } catch (error) {
      console.error('Error posting role change notification:', error);
      // Fallback to webhook if bot fails
      return await this.fallbackWebhookNotification(user, roleChangeData, 'roleChange');
    }
  }

  /**
   * Fallback webhook notification when Puppers Game Bot is not available
   */
  async fallbackWebhookNotification(user, data, type) {
    try {
      if (!this.gamesChannelWebhook) {
        console.warn('Discord games webhook not configured');
        return false;
      }

      let message;
      if (type === 'levelUp') {
        message = this.createLevelUpMessage(user, data);
      } else if (type === 'roleChange') {
        message = this.createRoleChangeMessage(user, data);
      } else {
        return false;
      }
      
      // Post to Discord webhook
      const response = await fetch(this.gamesChannelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        console.log(`✅ Posted ${type} notification via webhook fallback for ${user.username}`);
        return true;
      } else {
        console.error(`Failed to post ${type} notification via webhook:`, response.status, response.statusText);
        return false;
      }

    } catch (error) {
      console.error(`Error posting ${type} notification via webhook:`, error);
      return false;
    }
  }


  /**
   * Create level up message for Discord webhook
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Object} Discord webhook message
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
      embeds: [embed]
    };
  }

  /**
   * Create role change message for Discord webhook
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Object} Discord webhook message
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
   * Check if webhook is configured
   * @returns {boolean} Configuration status
   */
  isConfigured() {
    return !!(this.gamesChannelWebhook || this.announcementsWebhook);
  }
}

export default DiscordWebhookService;
