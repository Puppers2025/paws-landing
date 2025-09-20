import { NextResponse } from 'next/server';
import connectDB from '../../../lib/database';
import User from '../../../models/User';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    // Test basic database operations
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      database: 'MongoDB Atlas',
      collection: 'puppers_database',
      userCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
