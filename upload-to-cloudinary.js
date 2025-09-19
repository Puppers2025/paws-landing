const cloudinary = require('cloudinary').v2;
const { loadCredentials } = require('../secure-credentials.js');
const path = require('path');

// Load Cloudinary credentials
const creds = loadCredentials('cloudinary');
if (!creds) {
  console.error('❌ Could not load Cloudinary credentials');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: creds.CLOUDINARY_CLOUD_NAME,
  api_key: creds.CLOUDINARY_API_KEY,
  api_secret: creds.CLOUDINARY_API_SECRET
});

async function uploadPawImage() {
  try {
    console.log('🚀 Uploading Future9.png to Cloudinary...');
    
    const result = await cloudinary.uploader.upload(
      path.join(__dirname, 'public/images/Future9.png'),
      {
        public_id: 'paws-landing/future9',
        folder: 'paws-landing',
        resource_type: 'image',
        transformation: [
          { width: 1024, height: 1024, crop: 'fill', quality: 'auto' },
          { format: 'auto' }
        ]
      }
    );
    
    console.log('✅ Image uploaded successfully!');
    console.log('📸 Public URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
    
    return result.secure_url;
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

uploadPawImage();
