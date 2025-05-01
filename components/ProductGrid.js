import Link from 'next/link';
import Image from 'next/image';

export default function ProductGrid({ products = [], basePath = '/products' }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-gray-600 mb-4">There are currently no products available in this category.</p>
        <p className="text-gray-600">Please check back later or contact us for more information.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Link href={`${basePath}/${product.id}`} key={product.id}>
          <a className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-48 w-full">
              <Image
                src={product.imageUrl || '/images/placeholder-product.jpg'}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              {product.brand && (
                <p className="text-gray-600 mb-1">{product.brand}</p>
              )}
              {product.category && (
                <p className="text-gray-600 mb-1">{product.category}</p>
              )}
              {product.petType && (
                <p className="text-gray-600 mb-2">For {product.petType}</p>
              )}
              {product.price && (
                <p className="text-blue-600 font-bold">₹{product.price}</p>
              )}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
