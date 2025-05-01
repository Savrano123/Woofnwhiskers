import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function PetsManagement() {
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');

        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }

        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        const response = await fetch(`/api/pets/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete pet');
        }

        // Update the UI by removing the deleted pet
        setPets(pets.filter(pet => pet.id !== id));
        // Show success message
        alert('Pet deleted successfully');
      } catch (error) {
        console.error('Failed to delete pet:', error);
        alert('Failed to delete pet: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Pets Management | Admin Dashboard</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pets Management</h1>
        <Link href="/admin/pets/new">
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add New Pet
          </a>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={pet.imageUrl || '/images/placeholder-pet.jpg'}
                          alt={pet.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                        <div className="text-sm text-gray-500">{pet.species}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pet.breed}</div>
                    <div className="text-sm text-gray-500">{pet.age}, {pet.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{pet.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pet.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/pets/${pet.id}`}>
                      <a className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}