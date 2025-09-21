import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Discord Notification Badge System
 * Creates custom red notification badges for Discord channels
 */
export class DiscordNotificationBadges {
  constructor() {
    this.badgeEmojis = {
      unread: '🔴',
      new: '🆕',
      important: '⚠️',
      update: '🔄',
      achievement: '🏆',
      level: '📈',
      role: '🎭',
      game: '🎮'
    };
  }

  /**
   * Create a channel notification badge message
   * @param {string} channelId - Discord channel ID
   * @param {string} badgeType - Type of badge (unread, new, important, etc.)
   * @param {number} count - Number of notifications
   * @param {string} message - Custom message
   * @returns {Object} Discord message object
   */
  createChannelBadge(channelId, badgeType = 'unread', count = 0, message = '') {
    const emoji = this.badgeEmojis[badgeType] || this.badgeEmojis.unread;
    
    const embed = new EmbedBuilder()
      .setTitle(`${emoji} Channel Notification`)
      .setDescription(message || `You have ${count} new notification${count !== 1 ? 's' : ''} in this channel`)
      .setColor(0xFF0000) // Red color
      .setTimestamp();

    if (count > 0) {
      embed.addFields({
        name: '📊 Notification Count',
        value: `**${count}** new item${count !== 1 ? 's' : ''}`,
        inline: true
      });
    }

    // Add action buttons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`mark_read_${channelId}`)
          .setLabel('Mark as Read')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId(`view_notifications_${channelId}`)
          .setLabel('View Details')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('👁️')
      );

    return {
      embeds: [embed],
      components: [row]
    };
  }

  /**
   * Create a user profile notification badge
   * @param {string} userId - Discord user ID
   * @param {Object} userStats - User statistics
   * @returns {Object} Discord message object
   */
  createUserProfileBadge(userId, userStats) {
    const { level, experience, gameRole, nftCount, achievements } = userStats;
    
    const embed = new EmbedBuilder()
      .setTitle('👤 User Profile')
      .setDescription(`<@${userId}>'s current status`)
      .setColor(0x00FF00)
      .setTimestamp();

    // Add user stats
    embed.addFields(
      {
        name: '🎯 Level',
        value: `**${level}**`,
        inline: true
      },
      {
        name: '📈 Experience',
        value: `**${experience}** XP`,
        inline: true
      },
      {
        name: '🎮 Game Role',
        value: `**${gameRole || 'Puppy'}**`,
        inline: true
      },
      {
        name: '🖼️ NFT Count',
        value: `**${nftCount || 0}** NFTs`,
        inline: true
      },
      {
        name: '🏆 Achievements',
        value: `**${achievements?.length || 0}** earned`,
        inline: true
      }
    );

    // Add progress bar for experience
    if (userStats.experienceToNextLevel) {
      const progressBar = this.createProgressBar(experience, userStats.experienceToNextLevel);
      embed.addFields({
        name: '📊 Progress to Next Level',
        value: progressBar,
        inline: false
      });
    }

    return {
      embeds: [embed]
    };
  }

  /**
   * Create a server-wide notification summary
   * @param {Object} serverStats - Server statistics
   * @returns {Object} Discord message object
   */
  createServerNotificationSummary(serverStats) {
    const { totalUsers, activeUsers, levelUps, roleChanges, newAchievements } = serverStats;
    
    const embed = new EmbedBuilder()
      .setTitle('📊 Server Activity Summary')
      .setDescription('Recent activity across all channels')
      .setColor(0x0099FF)
      .setTimestamp();

    embed.addFields(
      {
        name: '👥 Total Users',
        value: `**${totalUsers}**`,
        inline: true
      },
      {
        name: '🟢 Active Users',
        value: `**${activeUsers}**`,
        inline: true
      },
      {
        name: '📈 Level Ups',
        value: `**${levelUps}**`,
        inline: true
      },
      {
        name: '🎭 Role Changes',
        value: `**${roleChanges}**`,
        inline: true
      },
      {
        name: '🏆 New Achievements',
        value: `**${newAchievements}**`,
        inline: true
      }
    );

    return {
      embeds: [embed]
    };
  }

  /**
   * Create a channel-specific notification list
   * @param {string} channelId - Discord channel ID
   * @param {Array} notifications - Array of notifications
   * @returns {Object} Discord message object
   */
  createChannelNotificationList(channelId, notifications) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Channel Notifications')
      .setDescription(`Recent notifications for this channel`)
      .setColor(0xFF6B6B)
      .setTimestamp();

    if (notifications.length === 0) {
      embed.addFields({
        name: '✅ No Notifications',
        value: 'You\'re all caught up!',
        inline: false
      });
    } else {
      // Group notifications by type
      const groupedNotifications = this.groupNotificationsByType(notifications);
      
      for (const [type, typeNotifications] of Object.entries(groupedNotifications)) {
        const emoji = this.badgeEmojis[type] || '📌';
        const count = typeNotifications.length;
        
        embed.addFields({
          name: `${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`,
          value: typeNotifications.slice(0, 5).map(n => `• ${n.message}`).join('\n') + 
                 (count > 5 ? `\n• ... and ${count - 5} more` : ''),
          inline: false
        });
      }
    }

    return {
      embeds: [embed]
    };
  }

  /**
   * Group notifications by type
   * @param {Array} notifications - Array of notifications
   * @returns {Object} Grouped notifications
   */
  groupNotificationsByType(notifications) {
    return notifications.reduce((groups, notification) => {
      const type = notification.type || 'unread';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(notification);
      return groups;
    }, {});
  }

  /**
   * Create progress bar for experience
   * @param {number} current - Current value
   * @param {number} max - Maximum value
   * @returns {string} Progress bar string
   */
  createProgressBar(current, max) {
    const percentage = Math.min(100, Math.floor((current / max) * 100));
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
  }

  /**
   * Create a notification badge for a specific event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   * @returns {Object} Discord message object
   */
  createEventBadge(eventType, eventData) {
    const eventConfigs = {
      levelUp: {
        emoji: '📈',
        color: 0x00FF00,
        title: 'Level Up!',
        description: `${eventData.username} reached level ${eventData.newLevel}!`
      },
      roleChange: {
        emoji: '🎭',
        color: 0xFF6B6B,
        title: 'Role Change!',
        description: `${eventData.username} earned the ${eventData.newRole} role!`
      },
      achievement: {
        emoji: '🏆',
        color: 0xFFD700,
        title: 'Achievement Unlocked!',
        description: `${eventData.username} earned the ${eventData.achievementName} achievement!`
      },
      nftUpdate: {
        emoji: '🖼️',
        color: 0x4ECDC4,
        title: 'NFT Count Updated!',
        description: `${eventData.username} now has ${eventData.nftCount} NFTs!`
      }
    };

    const config = eventConfigs[eventType] || eventConfigs.levelUp;
    
    const embed = new EmbedBuilder()
      .setTitle(`${config.emoji} ${config.title}`)
      .setDescription(config.description)
      .setColor(config.color)
      .setTimestamp();

    return {
      embeds: [embed]
    };
  }
}

export default DiscordNotificationBadges;
