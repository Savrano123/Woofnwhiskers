import { db } from '../../lib/db';

export default async function handler(req, res) {
  try {
    // Get carousel slides from database
    const carouselSlides = db.getAll('carousel') || [];
    
    // Get the timestamp of the most recent slide
    let latestTimestamp = null;
    if (carouselSlides.length > 0) {
      const sortedSlides = [...carouselSlides].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      latestTimestamp = sortedSlides[0].createdAt;
    }
    
    return res.status(200).json({
      success: true,
      count: carouselSlides.length,
      latestTimestamp,
      slides: carouselSlides.map(slide => ({
        id: slide.id,
        title: slide.title,
        imageUrl: slide.imageUrl,
        createdAt: slide.createdAt
      }))
    });
  } catch (error) {
    console.error('Error checking carousel data:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking carousel data',
      error: error.message
    });
  }
}
