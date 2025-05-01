import Link from 'next/link';
import Image from 'next/image';

export default function PetGrid({ pets = [] }) {
  if (pets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No pets found</h2>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pets.map(pet => (
        <Link href={`/pets/${pet.id}`} key={pet.id}>
          <a className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="relative h-48 w-full">
              <Image 
                src={pet.imageUrl || '/images/placeholder-pet.jpg'} 
                alt={pet.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{pet.name}</h3>
              <p className="text-gray-600 mb-1">{pet.breed}</p>
              <p className="text-gray-600 mb-2">{pet.age} • {pet.gender}</p>
              {pet.price && (
                <p className="text-blue-600 font-bold">₹{pet.price}</p>
              )}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
