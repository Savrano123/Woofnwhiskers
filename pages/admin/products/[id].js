import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';

export default function AdminProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const isNewProduct = id === 'new';

  const [product, setProduct] = useState({
    name: '',
    category: 'Food',
    petType: 'Dog',
    price: '',
    stock: '',
    description: '',
    imageUrl: '/images/placeholder-product.jpg'
  });

  const [isLoading, setIsLoading] = useState(!isNewProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    if (!isNewProduct) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }

          const productData = await response.json();
          setProduct(productData);
        } catch (error) {
          console.error('Failed to fetch product:', error);
          alert('Failed to load product details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [router.isReady, id, isNewProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseInt(value) || '' : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Product image file selected:', file.name);
      setImageFile(file);
      // Use FileReader instead of URL.createObjectURL for consistency
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('FileReader completed');
        // Update the product state with the preview URL
        setProduct(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Upload the image if a new one was selected
      let imageUrl = product.imageUrl;

      // Check if the imageUrl is a blob URL (temporary) or if we have a new file
      const isBlobUrl = imageUrl?.startsWith('blob:');

      // If we have a blob URL but no file, we need to use a default image
      if (isBlobUrl && !imageFile) {
        imageUrl = '/images/products/pet-bed.jpg';
      }

      if (imageFile) {
        console.log('Uploading product image file:', imageFile.name);

        // Read the file as an ArrayBuffer for direct upload
        const arrayBuffer = await imageFile.arrayBuffer();
        console.log(`File read as ArrayBuffer, size: ${arrayBuffer.byteLength} bytes`);

        console.log('Sending direct upload request...');
        const uploadResponse = await fetch('/api/direct-upload?type=products', {
          method: 'POST',
          body: arrayBuffer,
          headers: {
            'Content-Type': imageFile.type
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.filePath;
      }

      const productData = {
        ...product,
        imageUrl: imageUrl || '/images/products/pet-bed.jpg'
      };

      const url = isNewProduct ? '/api/products' : `/api/products/${id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      // Show success message
      if (typeof window !== 'undefined') {
        window.alert(`Product ${isNewProduct ? 'created' : 'updated'} successfully`);
      }
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to save product: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <BackButton fallbackPath="/admin/products" />
        <h1 className="text-2xl font-bold mt-2">{isNewProduct ? 'Add New Product' : 'Edit Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Food">Food</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="petType" className="block text-sm font-medium text-gray-700 mb-1">
                Pet Type
              </label>
              <select
                id="petType"
                name="petType"
                value={product.petType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Fish">Fish</option>
                <option value="Bird">Bird</option>
                <option value="Small Pet">Small Pet</option>
                <option value="All">All</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="relative mx-auto h-32 w-32 mb-4">
                    <Image
                      src={product.imageUrl || '/images/placeholder-product.jpg'}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={product.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSaving ? 'Saving...' : isNewProduct ? 'Create Product' : 'Update Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
