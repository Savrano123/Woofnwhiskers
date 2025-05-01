import { db } from '../../../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  // Handle GET request - retrieve a product by ID
  if (req.method === 'GET') {
    const product = db.getById('products', id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(200).json(product);
  }
  
  // Handle PUT request - update a product
  if (req.method === 'PUT') {
    try {
      const updatedProduct = db.update('products', id, req.body);
      
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found or update failed' });
      }
      
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle DELETE request - delete a product
  if (req.method === 'DELETE') {
    try {
      const success = db.delete('products', id);
      
      if (!success) {
        return res.status(404).json({ error: 'Product not found or delete failed' });
      }
      
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
