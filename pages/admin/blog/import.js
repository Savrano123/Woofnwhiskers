import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';

export default function ImportBlogPost() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['.json', '.md', '.markdown'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload a JSON or Markdown file.`);
      fileInputRef.current.value = '';
      return;
    }

    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type
    });
    
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fileInputRef.current.files || fileInputRef.current.files.length === 0) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const response = await fetch('/api/blog/import', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import blog post');
      }

      setSuccess(`Blog post "${data.post.title}" imported successfully!`);
      setFileInfo(null);
      fileInputRef.current.value = '';
      
      // Redirect to the edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/blog/${data.post.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error importing blog post:', error);
      setError(error.message || 'An error occurred while importing the blog post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Import Blog Post | WoofnWhiskers Admin</title>
      </Head>

      <div className="mb-6 flex items-center">
        <BackButton href="/admin/blog" />
        <h1 className="text-2xl font-bold ml-4">Import Blog Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Upload a JSON or Markdown file containing a blog post. The file should include at least a title and content.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>JSON Format:</strong> The JSON file should contain an object with properties like title, content, excerpt, category, tags, etc.
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  <strong>Markdown Format:</strong> The Markdown file should have front matter (YAML) at the top with metadata, followed by the content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,.md,.markdown"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload a JSON or Markdown file containing your blog post.
            </p>
          </div>

          {fileInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">File Information</h3>
              <ul className="text-sm text-gray-600">
                <li><strong>Name:</strong> {fileInfo.name}</li>
                <li><strong>Size:</strong> {fileInfo.size}</li>
                <li><strong>Type:</strong> {fileInfo.type}</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Link href="/admin/blog">
              <a className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                Cancel
              </a>
            </Link>
            <button
              type="submit"
              disabled={isUploading || !fileInfo}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                (isUploading || !fileInfo) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Importing...' : 'Import Blog Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">File Format Examples</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">JSON Example</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "title": "10 Essential Tips for New Pet Owners",
  "excerpt": "A comprehensive guide for first-time pet parents to ensure a smooth transition.",
  "content": "<p>Bringing home a new pet is exciting, but it also comes with responsibilities...</p>",
  "category": "Pet Care",
  "tags": ["new pets", "pet care", "beginners guide"],
  "author": "Dr. Pet Expert",
  "authorTitle": "Veterinarian",
  "published": true,
  "readTime": "5"
}`}
          </pre>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Markdown Example</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
{`---
title: 10 Essential Tips for New Pet Owners
excerpt: A comprehensive guide for first-time pet parents to ensure a smooth transition.
category: Pet Care
tags: new pets, pet care, beginners guide
author: Dr. Pet Expert
authorTitle: Veterinarian
published: true
readTime: 5
---

# 10 Essential Tips for New Pet Owners

Bringing home a new pet is exciting, but it also comes with responsibilities.

## 1. Prepare Your Home

Before bringing your new pet home, make sure your space is safe and comfortable.

## 2. Find a Veterinarian

Schedule a check-up within the first week of bringing your pet home.

[... rest of the content ...]`}
          </pre>
        </div>
      </div>
    </AdminLayout>
  );
}
