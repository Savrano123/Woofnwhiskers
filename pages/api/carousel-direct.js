import { db } from '../../lib/db';

export default function handler(req, res) {
  try {
    // Get all carousel slides from the database
    const slides = db.getAll('carousel') || [];
    
    // Sort by createdAt (newest first)
    const sortedSlides = [...slides].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Return the slides
    res.status(200).json(sortedSlides);
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    res.status(500).json({ error: 'Failed to fetch carousel slides' });
  }
}
