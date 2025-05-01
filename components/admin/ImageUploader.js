import { useState, useRef } from 'react';

export default function ImageUploader({ category, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('category', category);
    
    // Add all selected files to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call the success callback
      if (onUploadSuccess) {
        onUploadSuccess(data.files);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.message || 'An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <label className="block">
          <span className="sr-only">Choose files</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>
        
        <div className="text-sm text-gray-500">
          {isUploading ? 'Uploading...' : `Upload to ${category}`}
        </div>
      </div>
      
      {uploadProgress > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          Error: {error}
        </div>
      )}
    </div>
  );
}
