# 🗄️ Database Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/puppers_database?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Discord Bot Configuration (for future integration)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_BOT_TOKEN=your-discord-bot-token

# Web3 Configuration
NEXT_PUBLIC_APECHAIN_RPC_URL=https://rpc.apechain.network
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address

# Admin Configuration
ADMIN_WALLET_ADDRESS=your-admin-wallet-address
```

## MongoDB Atlas Setup Steps

1. **Get your connection string from MongoDB Atlas:**
   - Go to your cluster in MongoDB Atlas
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `puppers_database`

2. **Update the MONGODB_URI in .env.local**

3. **Generate a JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Database Collections

The following collections will be created automatically:

- `users` - User profiles and wallet data
- `achievements` - User achievements and unlocks
- `powerups` - User powerup inventory
- `gamesessions` - Game session data
- `discordroles` - Discord role mappings
