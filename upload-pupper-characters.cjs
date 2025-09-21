const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dncbk5sac',
  api_key: '329723753343172',
  api_secret: 'bXo5ahKsloR1Gk812zvIduQp1pg'
});

// Pupper character images mapping
const pupperCharacters = [
  {
    name: 'bolt',
    title: 'Speed Demon',
    description: 'This pupper craves fast-paced challenges and reflex-driven games.',
    sourceImage: 'Puppers- BD illustration ai sample', // Using existing uploaded image
    color: '#FF6B6B'
  },
  {
    name: 'luna',
    title: 'Mystic Wanderer',
    description: 'Explore deep lore and hidden truths through her spiritual path.',
    sourceImage: 'Puppers- Chi illustration ai sample',
    color: '#4ECDC4'
  },
  {
    name: 'maxx',
    title: 'Battle Born',
    description: 'Gear up for tactical duels and intense arena clashes.',
    sourceImage: 'Puppers- GS illustration ai sample',
    color: '#45B7D1'
  },
  {
    name: 'nova',
    title: 'Galactic Scout',
    description: 'Blast off into exploration mode and interdimensional discovery.',
    sourceImage: 'Puppers- P illustration ai sample',
    color: '#96CEB4'
  },
  {
    name: 'zeek',
    title: 'Loyal Healer',
    description: 'Support your squad with compassion and powerful restoration.',
    sourceImage: 'Puppers-Dachshund',
    color: '#FFEAA7'
  },
  {
    name: 'rexx',
    title: 'Alpha Tracker',
    description: 'Lead your pack through quests and dominate the leaderboard.',
    sourceImage: 'Puppers-Rottweiler',
    color: '#DDA0DD'
  }
];

async function createPupperCharacter(pupper) {
  try {
    console.log(`🎨 Creating ${pupper.name} character image...`);
    
    // Use the existing uploaded image as base and transform it for the character
    const result = await cloudinary.uploader.upload(
      `https://res.cloudinary.com/dncbk5sac/image/upload/v1758425626/paws-landing/paws-landing/backgrounds/${encodeURIComponent(pupper.sourceImage)}.jpg`,
      {
        public_id: `paws-landing/puppers/${pupper.name}`,
        folder: 'paws-landing',
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'fill', quality: 'auto' },
          { format: 'auto' }
        ]
      }
    );
    
    console.log(`✅ ${pupper.name} character created!`);
    console.log(`📸 URL: ${result.secure_url}`);
    
    return {
      name: pupper.name,
      url: result.secure_url,
      public_id: result.public_id,
      title: pupper.title,
      description: pupper.description
    };
    
  } catch (error) {
    console.error(`❌ Failed to create ${pupper.name}:`, error.message);
    return null;
  }
}

async function uploadAllPupperCharacters() {
  console.log('🚀 Creating Pupper Character Images...\n');
  
  const results = [];
  
  for (const pupper of pupperCharacters) {
    const result = await createPupperCharacter(pupper);
    if (result) {
      results.push(result);
    }
  }
  
  console.log('\n📊 Character Creation Summary:');
  console.log('==============================');
  console.log(`✅ Created ${results.length} character images`);
  
  console.log('\n📋 Character URLs for your get-started page:');
  console.log('============================================');
  
  results.forEach(char => {
    console.log(`\n// ${char.name.charAt(0).toUpperCase() + char.name.slice(1)} - ${char.title}`);
    console.log(`image: '${char.url}',`);
  });
  
  console.log('\n📝 Updated get-started page code:');
  console.log('=================================');
  
  const codeSnippet = results.map(char => 
    `  {
    name: '${char.name.charAt(0).toUpperCase() + char.name.slice(1)}',
    image: '${char.url}',
    title: '${char.title}',
    description: '${char.description}',
    icon: <Fa${char.name === 'bolt' ? 'Bolt' : char.name === 'luna' ? 'MapMarkedAlt' : char.name === 'maxx' ? 'Cogs' : char.name === 'nova' ? 'Rocket' : char.name === 'zeek' ? 'Heartbeat' : 'Paw'} className="text-red-500 text-3xl" />,
  },`
  ).join('\n');
  
  console.log(codeSnippet);
  
  console.log('\n✅ Pupper character images ready!');
  return results;
}

// Run the character creation process
uploadAllPupperCharacters().catch(console.error);
