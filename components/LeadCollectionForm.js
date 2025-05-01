import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function LeadCollectionForm({ petId, petName, productId, productName }) {
  const { settings, loading } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: petId ? 'pets' : productId ? (productId.includes('food') ? 'food' : 'accessories') : 'general',
    status: 'new',
    source: 'website',
    petId: petId || null,
    petName: petName || null,
    productId: productId || null,
    productName: productName || null
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: null });

    try {
      // Prepare the lead data with timestamp
      const leadData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Submit to the API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        interest: petId ? 'pets' : productId ? (productId.includes('food') ? 'food' : 'accessories') : 'general',
        status: 'new',
        source: 'website',
        petId: petId || null,
        petName: petName || null,
        productId: productId || null,
        productName: productName || null
      });

      setStatus({ submitted: true, submitting: false, error: null });
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({ submitted: false, submitting: false, error: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="bg-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-blue-600 text-white p-8">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="mb-6">
                Interested in our pets or products? Fill out this form and we'll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-6 w-6 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p>{loading ? '+91 123 456 7890' : settings?.general?.storePhones?.[0] || '+91 123 456 7890'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>{loading ? 'info@woofnwhiskers.com' : settings?.general?.storeEmail || 'info@woofnwhiskers.com'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p>{loading ? 'Sector 12, Dwarka, New Delhi' : settings?.general?.storeAddress || 'Sector 12, Dwarka, New Delhi'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              {status.submitted ? (
                <div className="text-center py-12">
                  <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600">We've received your message and will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-xl font-bold mb-4">Send us a message</h3>

                  {status.error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                      <p className="text-red-700">{status.error}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                      I'm interested in
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="pets">Pets</option>
                      <option value="accessories">Accessories</option>
                      <option value="food">Pet Food</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={status.submitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {status.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
