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
    return res.status(400).json({ error: 'Pet ID is required' });
  }
  
  // Handle GET request - retrieve a pet by ID
  if (req.method === 'GET') {
    const pet = db.getById('pets', id);
    
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    return res.status(200).json(pet);
  }
  
  // Handle PUT request - update a pet
  if (req.method === 'PUT') {
    try {
      const updatedPet = db.update('pets', id, req.body);
      
      if (!updatedPet) {
        return res.status(404).json({ error: 'Pet not found or update failed' });
      }
      
      return res.status(200).json(updatedPet);
    } catch (error) {
      console.error('Error updating pet:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle DELETE request - delete a pet
  if (req.method === 'DELETE') {
    try {
      const success = db.delete('pets', id);
      
      if (!success) {
        return res.status(404).json({ error: 'Pet not found or delete failed' });
      }
      
      return res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
      console.error('Error deleting pet:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
