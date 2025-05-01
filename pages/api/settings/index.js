import { db } from '../../../lib/db';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request - retrieve settings
  if (req.method === 'GET') {
    try {
      // Get settings from database
      const settings = db.getAll('settings');

      // If no settings exist yet, return default settings
      if (!settings || settings.length === 0) {
        const defaultSettings = {
          general: {
            storeName: 'WoofnWhiskers',
            storeAddress: 'Sector 12, Dwarka, New Delhi',
            storePhones: ['+91 123 456 7890', '', ''],
            storeEmail: 'info@woofnwhiskers.com',
            businessHours: 'Monday - Friday: 10:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM'
          },
          social: {
            facebook: 'https://facebook.com/woofnwhiskers',
            instagram: 'https://instagram.com/woofnwhiskers',
            twitter: '',
            youtube: ''
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            newLeadNotifications: true,
            orderNotifications: true
          }
        };

        return res.status(200).json(defaultSettings);
      }

      // Return the first settings object (there should only be one)
      return res.status(200).json(settings[0]);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle POST request - save settings
  if (req.method === 'POST') {
    try {
      const settings = req.body;

      // Validate required fields
      if (!settings.general || !settings.general.storeName) {
        return res.status(400).json({ error: 'Store name is required' });
      }

      // Get existing settings
      const existingSettings = db.getAll('settings');

      let result;

      // If settings already exist, update them
      if (existingSettings && existingSettings.length > 0) {
        result = db.update('settings', existingSettings[0].id, settings);
      } else {
        // Otherwise create new settings
        result = db.create('settings', settings);
      }

      if (!result) {
        return res.status(500).json({ error: 'Failed to save settings' });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error saving settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
