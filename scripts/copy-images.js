const fs = require('fs');
const path = require('path');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Function to copy a file
function copyFile(source, destination) {
  try {
    const data = fs.readFileSync(source);
    fs.writeFileSync(destination, data);
    console.log(`Copied: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`Error copying file ${source}:`, error);
  }
}

// Main function to copy placeholder images
function copyPlaceholderImages() {
  console.log('Starting to copy placeholder images...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  
  // Ensure the images directory exists
  ensureDirectoryExists(imagesDir);
  
  // Create subdirectories
  const directories = ['carousel', 'pets', 'products', 'blog'];
  directories.forEach(dir => {
    ensureDirectoryExists(path.join(imagesDir, dir));
  });
  
  // Copy placeholder images
  // 1. Placeholder product image
  const placeholderProductSource = path.join(publicDir, 'images', 'placeholder-product.jpg');
  if (fs.existsSync(placeholderProductSource)) {
    copyFile(
      placeholderProductSource,
      path.join(imagesDir, 'products', 'default.jpg')
    );
  } else {
    console.log(`Warning: Placeholder product image not found at ${placeholderProductSource}`);
  }
  
  // 2. Placeholder pet image
  const placeholderPetSource = path.join(publicDir, 'images', 'placeholder-pet.jpg');
  if (fs.existsSync(placeholderPetSource)) {
    copyFile(
      placeholderPetSource,
      path.join(imagesDir, 'pets', 'default.jpg')
    );
  } else {
    console.log(`Warning: Placeholder pet image not found at ${placeholderPetSource}`);
  }
  
  // 3. Copy mock photos if they exist
  const mockPhotosDir = path.join(process.cwd(), '..', 'Screenshots', 'mock photos');
  if (fs.existsSync(mockPhotosDir)) {
    const mockPhotos = fs.readdirSync(mockPhotosDir);
    
    mockPhotos.forEach((photo, index) => {
      const sourcePath = path.join(mockPhotosDir, photo);
      
      // Determine destination based on file extension
      let destDir;
      if (index % 3 === 0) {
        destDir = path.join(imagesDir, 'carousel');
      } else if (index % 3 === 1) {
        destDir = path.join(imagesDir, 'pets');
      } else {
        destDir = path.join(imagesDir, 'products');
      }
      
      const destPath = path.join(destDir, `mock-${index + 1}${path.extname(photo)}`);
      copyFile(sourcePath, destPath);
    });
  } else {
    console.log(`Warning: Mock photos directory not found at ${mockPhotosDir}`);
  }
  
  console.log('Finished copying placeholder images.');
}

// Run the function
copyPlaceholderImages();
