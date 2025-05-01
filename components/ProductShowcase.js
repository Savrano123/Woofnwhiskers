import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductShowcase({ products = [] }) {
  const [visibleProducts, setVisibleProducts] = useState(4);

  const loadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 4, products.length));
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <p className="text-center text-gray-500">No products available at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, visibleProducts).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={product.imageUrl || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-1">{product.category}</p>
                <p className="text-blue-600 font-bold mb-3">₹{product.price}</p>
                <Link href={`/${product.category === 'Food' ? 'food' : 'accessories'}/${product.id}`}>
                  <a className="text-blue-600 font-medium hover:text-blue-800">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {visibleProducts < products.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/accessories">
            <a className="text-blue-600 font-medium hover:text-blue-800 mr-6">
              View All Accessories →
            </a>
          </Link>
          <Link href="/food">
            <a className="text-blue-600 font-medium hover:text-blue-800">
              View All Pet Food →
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
