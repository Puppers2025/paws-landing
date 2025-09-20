import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import { verifyNonce } from '../../../../lib/wallet-utils';

// Security: Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

// Security: Input validation
const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidSignature = (signature) => {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
};

// Security: Rate limiting check
const checkRateLimit = (ip) => {
  const now = Date.now();
  const userAttempts = rateLimitStore.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userAttempts.resetTime) {
    userAttempts.count = 0;
    userAttempts.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userAttempts.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }
  
  userAttempts.count++;
  rateLimitStore.set(ip, userAttempts);
  return true;
};

export async function GET(request) {
  try {
    // Security: Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Security: Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    // Security: Input validation
    if (!address || !isValidEthereumAddress(address)) {
      return NextResponse.json({ error: 'Valid Ethereum address is required' }, { status: 400 });
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
    // Security: Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Security: Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { address, message, signature } = await request.json();

    // Security: Input validation
    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Address, message, and signature are required' },
        { status: 400 }
      );
    }

    if (!isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    if (!isValidSignature(signature)) {
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      );
    }

    // Security: Verify message format (must contain nonce and address)
    if (!message.includes('Nonce:') || !message.includes('Address:')) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Security: Extract and verify nonce
    const nonceMatch = message.match(/Nonce: (0x[a-fA-F0-9]+)/);
    if (!nonceMatch) {
      return NextResponse.json(
        { error: 'Invalid nonce format' },
        { status: 400 }
      );
    }

    const nonce = nonceMatch[1];
    const nonceVerification = verifyNonce(nonce);
    if (!nonceVerification.valid) {
      return NextResponse.json(
        { error: `Nonce verification failed: ${nonceVerification.reason}` },
        { status: 400 }
      );
    }

    // Security: Verify the signature
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (error) {
      console.error('Signature verification error:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { error: 'Signature does not match address' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ walletAddress: address.toLowerCase() });
    
    if (!user) {
      // Security: Generate secure username
      const username = `user_${address.slice(2, 8)}_${Date.now().toString(36)}`;
      
      // Create new user
      user = new User({
        username,
        walletAddress: address.toLowerCase(),
        discordRole: 'puppy',
        gameRole: 'puppy',
        nftCount: 0,
        level: 1,
        experience: 0
      });
      await user.save();
    }

    // Security: Generate proper JWT token with secret
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    const token = jwt.sign(
      {
        userId: user._id,
        address: address.toLowerCase(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      jwtSecret,
      { algorithm: 'HS256' }
    );

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