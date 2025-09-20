import { NextResponse } from 'next/server';
import { getAllRoles, getRoleHierarchy } from '../../../../../lib/discord-role-mapping';

// GET - Get all available roles
export async function GET() {
  try {
    const allRoles = getAllRoles();
    const hierarchy = getRoleHierarchy();
    
    return NextResponse.json({
      success: true,
      roles: allRoles,
      hierarchy,
      totalRoles: allRoles.length
    });
    
  } catch (error) {
    console.error('Get roles list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
