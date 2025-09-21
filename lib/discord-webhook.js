/**
 * Discord Webhook Service
 * Lightweight Discord integration using webhooks instead of discord.js
 */

export class DiscordWebhookService {
  constructor() {
    this.gamesChannelWebhook = process.env.DISCORD_GAMES_WEBHOOK_URL;
    this.announcementsWebhook = process.env.DISCORD_ANNOUNCEMENTS_WEBHOOK_URL;
  }

  /**
   * Post level up notification to Discord games channel
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {Promise<boolean>} Success status
   */
  async postLevelUpNotification(user, levelUpData) {
    try {
      if (!this.gamesChannelWebhook) {
        console.warn('Discord games webhook not configured');
        return false;
      }

      const { levelUps, newLevel, gameRoleUpdate } = levelUpData;
      
      // Create level up message with custom red notification badge
      const message = this.createLevelUpMessage(user, levelUpData);
      
      // Post to Discord webhook
      const response = await fetch(this.gamesChannelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        console.log(`✅ Posted level up notification for ${user.username} (Level ${newLevel}) to games channel`);
        
        // Post custom red notification badge
        await this.postNotificationBadge('levelUp', user, levelUpData);
        return true;
      } else {
        console.error('Failed to post level up notification:', response.status, response.statusText);
        return false;
      }

    } catch (error) {
      console.error('Error posting level up notification:', error);
      return false;
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
      if (!this.gamesChannelWebhook) {
        console.warn('Discord games webhook not configured');
        return false;
      }

      const { oldRole, newRole, level, nftCount } = roleChangeData;
      
      // Create role change message
      const message = this.createRoleChangeMessage(user, roleChangeData);
      
      // Post to Discord webhook
      const response = await fetch(this.gamesChannelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        console.log(`✅ Posted role change notification for ${user.username} to games channel`);
        
        // Post custom red notification badge
        await this.postNotificationBadge('roleChange', user, roleChangeData);
        return true;
      } else {
        console.error('Failed to post role change notification:', response.status, response.statusText);
        return false;
      }

    } catch (error) {
      console.error('Error posting role change notification:', error);
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
   * Post custom red notification badge
   * @param {string} eventType - Type of event (levelUp, roleChange, etc.)
   * @param {Object} user - User object
   * @param {Object} eventData - Event data
   * @returns {Promise<boolean>} Success status
   */
  async postNotificationBadge(eventType, user, eventData) {
    try {
      if (!this.gamesChannelWebhook) {
        console.warn('Discord games webhook not configured');
        return false;
      }

      // Create custom red notification badge message
      const badgeMessage = this.createNotificationBadge(eventType, user, eventData);
      
      // Post to Discord webhook
      const response = await fetch(this.gamesChannelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(badgeMessage)
      });

      if (response.ok) {
        console.log(`✅ Posted custom red notification badge for ${eventType}`);
        return true;
      } else {
        console.error('Failed to post notification badge:', response.status, response.statusText);
        return false;
      }

    } catch (error) {
      console.error('Error posting notification badge:', error);
      return false;
    }
  }

  /**
   * Create custom red notification badge message
   * @param {string} eventType - Type of event
   * @param {Object} user - User object
   * @param {Object} eventData - Event data
   * @returns {Object} Discord webhook message
   */
  createNotificationBadge(eventType, user, eventData) {
    const badgeConfigs = {
      levelUp: {
        emoji: '🔴',
        title: '🔴 LEVEL UP NOTIFICATION',
        color: 0xFF0000, // Bright red
        description: `**${user.username}** has leveled up! Check the games channel for details.`
      },
      roleChange: {
        emoji: '🔴',
        title: '🔴 ROLE CHANGE NOTIFICATION',
        color: 0xFF0000, // Bright red
        description: `**${user.username}** has earned a new role! Check the games channel for details.`
      },
      nftUpdate: {
        emoji: '🔴',
        title: '🔴 NFT UPDATE NOTIFICATION',
        color: 0xFF0000, // Bright red
        description: `**${user.username}**'s NFT count has been updated! Check the games channel for details.`
      }
    };

    const config = badgeConfigs[eventType] || badgeConfigs.levelUp;
    
    const embed = {
      title: config.title,
      description: config.description,
      color: config.color,
      fields: [
        {
          name: '👤 User',
          value: `**${user.username}**`,
          inline: true
        },
        {
          name: '🎯 Level',
          value: `**${user.level || 1}**`,
          inline: true
        },
        {
          name: '🎮 Game Role',
          value: `**${user.gameRole || 'Puppy'}**`,
          inline: true
        }
      ],
      footer: {
        text: '🔴 Custom Red Notification Badge • Puppers Game'
      },
      timestamp: new Date().toISOString()
    };

    // Add event-specific information
    if (eventType === 'levelUp' && eventData.newLevel) {
      embed.fields.push({
        name: '📈 New Level',
        value: `**${eventData.newLevel}**`,
        inline: true
      });
    }

    if (eventType === 'roleChange' && eventData.newRole) {
      embed.fields.push({
        name: '🎭 New Role',
        value: `**${eventData.newRole}**`,
        inline: true
      });
    }

    if (eventType === 'nftUpdate' && eventData.nftCount !== undefined) {
      embed.fields.push({
        name: '🖼️ NFT Count',
        value: `**${eventData.nftCount}**`,
        inline: true
      });
    }

    return {
      content: `${config.emoji} **CUSTOM RED NOTIFICATION BADGE** ${config.emoji}`,
      embeds: [embed]
    };
  }

  /**
   * Post server profile icon with counter
   * @param {Object} user - User object
   * @param {Object} stats - User statistics
   * @returns {Promise<boolean>} Success status
   */
  async postServerProfileIcon(user, stats) {
    try {
      if (!this.gamesChannelWebhook) {
        console.warn('Discord games webhook not configured');
        return false;
      }

      // Create server profile icon message
      const profileMessage = this.createServerProfileIcon(user, stats);
      
      // Post to Discord webhook
      const response = await fetch(this.gamesChannelWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileMessage)
      });

      if (response.ok) {
        console.log(`✅ Posted server profile icon for ${user.username}`);
        return true;
      } else {
        console.error('Failed to post server profile icon:', response.status, response.statusText);
        return false;
      }

    } catch (error) {
      console.error('Error posting server profile icon:', error);
      return false;
    }
  }

  /**
   * Create server profile icon message
   * @param {Object} user - User object
   * @param {Object} stats - User statistics
   * @returns {Object} Discord webhook message
   */
  createServerProfileIcon(user, stats) {
    const embed = {
      title: '👤 Server Profile Icon Update',
      description: `**${user.username}**'s profile has been updated with new counters`,
      color: 0x00FF00, // Green
      fields: [
        {
          name: '🎯 Level Counter',
          value: `**${user.level || 1}**`,
          inline: true
        },
        {
          name: '📈 Experience Counter',
          value: `**${user.experience || 0}** XP`,
          inline: true
        },
        {
          name: '🎮 Role Counter',
          value: `**${user.gameRole || 'Puppy'}**`,
          inline: true
        },
        {
          name: '🖼️ NFT Counter',
          value: `**${user.nftCount || 0}** NFTs`,
          inline: true
        }
      ],
      footer: {
        text: '👤 Server Profile Icon • Puppers Game'
      },
      timestamp: new Date().toISOString()
    };

    return {
      content: '👤 **SERVER PROFILE ICON UPDATE** 👤',
      embeds: [embed]
    };
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
