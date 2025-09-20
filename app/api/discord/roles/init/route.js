import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/database';
import DiscordRole from '../../../../../models/DiscordRole';
import { DISCORD_ROLE_MAPPINGS } from '../../../../../lib/discord-role-mapping';

// POST - Initialize Discord roles in database
export async function POST() {
  try {
    await connectDB();
    
    const roles = [];
    
    // Create roles from mappings
    for (const [roleName, roleData] of Object.entries(DISCORD_ROLE_MAPPINGS)) {
      const existingRole = await DiscordRole.findOne({ roleName });
      
      if (existingRole) {
        // Update existing role
        existingRole.nftRequired = roleData.nftRequired;
        existingRole.gameLevelRequired = roleData.gameLevelRequired;
        existingRole.color = roleData.color;
        existingRole.priority = roleData.priority;
        existingRole.description = roleData.description;
        await existingRole.save();
        roles.push(existingRole);
      } else {
        // Create new role
        const newRole = new DiscordRole({
          roleId: `role_${roleName.toLowerCase().replace(/\s+/g, '_')}`,
          roleName,
          levelRequired: 1, // Default level requirement
          gameLevelRequired: roleData.gameLevelRequired,
          nftRequired: roleData.nftRequired,
          color: roleData.color,
          priority: roleData.priority,
          description: roleData.description,
          guildId: 'default', // Will be updated when Discord bot connects
          isActive: true,
          isExclusive: false,
          isStackable: true
        });
        
        await newRole.save();
        roles.push(newRole);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Discord roles initialized successfully',
      roles: roles.map(role => ({
        id: role._id,
        roleName: role.roleName,
        nftRequired: role.nftRequired,
        gameLevelRequired: role.gameLevelRequired,
        color: role.color,
        priority: role.priority,
        description: role.description
      })),
      totalRoles: roles.length
    });
    
  } catch (error) {
    console.error('Initialize roles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
