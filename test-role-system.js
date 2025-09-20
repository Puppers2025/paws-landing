// Test the Discord role system
import { getUserRoleStatus, getAllRoles, getRoleByGameLevel, getRoleByNFTCount } from './lib/discord-role-mapping.js';

console.log('🧪 Testing Discord Role System\n');

// Test 1: Get all roles
console.log('1. All Available Roles:');
const allRoles = getAllRoles();
allRoles.forEach(role => {
  console.log(`   ${role.roleName}: ${role.nftRequired} NFTs or Level ${role.gameLevelRequired}`);
});
console.log('');

// Test 2: Test role by game level
console.log('2. Role by Game Level:');
const testLevels = [1, 100, 150, 200, 300, 400, 600, 700];
testLevels.forEach(level => {
  const role = getRoleByGameLevel(level);
  console.log(`   Level ${level}: ${role ? role.roleName : 'No role'}`);
});
console.log('');

// Test 3: Test role by NFT count
console.log('3. Role by NFT Count:');
const testNFTs = [0, 50, 75, 100, 150, 200, 300, 400];
testNFTs.forEach(nftCount => {
  const role = getRoleByNFTCount(nftCount);
  console.log(`   ${nftCount} NFTs: ${role ? role.roleName : 'No role'}`);
});
console.log('');

// Test 4: Test user role status
console.log('4. User Role Status Examples:');
const testUsers = [
  { level: 1, nftCount: 0 },
  { level: 150, nftCount: 0 },
  { level: 1, nftCount: 80 },
  { level: 200, nftCount: 100 },
  { level: 300, nftCount: 150 },
  { level: 600, nftCount: 300 }
];

testUsers.forEach((user, index) => {
  const status = getUserRoleStatus(user.level, user.nftCount);
  console.log(`   User ${index + 1} (Level ${user.level}, ${user.nftCount} NFTs):`);
  console.log(`     Discord Role: ${status.discordRole || 'None'}`);
  console.log(`     Game Role: ${status.gameRole || 'None'}`);
  console.log(`     Next Game Role: ${status.nextGameRole || 'None'}`);
  console.log(`     Levels to Next: ${status.levelsToNextRole || 'N/A'}`);
  console.log(`     Highest Role: ${status.highestRole || 'None'}`);
  console.log('');
});

console.log('✅ Role system test completed!');
