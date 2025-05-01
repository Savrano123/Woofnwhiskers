import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '../../components/admin/AdminLayout';
import BackButton from '../../components/BackButton';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import ImageUploader from '../../components/admin/ImageUploader';
import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';

export default function ImagesManagement({ imagesByCategory }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('carousel');
  const [images, setImages] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedPath, setCopiedPath] = useState(null);

  useEffect(() => {
    if (imagesByCategory && imagesByCategory[selectedCategory]) {
      setImages(imagesByCategory[selectedCategory]);
    } else {
      setImages([]);
    }
  }, [selectedCategory, imagesByCategory]);

  // Function to open the delete confirmation modal
  const openDeleteModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Function to delete an image
  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    setIsDeleting(true);
    setIsModalOpen(false);
    setDeleteResult(null);

    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagePath: selectedImage.path,
          category: selectedCategory
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteResult({
          success: true,
          message: `Image ${selectedImage.name} deleted successfully`
        });

        // Remove the deleted image from the list
        setImages(prevImages => prevImages.filter(img => img.path !== selectedImage.path));
      } else {
        setDeleteResult({
          success: false,
          message: data.error || 'Failed to delete image'
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteResult({
        success: false,
        message: error.message || 'An error occurred while deleting the image'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to refresh the page
  const refreshPage = () => {
    setIsRefreshing(true);
    router.replace(router.asPath);
  };

  // Function to copy image path to clipboard
  const copyToClipboard = (path) => {
    navigator.clipboard.writeText(path)
      .then(() => {
        setCopiedPath(path);
        setTimeout(() => setCopiedPath(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy path:', err);
      });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Images Management | Admin Dashboard</title>
      </Head>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteImage}
        title="Confirm Delete"
        message={selectedImage ? `Are you sure you want to delete ${selectedImage.name}? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDangerous={true}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Images Management</h1>
          <p className="text-gray-600">View and manage uploaded images</p>
        </div>
        <button
          onClick={refreshPage}
          disabled={isRefreshing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Images'}
        </button>
      </div>

      {deleteResult && (
        <div className={`mb-6 p-4 rounded-lg ${deleteResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-medium">{deleteResult.success ? 'Success!' : 'Error!'}</p>
          <p>{deleteResult.message}</p>
          <button
            onClick={() => setDeleteResult(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>
          <div className="flex space-x-2">
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.keys(imagesByCategory).map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({imagesByCategory[category].length})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-1">Upload New Images</h2>
          <ImageUploader
            category={selectedCategory}
            onUploadSuccess={() => refreshPage()}
          />
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No images found in this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Images ({images.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.name} className="border rounded-lg overflow-hidden">
                  <div className="relative h-40 group">
                    <Image
                      src={image.path}
                      alt={image.name}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a
                        href={image.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded mr-2"
                      >
                        View
                      </a>
                      <button
                        onClick={() => openDeleteModal(image)}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-2 rounded disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate" title={image.name}>
                        {image.name}
                      </p>
                      <button
                        onClick={() => openDeleteModal(image)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 text-xs ml-2 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(image.lastModified).toLocaleDateString()}
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500 truncate flex-grow" title={image.path}>
                        {image.path}
                      </p>
                      <button
                        onClick={() => copyToClipboard(image.path)}
                        className="text-blue-600 hover:text-blue-800 text-xs ml-2"
                        title="Copy path to clipboard"
                      >
                        {copiedPath === image.path ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

export async function getServerSideProps() {
  // Get all image categories
  const categories = ['carousel', 'pets', 'products'];
  const imagesByCategory = {};

  try {
    // Get images for each category
    for (const category of categories) {
      const categoryDir = path.join(process.cwd(), 'public', 'images', category);

      try {
        const files = fs.readdirSync(categoryDir);

        // Filter for image files and get their details
        const images = files
          .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .map(file => {
            const filePath = path.join(categoryDir, file);
            const stats = fs.statSync(filePath);

            return {
              name: file,
              path: `/images/${category}/${file}`,
              size: stats.size,
              lastModified: stats.mtime.toISOString()
            };
          })
          // Sort by last modified date (newest first)
          .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        imagesByCategory[category] = images;
      } catch (error) {
        console.error(`Error reading ${category} directory:`, error);
        imagesByCategory[category] = [];
      }
    }
  } catch (error) {
    console.error('Error getting images:', error);
  }

  return {
    props: {
      imagesByCategory
    }
  };
}
