import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import PageHeader from '../../components/PageHeader';
import ProductGrid from '../../components/ProductGrid';
import FilterSidebar from '../../components/FilterSidebar';

export default function AccessoriesPage({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeFilters, setActiveFilters] = useState({
    petType: [],
    category: [],
    priceRange: []
  });

  const handleSearch = (query, category) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = products.filter(product => {
      const matchesSearch = searchTerms.some(term =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.petType.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
      return matchesSearch;
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };

      if (newFilters[filterType].includes(value)) {
        // Remove filter if already active
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        // Add filter
        newFilters[filterType] = [...newFilters[filterType], value];
      }

      return newFilters;
    });
  };

  // Apply filters
  const displayedProducts = filteredProducts.filter(product => {
    // If no filters are active for a category, include all products
    const petTypeMatch = activeFilters.petType.length === 0 ||
                         activeFilters.petType.includes(product.petType);
    const categoryMatch = activeFilters.category.length === 0 ||
                          activeFilters.category.includes(product.category);

    // Price range filter
    let priceMatch = true;
    if (activeFilters.priceRange.length > 0) {
      priceMatch = false;
      for (const range of activeFilters.priceRange) {
        if (range === 'under500' && product.price < 500) {
          priceMatch = true;
          break;
        } else if (range === '500-1000' && product.price >= 500 && product.price <= 1000) {
          priceMatch = true;
          break;
        } else if (range === '1000-2000' && product.price > 1000 && product.price <= 2000) {
          priceMatch = true;
          break;
        } else if (range === 'over2000' && product.price > 2000) {
          priceMatch = true;
          break;
        }
      }
    }

    return petTypeMatch && categoryMatch && priceMatch;
  });

  // Get unique values for filter options
  const uniquePetTypes = [...new Set(products.map(product => product.petType))];
  const uniqueCategories = [...new Set(products.map(product => product.category))];
  const priceRanges = [
    { id: 'under500', label: 'Under ₹500' },
    { id: '500-1000', label: '₹500 - ₹1,000' },
    { id: '1000-2000', label: '₹1,000 - ₹2,000' },
    { id: 'over2000', label: 'Over ₹2,000' }
  ];

  return (
    <div>
      <Head>
        <title>Pet Accessories - WoofnWhiskers Dwarka</title>
        <meta name="description" content="Browse our selection of high-quality pet accessories at WoofnWhiskers in Dwarka, New Delhi" />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader title="Pet Accessories" fallbackPath="/" />

        <SearchBar onSearch={handleSearch} />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Filters */}
          <FilterSidebar
            filters={[
              {
                name: 'Pet Type',
                key: 'petType',
                options: uniquePetTypes
              },
              {
                name: 'Category',
                key: 'category',
                options: uniqueCategories
              },
              {
                name: 'Price Range',
                key: 'priceRange',
                options: priceRanges
              }
            ]}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />

          {/* Product Listings */}
          <div className="md:w-3/4">
            <ProductGrid
              products={displayedProducts}
              basePath="/accessories"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // Fetch products from the API
  let products = [];

  try {
    // Use the database directly in getStaticProps
    const { db } = require('../../lib/db');
    const allProducts = db.getAll('products') || [];

    // Filter to only include accessories (non-food) products
    products = allProducts.filter(product =>
      product.category !== 'Food' &&
      product.category?.toLowerCase() !== 'food'
    );

    // If no accessories products found, use an empty array
    if (products.length === 0) {
      products = [];
    }
  } catch (error) {
    console.error('Error fetching accessories products:', error);
    // Use empty array if there's an error
    products = [];
  }

  return {
    props: {
      products
    },
    revalidate: 60 // Revalidate every minute to quickly reflect changes
  };
}
