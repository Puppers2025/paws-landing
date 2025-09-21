import { EmbedBuilder } from 'discord.js';

/**
 * Discord Level Up Notification System
 * Handles posting level up messages to the correct Discord channels
 */

export class DiscordLevelNotifications {
  constructor() {
    // Channel IDs from Discord bot config
    this.gamesChannelId = '1412288663190245478'; // Games channel ID
    this.puppyLoungeChannelId = '1412289252833624094'; // Puppy lounge channel ID
    this.announcementsChannelId = '1412285717412843681'; // Announcements channel ID
  }

  /**
   * Post level up notification to games channel
   * @param {Object} client - Discord client
   * @param {Object} user - User object with level and role info
   * @param {Object} levelUpData - Level up data from addExperience method
   * @returns {Promise<boolean>} Success status
   */
  async postLevelUpNotification(client, user, levelUpData) {
    try {
      if (!client || !user || !levelUpData) {
        console.error('Missing required parameters for level up notification');
        return false;
      }

      // Get the games channel
      const gamesChannel = client.channels.cache.get(this.gamesChannelId);
      if (!gamesChannel) {
        console.error(`Games channel ${this.gamesChannelId} not found`);
        return false;
      }

      // Create level up embed
      const embed = this.createLevelUpEmbed(user, levelUpData);
      
      // Post to games channel
      await gamesChannel.send({ embeds: [embed] });
      
      console.log(`✅ Posted level up notification for ${user.username} (Level ${levelUpData.newLevel}) to games channel`);
      return true;

    } catch (error) {
      console.error('❌ Error posting level up notification:', error);
      return false;
    }
  }

  /**
   * Create level up embed message
   * @param {Object} user - User object
   * @param {Object} levelUpData - Level up data
   * @returns {EmbedBuilder} Discord embed
   */
  createLevelUpEmbed(user, levelUpData) {
    const { levelUps, newLevel, gameRoleUpdate } = levelUpData;
    
    // Determine level up message based on level
    let levelUpMessage = this.getLevelUpMessage(newLevel);
    let color = this.getLevelUpColor(newLevel);
    let emoji = this.getLevelUpEmoji(newLevel);

    const embed = new EmbedBuilder()
      .setTitle(`${emoji} Level Up! ${emoji}`)
      .setDescription(`**${user.username}** has leveled up!`)
      .addFields(
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
      )
      .setColor(color)
      .setFooter({ text: 'Puppers Game • Level Progression' })
      .setTimestamp();

    // Add role update information if applicable
    if (gameRoleUpdate && gameRoleUpdate.roleChanged) {
      embed.addFields({
        name: '🎭 Role Update',
        value: `**${gameRoleUpdate.oldRole}** → **${gameRoleUpdate.newRole}**`,
        inline: false
      });
    }

    // Add special message for milestone levels
    if (levelUpMessage) {
      embed.addFields({
        name: '🎉 Milestone Achievement',
        value: levelUpMessage,
        inline: false
      });
    }

    // Add experience progress
    const progressBar = this.createProgressBar(user.experience, user.experienceToNextLevel);
    embed.addFields({
      name: '📊 Experience Progress',
      value: `${progressBar} (${user.experience}/${user.experienceToNextLevel} XP)`,
      inline: false
    });

    return embed;
  }

  /**
   * Get level up message for milestone levels
   * @param {number} level - User's new level
   * @returns {string|null} Special message or null
   */
  getLevelUpMessage(level) {
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
   * Get color for level up embed based on level
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
   * Post role change notification to appropriate channel
   * @param {Object} client - Discord client
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {Promise<boolean>} Success status
   */
  async postRoleChangeNotification(client, user, roleChangeData) {
    try {
      if (!client || !user || !roleChangeData) {
        console.error('Missing required parameters for role change notification');
        return false;
      }

      // Get the games channel
      const gamesChannel = client.channels.cache.get(this.gamesChannelId);
      if (!gamesChannel) {
        console.error(`Games channel ${this.gamesChannelId} not found`);
        return false;
      }

      // Create role change embed
      const embed = this.createRoleChangeEmbed(user, roleChangeData);
      
      // Post to games channel
      await gamesChannel.send({ embeds: [embed] });
      
      console.log(`✅ Posted role change notification for ${user.username} to games channel`);
      return true;

    } catch (error) {
      console.error('❌ Error posting role change notification:', error);
      return false;
    }
  }

  /**
   * Create role change embed message
   * @param {Object} user - User object
   * @param {Object} roleChangeData - Role change data
   * @returns {EmbedBuilder} Discord embed
   */
  createRoleChangeEmbed(user, roleChangeData) {
    const { oldRole, newRole, level } = roleChangeData;
    
    const embed = new EmbedBuilder()
      .setTitle('🎭 Role Promotion!')
      .setDescription(`**${user.username}** has earned a new role!`)
      .addFields(
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
      )
      .setColor(0x00FF00)
      .setFooter({ text: 'Puppers Game • Role Management' })
      .setTimestamp();

    // Add congratulations message
    embed.addFields({
      name: '🎉 Congratulations!',
      value: `You now have access to additional features and rewards with your **${newRole}** role!`,
      inline: false
    });

    return embed;
  }
}

export default DiscordLevelNotifications;
