import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

export default function BlogIndex({ initialPosts, categories, pagination }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(pagination.page);
  const [totalPages, setTotalPages] = useState(pagination.totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Update posts when query params change
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Build query string
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage);
        queryParams.append('published', 'true');
        
        if (activeCategory !== 'all') {
          queryParams.append('category', activeCategory);
        }
        
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/blog?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, activeCategory, searchTerm]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Head>
        <title>Blog | WoofnWhiskers</title>
        <meta name="description" content="Read the latest articles about pet care, nutrition, training, and more from WoofnWhiskers." />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/" />
        </div>

        <h1 className="text-3xl font-bold mb-6">Pet Care Blog</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Search</h2>
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-2 py-1 rounded ${
                      activeCategory === 'all' ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-2 py-1 rounded ${
                        activeCategory === category ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
              <p className="mb-4 text-sm">
                Get the latest pet care tips, product updates, and special offers delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={post.coverImage || '/images/blog/default-cover.jpg'}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-6">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="block">
                          <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">{post.title}</h2>
                        </a>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{post.category}</span>
                        {post.readTime && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{post.readTime} min read</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`}>
                        <a className="text-blue-600 hover:text-blue-800 font-medium">
                          Read More →
                        </a>
                      </Link>
                    </div>
                  </article>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-l-md border ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 border-t border-b ${
                            currentPage === index + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-r-md border ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? `No posts matching "${searchTerm}" were found.`
                    : activeCategory !== 'all'
                    ? `No posts in the "${activeCategory}" category.`
                    : 'No blog posts have been published yet.'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps() {
  // In a production environment, we would use an absolute URL
  // For local development, we'll use the Node.js API directly
  const { db } = require('../../lib/db');
  
  // Get all published posts
  let posts = db.getAll('blog_posts') || [];
  posts = posts.filter(post => post.published);
  
  // Sort by publishedAt date (newest first)
  posts = posts.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt);
    const dateB = new Date(b.publishedAt || b.createdAt);
    return dateB - dateA;
  });
  
  // Get first page of posts
  const limit = 10;
  const paginatedPosts = posts.slice(0, limit);
  
  // Extract unique categories
  const categories = [...new Set(posts.map(post => post.category))].filter(Boolean);
  
  return {
    props: {
      initialPosts: paginatedPosts,
      categories,
      pagination: {
        total: posts.length,
        page: 1,
        limit,
        totalPages: Math.ceil(posts.length / limit)
      }
    }
  };
}
