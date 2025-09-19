const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dncbk5sac',
  api_key: '329723753343172',
  api_secret: 'bXo5ahKsloR1Gk812zvIduQp1pg'
});

// Image categories and their transformations
const imageCategories = {
  'backgrounds': {
    folder: 'backgrounds',
    transformation: [
      { width: 1920, height: 1080, crop: 'fill', quality: 'auto' },
      { format: 'auto' }
    ]
  },
  'avatars': {
    folder: 'avatars',
    transformation: [
      { width: 512, height: 512, crop: 'fill', quality: 'auto' },
      { format: 'auto' }
    ]
  },
  'game-assets': {
    folder: 'game-assets',
    transformation: [
      { width: 256, height: 256, crop: 'fill', quality: 'auto' },
      { format: 'auto' }
    ]
  },
  'ui-elements': {
    folder: 'ui-elements',
    transformation: [
      { width: 128, height: 128, crop: 'fill', quality: 'auto' },
      { format: 'auto' }
    ]
  },
  'marketing': {
    folder: 'marketing',
    transformation: [
      { width: 1024, height: 1024, crop: 'fill', quality: 'auto' },
      { format: 'auto' }
    ]
  }
};

// Supported image formats
const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

async function uploadImage(imagePath, category, customName = null) {
  try {
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const publicId = customName || fileName;
    const config = imageCategories[category];
    
    console.log(`📤 Uploading: ${fileName} to ${category}...`);
    
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: `paws-landing/${config.folder}/${publicId}`,
      folder: 'paws-landing',
      resource_type: 'image',
      transformation: config.transformation
    });
    
    console.log(`✅ Uploaded: ${result.secure_url}`);
    return {
      originalName: fileName,
      publicId: result.public_id,
      url: result.secure_url,
      category: category
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function uploadDirectory(dirPath, category) {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return results;
  }
  
  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter(file => 
    supportedFormats.includes(path.extname(file).toLowerCase())
  );
  
  console.log(`\n📁 Processing ${imageFiles.length} images in ${category}...`);
  
  for (const file of imageFiles) {
    const filePath = path.join(dirPath, file);
    const result = await uploadImage(filePath, category);
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}

async function uploadAllImages() {
  console.log('🚀 Starting bulk image upload to Cloudinary...\n');
  
  const allResults = [];
  
  // Upload images from different directories
  const uploadTasks = [
    { path: './public/images', category: 'backgrounds' },
    { path: './public/avatars', category: 'avatars' },
    { path: './public/game-assets', category: 'game-assets' },
    { path: './public/ui-elements', category: 'ui-elements' },
    { path: './public/marketing', category: 'marketing' }
  ];
  
  for (const task of uploadTasks) {
    const results = await uploadDirectory(task.path, task.category);
    allResults.push(...results);
  }
  
  // Generate summary report
  console.log('\n📊 Upload Summary:');
  console.log('==================');
  
  const categoryCounts = {};
  allResults.forEach(result => {
    categoryCounts[result.category] = (categoryCounts[result.category] || 0) + 1;
  });
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`${category}: ${count} images`);
  });
  
  console.log(`\nTotal uploaded: ${allResults.length} images`);
  
  // Save results to file for reference
  const reportPath = './cloudinary-upload-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  
  // Generate code snippets for easy copy-paste
  console.log('\n📋 Code Snippets:');
  console.log('=================');
  
  allResults.forEach(result => {
    console.log(`\n// ${result.originalName} (${result.category})`);
    console.log(`backgroundImage: 'url("${result.url}")'`);
  });
  
  console.log('\n✅ Upload process completed!');
  return allResults;
}

// Run the upload process
uploadAllImages().catch(console.error);
