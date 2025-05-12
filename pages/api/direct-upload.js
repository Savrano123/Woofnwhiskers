import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Starting direct upload process...');

  try {
    // Create upload directories
    const types = ['carousel', 'pets', 'products'];
    types.forEach(type => {
      const dir = path.join(process.cwd(), 'public', 'images', type);
      if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Try to get content type from headers
    const contentType = req.headers['content-type'] || 'image/jpeg';
    console.log(`Content type: ${contentType}`);

    // Determine file extension from content type
    let fileExt = '.jpg'; // Default extension
    if (contentType.includes('png')) {
      fileExt = '.png';
    } else if (contentType.includes('gif')) {
      fileExt = '.gif';
    } else if (contentType.includes('webp')) {
      fileExt = '.webp';
    }
    console.log(`Using file extension: ${fileExt}`);

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}${fileExt}`;
    console.log(`Generated filename: ${filename}`);

    // Try to get type from query parameters, default to carousel
    const type = req.query.type || 'carousel';
    console.log(`Upload type: ${type}`);

    const uploadDir = path.join(process.cwd(), 'public', 'images', type);
    console.log(`Upload directory: ${uploadDir}`);

    // Ensure the directory exists again (just to be safe)
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating directory again: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    console.log(`Full file path: ${filePath}`);

    // Get the raw data from the request
    const data = await getRawBody(req);
    console.log(`Received ${data.length} bytes of data`);

    // Check if the data is valid
    if (!data || data.length === 0) {
      console.error('No data received');
      return res.status(400).json({ error: 'No data received' });
    }

    // Write the data to a file
    try {
      fs.writeFileSync(filePath, data);
      console.log(`File saved to ${filePath}`);
    } catch (writeError) {
      console.error(`Error writing file: ${writeError.message}`);
      return res.status(500).json({ error: `Error writing file: ${writeError.message}` });
    }

    // Verify the file was created
    if (!fs.existsSync(filePath)) {
      console.error('File was not created');
      return res.status(500).json({ error: 'File was not created' });
    }

    // Get file stats to verify size
    const stats = fs.statSync(filePath);
    console.log(`File size: ${stats.size} bytes`);

    // Return success
    const publicPath = `/images/${type}/${filename}`;
    console.log(`Public path: ${publicPath}`);

    return res.status(200).json({
      success: true,
      message: 'File uploaded directly',
      path: publicPath,
      filePath: publicPath,
      imageUrl: publicPath,
      url: publicPath,
      size: stats.size
    });
  } catch (error) {
    console.error('Error in direct upload:', error);
    return res.status(500).json({ error: `Upload error: ${error.message}` });
  }
}

// Helper function to get raw request body
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}
