/**
 * Railway Discord API
 * Communicates with Discord bots running on Railway
 */

import { NextResponse } from 'next/server';

const RAILWAY_DISCORD_URL = process.env.RAILWAY_DISCORD_URL || 'http://localhost:3001';

export async function POST(request) {
  try {
    const { action, data } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let response;

    switch (action) {
      case 'create-notification-badges':
        response = await fetch(`${RAILWAY_DISCORD_URL}/api/notification-badges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        break;

      case 'post-level-up':
        response = await fetch(`${RAILWAY_DISCORD_URL}/api/game-notifications/level-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        break;

      case 'post-role-change':
        response = await fetch(`${RAILWAY_DISCORD_URL}/api/game-notifications/role-change`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        break;

      case 'status':
        response = await fetch(`${RAILWAY_DISCORD_URL}/api/status`, {
          method: 'GET'
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!response.ok) {
      console.error(`Railway Discord API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ 
        error: 'Railway Discord service unavailable',
        fallback: true 
      }, { status: 503 });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Railway Discord API error:', error);
    
    // Fallback to webhook if Railway is unavailable
    if (action === 'post-level-up' || action === 'post-role-change') {
      console.log('Falling back to webhook for Discord notifications');
      return NextResponse.json({ 
        success: false, 
        fallback: true,
        message: 'Railway Discord service unavailable, using webhook fallback'
      });
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: true 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${RAILWAY_DISCORD_URL}/api/status`, {
      method: 'GET'
    });

    if (!response.ok) {
      return NextResponse.json({ 
        status: 'unavailable',
        message: 'Railway Discord service not responding'
      });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Railway Discord status check error:', error);
    return NextResponse.json({ 
      status: 'unavailable',
      message: 'Railway Discord service not responding'
    });
  }
}
