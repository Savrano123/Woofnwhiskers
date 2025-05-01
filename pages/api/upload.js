import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting file upload process...');

    // Create a temporary directory for uploads if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Parse the form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true, // Allow multiple files
      uploadDir: tempDir,
      filename: (name, ext) => `${Date.now()}${ext}`, // Custom filename function
    });

    console.log(`Using upload directory: ${tempDir}`);

    // Parse the form
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    console.log('Form parsed successfully');
    console.log('Fields received:', fields);
    console.log('Files received:', Object.keys(files));

    // Get the uploaded files - handle different formidable versions
    console.log('Files object keys:', Object.keys(files));

    // Try to find the files in different possible locations
    let fileList = [];

    // Check for files field (multiple files)
    if (files.files) {
      // Handle both array and single file cases
      fileList = Array.isArray(files.files) ? files.files : [files.files];
      console.log(`Found ${fileList.length} files in 'files' field`);
    }
    // Check for file field (single file)
    else if (files.file) {
      fileList = Array.isArray(files.file) ? files.file : [files.file];
      console.log(`Found ${fileList.length} files in 'file' field`);
    }
    // Try to get any files from any field
    else if (Object.keys(files).length > 0) {
      // Collect all files from all fields
      for (const key of Object.keys(files)) {
        const filesInField = Array.isArray(files[key]) ? files[key] : [files[key]];
        fileList.push(...filesInField);
      }
      console.log(`Found ${fileList.length} files across all fields`);
    }

    if (fileList.length === 0) {
      console.error('No files found in the request');
      console.log('Available files:', Object.keys(files));
      console.log('Files object:', JSON.stringify(files, null, 2));
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`Processing ${fileList.length} files`);

    // Log details of each file
    fileList.forEach((file, index) => {
      console.log(`File ${index + 1} details:`, {
        name: file.originalFilename,
        type: file.mimetype,
        size: file.size,
        path: file.filepath
      });
    });

    // Get the category (pets, products, or carousel)
    console.log('Raw fields:', fields);

    // Handle different ways the category might be passed
    let category;
    if (typeof fields.category === 'string') {
      category = fields.category;
    } else if (Array.isArray(fields.category)) {
      category = fields.category[0];
    } else if (fields.category && typeof fields.category === 'object') {
      // Handle case where formidable might parse it as an object
      category = Object.values(fields.category)[0];
    }
    // Fallback to type field for backward compatibility
    else if (typeof fields.type === 'string') {
      category = fields.type;
    } else if (Array.isArray(fields.type)) {
      category = fields.type[0];
    } else if (fields.type && typeof fields.type === 'object') {
      category = Object.values(fields.type)[0];
    }

    console.log('Extracted category:', category);

    // Validate the category
    if (!category || !['pets', 'products', 'carousel'].includes(category)) {
      console.error('Invalid category specified:', category);
      return res.status(400).json({ error: 'Invalid category specified' });
    }

    console.log(`Uploading files to ${category} directory`);

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', category);
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Process each file
    const uploadedFiles = [];
    const mimeExtensions = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg'
    };

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      console.log(`Processing file ${i + 1} of ${fileList.length}`);

      // Generate a unique filename with robust checks
      const timestamp = Date.now() + i; // Add index to ensure uniqueness

      // Check if originalFilename exists and is a string
      console.log('Original filename:', file.originalFilename);

      let fileExtension = '';
      if (file.originalFilename && typeof file.originalFilename === 'string') {
        fileExtension = path.extname(file.originalFilename);
      } else if (file.mimetype) {
        // Fallback to mimetype if available
        fileExtension = mimeExtensions[file.mimetype] || '.bin';
      }

      const newFilename = `${timestamp}${fileExtension}`;
      const newFilePath = path.join(uploadDir, newFilename);

      console.log('Generated filename:', newFilename);
      console.log(`New file path: ${newFilePath}`);

      // Check if the file exists and has a valid path
      if (!file.filepath || typeof file.filepath !== 'string') {
        console.error('Invalid file path:', file.filepath);
        continue; // Skip this file but continue with others
      }

      console.log(`Reading file from temporary location: ${file.filepath}`);
      if (!fs.existsSync(file.filepath)) {
        console.error(`Temporary file does not exist: ${file.filepath}`);
        continue; // Skip this file but continue with others
      }

      try {
        const fileData = fs.readFileSync(file.filepath);
        console.log(`Read ${fileData.length} bytes from temporary file`);

        // Write the file to the new location
        fs.writeFileSync(newFilePath, fileData);
        console.log('File written successfully');

        // Add to uploaded files
        const publicPath = `/images/${category}/${newFilename}`;
        uploadedFiles.push({
          originalName: file.originalFilename,
          name: newFilename,
          path: publicPath,
          size: file.size,
          type: file.mimetype
        });
      } catch (error) {
        console.error(`Error processing file ${i + 1}:`, error);
        // Continue with other files
      }
    }

    // Return a response with all uploaded files
    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles,
      // For backward compatibility with single file uploads
      path: uploadedFiles.length > 0 ? uploadedFiles[0].path : null,
      filePath: uploadedFiles.length > 0 ? uploadedFiles[0].path : null,
      imageUrl: uploadedFiles.length > 0 ? uploadedFiles[0].path : null,
      url: uploadedFiles.length > 0 ? uploadedFiles[0].path : null,
      file: uploadedFiles.length > 0 ? uploadedFiles[0] : null
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Provide detailed error information
    return res.status(500).json({
      error: 'Failed to upload file: ' + error.message,
      details: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}
