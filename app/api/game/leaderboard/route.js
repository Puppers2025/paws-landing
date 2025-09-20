import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import GameSession from '../../../../models/GameSession';

// GET - Get leaderboard
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'totalScore';
    const gameMode = searchParams.get('gameMode') || 'classic';
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    let leaderboard = [];
    
    switch (type) {
      case 'totalScore':
        leaderboard = await User.getLeaderboard(limit);
        break;
        
      case 'highScore':
        leaderboard = await GameSession.getLeaderboard(gameMode, limit);
        break;
        
      case 'level':
        leaderboard = await User.find({ 
          isActive: true, 
          isBanned: false 
        })
          .sort({ level: -1, experience: -1 })
          .limit(limit)
          .select('username level experience totalScore');
        break;
        
      case 'gamesPlayed':
        leaderboard = await User.find({ 
          isActive: true, 
          isBanned: false 
        })
          .sort({ gamesPlayed: -1 })
          .limit(limit)
          .select('username gamesPlayed totalScore level');
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid leaderboard type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry.toObject ? entry.toObject() : entry
      })),
      type,
      gameMode,
      limit
    });
    
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
