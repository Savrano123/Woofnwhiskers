import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (onSearch) {
      // If onSearch prop is provided, use it (for in-page filtering)
      onSearch(query, category);
    } else {
      // Otherwise, navigate to search results page
      router.push({
        pathname: '/search',
        query: { 
          q: query,
          category: category !== 'all' ? category : undefined
        }
      });
    }
  };
  
  return (
    <div className="bg-white py-6 shadow-sm">
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search for pets, accessories, food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="pets">Pets</option>
              <option value="accessories">Accessories</option>
              <option value="food">Pet Food</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
