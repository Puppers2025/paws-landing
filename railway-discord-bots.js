/**
 * Railway Discord Bots
 * Runs all Discord bots on Railway infrastructure
 * This file should be deployed to Railway alongside your Discord setup
 */

import { config } from 'dotenv';
import BulldogCommunityBot from './lib/bulldog-community-bot.js';
import PuppersGameBot from './lib/puppers-game-bot.js';

// Load environment variables
config({ path: '.env.local' });

class RailwayDiscordBotManager {
  constructor() {
    this.bulldogBot = new BulldogCommunityBot();
    this.gameBot = new PuppersGameBot();
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('🚂 Railway Discord Bots already running');
      return;
    }

    console.log('🚂 Starting Railway Discord Bots...');

    try {
      // Start Bulldog Community Bot
      console.log('🐕 Starting Bulldog Community Bot...');
      const bulldogConnected = await this.bulldogBot.connect();
      
      if (bulldogConnected) {
        console.log('✅ Bulldog Community Bot connected successfully');
      } else {
        console.error('❌ Failed to connect Bulldog Community Bot');
      }

      // Start Puppers Game Bot
      console.log('🎮 Starting Puppers Game Bot...');
      const gameConnected = await this.gameBot.connect();
      
      if (gameConnected) {
        console.log('✅ Puppers Game Bot connected successfully');
      } else {
        console.error('❌ Failed to connect Puppers Game Bot');
      }

      this.isRunning = true;
      console.log('🚂 Railway Discord Bots started successfully!');

      // Keep the process alive
      this.keepAlive();

    } catch (error) {
      console.error('❌ Error starting Railway Discord Bots:', error);
    }
  }

  async stop() {
    if (!this.isRunning) {
      console.log('🚂 Railway Discord Bots not running');
      return;
    }

    console.log('🚂 Stopping Railway Discord Bots...');

    try {
      await this.bulldogBot.disconnect();
      await this.gameBot.disconnect();
      
      this.isRunning = false;
      console.log('🚂 Railway Discord Bots stopped successfully');

    } catch (error) {
      console.error('❌ Error stopping Railway Discord Bots:', error);
    }
  }

  keepAlive() {
    // Keep the process alive and log status every 5 minutes
    setInterval(() => {
      if (this.isRunning) {
        console.log('🚂 Railway Discord Bots running...');
        console.log(`   - Bulldog Community Bot: ${this.bulldogBot.client.isReady() ? '✅ Ready' : '❌ Disconnected'}`);
        console.log(`   - Puppers Game Bot: ${this.gameBot.client.isReady() ? '✅ Ready' : '❌ Disconnected'}`);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // API endpoints for website integration
  async createNotificationBadges(config) {
    if (!this.isRunning) {
      console.error('🚂 Railway Discord Bots not running');
      return false;
    }

    try {
      const results = await this.bulldogBot.createComprehensiveNotification(config);
      console.log('🚂 Notification badges created via Railway:', results);
      return results;
    } catch (error) {
      console.error('🚂 Error creating notification badges:', error);
      return false;
    }
  }

  async postGameNotification(user, levelUpData) {
    if (!this.isRunning) {
      console.error('🚂 Railway Discord Bots not running');
      return false;
    }

    try {
      const result = await this.gameBot.postLevelUpNotification(user, levelUpData);
      console.log('🚂 Game notification posted via Railway:', result);
      return result;
    } catch (error) {
      console.error('🚂 Error posting game notification:', error);
      return false;
    }
  }

  async postRoleChangeNotification(user, roleChangeData) {
    if (!this.isRunning) {
      console.error('🚂 Railway Discord Bots not running');
      return false;
    }

    try {
      const result = await this.gameBot.postRoleChangeNotification(user, roleChangeData);
      console.log('🚂 Role change notification posted via Railway:', result);
      return result;
    } catch (error) {
      console.error('🚂 Error posting role change notification:', error);
      return false;
    }
  }
}

// Create global instance
const railwayBotManager = new RailwayDiscordBotManager();

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🚂 Received SIGINT, stopping Railway Discord Bots...');
  await railwayBotManager.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🚂 Received SIGTERM, stopping Railway Discord Bots...');
  await railwayBotManager.stop();
  process.exit(0);
});

// Start the bots
railwayBotManager.start().catch(console.error);

export default railwayBotManager;
