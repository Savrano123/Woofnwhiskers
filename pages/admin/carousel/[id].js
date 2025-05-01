import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';
import RevalidateButton from '../../../components/admin/RevalidateButton';

export default function EditCarouselSlide() {
  const router = useRouter();
  const { id } = router.query;
  const isNewSlide = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNewSlide);
  const [isSaving, setIsSaving] = useState(false);
  const [slide, setSlide] = useState({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!isNewSlide && id) {
      const fetchSlide = async () => {
        try {
          const response = await fetch(`/api/carousel/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch slide');
          }

          const slideData = await response.json();
          setSlide(slideData);
          setImagePreview(slideData.imageUrl || '/images/placeholder-product.jpg');
        } catch (error) {
          console.error('Failed to fetch slide:', error);
          alert('Failed to load slide data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSlide();
    }
  }, [router.isReady, id, isNewSlide]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSlide(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image file selected:', file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('FileReader completed');
        setImagePreview(reader.result);
        // Also update the slide state with the preview URL
        setSlide(prev => ({
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
    console.log('Submitting form...');

    try {
      // Upload the image if a new one was selected
      let imageUrl = slide.imageUrl;
      console.log('Initial imageUrl:', imageUrl);

      // Check if the imageUrl is a data URL (from FileReader) and not a file path
      const isDataUrl = imageUrl?.startsWith('data:');
      console.log('Is data URL:', isDataUrl);

      // If we have a data URL but no file, we need to use a default image
      if (isDataUrl && !imageFile) {
        console.log('Data URL without file, using default image');
        imageUrl = '/images/placeholder-product.jpg';
      }

      if (imageFile) {
        console.log('Uploading image file:', imageFile.name);

        // Read the file as an ArrayBuffer for direct upload
        const arrayBuffer = await imageFile.arrayBuffer();
        console.log(`File read as ArrayBuffer, size: ${arrayBuffer.byteLength} bytes`);

        console.log('Sending direct upload request...');
        const uploadResponse = await fetch('/api/direct-upload?type=carousel', {
          method: 'POST',
          body: arrayBuffer,
          headers: {
            'Content-Type': imageFile.type
          }
        });

        console.log('Upload response status:', uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload response error:', errorText);
          throw new Error(`Failed to upload image: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);
        imageUrl = uploadResult.filePath;
      }

      const slideData = {
        ...slide,
        imageUrl: imageUrl || '/images/placeholder-product.jpg'
      };

      const url = isNewSlide ? '/api/carousel' : `/api/carousel/${id}`;
      const method = isNewSlide ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });

      if (!response.ok) {
        throw new Error('Failed to save slide');
      }

      // Show success message
      alert(`Slide ${isNewSlide ? 'created' : 'updated'} successfully. Please update the homepage to see your changes.`);
      router.push('/admin/carousel');
    } catch (error) {
      console.error('Failed to save slide:', error);
      alert('Failed to save slide: ' + error.message);
    } finally {
      setIsSaving(false);
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
        <title>{isNewSlide ? 'Add New Slide' : `Edit Slide`} | Admin Dashboard</title>
      </Head>

      <div className="mb-6">
        <BackButton fallbackPath="/admin/carousel" />
        <h1 className="text-2xl font-bold mt-2">{isNewSlide ? 'Add New Slide' : 'Edit Slide'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Slide Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                name="title"
                type="text"
                value={slide.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                rows="3"
                value={slide.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Slide Image
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 relative h-40 w-full">
                  <Image
                    src={imagePreview}
                    alt="Slide preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buttonText">
                Primary Button Text
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="buttonText"
                name="buttonText"
                type="text"
                value={slide.buttonText}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buttonLink">
                Primary Button Link
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="buttonLink"
                name="buttonLink"
                type="text"
                value={slide.buttonLink}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secondaryButtonText">
                Secondary Button Text (Optional)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="secondaryButtonText"
                name="secondaryButtonText"
                type="text"
                value={slide.secondaryButtonText}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secondaryButtonLink">
                Secondary Button Link (Optional)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="secondaryButtonLink"
                name="secondaryButtonLink"
                type="text"
                value={slide.secondaryButtonLink}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-start">
          <div>
            {!isNewSlide && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Update Homepage</h3>
                <p className="text-xs text-gray-600 mb-2">
                  After saving, follow these steps to see your changes:
                </p>
                <ol className="list-decimal list-inside text-xs text-gray-600 mb-2">
                  <li className="mb-1">Click "Update Homepage"</li>
                  <li className="mb-1">Open the homepage in a new tab</li>
                  <li className="mb-1">If needed, do a hard refresh (Ctrl+F5)</li>
                </ol>
                <div className="flex space-x-2">
                  <RevalidateButton
                    path="/"
                    label="Update Homepage"
                  />
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Open Homepage
                  </a>
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => router.push('/admin/carousel')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {isSaving ? 'Saving...' : isNewSlide ? 'Create Slide' : 'Update Slide'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
