import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';
import BackButton from '../../../components/BackButton';

// Import React Quill editor dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Import the CSS only on the client side
function QuillCSS() {
  useEffect(() => {
    // This ensures the CSS is only imported on the client side
    import('react-quill/dist/quill.snow.css');
  }, []);
  return null;
}

export default function BlogPostEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNewPost = id === 'new';

  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [],
    author: '',
    authorTitle: '',
    authorImage: '',
    published: false,
    readTime: ''
  });

  const [isLoading, setIsLoading] = useState(!isNewPost);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch post data if editing an existing post
  useEffect(() => {
    if (!router.isReady || isNewPost) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        window.alert('Failed to fetch post: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [router.isReady, id, isNewPost]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' && !post.slug) {
      // Auto-generate slug from title if slug is empty
      setPost(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    } else {
      setPost(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle rich text editor change
  const handleEditorChange = (content) => {
    setPost(prev => ({
      ...prev,
      content
    }));

    // Clear error for content field
    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: null
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // Add tag
  const handleAddTag = (e) => {
    e.preventDefault();

    if (!tagInput.trim()) return;

    // Don't add duplicate tags
    if (post.tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }

    setPost(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));

    setTagInput('');
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!post.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!post.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!post.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!post.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.alert('Please fix the errors in the form');
      return;
    }

    setIsSaving(true);

    try {
      const url = isNewPost ? '/api/blog' : `/api/blog/${id}`;
      const method = isNewPost ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const savedPost = await response.json();

      // Show success message
      window.alert(`Post ${isNewPost ? 'created' : 'updated'} successfully`);

      // Redirect to the post list or the edit page for a new post
      if (isNewPost) {
        router.push(`/admin/blog/${savedPost.id}`);
      } else {
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      window.alert('Failed to save post: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Preview post
  const handlePreview = () => {
    // Open the post in a new tab if it's published
    if (!isNewPost && post.published) {
      window.open(`/blog/${post.slug}`, '_blank');
    } else {
      window.alert('You can only preview published posts. Save and publish the post first.');
    }
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image'
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <QuillCSS />
      <Head>
        <title>{isNewPost ? 'Create New Post' : 'Edit Post'} | WoofnWhiskers Admin</title>
      </Head>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <BackButton href="/admin/blog" />
          <h1 className="text-2xl font-bold ml-4">{isNewPost ? 'Create New Post' : 'Edit Post'}</h1>
        </div>

        <div className="flex space-x-3">
          {!isNewPost && post.published && (
            <button
              type="button"
              onClick={handlePreview}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Preview
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={post.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter post title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /blog/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={post.slug}
                    onChange={handleChange}
                    className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="enter-post-slug"
                  />
                </div>
                {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  The slug is the URL-friendly version of the title. It should contain only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows="3"
                  value={post.excerpt}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Brief summary of the post (displayed in previews)"
                ></textarea>
                {errors.excerpt && <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className={`border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md`}>
                  <ReactQuill
                    value={post.content}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your post content here..."
                    theme="snow"
                    style={{ height: '400px' }}
                  />
                </div>
                {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              </div>
            </div>

            {/* Sidebar - 1/3 width on large screens */}
            <div className="lg:col-span-1 space-y-6">
              {/* Publish Settings */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Publish Settings</h3>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={post.published}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publish post
                  </label>
                </div>

                <div className="text-sm text-gray-500">
                  {post.published ? (
                    <p>This post will be visible to all visitors.</p>
                  ) : (
                    <p>This post is a draft and will not be visible to visitors.</p>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={post.coverImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the URL of the cover image for this post.
                </p>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={post.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Pet Care">Pet Care</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Training">Training</option>
                  <option value="Health">Health</option>
                  <option value="Grooming">Grooming</option>
                  <option value="Adoption">Adoption</option>
                  <option value="Products">Products</option>
                  <option value="News">News</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tagInput"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                </div>

                {post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag {tag}</span>
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Author Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Author Information</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={post.author}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label htmlFor="authorTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Author Title
                    </label>
                    <input
                      type="text"
                      id="authorTitle"
                      name="authorTitle"
                      value={post.authorTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Pet Care Specialist"
                    />
                  </div>

                  <div>
                    <label htmlFor="authorImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Author Image URL
                    </label>
                    <input
                      type="url"
                      id="authorImage"
                      name="authorImage"
                      value={post.authorImage}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/author.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Settings</h3>

                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="readTime"
                    name="readTime"
                    value={post.readTime}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
