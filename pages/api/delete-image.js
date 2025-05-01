import fs from 'fs';
import path from 'path';
import { db } from '../../lib/db';

export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imagePath, category } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    // Extract the filename from the path
    const filename = path.basename(imagePath);
    
    // Construct the full path to the image file
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }
    
    // Delete the file
    fs.unlinkSync(fullPath);
    
    // If the image is from the carousel, also remove it from the database
    if (category === 'carousel') {
      // Get all carousel slides
      const slides = db.getAll('carousel') || [];
      
      // Find slides that use this image
      const slidesToUpdate = slides.filter(slide => slide.imageUrl === imagePath);
      
      if (slidesToUpdate.length > 0) {
        // Delete the slides that use this image
        slidesToUpdate.forEach(slide => {
          db.delete('carousel', slide.id);
        });
        
        console.log(`Deleted ${slidesToUpdate.length} carousel slides that used the image ${filename}`);
      }
    }
    
    // If the image is from pets, also update the database
    if (category === 'pets') {
      // Get all pets
      const pets = db.getAll('pets') || [];
      
      // Find pets that use this image
      const petsToUpdate = pets.filter(pet => pet.imageUrl === imagePath);
      
      if (petsToUpdate.length > 0) {
        // Update the pets to use a default image
        petsToUpdate.forEach(pet => {
          const updatedPet = { ...pet, imageUrl: '/images/pets/default.jpg' };
          db.update('pets', pet.id, updatedPet);
        });
        
        console.log(`Updated ${petsToUpdate.length} pets that used the image ${filename}`);
      }
    }
    
    // If the image is from products, also update the database
    if (category === 'products') {
      // Get all products
      const products = db.getAll('products') || [];
      
      // Find products that use this image
      const productsToUpdate = products.filter(product => product.imageUrl === imagePath);
      
      if (productsToUpdate.length > 0) {
        // Update the products to use a default image
        productsToUpdate.forEach(product => {
          const updatedProduct = { ...product, imageUrl: '/images/products/default.jpg' };
          db.update('products', product.id, updatedProduct);
        });
        
        console.log(`Updated ${productsToUpdate.length} products that used the image ${filename}`);
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: `Image ${filename} deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ 
      error: `Failed to delete image: ${error.message}` 
    });
  }
}
