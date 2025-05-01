import { db } from '../../../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET request - retrieve all blog posts or filter by query
  if (req.method === 'GET') {
    try {
      const { category, tag, search, page = 1, limit = 10, published } = req.query;
      
      // Get all blog posts
      let posts = db.getAll('blog_posts');
      
      // Sort by publishedAt date (newest first)
      posts = posts.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt);
        const dateB = new Date(b.publishedAt || b.createdAt);
        return dateB - dateA;
      });
      
      // Filter by published status if specified
      if (published !== undefined) {
        const isPublished = published === 'true';
        posts = posts.filter(post => post.published === isPublished);
      }
      
      // Filter by category if specified
      if (category) {
        posts = posts.filter(post => post.category === category);
      }
      
      // Filter by tag if specified
      if (tag) {
        posts = posts.filter(post => post.tags && post.tags.includes(tag));
      }
      
      // Filter by search term if specified
      if (search) {
        const searchLower = search.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) || 
          post.excerpt.toLowerCase().includes(searchLower) || 
          post.content.toLowerCase().includes(searchLower)
        );
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalPosts = posts.length;
      const paginatedPosts = posts.slice(startIndex, endIndex);
      
      // Return response with pagination metadata
      return res.status(200).json({
        posts: paginatedPosts,
        pagination: {
          total: totalPosts,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalPosts / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle POST request - create a new blog post
  if (req.method === 'POST') {
    try {
      const post = req.body;
      
      // Validate required fields
      if (!post.title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      if (!post.content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      // Generate slug from title if not provided
      if (!post.slug) {
        post.slug = post.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      // Check if slug already exists
      const existingPost = db.getAll('blog_posts').find(p => p.slug === post.slug);
      if (existingPost) {
        return res.status(400).json({ error: 'A post with this slug already exists' });
      }
      
      // Set default values
      post.createdAt = new Date().toISOString();
      post.updatedAt = post.createdAt;
      post.published = post.published || false;
      post.publishedAt = post.published ? post.createdAt : null;
      post.views = 0;
      
      // Create the post
      const newPost = db.create('blog_posts', post);
      
      if (!newPost) {
        return res.status(500).json({ error: 'Failed to create blog post' });
      }
      
      return res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
