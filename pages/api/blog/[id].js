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
    return res.status(400).json({ error: 'Blog post ID is required' });
  }
  
  // Handle GET request - retrieve a blog post by ID or slug
  if (req.method === 'GET') {
    try {
      // First try to find by ID
      let post = db.getById('blog_posts', id);
      
      // If not found, try to find by slug
      if (!post) {
        const posts = db.getAll('blog_posts');
        post = posts.find(p => p.slug === id);
      }
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // Increment view count if this is a public view (not from admin)
      if (req.headers.referer && !req.headers.referer.includes('/admin')) {
        post.views = (post.views || 0) + 1;
        db.update('blog_posts', post.id, post);
      }
      
      return res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle PUT request - update a blog post
  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      
      // Find the post
      const post = db.getById('blog_posts', id);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // Check if slug is being changed and if it already exists
      if (updates.slug && updates.slug !== post.slug) {
        const existingPost = db.getAll('blog_posts').find(p => p.slug === updates.slug && p.id !== post.id);
        if (existingPost) {
          return res.status(400).json({ error: 'A post with this slug already exists' });
        }
      }
      
      // Update publishedAt if publishing for the first time
      if (updates.published && !post.published) {
        updates.publishedAt = new Date().toISOString();
      }
      
      // Always update the updatedAt timestamp
      updates.updatedAt = new Date().toISOString();
      
      // Update the post
      const updatedPost = db.update('blog_posts', id, updates);
      
      if (!updatedPost) {
        return res.status(500).json({ error: 'Failed to update blog post' });
      }
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error updating blog post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle DELETE request - delete a blog post
  if (req.method === 'DELETE') {
    try {
      const success = db.delete('blog_posts', id);
      
      if (!success) {
        return res.status(404).json({ error: 'Blog post not found or delete failed' });
      }
      
      return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
