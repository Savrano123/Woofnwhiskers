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

  // Create default placeholder images if they don't exist
  const createDefaultPlaceholder = (targetPath) => {
    if (!fs.existsSync(targetPath)) {
      console.log(`Creating default placeholder at ${targetPath}`);

      // Create a simple colored rectangle as a placeholder
      const canvas = require('canvas');
      const { createCanvas } = canvas;
      const c = createCanvas(400, 300);
      const ctx = c.getContext('2d');

      // Fill with a gradient
      const gradient = ctx.createLinearGradient(0, 0, 400, 300);
      gradient.addColorStop(0, '#4a6fa5');
      gradient.addColorStop(1, '#166bb5');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 300);

      // Add text
      ctx.font = 'bold 30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Image Placeholder', 200, 150);

      // Save to file
      const buffer = c.toBuffer('image/jpeg');
      fs.writeFileSync(targetPath, buffer);
    }
  };

  // Ensure placeholder images exist
  const placeholderPaths = [
    path.join(imagesDir, 'placeholder-product.jpg'),
    path.join(imagesDir, 'placeholder-pet.jpg'),
    path.join(imagesDir, 'pets', 'max.jpg'),
    path.join(imagesDir, 'pets', 'default.jpg'),
    path.join(imagesDir, 'products', 'default.jpg'),
    path.join(imagesDir, 'carousel', 'default.jpg')
  ];

  // Try to install canvas if needed
  try {
    require('canvas');
  } catch (e) {
    console.log('Canvas module not found, using fallback method');

    // Create a simple placeholder file
    placeholderPaths.forEach(placeholderPath => {
      if (!fs.existsSync(placeholderPath)) {
        console.log(`Creating simple placeholder at ${placeholderPath}`);

        // Create directory if it doesn't exist
        const dir = path.dirname(placeholderPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Create a simple 1x1 pixel JPEG
        const buffer = Buffer.from([
          0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
          0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
          0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
          0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
          0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
          0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
          0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14,
          0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 0xff, 0xd9
        ]);

        fs.writeFileSync(placeholderPath, buffer);
      }
    });
  }

  // Copy placeholder images if they exist
  // 1. Placeholder product image
  const placeholderProductSource = path.join(publicDir, 'images', 'placeholder-product.jpg');
  if (fs.existsSync(placeholderProductSource)) {
    copyFile(
      placeholderProductSource,
      path.join(imagesDir, 'products', 'default.jpg')
    );
  }

  // 2. Placeholder pet image
  const placeholderPetSource = path.join(publicDir, 'images', 'placeholder-pet.jpg');
  if (fs.existsSync(placeholderPetSource)) {
    copyFile(
      placeholderPetSource,
      path.join(imagesDir, 'pets', 'default.jpg')
    );

    // Also copy to max.jpg which is used as a fallback
    copyFile(
      placeholderPetSource,
      path.join(imagesDir, 'pets', 'max.jpg')
    );
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
