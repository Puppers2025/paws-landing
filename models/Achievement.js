import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  // Achievement Definition
  achievementId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Achievement Type
  type: {
    type: String,
    required: true,
    enum: ['level', 'score', 'games_played', 'powerups_used', 'streak', 'special', 'discord'],
    required: true
  },
  
  // Requirements
  requirements: {
    level: {
      type: Number,
      min: 1
    },
    score: {
      type: Number,
      min: 0
    },
    gamesPlayed: {
      type: Number,
      min: 0
    },
    powerupsUsed: {
      type: Number,
      min: 0
    },
    streak: {
      type: Number,
      min: 0
    },
    custom: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  
  // Rewards
  rewards: {
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    pawsTokens: {
      type: Number,
      default: 0,
      min: 0
    },
    powerups: [{
      type: {
        type: String,
        enum: ['boost', 'bulletBoost', 'shield', 'speed', 'health']
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    discordRole: {
      type: String,
      enum: ['puppy', 'adult', 'alpha', 'legend', 'admin']
    }
  },
  
  // Metadata
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'legendary'],
    default: 'beginner'
  },
  
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isHidden: {
    type: Boolean,
    default: false
  },
  
  // Discord Integration
  discordAnnouncement: {
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
  collection: 'achievements'
});

// Indexes
achievementSchema.index({ achievementId: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });

// Static method to get achievements by type
achievementSchema.statics.getByType = function(type) {
  return this.find({ type, isActive: true }).sort({ createdAt: 1 });
};

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ createdAt: 1 });
};

// Method to check if user meets requirements
achievementSchema.methods.checkRequirements = function(userStats) {
  const req = this.requirements;
  
  switch (this.type) {
    case 'level':
      return userStats.level >= (req.level || 0);
    case 'score':
      return userStats.totalScore >= (req.score || 0);
    case 'games_played':
      return userStats.gamesPlayed >= (req.gamesPlayed || 0);
    case 'powerups_used':
      return userStats.powerupsUsed >= (req.powerupsUsed || 0);
    case 'streak':
      return userStats.currentStreak >= (req.streak || 0);
    case 'special':
      // Custom logic for special achievements
      return true; // Implement custom logic as needed
    case 'discord':
      return userStats.discordConnected === true;
    default:
      return false;
  }
};

export default mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);
