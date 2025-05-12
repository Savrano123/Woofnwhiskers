const fs = require('fs');
const path = require('path');
const http = require('https');

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Creating directory: ${directory}`);
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Create necessary directories
const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');
ensureDirectoryExists(imagesDir);

const petsDir = path.join(imagesDir, 'pets');
ensureDirectoryExists(petsDir);

const productsDir = path.join(imagesDir, 'products');
ensureDirectoryExists(productsDir);

const carouselDir = path.join(imagesDir, 'carousel');
ensureDirectoryExists(carouselDir);

// Download a placeholder image from placeholder.com
function downloadPlaceholder(width, height, text, outputPath) {
  return new Promise((resolve, reject) => {
    const url = `https://via.placeholder.com/${width}x${height}.jpg?text=${encodeURIComponent(text)}`;
    console.log(`Downloading placeholder from: ${url}`);
    
    const file = fs.createWriteStream(outputPath);
    
    http.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded placeholder to: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading placeholder: ${err.message}`);
      reject(err);
    });
  });
}

// Create placeholder images
async function createPlaceholders() {
  try {
    const placeholders = [
      { path: path.join(imagesDir, 'placeholder-pet.jpg'), text: 'Pet+Placeholder', width: 400, height: 300 },
      { path: path.join(imagesDir, 'placeholder-product.jpg'), text: 'Product+Placeholder', width: 400, height: 300 },
      { path: path.join(petsDir, 'max.jpg'), text: 'Pet+Image', width: 400, height: 300 },
      { path: path.join(petsDir, 'default.jpg'), text: 'Default+Pet', width: 400, height: 300 },
      { path: path.join(productsDir, 'default.jpg'), text: 'Default+Product', width: 400, height: 300 },
      { path: path.join(productsDir, 'pet-bed.jpg'), text: 'Pet+Bed', width: 400, height: 300 },
      { path: path.join(carouselDir, 'default.jpg'), text: 'Default+Carousel', width: 800, height: 400 },
      { path: path.join(carouselDir, 'slide1.jpg'), text: 'Carousel+Slide', width: 800, height: 400 }
    ];
    
    for (const placeholder of placeholders) {
      await downloadPlaceholder(
        placeholder.width, 
        placeholder.height, 
        placeholder.text, 
        placeholder.path
      );
    }
    
    console.log('All placeholder images created successfully!');
  } catch (error) {
    console.error('Error creating placeholders:', error);
  }
}

createPlaceholders();
