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
  
  // Handle GET request - retrieve all pets
  if (req.method === 'GET') {
    const pets = db.getAll('pets');
    return res.status(200).json(pets);
  }
  
  // Handle POST request - create a new pet
  if (req.method === 'POST') {
    try {
      const newPet = db.create('pets', req.body);
      
      if (!newPet) {
        return res.status(500).json({ error: 'Failed to create pet' });
      }
      
      return res.status(201).json(newPet);
    } catch (error) {
      console.error('Error creating pet:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
