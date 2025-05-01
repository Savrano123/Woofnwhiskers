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

  // Handle GET request - retrieve admin credentials
  if (req.method === 'GET') {
    try {
      // Get admin credentials from database
      const credentials = db.getAll('admin_credentials');

      // If no credentials exist yet, return default credentials
      if (!credentials || credentials.length === 0) {
        const defaultCredentials = {
          username: 'admin',
          email: 'admin@woofnwhiskers.com'
        };

        return res.status(200).json(defaultCredentials);
      }

      // Return the first credentials object (there should only be one)
      // Don't return the password hash for security reasons
      const { passwordHash, ...safeCredentials } = credentials[0];
      return res.status(200).json(safeCredentials);
    } catch (error) {
      console.error('Error fetching admin credentials:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Handle POST request - update admin credentials
  if (req.method === 'POST') {
    try {
      const { username, email, currentPassword, newPassword } = req.body;

      // Validate required fields
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      // Get existing credentials
      const existingCredentials = db.getAll('admin_credentials');

      // Check if we're updating the password
      if (newPassword) {
        // Get the current stored password from the database
        if (existingCredentials && existingCredentials.length > 0) {
          const storedPassword = existingCredentials[0].passwordHash;

          // Check if the provided current password matches the stored password
          if (currentPassword !== storedPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
          }
        } else {
          // If no credentials exist yet, use the default password check
          if (currentPassword !== 'password') {
            return res.status(401).json({ error: 'Current password is incorrect' });
          }
        }
      }

      // Prepare the updated credentials
      const updatedCredentials = {
        username,
        email,
        // Only update the password if a new one is provided
        // If credentials exist, keep the existing password if no new one is provided
        passwordHash: newPassword || (existingCredentials && existingCredentials.length > 0
          ? existingCredentials[0].passwordHash
          : 'password')
      };

      let result;

      // If credentials already exist, update them
      if (existingCredentials && existingCredentials.length > 0) {
        result = db.update('admin_credentials', existingCredentials[0].id, updatedCredentials);
      } else {
        // Otherwise create new credentials
        result = db.create('admin_credentials', updatedCredentials);
      }

      if (!result) {
        return res.status(500).json({ error: 'Failed to save credentials' });
      }

      // Update the login.js file with the new credentials
      try {
        // This is a simplified approach - in a real app, you would use a more secure method
        // such as environment variables or a proper authentication system
        const fs = require('fs');
        const path = require('path');

        const loginFilePath = path.join(process.cwd(), 'pages', 'admin', 'login.js');
        let loginFileContent = fs.readFileSync(loginFilePath, 'utf8');

        // Replace the username and password in the login.js file
        loginFileContent = loginFileContent.replace(
          /if \(username === ['"].*?['"] && password === ['"].*?['"]\)/,
          `if (username === '${username}' && password === '${newPassword || 'password'}')`
        );

        fs.writeFileSync(loginFilePath, loginFileContent);
      } catch (fileError) {
        console.error('Error updating login file:', fileError);
        // Continue even if file update fails - the database update still succeeded
      }

      // Return the updated credentials without the password hash
      const { passwordHash, ...safeResult } = result;
      return res.status(200).json(safeResult);
    } catch (error) {
      console.error('Error saving admin credentials:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // If we get here, the method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}
