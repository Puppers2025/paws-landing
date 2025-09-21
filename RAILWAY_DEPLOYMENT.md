# Railway Discord Bots Deployment

## 🚂 Deploy Discord Bots to Railway

This guide will help you deploy the Discord bots to Railway alongside your existing Discord setup.

### Prerequisites
- Railway account with existing Discord project
- Discord bot tokens and environment variables
- Access to your Railway project

### Step 1: Add Environment Variables to Railway

Add these environment variables to your Railway project:

```bash
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_bulldog_community_bot_token
PUPPERS_GAME_BOT_TOKEN=your_puppers_game_bot_token
DISCORD_GUILD_ID=1412282717164408903
DISCORD_GAMES_CHANNEL_ID=1412288663190245478

# API Configuration
PORT=3001
NODE_ENV=production
```

### Step 2: Deploy to Railway

1. **Option A: Deploy from GitHub**
   - Connect this repository to Railway
   - Set the root directory to the project root
   - Railway will automatically detect the `railway.json` configuration

2. **Option B: Deploy via Railway CLI**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy the project
   railway up
   ```

### Step 3: Update Website Configuration

Add the Railway Discord service URL to your Vercel environment variables:

```bash
# In Vercel dashboard or via CLI
RAILWAY_DISCORD_URL=https://your-railway-project.railway.app
```

### Step 4: Test the Integration

1. **Check Railway Logs**
   ```bash
   railway logs
   ```
   You should see:
   ```
   🚂 Starting Railway Discord Bots...
   🐕 Starting Bulldog Community Bot...
   ✅ Bulldog Community Bot connected successfully
   🎮 Starting Puppers Game Bot...
   ✅ Puppers Game Bot connected successfully
   🚂 Railway Discord Bots started successfully!
   ```

2. **Test from Website**
   - Visit your website
   - Trigger a level up or role change
   - Check Discord for notifications

### Features

#### 🐕 Bulldog Community Bot
- Manages red notification badges for all channels
- Creates server icon notification badges
- Comprehensive notification system across all 34 channels
- Channel-specific badge management

#### 🎮 Puppers Game Bot
- Handles website game notifications
- Level up notifications with native badges
- Role change notifications with native badges
- Clean embed messages

#### 🚂 Railway Integration
- Both bots run continuously on Railway
- API endpoints for website communication
- Health checks and monitoring
- Automatic restart on failure

### API Endpoints

The Railway service exposes these endpoints:

- `GET /api/status` - Check bot status
- `POST /api/notification-badges` - Create notification badges
- `POST /api/game-notifications/level-up` - Post level up notification
- `POST /api/game-notifications/role-change` - Post role change notification

### Monitoring

- **Health Check**: `GET /health`
- **Status Check**: `GET /api/status`
- **Logs**: `railway logs`

### Troubleshooting

1. **Bots not connecting**
   - Check Discord bot tokens
   - Verify bot permissions in Discord
   - Check Railway logs for errors

2. **Website can't reach Railway**
   - Verify `RAILWAY_DISCORD_URL` environment variable
   - Check Railway service is running
   - Test API endpoints directly

3. **Notifications not appearing**
   - Check Discord channel permissions
   - Verify bot has access to channels
   - Check Railway logs for errors

### Benefits of Railway Deployment

✅ **Continuous Operation**: Bots run 24/7 on Railway
✅ **Reliability**: Automatic restart on failure
✅ **Scalability**: Can handle multiple requests
✅ **Monitoring**: Built-in health checks and logs
✅ **Integration**: Easy API communication with website
✅ **Cost Effective**: Pay only for what you use

### Next Steps

1. Deploy to Railway
2. Update website environment variables
3. Test the integration
4. Monitor bot performance
5. Scale as needed

The Discord bots will now run continuously on Railway, providing reliable notification badge management for your Discord server!
