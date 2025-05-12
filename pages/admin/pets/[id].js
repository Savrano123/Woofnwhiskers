import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function EditPet() {
  const router = useRouter();
  const { id } = router.query;
  const isNewPet = id === 'new';

  const [isLoading, setIsLoading] = useState(!isNewPet);
  const [isSaving, setIsSaving] = useState(false);
  const [pet, setPet] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    price: '',
    status: 'Available',
    imageUrl: ''
  });
  // We'll use this state to store the file for upload in a real implementation
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!isNewPet && id) {
      const fetchPet = async () => {
        try {
          const response = await fetch(`/api/pets/${id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch pet');
          }

          const petData = await response.json();
          setPet(petData);
          setImagePreview(petData.imageUrl || '/images/pets/max.jpg');
        } catch (error) {
          console.error('Failed to fetch pet:', error);
          alert('Failed to load pet data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPet();
    }
  }, [router.isReady, id, isNewPet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Pet image file selected:', file.name, 'type:', file.type, 'size:', file.size);

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please select a file smaller than 5MB.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('FileReader completed');
        setImagePreview(reader.result);
        // Also update the pet state with the preview URL
        setPet(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error reading the image file. Please try another file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Upload the image if a new one was selected
      let imageUrl = pet.imageUrl;

      // Check if the imageUrl is a data URL (from FileReader) and not a file path
      const isDataUrl = imageUrl?.startsWith('data:');

      // If we have a data URL but no file, we need to use a default image
      if (isDataUrl && !imageFile) {
        imageUrl = '/images/pets/max.jpg';
      }

      if (imageFile) {
        console.log('Uploading pet image file:', imageFile.name);

        try {
          // Read the file as an ArrayBuffer for direct upload
          const arrayBuffer = await imageFile.arrayBuffer();
          console.log(`File read as ArrayBuffer, size: ${arrayBuffer.byteLength} bytes`);

          console.log('Sending direct upload request...');
          const uploadResponse = await fetch('/api/direct-upload?type=pets', {
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

          if (uploadResult && uploadResult.filePath) {
            imageUrl = uploadResult.filePath;
            console.log('Image URL set to:', imageUrl);
          } else {
            console.error('Invalid upload result:', uploadResult);
            throw new Error('Invalid upload result');
          }
        } catch (uploadError) {
          console.error('Error during image upload:', uploadError);
          alert(`Error uploading image: ${uploadError.message}`);
          // Use default image if upload fails
          imageUrl = '/images/placeholder-pet.jpg';
        }
      }

      // Ensure we have a valid imageUrl
      if (!imageUrl || imageUrl.startsWith('data:')) {
        console.log('Using fallback image');
        imageUrl = '/images/placeholder-pet.jpg';
      }

      // We can't use fs in the browser, so we'll just check if the URL is valid
      if (!imageUrl || imageUrl === '' || imageUrl === 'undefined') {
        console.error('Invalid image URL');
        imageUrl = '/images/placeholder-pet.jpg';
      } else {
        console.log(`Using image URL: ${imageUrl}`);
      }

      const petData = {
        ...pet,
        imageUrl: imageUrl
      };

      console.log('Final pet data:', petData);

      const url = isNewPet ? '/api/pets' : `/api/pets/${id}`;
      const method = isNewPet ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error('Failed to save pet');
      }

      // Show success message
      alert(`Pet ${isNewPet ? 'created' : 'updated'} successfully`);
      router.push('/admin/pets');
    } catch (error) {
      console.error('Failed to save pet:', error);
      alert('Failed to save pet: ' + error.message);
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
        <title>{isNewPet ? 'Add New Pet' : `Edit ${pet.name}`} | Admin Dashboard</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isNewPet ? 'Add New Pet' : `Edit ${pet.name}`}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Pet Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              value={pet.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="species">
              Species
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="species"
              name="species"
              type="text"
              value={pet.species}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="breed">
              Breed
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="breed"
              name="breed"
              type="text"
              value={pet.breed}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="age"
              name="age"
              type="text"
              value={pet.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="gender"
              name="gender"
              value={pet.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price (₹)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              name="price"
              type="number"
              min="0"
              value={pet.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              name="status"
              value={pet.status}
              onChange={handleChange}
              required
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Pet Image
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
              <div className="mt-2 relative h-40 w-40">
                <Image
                  src={imagePreview}
                  alt="Pet preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            rows="4"
            value={pet.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/pets')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSaving ? 'Saving...' : isNewPet ? 'Create Pet' : 'Update Pet'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}