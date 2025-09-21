/**
 * Puppers Game Bot
 * Dedicated Discord bot for website game notifications
 * Separate from the main Puppers Community Discord Bot
 */

import { Client, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

class PuppersGameBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User],
    });

    // Use separate token for game bot
    this.token = process.env.PUPPERS_GAME_BOT_TOKEN || process.env.DISCORD_BOT_TOKEN;
    this.guildId = process.env.DISCORD_GUILD_ID;
    this.gamesChannelId = process.env.DISCORD_GAMES_CHANNEL_ID;

    this.client.once('ready', () => {
      console.log(`🎮 Puppers Game Bot Ready! Logged in as ${this.client.user.tag}`);
    });

    this.client.on('error', error => {
      console.error('🎮 Puppers Game Bot Error:', error);
    });
  }

  async connect() {
    if (!this.token) {
      console.error('🎮 Puppers Game Bot Token not found. Please set PUPPERS_GAME_BOT_TOKEN in your environment variables.');
      return false;
    }
    
    try {
      await this.client.login(this.token);
      return true;
    } catch (error) {
      console.error('🎮 Failed to connect Puppers Game Bot:', error);
      return false;
    }
  }

  async disconnect() {
    this.client.destroy();
    console.log('🎮 Puppers Game Bot disconnected.');
  }

  async getGuild() {
    if (!this.client.isReady()) {
      console.error('🎮 Puppers Game Bot is not ready.');
      return null;
    }
    if (!this.guildId) {
      console.error('🎮 Discord Guild ID not set.');
      return null;
    }
    return this.client.guilds.fetch(this.guildId);
  }

  async getGamesChannel() {
    const guild = await this.getGuild();
    if (!guild || !this.gamesChannelId) {
      console.error('🎮 Games channel ID not set or guild not found.');
      return null;
    }
    return guild.channels.fetch(this.gamesChannelId);
  }

  /**
   * Post level up notification with native Discord notification badge
   */
  async postLevelUpNotification(user, levelUpData) {
    try {
      const gamesChannel = await this.getGamesChannel();
      if (!gamesChannel) {
        console.error('🎮 Could not access games channel');
        return false;
      }

      const { levelUps, newLevel, gameRoleUpdate } = levelUpData;
      
      // Create level up embed
      const embed = new EmbedBuilder()
        .setTitle(`🎮 Level Up! 🎮`)
        .setDescription(`**${user.username}** has leveled up!`)
        .setColor(0x00FF00)
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

      // Add experience progress
      const progressBar = this.createProgressBar(user.experience, user.experienceToNextLevel);
      embed.addFields({
        name: '📊 Experience Progress',
        value: `${progressBar} (${user.experience}/${user.experienceToNextLevel} XP)`,
        inline: false
      });

      // Send message to create native notification badge
      await gamesChannel.send({ 
        content: `🎉 **${user.username}** leveled up to level **${newLevel}**!`,
        embeds: [embed]
      });

      console.log(`🎮 Posted level up notification for ${user.username} (Level ${newLevel})`);
      return true;

    } catch (error) {
      console.error('🎮 Error posting level up notification:', error);
      return false;
    }
  }

  /**
   * Post role change notification with native Discord notification badge
   */
  async postRoleChangeNotification(user, roleChangeData) {
    try {
      const gamesChannel = await this.getGamesChannel();
      if (!gamesChannel) {
        console.error('🎮 Could not access games channel');
        return false;
      }

      const { oldRole, newRole, level, nftCount } = roleChangeData;
      
      const embed = new EmbedBuilder()
        .setTitle('🎭 Role Promotion!')
        .setDescription(`**${user.username}** has earned a new role!`)
        .setColor(0x00FF00)
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
          },
          {
            name: '🎉 Congratulations!',
            value: `You now have access to additional features and rewards with your **${newRole}** role!`,
            inline: false
          }
        )
        .setFooter({ text: 'Puppers Game • Role Management' })
        .setTimestamp();

      // Send message to create native notification badge
      await gamesChannel.send({ 
        content: `🎉 **${user.username}** earned the **${newRole}** role!`,
        embeds: [embed]
      });

      console.log(`🎮 Posted role change notification for ${user.username}`);
      return true;

    } catch (error) {
      console.error('🎮 Error posting role change notification:', error);
      return false;
    }
  }

  /**
   * Create progress bar for experience
   */
  createProgressBar(current, max) {
    const percentage = Math.min(100, Math.floor((current / max) * 100));
    const filled = Math.floor(percentage / 10);
    const empty = 10 - filled;
    
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percentage}%`;
  }
}

export default PuppersGameBot;
