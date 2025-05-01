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
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Try to get content type from headers
    const contentType = req.headers['content-type'] || 'image/jpeg';

    // Determine file extension from content type
    let fileExt = '.jpg'; // Default extension
    if (contentType.includes('png')) {
      fileExt = '.png';
    } else if (contentType.includes('gif')) {
      fileExt = '.gif';
    } else if (contentType.includes('webp')) {
      fileExt = '.webp';
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}${fileExt}`;

    // Try to get type from query parameters, default to carousel
    const type = req.query.type || 'carousel';
    const uploadDir = path.join(process.cwd(), 'public', 'images', type);
    const filePath = path.join(uploadDir, filename);

    // Get the raw data from the request
    const data = await getRawBody(req);
    console.log(`Received ${data.length} bytes of data`);

    // Write the data to a file
    fs.writeFileSync(filePath, data);
    console.log(`File saved to ${filePath}`);

    // Return success
    const publicPath = `/images/${type}/${filename}`;
    return res.status(200).json({
      success: true,
      message: 'File uploaded directly',
      path: publicPath,
      filePath: publicPath,
      imageUrl: publicPath,
      url: publicPath
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
