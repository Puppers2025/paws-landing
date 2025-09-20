import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import DiscordRole from '../../../../models/DiscordRole';
import { getUserRoleStatus, getAllRoles } from '../../../../lib/discord-role-mapping';
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

// GET - Get user's role status
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
    
    // Get user's role status
    const roleStatus = getUserRoleStatus(user.level, user.nftCount || 0);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        nftCount: user.nftCount || 0,
        discordRole: user.discordRole,
        gameRole: user.gameRole
      },
      roleStatus
    });
    
  } catch (error) {
    console.error('Get role status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update user's NFT count (for Discord verification)
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
    
    const { nftCount } = await request.json();
    
    if (typeof nftCount !== 'number' || nftCount < 0) {
      return NextResponse.json(
        { error: 'Invalid NFT count' },
        { status: 400 }
      );
    }
    
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update NFT count
    user.nftCount = nftCount;
    
    // Update Discord role based on NFT count
    const roleStatus = getUserRoleStatus(user.level, nftCount);
    if (roleStatus.discordRole) {
      user.discordRole = roleStatus.discordRole;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'NFT count updated successfully',
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        nftCount: user.nftCount,
        discordRole: user.discordRole,
        gameRole: user.gameRole
      },
      roleStatus
    });
    
  } catch (error) {
    console.error('Update NFT count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Sync user's game role (called when level changes)
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
    
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update game role based on current level
    const gameRoleUpdate = user.updateGameRole();
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Game role synced successfully',
      user: {
        id: user._id,
        username: user.username,
        level: user.level,
        nftCount: user.nftCount || 0,
        discordRole: user.discordRole,
        gameRole: user.gameRole
      },
      gameRoleUpdate
    });
    
  } catch (error) {
    console.error('Sync game role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
