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
  
  // Handle GET request - retrieve all carousel slides
  if (req.method === 'GET') {
    const slides = db.getAll('carousel');
    return res.status(200).json(slides);
  }
  
  // Handle POST request - create a new slide
  if (req.method === 'POST') {
    try {
      const newSlide = db.create('carousel', req.body);
      
      if (!newSlide) {
        return res.status(500).json({ error: 'Failed to create carousel slide' });
      }
      
      return res.status(201).json(newSlide);
    } catch (error) {
      console.error('Error creating carousel slide:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
