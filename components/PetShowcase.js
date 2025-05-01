import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FallbackImage from './FallbackImage';
import StaticImage from './StaticImage';

export default function PetShowcase({ pets = [] }) {
  const [visiblePets, setVisiblePets] = useState(4);

  const loadMore = () => {
    setVisiblePets(prev => Math.min(prev + 4, pets.length));
  };

  if (!pets || pets.length === 0) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Pets</h2>
          <p className="text-center text-gray-500">No pets available at the moment. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Pets</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.slice(0, visiblePets).map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full overflow-hidden">
                <StaticImage
                  src={pet.imageUrl || '/images/placeholder-pet.jpg'}
                  fallbackSrc="/images/placeholder-pet.jpg"
                  alt={pet.name}
                  className="w-full h-full"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                <p className="text-gray-600 mb-1">{pet.breed}</p>
                <p className="text-gray-600 mb-3">{pet.age}</p>
                <Link href={`/pets/${pet.id}`}>
                  <a className="text-blue-600 font-medium hover:text-blue-800">
                    View Details
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {visiblePets < pets.length && (
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
          <Link href="/pets">
            <a className="text-blue-600 font-medium hover:text-blue-800">
              View All Pets →
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
