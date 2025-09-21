import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '../../../../lib/database'
import User from '../../../../models/User'

export async function GET(request) {
  try {
    await connectDB()
    
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Check if token is expired
      if (decoded.exp < Date.now() / 1000) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }

      // Get user data
      const user = await User.findById(decoded.userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          walletAddress: user.walletAddress,
          level: user.level,
          experience: user.experience,
          nftCount: user.nftCount,
          discordRole: user.discordRole,
          gameRole: user.gameRole,
          createdAt: user.createdAt
        }
      })
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
