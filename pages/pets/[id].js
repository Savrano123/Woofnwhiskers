import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LeadCollectionForm from '../../components/LeadCollectionForm';
import BackButton from '../../components/BackButton';

export default function PetProfile({ pet }) {
  const [showContactForm, setShowContactForm] = useState(false);

  const formattedDate = new Date(pet.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div>
      <Head>
        <title>{pet.name} - WoofnWhiskers Dwarka</title>
        <meta name="description" content={`Adopt ${pet.name}, a ${pet.age} ${pet.breed} from WoofnWhiskers in Dwarka, New Delhi`} />
      </Head>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackPath="/pets" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Images */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-96 w-full">
              <Image
                src={pet.imageUrl || '/images/placeholder-pet.jpg'}
                alt={pet.name}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="p-4 text-sm text-gray-500">
              <p>Listed on {formattedDate}</p>
            </div>
          </div>

          {/* Pet Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
            <p className="text-xl text-gray-700 mb-4">{pet.breed}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-semibold">{pet.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-semibold">{pet.gender}</p>
              </div>
              <div>
                <p className="text-gray-600">Species</p>
                <p className="font-semibold">{pet.species}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold text-blue-600">₹{pet.price}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About {pet.name}</h2>
              <p className="text-gray-700">{pet.description}</p>
            </div>

            <button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Begin adoption process, chat now
            </button>
          </div>
        </div>

        {showContactForm && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact us about {pet.name}</h2>
            <LeadCollectionForm petId={pet.id} petName={pet.name} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch all pet IDs from the database
  let pets = [];

  try {
    const { db } = require('../../lib/db');
    pets = db.getAll('pets') || [];
  } catch (error) {
    console.error('Error fetching pets for static paths:', error);
    // Fallback to default IDs if there's an error
    pets = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];
  }

  return {
    paths: pets.map(pet => ({ params: { id: pet.id.toString() } })),
    fallback: 'blocking' // Show a loading state for new pets
  };
}

export async function getStaticProps({ params }) {
  // Fetch the specific pet data from the database
  let pet = null;

  try {
    const { db } = require('../../lib/db');
    pet = db.getById('pets', params.id);

    // If pet not found, return 404
    if (!pet) {
      return {
        notFound: true
      };
    }
  } catch (error) {
    console.error('Error fetching pet data:', error);
    // Create a fallback pet if there's an error
    pet = {
      id: parseInt(params.id),
      name: ['Max', 'Bella', 'Charlie', 'Luna'][parseInt(params.id) - 1] || 'Pet',
      species: ['Dog', 'Dog', 'Cat', 'Cat'][parseInt(params.id) - 1] || 'Unknown',
      breed: ['Golden Retriever', 'Labrador', 'Persian', 'Siamese'][parseInt(params.id) - 1] || 'Unknown',
      age: ['2 years', '1 year', '3 years', '2 years'][parseInt(params.id) - 1] || 'Unknown',
      gender: ['Male', 'Female', 'Male', 'Female'][parseInt(params.id) - 1] || 'Unknown',
      description: 'This loving pet is looking for a forever home. They are well-behaved, friendly, and great with children. They have been vaccinated and are in excellent health.',
      price: [15000, 12000, 8000, 10000][parseInt(params.id) - 1] || 5000,
      imageUrl: '/images/pets/max.jpg',
      createdAt: new Date().toISOString(),
      status: 'Available'
    };
  }

  return {
    props: {
      pet
    },
    revalidate: 60 // Revalidate every minute to quickly reflect changes
  };
}