import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import GameSession from '../../../../models/GameSession';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// POST - Start new game session
export async function POST(request) {
  try {
    await connectDB();
    
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { gameMode, difficulty } = await request.json();
    
    // Generate unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new game session
    const session = new GameSession({
      userId: tokenData.userId,
      walletAddress: tokenData.walletAddress,
      sessionId,
      score: 0,
      duration: 0,
      level: 1,
      gameMode: gameMode || 'classic',
      difficulty: difficulty || 'medium',
      powerupsUsed: [],
      enemiesDefeated: {
        zombie1: 0,
        zombie2: 0,
        zombie3: 0,
        boss: 0
      },
      rewards: {
        experience: 0,
        pawsTokens: 0,
        powerups: []
      },
      status: 'active',
      startedAt: new Date()
    });
    
    await session.save();
    
    return NextResponse.json({
      success: true,
      message: 'Game session started',
      session: {
        sessionId: session.sessionId,
        gameMode: session.gameMode,
        difficulty: session.difficulty,
        startedAt: session.startedAt
      }
    });
    
  } catch (error) {
    console.error('Start session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update game session (end game)
export async function PUT(request) {
  try {
    await connectDB();
    
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { sessionId, finalScore, finalDuration, gameStats } = await request.json();
    
    if (!sessionId || finalScore === undefined || finalDuration === undefined) {
      return NextResponse.json(
        { error: 'Session ID, final score, and duration are required' },
        { status: 400 }
      );
    }
    
    // Find and update session
    const session = await GameSession.findOne({ 
      sessionId, 
      userId: tokenData.userId,
      status: 'active' 
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or already ended' },
        { status: 404 }
      );
    }
    
    // Update session with final stats
    session.score = finalScore;
    session.duration = finalDuration;
    session.status = 'completed';
    session.endedAt = new Date();
    
    // Update game stats if provided
    if (gameStats) {
      if (gameStats.enemiesDefeated) {
        session.enemiesDefeated = { ...session.enemiesDefeated, ...gameStats.enemiesDefeated };
      }
      if (gameStats.accuracy !== undefined) {
        session.accuracy = gameStats.accuracy;
      }
      if (gameStats.maxCombo !== undefined) {
        session.maxCombo = gameStats.maxCombo;
      }
    }
    
    // Calculate rewards
    await session.calculateRewards();
    await session.save();
    
    // Update user stats
    const user = await User.findById(tokenData.userId);
    if (user) {
      user.totalScore += finalScore;
      user.gamesPlayed += 1;
      user.highScore = Math.max(user.highScore, finalScore);
      user.lastGamePlayed = new Date();
      
      // Add experience and handle level up
      await user.addExperience(session.rewards.experience);
      
      // Add PAWS tokens
      user.pawsTokens += session.rewards.pawsTokens;
      
      // Add powerup rewards
      for (const powerup of session.rewards.powerups) {
        await user.addPowerup(powerup.type, powerup.quantity);
      }
      
      await user.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Game session completed',
      session: {
        sessionId: session.sessionId,
        score: session.score,
        duration: session.duration,
        rewards: session.rewards,
        endedAt: session.endedAt
      },
      user: {
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore,
        pawsTokens: user.pawsTokens
      }
    });
    
  } catch (error) {
    console.error('End session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get user's game history
export async function GET(request) {
  try {
    await connectDB();
    
    const tokenData = verifyToken(request);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    const sessions = await GameSession.getUserHistory(tokenData.userId, limit);
    
    return NextResponse.json({
      success: true,
      sessions
    });
    
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
