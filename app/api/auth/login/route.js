import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    const { walletAddress } = await request.json();
    
    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }
    
    // Find user by wallet address
    const user = await User.findByWallet(walletAddress);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }
    
    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        { 
          error: 'Account is banned',
          reason: user.banReason || 'No reason provided'
        },
        { status: 403 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        walletAddress: user.walletAddress,
        username: user.username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        level: user.level,
        experience: user.experience,
        experienceToNextLevel: user.experienceToNextLevel,
        totalScore: user.totalScore,
        highScore: user.highScore,
        gamesPlayed: user.gamesPlayed,
        pawsTokens: user.pawsTokens,
        powerups: user.powerups,
        achievements: user.achievements,
        discordRole: user.discordRole,
        lastLogin: user.lastLogin
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
