import { useState, useEffect } from 'react';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    visitors: 0,
    leads: 0,
    pets: 0,
    products: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch data from APIs
        const [leadsResponse, petsResponse, productsResponse, blogPostsResponse] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/pets'),
          fetch('/api/products'),
          fetch('/api/blog')
        ]);

        // Process responses
        const leads = await leadsResponse.json();
        const pets = await petsResponse.json();
        const products = await productsResponse.json();
        const blogData = await blogPostsResponse.json();

        // Set stats with real data
        setStats({
          visitors: 1245, // Keep mock data for visitors since we don't track them yet
          leads: Array.isArray(leads) ? leads.length : 0,
          pets: Array.isArray(pets) ? pets.length : 0,
          products: Array.isArray(products) ? products.length : 0,
          blogPosts: blogData.pagination ? blogData.pagination.total : 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default values in case of error
        setStats({
          visitors: 0,
          leads: 0,
          pets: 0,
          products: 0,
          blogPosts: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.visitors,
      change: '+12.5%',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'New Leads',
      value: stats.leads,
      change: '+8.2%',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'Active Pets',
      value: stats.pets,
      change: '+2',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
        </svg>
      )
    },
    {
      title: 'Total Products',
      value: stats.products,
      change: '+5.7%',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts || 0,
      change: 'New',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <div className="bg-gray-100 p-2 rounded-full">{card.icon}</div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{card.value.toLocaleString()}</p>
            <p className={`ml-2 text-sm font-medium ${
              card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change}
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">Compared to last month</p>
        </div>
      ))}
    </div>
  );
}
