import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { connectDB } from '../../../../lib/database';
import User from '../../../../models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({ 
        exists: false,
        message: 'User not found. Please sign up first.' 
      });
    }

    return NextResponse.json({ 
      exists: true,
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        discordId: user.discordId,
        discordRole: user.discordRole,
        gameRole: user.gameRole,
        nftCount: user.nftCount,
        level: user.level,
        experience: user.experience
      }
    });

  } catch (error) {
    console.error('Wallet check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Address, message, and signature are required' },
        { status: 400 }
      );
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        username: `user_${address.slice(2, 8)}`,
        walletAddress: address.toLowerCase(),
        discordRole: 'puppy',
        gameRole: 'puppy',
        nftCount: 0,
        level: 1,
        experience: 0
      });
      await user.save();
    }

    // Generate JWT token (you might want to use a proper JWT library)
    const token = Buffer.from(JSON.stringify({
      userId: user._id,
      address: address,
      timestamp: Date.now()
    })).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        discordId: user.discordId,
        discordRole: user.discordRole,
        gameRole: user.gameRole,
        nftCount: user.nftCount,
        level: user.level,
        experience: user.experience
      }
    });

  } catch (error) {
    console.error('Wallet authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}