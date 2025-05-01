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
    return res.status(400).json({ error: 'Lead ID is required' });
  }
  
  // Handle GET request - retrieve a lead by ID
  if (req.method === 'GET') {
    const lead = db.getById('leads', id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    return res.status(200).json(lead);
  }
  
  // Handle PUT request - update a lead
  if (req.method === 'PUT') {
    try {
      const updatedLead = db.update('leads', id, req.body);
      
      if (!updatedLead) {
        return res.status(404).json({ error: 'Lead not found or update failed' });
      }
      
      return res.status(200).json(updatedLead);
    } catch (error) {
      console.error('Error updating lead:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle DELETE request - delete a lead
  if (req.method === 'DELETE') {
    try {
      const success = db.delete('leads', id);
      
      if (!success) {
        return res.status(404).json({ error: 'Lead not found or delete failed' });
      }
      
      return res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
      console.error('Error deleting lead:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
