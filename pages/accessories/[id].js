import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeadCollectionForm from '../../components/LeadCollectionForm';
import BackButton from '../../components/BackButton';

export default function AccessoryProductPage({ product, relatedProducts = [] }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div>
      <Head>
        <title>{product.name} - WoofnWhiskers Dwarka</title>
        <meta name="description" content={`Buy ${product.name} for your ${product.petType} from WoofnWhiskers in Dwarka, New Delhi`} />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/accessories" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-96 w-full">
              <Image
                src={product.imageUrl || '/images/placeholder-product.jpg'}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="p-4 text-sm text-gray-500">
              <p>Listed on {formattedDate}</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-700 mb-4">{product.category}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Pet Type</p>
                <p className="font-semibold">{product.petType}</p>
              </div>
              <div>
                <p className="text-gray-600">Size</p>
                <p className="font-semibold">{product.size}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold text-blue-600">₹{product.price}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-200 px-3 py-1 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-200 px-3 py-1 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {showContactForm && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Inquire about {product.name}</h2>
            <LeadCollectionForm productId={product.id} productName={product.name} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link href={`/accessories/${relatedProduct.id}`} key={relatedProduct.id}>
                  <a className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedProduct.imageUrl || '/images/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{relatedProduct.name}</h3>
                      <p className="text-gray-600 mb-1">{relatedProduct.category}</p>
                      <p className="text-blue-600 font-bold">₹{relatedProduct.price}</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch all accessories product IDs from the database
  let products = [];

  try {
    const { db } = require('../../lib/db');
    const allProducts = db.getAll('products') || [];

    // Filter to only include accessories products (non-food)
    products = allProducts.filter(product =>
      product.category !== 'Food' &&
      product.category?.toLowerCase() !== 'food'
    );
  } catch (error) {
    console.error('Error fetching accessories products for static paths:', error);
    // Fallback to default IDs if there's an error
    products = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];
  }

  return {
    paths: products.map(product => ({ params: { id: product.id.toString() } })),
    fallback: 'blocking' // Show a loading state for new products
  };
}

export async function getStaticProps({ params }) {
  // Fetch the specific product data from the database
  let product = null;
  let relatedProducts = [];

  try {
    const { db } = require('../../lib/db');
    product = db.getById('products', params.id);

    // If product not found, return 404
    if (!product) {
      return {
        notFound: true
      };
    }

    // Get related products (same category, different ID)
    const allProducts = db.getAll('products') || [];
    relatedProducts = allProducts
      .filter(p =>
        p.category !== 'Food' &&
        p.category?.toLowerCase() !== 'food' &&
        p.id !== product.id &&
        p.petType === product.petType
      )
      .slice(0, 4);

    // If no related products, get any accessories products
    if (relatedProducts.length === 0) {
      relatedProducts = allProducts
        .filter(p =>
          p.category !== 'Food' &&
          p.category?.toLowerCase() !== 'food' &&
          p.id !== product.id
        )
        .slice(0, 4);
    }

    // Add related products to the props
    return {
      props: {
        product,
        relatedProducts
      },
      revalidate: 60 // Revalidate every minute to quickly reflect changes
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    // Create a fallback product if there's an error
    product = {
      id: parseInt(params.id),
      name: ['Deluxe Pet Bed', 'Cat Scratching Post', 'Dog Collar with Name Tag', 'Interactive Cat Toy'][parseInt(params.id) - 1] || 'Pet Accessory',
      category: ['Bedding', 'Toys', 'Collars & Leashes', 'Toys'][parseInt(params.id) - 1] || 'Unknown',
      petType: ['Dog', 'Cat', 'Dog', 'Cat'][parseInt(params.id) - 1] || 'Unknown',
      description: 'This high-quality pet accessory is designed to enhance your pet\'s comfort and happiness. Made with durable materials and attention to detail for long-lasting use.',
      price: [1500, 800, 350, 600][parseInt(params.id) - 1] || 500,
      size: ['Medium', 'Standard', 'Small', 'One Size'][parseInt(params.id) - 1] || 'Standard',
      imageUrl: '/images/products/pet-bed.jpg',
      createdAt: new Date().toISOString()
    };

    return {
      props: {
        product,
        relatedProducts: []
      },
      revalidate: 60 // Revalidate every minute to quickly reflect changes
    };
  }
}
