import { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import PageHeader from '../../components/PageHeader';
import ProductGrid from '../../components/ProductGrid';
import FilterSidebar from '../../components/FilterSidebar';

export default function PetFoodPage({ products = [] }) {
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [activeFilters, setActiveFilters] = useState({
    petType: [],
    brand: [],
    priceRange: []
  });

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = products.filter(product => {
      if (!product) return false;

      const matchesSearch = searchTerms.some(term => {
        const name = product.name ? product.name.toLowerCase() : '';
        const brand = product.brand ? product.brand.toLowerCase() : '';
        const petType = product.petType ? product.petType.toLowerCase() : '';
        const description = product.description ? product.description.toLowerCase() : '';

        return name.includes(term) ||
               brand.includes(term) ||
               petType.includes(term) ||
               description.includes(term);
      });
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
    if (!product) return false;

    // If no filters are active for a category, include all products
    const petTypeMatch = activeFilters.petType.length === 0 ||
                         (product.petType && activeFilters.petType.includes(product.petType));
    const brandMatch = activeFilters.brand.length === 0 ||
                       (product.brand && activeFilters.brand.includes(product.brand));

    // Price range filter
    let priceMatch = true;
    if (activeFilters.priceRange.length > 0 && product.price !== undefined) {
      priceMatch = false;
      const price = Number(product.price) || 0;

      for (const range of activeFilters.priceRange) {
        if (range === 'under500' && price < 500) {
          priceMatch = true;
          break;
        } else if (range === '500-1000' && price >= 500 && price <= 1000) {
          priceMatch = true;
          break;
        } else if (range === '1000-2000' && price > 1000 && price <= 2000) {
          priceMatch = true;
          break;
        } else if (range === 'over2000' && price > 2000) {
          priceMatch = true;
          break;
        }
      }
    }

    return petTypeMatch && brandMatch && priceMatch;
  });

  // Get unique values for filter options
  const uniquePetTypes = [...new Set(products.filter(p => p && p.petType).map(product => product.petType))];
  const uniqueBrands = [...new Set(products.filter(p => p && p.brand).map(product => product.brand))];
  const priceRanges = [
    { id: 'under500', label: 'Under ₹500' },
    { id: '500-1000', label: '₹500 - ₹1,000' },
    { id: '1000-2000', label: '₹1,000 - ₹2,000' },
    { id: 'over2000', label: 'Over ₹2,000' }
  ];

  return (
    <div>
      <Head>
        <title>Pet Food - WoofnWhiskers Dwarka</title>
        <meta name="description" content="Browse our selection of high-quality pet food at WoofnWhiskers in Dwarka, New Delhi" />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <PageHeader title="Pet Food" fallbackPath="/" />

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
                name: 'Brand',
                key: 'brand',
                options: uniqueBrands
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
            {displayedProducts.length > 0 ? (
              <ProductGrid
                products={displayedProducts}
                basePath="/food"
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setActiveFilters({ petType: [], brand: [], priceRange: [] });
                    setFilteredProducts(products || []);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Clear All Filters
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

export async function getStaticProps() {
  // Fetch products from the API
  let products = [];

  try {
    // Use the database directly in getStaticProps
    const { db } = require('../../lib/db');
    const allProducts = db.getAll('products') || [];

    // Filter to only include food products
    products = allProducts.filter(product =>
      product.category === 'Food' ||
      product.category?.toLowerCase() === 'food'
    );

    // If no food products found, use default data
    if (products.length === 0) {
      products = [
        {
          id: 1,
          name: 'Premium Dry Dog Food',
          brand: 'Royal Canin',
          petType: 'Dog',
          category: 'Food',
          description: 'High-quality dry food for adult dogs with balanced nutrition for optimal health and energy.',
          price: 1200,
          weight: '5kg',
          imageUrl: '/images/products/pet-bed.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: 'Kitten Wet Food',
          brand: 'Whiskas',
          petType: 'Cat',
          category: 'Food',
          description: 'Delicious wet food specially formulated for kittens to support healthy growth and development.',
          price: 450,
          weight: '400g',
          imageUrl: '/images/products/pet-bed.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: 'Senior Dog Food',
          brand: 'Pedigree',
          petType: 'Dog',
          category: 'Food',
          description: 'Specially formulated food for senior dogs to support joint health and maintain energy levels.',
          price: 950,
          weight: '3kg',
          imageUrl: '/images/products/pet-bed.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: 'Adult Cat Dry Food',
          brand: 'Meow Mix',
          petType: 'Cat',
          category: 'Food',
          description: 'Complete and balanced nutrition for adult cats with added vitamins and minerals.',
          price: 800,
          weight: '2kg',
          imageUrl: '/images/products/pet-bed.jpg',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  } catch (error) {
    console.error('Error fetching food products:', error);
    // Use default data if there's an error
    products = [
      {
        id: 1,
        name: 'Premium Dry Dog Food',
        brand: 'Royal Canin',
        petType: 'Dog',
        category: 'Food',
        description: 'High-quality dry food for adult dogs with balanced nutrition for optimal health and energy.',
        price: 1200,
        weight: '5kg',
        imageUrl: '/images/products/pet-bed.jpg',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Kitten Wet Food',
        brand: 'Whiskas',
        petType: 'Cat',
        category: 'Food',
        description: 'Delicious wet food specially formulated for kittens to support healthy growth and development.',
        price: 450,
        weight: '400g',
        imageUrl: '/images/products/pet-bed.jpg',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  return {
    props: {
      products
    },
    revalidate: 60 // Revalidate every minute to quickly reflect changes
  };
}
