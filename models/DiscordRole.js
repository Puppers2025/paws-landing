import mongoose from 'mongoose';

const discordRoleSchema = new mongoose.Schema({
  // Role Definition
  roleId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  roleName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Level Requirements
  levelRequired: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Role Properties
  color: {
    type: String,
    default: '#FF0000',
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Invalid color format'
    }
  },
  
  permissions: [{
    type: String,
    enum: [
      'view_channel',
      'send_messages',
      'manage_messages',
      'manage_channels',
      'kick_members',
      'ban_members',
      'manage_roles',
      'manage_guild',
      'administrator'
    ]
  }],
  
  // Discord Server Info
  guildId: {
    type: String,
    required: true,
    trim: true
  },
  
  // Role Hierarchy
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Role Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Special Properties
  isExclusive: {
    type: Boolean,
    default: false // If true, user can only have this role
  },
  
  isStackable: {
    type: Boolean,
    default: true // If true, user can have multiple roles
  },
  
  // Rewards for having this role
  rewards: {
    dailyPawsTokens: {
      type: Number,
      default: 0
    },
    experienceMultiplier: {
      type: Number,
      default: 1.0,
      min: 1.0
    },
    powerupDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100 // Percentage discount
    }
  },
  
  // Role Description
  description: {
    type: String,
    trim: true
  },
  
  // Welcome Message
  welcomeMessage: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'discordroles'
});

// Indexes
discordRoleSchema.index({ roleId: 1 });
discordRoleSchema.index({ levelRequired: 1 });
discordRoleSchema.index({ guildId: 1 });
discordRoleSchema.index({ priority: -1 });

// Static method to get roles by level
discordRoleSchema.statics.getRolesByLevel = function(level) {
  return this.find({ 
    levelRequired: { $lte: level }, 
    isActive: true 
  }).sort({ levelRequired: -1 });
};

// Static method to get next role
discordRoleSchema.statics.getNextRole = function(currentLevel) {
  return this.findOne({ 
    levelRequired: { $gt: currentLevel }, 
    isActive: true 
  }).sort({ levelRequired: 1 });
};

// Method to check if user qualifies for role
discordRoleSchema.methods.userQualifies = function(userLevel) {
  return userLevel >= this.levelRequired && this.isActive;
};

// Static method to sync roles with Discord
discordRoleSchema.statics.syncWithDiscord = async function(guildId, discordClient) {
  try {
    const guild = await discordClient.guilds.fetch(guildId);
    const roles = await guild.roles.fetch();
    
    const roleUpdates = [];
    
    for (const [roleId, role] of roles) {
      const existingRole = await this.findOne({ roleId });
      
      if (existingRole) {
        // Update existing role
        existingRole.roleName = role.name;
        existingRole.color = role.hexColor;
        existingRole.permissions = role.permissions.toArray();
        await existingRole.save();
        roleUpdates.push(`Updated role: ${role.name}`);
      } else {
        // Create new role
        const newRole = new this({
          roleId: role.id,
          roleName: role.name,
          levelRequired: 1, // Default level requirement
          color: role.hexColor,
          permissions: role.permissions.toArray(),
          guildId: guildId
        });
        await newRole.save();
        roleUpdates.push(`Created role: ${role.name}`);
      }
    }
    
    return roleUpdates;
  } catch (error) {
    console.error('Error syncing roles with Discord:', error);
    throw error;
  }
};

export default mongoose.models.DiscordRole || mongoose.model('DiscordRole', discordRoleSchema);
