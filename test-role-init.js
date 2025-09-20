// Test role initialization directly
import mongoose from 'mongoose';
import DiscordRole from './models/DiscordRole.js';
import { DISCORD_ROLE_MAPPINGS } from './lib/discord-role-mapping.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-puppers_database:hAFuPH89BjA38plz@puppers-database.x0ycit2.mongodb.net/?retryWrites=true&w=majority';

async function testRoleInit() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('Testing role initialization...');
    
    // Clear existing roles first
    await DiscordRole.deleteMany({});
    console.log('Cleared existing roles');
    
    const roles = [];
    
    // Create roles from mappings
    for (const [roleName, roleData] of Object.entries(DISCORD_ROLE_MAPPINGS)) {
      console.log(`Creating role: ${roleName}`);
      
      const newRole = new DiscordRole({
        roleId: `role_${roleName.toLowerCase().replace(/\s+/g, '_')}`,
        roleName,
        levelRequired: 1, // Default level requirement
        gameLevelRequired: roleData.gameLevelRequired,
        nftRequired: roleData.nftRequired,
        color: roleData.color,
        priority: roleData.priority,
        description: roleData.description,
        guildId: 'default',
        isActive: true,
        isExclusive: false,
        isStackable: true
      });
      
      await newRole.save();
      roles.push(newRole);
      console.log(`✅ Created role: ${roleName}`);
    }
    
    console.log(`\n✅ Successfully created ${roles.length} roles:`);
    roles.forEach(role => {
      console.log(`- ${role.roleName}: ${role.nftRequired} NFTs or Level ${role.gameLevelRequired}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testRoleInit();
