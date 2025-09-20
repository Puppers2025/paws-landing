import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Wallet Information
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  
  // Discord Integration
  discordId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but enforces uniqueness when present
    trim: true
  },
  
  discordUsername: {
    type: String,
    trim: true
  },
  
  // Game Profile
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  
  // Game Progress
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  
  experienceToNextLevel: {
    type: Number,
    default: 100
  },
  
  // Game Stats
  totalScore: {
    type: Number,
    default: 0,
    min: 0
  },
  
  gamesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  
  highScore: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Currency
  pawsTokens: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Powerups Inventory
  powerups: [{
    type: {
      type: String,
      enum: ['boost', 'bulletBoost', 'shield', 'speed', 'health'],
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0
    },
    acquiredAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Achievements
  achievements: [{
    achievementId: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  
  // Discord Role Sync
  discordRole: {
    type: String,
    enum: ['puppy', 'adult', 'alpha', 'legend', 'admin'],
    default: 'puppy'
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isBanned: {
    type: Boolean,
    default: false
  },
  
  banReason: {
    type: String,
    trim: true
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  lastGamePlayed: {
    type: Date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'users'
});

// Indexes for better performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ discordId: 1 });
userSchema.index({ username: 1 });
userSchema.index({ level: -1 });
userSchema.index({ totalScore: -1 });

// Virtual for experience percentage to next level
userSchema.virtual('experiencePercentage').get(function() {
  if (this.experienceToNextLevel === 0) return 100;
  return Math.min(100, (this.experience / this.experienceToNextLevel) * 100);
});

// Method to add experience and handle leveling up
userSchema.methods.addExperience = function(amount) {
  this.experience += amount;
  
  // Check for level up
  while (this.experience >= this.experienceToNextLevel) {
    this.experience -= this.experienceToNextLevel;
    this.level += 1;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2); // 20% increase per level
    
    // Update Discord role based on level
    this.updateDiscordRole();
  }
  
  return this.save();
};

// Method to update Discord role based on level
userSchema.methods.updateDiscordRole = function() {
  if (this.level >= 31) {
    this.discordRole = 'legend';
  } else if (this.level >= 16) {
    this.discordRole = 'alpha';
  } else if (this.level >= 6) {
    this.discordRole = 'adult';
  } else {
    this.discordRole = 'puppy';
  }
};

// Method to add powerup
userSchema.methods.addPowerup = function(type, quantity = 1) {
  const existingPowerup = this.powerups.find(p => p.type === type);
  
  if (existingPowerup) {
    existingPowerup.quantity += quantity;
  } else {
    this.powerups.push({ type, quantity });
  }
  
  return this.save();
};

// Method to use powerup
userSchema.methods.usePowerup = function(type) {
  const powerup = this.powerups.find(p => p.type === type);
  
  if (!powerup || powerup.quantity <= 0) {
    return false;
  }
  
  powerup.quantity -= 1;
  
  // Remove powerup if quantity is 0
  if (powerup.quantity === 0) {
    this.powerups = this.powerups.filter(p => p.type !== type);
  }
  
  return this.save();
};

// Static method to find user by wallet address
userSchema.statics.findByWallet = function(walletAddress) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

// Static method to get leaderboard
userSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ isActive: true, isBanned: false })
    .sort({ totalScore: -1 })
    .limit(limit)
    .select('username level totalScore highScore');
};

export default mongoose.models.User || mongoose.model('User', userSchema);
