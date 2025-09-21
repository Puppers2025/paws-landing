import cloudinary from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary using environment variable
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  console.error('❌ CLOUDINARY_URL environment variable not found');
  console.log('Please set CLOUDINARY_URL in your environment or .env.local file');
  process.exit(1);
}

// Parse Cloudinary URL
const url = new URL(cloudinaryUrl);
cloudinary.v2.config({
  cloud_name: url.hostname.split('.')[0],
  api_key: url.username,
  api_secret: url.password
});

// Pupper images configuration
const pupperImages = [
  {
    name: 'bolt',
    title: 'Speed Demon',
    description: 'This pupper craves fast-paced challenges and reflex-driven games.',
    color: '#FF6B6B' // Red
  },
  {
    name: 'luna',
    title: 'Mystic Wanderer', 
    description: 'Explore deep lore and hidden truths through her spiritual path.',
    color: '#4ECDC4' // Teal
  },
  {
    name: 'maxx',
    title: 'Battle Born',
    description: 'Gear up for tactical duels and intense arena clashes.',
    color: '#45B7D1' // Blue
  },
  {
    name: 'nova',
    title: 'Galactic Scout',
    description: 'Blast off into exploration mode and interdimensional discovery.',
    color: '#96CEB4' // Green
  },
  {
    name: 'zeek',
    title: 'Loyal Healer',
    description: 'Support your squad with compassion and powerful restoration.',
    color: '#FFEAA7' // Yellow
  },
  {
    name: 'rexx',
    title: 'Alpha Tracker',
    description: 'Lead your pack through quests and dominate the leaderboard.',
    color: '#DDA0DD' // Plum
  }
];

async function createPupperPlaceholder(name, title, color) {
  try {
    console.log(`🎨 Creating placeholder for ${name}...`);
    
    // Create a simple placeholder image using Cloudinary's text overlay
    const result = await cloudinary.v2.uploader.upload(
      `data:image/svg+xml;base64,${Buffer.from(`
        <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:${color}40;stop-opacity:0.4" />
            </linearGradient>
          </defs>
          <rect width="300" height="300" fill="url(#grad)" rx="150"/>
          <circle cx="150" cy="120" r="40" fill="white" opacity="0.9"/>
          <circle cx="140" cy="110" r="8" fill="black"/>
          <circle cx="160" cy="110" r="8" fill="black"/>
          <ellipse cx="150" cy="140" rx="15" ry="8" fill="black"/>
          <text x="150" y="200" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${name.toUpperCase()}</text>
          <text x="150" y="230" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">${title}</text>
        </svg>
      `).toString('base64')}`,
      {
        public_id: `paws-landing/puppers/${name}`,
        folder: 'paws-landing/puppers',
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'fill', quality: 'auto' },
          { format: 'auto' }
        ]
      }
    );
    
    console.log(`✅ ${name} placeholder created!`);
    console.log(`📸 URL: ${result.secure_url}`);
    
    return {
      name,
      url: result.secure_url,
      public_id: result.public_id
    };
    
  } catch (error) {
    console.error(`❌ Failed to create placeholder for ${name}:`, error.message);
    return null;
  }
}

async function uploadExistingImages() {
  try {
    console.log('🔍 Checking for existing pupper images...');
    
    const imagesDir = path.join(__dirname, 'public/images');
    const uploadedImages = [];
    
    for (const pupper of pupperImages) {
      const imagePath = path.join(imagesDir, `${pupper.name}.jpg`);
      
      if (fs.existsSync(imagePath)) {
        console.log(`📤 Uploading existing image for ${pupper.name}...`);
        
        const result = await cloudinary.v2.uploader.upload(imagePath, {
          public_id: `paws-landing/puppers/${pupper.name}`,
          folder: 'paws-landing/puppers',
          resource_type: 'image',
          transformation: [
            { width: 300, height: 300, crop: 'fill', quality: 'auto' },
            { format: 'auto' }
          ]
        });
        
        console.log(`✅ ${pupper.name} uploaded!`);
        console.log(`📸 URL: ${result.secure_url}`);
        
        uploadedImages.push({
          name: pupper.name,
          url: result.secure_url,
          public_id: result.public_id
        });
      } else {
        console.log(`⚠️ No existing image found for ${pupper.name}, creating placeholder...`);
        const placeholder = await createPupperPlaceholder(pupper.name, pupper.title, pupper.color);
        if (placeholder) {
          uploadedImages.push(placeholder);
        }
      }
    }
    
    return uploadedImages;
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    return [];
  }
}

async function main() {
  try {
    console.log('🚀 Starting Pupper Images Upload to Cloudinary...');
    console.log('================================================');
    
    const uploadedImages = await uploadExistingImages();
    
    console.log('\n🎉 Upload Complete!');
    console.log('==================');
    console.log(`✅ Uploaded ${uploadedImages.length} images`);
    
    console.log('\n📋 Image URLs for your code:');
    console.log('============================');
    
    uploadedImages.forEach(img => {
      console.log(`${img.name}: ${img.url}`);
    });
    
    console.log('\n📝 Update your get-started page with these URLs:');
    console.log('===============================================');
    
    const codeSnippet = uploadedImages.map(img => 
      `  {
    name: '${img.name.charAt(0).toUpperCase() + img.name.slice(1)}',
    image: '${img.url}',
    title: '${pupperImages.find(p => p.name === img.name)?.title}',
    description: '${pupperImages.find(p => p.name === img.name)?.description}',
    icon: <Fa${img.name === 'bolt' ? 'Bolt' : img.name === 'luna' ? 'MapMarkedAlt' : img.name === 'maxx' ? 'Cogs' : img.name === 'nova' ? 'Rocket' : img.name === 'zeek' ? 'Heartbeat' : 'Paw'} className="text-red-500 text-3xl" />,
  },`
    ).join('\n');
    
    console.log(codeSnippet);
    
  } catch (error) {
    console.error('❌ Upload process failed:', error.message);
  }
}

main();
