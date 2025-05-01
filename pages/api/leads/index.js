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
  
  // Handle GET request - retrieve all leads
  if (req.method === 'GET') {
    const leads = db.getAll('leads');
    return res.status(200).json(leads);
  }
  
  // Handle POST request - create a new lead
  if (req.method === 'POST') {
    try {
      const newLead = db.create('leads', req.body);
      
      if (!newLead) {
        return res.status(500).json({ error: 'Failed to create lead' });
      }
      
      return res.status(201).json(newLead);
    } catch (error) {
      console.error('Error creating lead:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
