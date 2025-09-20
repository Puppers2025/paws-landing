import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    
    const { walletAddress, username, discordId, discordUsername } = await request.json();
    
    // Validate required fields
    if (!walletAddress || !username) {
      return NextResponse.json(
        { error: 'Wallet address and username are required' },
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
    
    // Check if user already exists
    const existingUser = await User.findByWallet(walletAddress);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this wallet address' },
        { status: 409 }
      );
    }
    
    // Check if username is taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }
    
    // Create new user
    const user = new User({
      walletAddress: walletAddress.toLowerCase(),
      username,
      discordId: discordId || null,
      discordUsername: discordUsername || null,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      totalScore: 0,
      gamesPlayed: 0,
      highScore: 0,
      pawsTokens: 100, // Starting tokens
      powerups: [],
      achievements: [],
      discordRole: 'puppy',
      isActive: true,
      isBanned: false,
      lastLogin: new Date()
    });
    
    // Save user to database
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
      message: 'User registered successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        level: user.level,
        experience: user.experience,
        experienceToNextLevel: user.experienceToNextLevel,
        totalScore: user.totalScore,
        pawsTokens: user.pawsTokens,
        discordRole: user.discordRole,
        lastLogin: user.lastLogin
      },
      token
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
