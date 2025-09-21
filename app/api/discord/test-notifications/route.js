import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database';
import User from '../../../../models/User';
import DiscordWebhookService from '../../../../lib/discord-webhook';
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

// POST - Test Discord notifications
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
    
    const { testType, amount } = await request.json();
    
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if Discord webhook is configured
    const webhookService = new DiscordWebhookService();
    if (!webhookService.isConfigured()) {
      return NextResponse.json(
        { error: 'Discord webhook not configured' },
        { status: 500 }
      );
    }
    
    let result = {};
    
    switch (testType) {
      case 'levelUp':
        // Test level up notification
        const levelUpResult = await user.addExperience(amount || 100);
        result = {
          success: true,
          message: 'Level up notification sent to Discord',
          levelUpResult
        };
        break;
        
      case 'roleChange':
        // Test role change notification
        const oldRole = user.gameRole;
        const roleChangeResult = user.updateGameRole();
        
        if (roleChangeResult.roleChanged) {
          await user.save();
          await webhookService.postRoleChangeNotification(user, roleChangeResult);
          result = {
            success: true,
            message: 'Role change notification sent to Discord',
            roleChangeResult
          };
        } else {
          result = {
            success: false,
            message: 'No role change occurred',
            roleChangeResult
          };
        }
        break;
        
      case 'nftUpdate':
        // Test NFT count update notification
        const oldNftCount = user.nftCount;
        user.nftCount = (user.nftCount || 0) + (amount || 10);
        
        if (user.nftCount !== oldNftCount) {
          await user.save();
          await webhookService.postRoleChangeNotification(user, {
            oldRole: oldNftCount < 1 ? 'None' : 'Previous Role',
            newRole: user.discordRole || 'Puppy',
            level: user.level,
            nftCount: user.nftCount
          });
          result = {
            success: true,
            message: 'NFT update notification sent to Discord',
            nftCount: user.nftCount
          };
        } else {
          result = {
            success: false,
            message: 'No NFT count change occurred'
          };
        }
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: levelUp, roleChange, or nftUpdate' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Test Discord notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get Discord webhook status
export async function GET() {
  try {
    const webhookService = new DiscordWebhookService();
    const isConfigured = webhookService.isConfigured();
    
    return NextResponse.json({
      success: true,
      discordWebhook: {
        configured: isConfigured,
        status: isConfigured ? 'Ready' : 'Not Configured'
      }
    });
    
  } catch (error) {
    console.error('Get Discord webhook status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
