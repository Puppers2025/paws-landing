import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  walletAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Session Data
  sessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Game Stats
  score: {
    type: Number,
    required: true,
    min: 0
  },
  
  duration: {
    type: Number,
    required: true,
    min: 0 // in seconds
  },
  
  level: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Game Details
  gameMode: {
    type: String,
    enum: ['classic', 'survival', 'speed', 'challenge'],
    default: 'classic'
  },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // Powerups Used
  powerupsUsed: [{
    type: {
      type: String,
      enum: ['boost', 'bulletBoost', 'shield', 'speed', 'health']
    },
    quantity: {
      type: Number,
      default: 1
    },
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Enemies Defeated
  enemiesDefeated: {
    zombie1: {
      type: Number,
      default: 0
    },
    zombie2: {
      type: Number,
      default: 0
    },
    zombie3: {
      type: Number,
      default: 0
    },
    boss: {
      type: Number,
      default: 0
    }
  },
  
  // Rewards Earned
  rewards: {
    experience: {
      type: Number,
      default: 0
    },
    pawsTokens: {
      type: Number,
      default: 0
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
    }]
  },
  
  // Session Status
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned', 'failed'],
    default: 'active'
  },
  
  // Performance Metrics
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  
  combo: {
    type: Number,
    default: 0,
    min: 0
  },
  
  maxCombo: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  endedAt: {
    type: Date
  },
  
  // Device/Platform Info
  platform: {
    type: String,
    enum: ['web', 'mobile', 'desktop'],
    default: 'web'
  },
  
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'gamesessions'
});

// Indexes for better performance
gameSessionSchema.index({ userId: 1 });
gameSessionSchema.index({ walletAddress: 1 });
gameSessionSchema.index({ sessionId: 1 });
gameSessionSchema.index({ score: -1 });
gameSessionSchema.index({ startedAt: -1 });
gameSessionSchema.index({ status: 1 });

// Virtual for session duration in minutes
gameSessionSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.duration / 60 * 100) / 100;
});

// Method to end session
gameSessionSchema.methods.endSession = function(finalScore, finalDuration) {
  this.score = finalScore;
  this.duration = finalDuration;
  this.status = 'completed';
  this.endedAt = new Date();
  
  return this.save();
};

// Method to calculate rewards
gameSessionSchema.methods.calculateRewards = function() {
  const baseExperience = Math.floor(this.score / 10);
  const durationBonus = Math.floor(this.duration / 60) * 5; // 5 XP per minute
  const levelBonus = this.level * 2;
  
  this.rewards.experience = baseExperience + durationBonus + levelBonus;
  this.rewards.pawsTokens = Math.floor(this.rewards.experience / 10);
  
  return this.save();
};

// Static method to get user's game history
gameSessionSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ userId, status: 'completed' })
    .sort({ startedAt: -1 })
    .limit(limit)
    .select('score duration level gameMode difficulty startedAt rewards');
};

// Static method to get leaderboard
gameSessionSchema.statics.getLeaderboard = function(gameMode = 'classic', limit = 10) {
  return this.find({ 
    gameMode, 
    status: 'completed' 
  })
    .sort({ score: -1 })
    .limit(limit)
    .populate('userId', 'username level')
    .select('score duration level startedAt');
};

// Static method to get session statistics
gameSessionSchema.statics.getSessionStats = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalDuration: { $sum: '$duration' },
        averageScore: { $avg: '$score' },
        averageDuration: { $avg: '$duration' },
        highScore: { $max: '$score' },
        longestSession: { $max: '$duration' }
      }
    }
  ]);
};

export default mongoose.models.GameSession || mongoose.model('GameSession', gameSessionSchema);
