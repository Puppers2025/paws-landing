import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import GameSession from '../../../../models/GameSession';
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

// GET - Get user profile
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
    
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's game statistics
    const gameStats = await GameSession.getSessionStats(tokenData.userId);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        level: user.level,
        experience: user.experience,
        experienceToNextLevel: user.experienceToNextLevel,
        experiencePercentage: user.experiencePercentage,
        totalScore: user.totalScore,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        pawsTokens: user.pawsTokens,
        powerups: user.powerups,
        achievements: user.achievements,
        discordRole: user.discordRole,
        lastLogin: user.lastLogin,
        lastGamePlayed: user.lastGamePlayed,
        createdAt: user.createdAt
      },
      gameStats: gameStats[0] || {
        totalSessions: 0,
        totalScore: 0,
        totalDuration: 0,
        averageScore: 0,
        averageDuration: 0,
        highScore: 0,
        longestSession: 0
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
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
    
    const { username, discordId, discordUsername } = await request.json();
    
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update username if provided and not taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ 
        username, 
        _id: { $ne: user._id } 
      });
      
      if (usernameExists) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
      
      user.username = username;
    }
    
    // Update Discord info if provided
    if (discordId) {
      user.discordId = discordId;
    }
    if (discordUsername) {
      user.discordUsername = discordUsername;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore,
        pawsTokens: user.pawsTokens,
        discordRole: user.discordRole
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
