import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';
import RevalidateButton from '../../../components/admin/RevalidateButton';
import CarouselStatus from '../../../components/admin/CarouselStatus';

export default function CarouselManagement() {
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carousel');

        if (!response.ok) {
          throw new Error('Failed to fetch carousel slides');
        }

        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching carousel slides:', error);
        alert('Failed to load carousel slides');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) {
      return;
    }

    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete slide');
      }

      // Remove the deleted slide from the state
      setSlides(slides.filter(slide => slide.id !== id));
      alert('Slide deleted successfully');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Failed to delete slide: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Carousel Management | Admin Dashboard</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carousel Management</h1>
        <Link href="/admin/carousel/new">
          <a className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add New Slide
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Update Homepage</h2>
          <p className="text-sm text-gray-600 mb-3">
            After adding or editing carousel slides, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 mb-3">
            <li className="mb-1">Click the "Update Homepage" button below</li>
            <li className="mb-1">Open the homepage in a new tab</li>
            <li className="mb-1">If you don't see your changes, try a hard refresh (Ctrl+F5 or Cmd+Shift+R)</li>
          </ol>
          <div className="flex space-x-4">
            <RevalidateButton
              path="/"
              label="Update Homepage"
            />
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Homepage
            </a>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Carousel Status</h2>
          <p className="text-sm text-gray-600 mb-3">
            Check if the homepage carousel is in sync with the database.
          </p>
          <CarouselStatus />
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No carousel slides found.</p>
          <Link href="/admin/carousel/new">
            <a className="text-blue-600 hover:text-blue-800">Add your first slide</a>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-24 relative">
                      <Image
                        src={slide.imageUrl || '/images/placeholder-product.jpg'}
                        alt={slide.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{slide.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/carousel/${slide.id}`}>
                      <a className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(slide.id)}
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
