import { db } from '../../../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET request - retrieve all products
  if (req.method === 'GET') {
    const products = db.getAll('products');
    return res.status(200).json(products);
  }
  
  // Handle POST request - create a new product
  if (req.method === 'POST') {
    try {
      const newProduct = db.create('products', req.body);
      
      if (!newProduct) {
        return res.status(500).json({ error: 'Failed to create product' });
      }
      
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
