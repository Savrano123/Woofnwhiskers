import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function AdminSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'WoofnWhiskers',
    storeAddress: 'Sector 12, Dwarka, New Delhi',
    storePhones: ['+91 123 456 7890', '', ''],
    storeEmail: 'info@woofnwhiskers.com',
    businessHours: 'Monday - Friday: 10:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM'
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: 'https://facebook.com/woofnwhiskers',
    instagram: 'https://instagram.com/woofnwhiskers',
    twitter: '',
    youtube: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newLeadNotifications: true,
    orderNotifications: true
  });

  const [accountSettings, setAccountSettings] = useState({
    username: 'admin',
    email: 'admin@petshop.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch general settings
        const settingsResponse = await fetch('/api/settings');

        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await settingsResponse.json();

        // Update state with fetched settings
        if (data.general) {
          // Ensure phone numbers are properly formatted as an array of 3 elements
          let formattedPhones;

          if (Array.isArray(data.general.storePhones)) {
            // If it's already an array, ensure it has 3 elements
            formattedPhones = [...data.general.storePhones, '', '', ''].slice(0, 3);

            // If the first element contains multiple phone numbers, split them
            if (formattedPhones[0] && formattedPhones[0].includes(' ')) {
              const splitPhones = formattedPhones[0].split(/\s+/).filter(p => p.trim());
              formattedPhones = [...splitPhones, '', ''].slice(0, 3);
            }
          } else if (typeof data.general.storePhones === 'string') {
            // If it's a string, split by spaces and ensure 3 elements
            formattedPhones = [...data.general.storePhones.split(/\s+/).filter(p => p.trim()), '', '', ''].slice(0, 3);
          } else {
            // Default to empty array with 3 elements
            formattedPhones = ['', '', ''];
          }

          setGeneralSettings({
            ...data.general,
            storePhones: formattedPhones
          });
        }

        if (data.social) {
          setSocialSettings(data.social);
        }

        if (data.notifications) {
          setNotificationSettings(data.notifications);
        }

        // Fetch admin credentials
        const credentialsResponse = await fetch('/api/admin/credentials');

        if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json();

          setAccountSettings(prev => ({
            ...prev,
            username: credentialsData.username || 'admin',
            email: credentialsData.email || 'admin@woofnwhiskers.com'
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (index, value) => {
    setGeneralSettings(prev => {
      // Make sure we have an array with 3 elements
      let updatedPhones = [...(Array.isArray(prev.storePhones) ? prev.storePhones : []), '', '', ''];
      updatedPhones = updatedPhones.slice(0, 3); // Ensure only 3 elements

      // Update the specific index
      updatedPhones[index] = value.trim(); // Trim to remove any extra spaces

      return {
        ...prev,
        storePhones: updatedPhones
      };
    });
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Different handling based on which tab is active
      if (activeTab === 'account') {
        // Validate password fields if changing password
        if (accountSettings.newPassword) {
          if (accountSettings.newPassword !== accountSettings.confirmPassword) {
            throw new Error('New password and confirmation do not match');
          }

          if (!accountSettings.currentPassword) {
            throw new Error('Current password is required to change password');
          }
        }

        // Save account settings via API
        const response = await fetch('/api/admin/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: accountSettings.username,
            email: accountSettings.email,
            currentPassword: accountSettings.currentPassword,
            newPassword: accountSettings.newPassword || undefined
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save account settings');
        }

        // Clear password fields
        setAccountSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Show success message
        if (typeof window !== 'undefined') {
          window.alert('Account settings saved successfully. Please log out and log back in for changes to take effect.');
        }
      } else {
        // For other tabs, save general settings
        const settings = {
          general: generalSettings,
          social: socialSettings,
          notifications: notificationSettings
        };

        // Save settings via API
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });

        if (!response.ok) {
          throw new Error('Failed to save settings');
        }

        // Show success message
        if (typeof window !== 'undefined') {
          window.alert('Settings saved successfully');
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to save settings: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'social'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'account'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="md:col-span-2 h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : activeTab === 'general' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={generalSettings.storeName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone Numbers (up to 3)
                  </label>
                  <div className="space-y-2">
                    {generalSettings.storePhones.map((phone, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                          placeholder={`Phone number ${index + 1}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter each phone number separately. Each number will be displayed and clickable individually on the website.
                  </p>
                </div>

                <div>
                  <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    id="storeEmail"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <input
                    type="text"
                    id="storeAddress"
                    name="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Hours
                  </label>
                  <textarea
                    id="businessHours"
                    name="businessHours"
                    rows="3"
                    value={generalSettings.businessHours}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {!isLoading && activeTab === 'social' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={socialSettings.facebook}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={socialSettings.instagram}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={socialSettings.twitter}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    id="youtube"
                    name="youtube"
                    value={socialSettings.youtube}
                    onChange={handleSocialChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {!isLoading && activeTab === 'notifications' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">Email Notifications</label>
                    <p className="text-gray-500">Receive notifications via email</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">SMS Notifications</label>
                    <p className="text-gray-500">Receive notifications via SMS</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newLeadNotifications"
                      name="newLeadNotifications"
                      type="checkbox"
                      checked={notificationSettings.newLeadNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newLeadNotifications" className="font-medium text-gray-700">New Lead Notifications</label>
                    <p className="text-gray-500">Get notified when a new lead is submitted</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="orderNotifications"
                      name="orderNotifications"
                      type="checkbox"
                      checked={notificationSettings.orderNotifications}
                      onChange={handleNotificationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="orderNotifications" className="font-medium text-gray-700">Order Notifications</label>
                    <p className="text-gray-500">Get notified about new orders and order status changes</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {!isLoading && activeTab === 'account' && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={accountSettings.username}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={accountSettings.currentPassword}
                        onChange={handleAccountChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={accountSettings.newPassword}
                        onChange={handleAccountChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={accountSettings.confirmPassword}
                        onChange={handleAccountChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
