/**
 * Railway Discord Bots Server
 * Express server for Railway deployment with Discord bots
 */

import express from 'express';
import { config } from 'dotenv';
import BulldogCommunityBot from './lib/bulldog-community-bot.js';
import PuppersGameBot from './lib/puppers-game-bot.js';

// Load environment variables
config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Initialize Discord bots
const bulldogBot = new BulldogCommunityBot();
const gameBot = new PuppersGameBot();

let botsConnected = false;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    bots: {
      bulldog: bulldogBot.client.isReady(),
      game: gameBot.client.isReady()
    },
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: botsConnected ? 'available' : 'unavailable',
    bots: {
      bulldog: bulldogBot.client.isReady(),
      game: gameBot.client.isReady()
    },
    uptime: process.uptime()
  });
});

// Community announcement endpoint
app.post('/api/community-announcement', async (req, res) => {
  try {
    const { channelId, title, description, color } = req.body;
    
    if (!channelId || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await bulldogBot.postCommunityAnnouncement(
      channelId,
      title,
      description,
      color
    );

    res.json({ success: result });
  } catch (error) {
    console.error('Error posting community announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Game notification endpoints
app.post('/api/game-notifications/level-up', async (req, res) => {
  try {
    const { user, levelUpData } = req.body;
    
    if (!user || !levelUpData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await gameBot.postLevelUpNotification(user, levelUpData);
    res.json({ success: result });
  } catch (error) {
    console.error('Error posting level up notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/game-notifications/role-change', async (req, res) => {
  try {
    const { user, roleChangeData } = req.body;
    
    if (!user || !roleChangeData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await gameBot.postRoleChangeNotification(user, roleChangeData);
    res.json({ success: result });
  } catch (error) {
    console.error('Error posting role change notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Discord bots
async function startDiscordBots() {
  console.log('🚂 Starting Railway Discord Bots...');

  try {
    // Start Bulldog Community Bot
    console.log('🐕 Starting Bulldog Community Bot...');
    const bulldogConnected = await bulldogBot.connect();
    
    if (bulldogConnected) {
      console.log('✅ Bulldog Community Bot connected successfully');
    } else {
      console.error('❌ Failed to connect Bulldog Community Bot');
    }

    // Start Puppers Game Bot
    console.log('🎮 Starting Puppers Game Bot...');
    const gameConnected = await gameBot.connect();
    
    if (gameConnected) {
      console.log('✅ Puppers Game Bot connected successfully');
    } else {
      console.error('❌ Failed to connect Puppers Game Bot');
    }

    botsConnected = bulldogConnected || gameConnected;

    if (botsConnected) {
      console.log('🚂 Railway Discord Bots started successfully!');
    } else {
      console.error('❌ No Discord bots connected');
    }

  } catch (error) {
    console.error('❌ Error starting Discord bots:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚂 Railway Discord Bots Server running on port ${PORT}`);
  startDiscordBots();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🚂 Received SIGINT, shutting down gracefully...');
  await bulldogBot.disconnect();
  await gameBot.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🚂 Received SIGTERM, shutting down gracefully...');
  await bulldogBot.disconnect();
  await gameBot.disconnect();
  process.exit(0);
});

export default app;
