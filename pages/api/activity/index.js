import { db } from '../../../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request - retrieve all activities
  if (req.method === 'GET') {
    try {
      // Generate activities from real data in the database
      const activities = generateActivitiesFromDatabase();

      // Get query parameters for filtering and pagination
      const { type, page = 1, limit = 10 } = req.query;

      // Filter by type if provided
      let filteredActivities = activities;
      if (type && type !== 'all') {
        filteredActivities = activities.filter(activity => activity.type === type);
      }

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

      // Return response with pagination metadata
      return res.status(200).json({
        activities: paginatedActivities,
        pagination: {
          total: filteredActivities.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredActivities.length / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}

// Function to generate activities from database entries
function generateActivitiesFromDatabase() {
  const activities = [];
  let activityId = 1;

  // Get data from database
  const leads = db.getAll('leads') || [];
  const pets = db.getAll('pets') || [];
  const products = db.getAll('products') || [];
  const blogPosts = db.getAll('blog_posts') || [];

  // Process leads
  leads.forEach(lead => {
    activities.push({
      id: activityId++,
      type: 'lead',
      description: 'New lead collected',
      name: lead.name,
      time: formatTimeAgo(new Date(lead.createdAt)),
      timestamp: lead.createdAt,
      link: `/admin/leads/${lead.id}`
    });
  });

  // Process pets
  pets.forEach(pet => {
    activities.push({
      id: activityId++,
      type: 'pet',
      description: pet.adopted ? 'Pet marked as adopted' : 'New pet added',
      name: `${pet.breed} - ${pet.name}`,
      time: formatTimeAgo(new Date(pet.createdAt)),
      timestamp: pet.createdAt,
      link: `/admin/pets/${pet.id}`
    });
  });

  // Process products
  products.forEach(product => {
    activities.push({
      id: activityId++,
      type: 'product',
      description: 'Product added',
      name: product.name,
      time: formatTimeAgo(new Date(product.createdAt)),
      timestamp: product.createdAt,
      link: `/admin/products/${product.id}`
    });
  });

  // Process blog posts
  blogPosts.forEach(post => {
    if (post.published) {
      activities.push({
        id: activityId++,
        type: 'blog',
        description: 'Blog post published',
        name: post.title,
        time: formatTimeAgo(new Date(post.publishedAt || post.createdAt)),
        timestamp: post.publishedAt || post.createdAt,
        link: `/admin/blog/${post.id}`
      });
    }
  });

  // Add some visitor activities if there are no activities yet
  if (activities.length === 0) {
    const mockActivities = [
        {
          id: 1,
          type: 'lead',
          description: 'New lead collected',
          name: 'Rahul Sharma',
          time: '10 minutes ago',
          timestamp: '2023-07-15T10:30:00Z',
          link: '/admin/leads/1'
        },
        {
          id: 2,
          type: 'pet',
          description: 'Pet profile updated',
          name: 'Golden Retriever - Max',
          time: '2 hours ago',
          timestamp: '2023-07-15T09:15:00Z',
          link: '/admin/pets/5'
        },
        {
          id: 3,
          type: 'product',
          description: 'New product added',
          name: 'Premium Dog Food - 5kg',
          time: '3 hours ago',
          timestamp: '2023-07-15T08:45:00Z',
          link: '/admin/products/12'
        },
        {
          id: 4,
          type: 'lead',
          description: 'Lead status updated',
          name: 'Priya Patel',
          time: '5 hours ago',
          timestamp: '2023-07-15T06:20:00Z',
          link: '/admin/leads/8'
        },
        {
          id: 5,
          type: 'visitor',
          description: 'High traffic detected',
          name: '120 visitors in the last hour',
          time: 'Yesterday',
          timestamp: '2023-07-14T18:30:00Z',
          link: '/admin/analytics'
        },
        {
          id: 6,
          type: 'product',
          description: 'Product stock updated',
          name: 'Cat Litter Box - Medium',
          time: 'Yesterday',
          timestamp: '2023-07-14T16:45:00Z',
          link: '/admin/products/8'
        },
        {
          id: 7,
          type: 'pet',
          description: 'New pet added',
          name: 'Persian Cat - Luna',
          time: 'Yesterday',
          timestamp: '2023-07-14T14:20:00Z',
          link: '/admin/pets/12'
        },
        {
          id: 8,
          type: 'lead',
          description: 'Lead converted to customer',
          name: 'Amit Kumar',
          time: '2 days ago',
          timestamp: '2023-07-13T11:10:00Z',
          link: '/admin/leads/5'
        },
        {
          id: 9,
          type: 'visitor',
          description: 'New visitor from Google',
          name: 'Search query: "pet shop in Dwarka"',
          time: '2 days ago',
          timestamp: '2023-07-13T09:30:00Z',
          link: '/admin/analytics'
        },
        {
          id: 10,
          type: 'product',
          description: 'Product price updated',
          name: 'Dog Collar - Large',
          time: '3 days ago',
          timestamp: '2023-07-12T15:40:00Z',
          link: '/admin/products/15'
        },
        {
          id: 11,
          type: 'lead',
          description: 'New lead from website',
          name: 'Neha Singh',
          time: '3 days ago',
          timestamp: '2023-07-12T13:25:00Z',
          link: '/admin/leads/12'
        },
        {
          id: 12,
          type: 'pet',
          description: 'Pet marked as adopted',
          name: 'Labrador - Rocky',
          time: '4 days ago',
          timestamp: '2023-07-11T10:15:00Z',
          link: '/admin/pets/3'
        },
        {
          id: 13,
          type: 'visitor',
          description: 'Traffic spike from social media',
          name: 'Facebook campaign',
          time: '5 days ago',
          timestamp: '2023-07-10T18:50:00Z',
          link: '/admin/analytics'
        },
        {
          id: 14,
          type: 'product',
          description: 'Product category changed',
          name: 'Bird Cage - Small',
          time: '5 days ago',
          timestamp: '2023-07-10T14:30:00Z',
          link: '/admin/products/20'
        },
        {
          id: 15,
          type: 'lead',
          description: 'Lead follow-up scheduled',
          name: 'Vikram Malhotra',
          time: '1 week ago',
          timestamp: '2023-07-08T11:20:00Z',
          link: '/admin/leads/15'
        }
      ];

      activities.push(...mockActivities);
    }

    // Sort activities by timestamp (newest first)
    return activities.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });
  }

  // Helper function to format time ago
  function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
      const diffWeek = Math.floor(diffDay / 7);
      return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
