import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { db } from '../../../lib/db';

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
    console.log('Starting blog post import process...');

    // Create a temporary directory for uploads if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Parse the form data
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      uploadDir: tempDir,
    });

    // Parse the form
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Parse error:', err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    console.log('Form parsed successfully');
    
    // Find the file
    const fileKey = Object.keys(files)[0];
    const file = files[fileKey];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File found:', {
      key: fileKey,
      name: file.originalFilename || 'unknown',
      path: file.filepath,
      size: file.size,
      type: file.mimetype
    });

    // Read the file content
    const fileContent = fs.readFileSync(file.filepath, 'utf8');
    
    // Parse the file content based on file type
    let blogData;
    try {
      if (file.originalFilename.endsWith('.json')) {
        // Parse JSON file
        blogData = JSON.parse(fileContent);
      } else if (file.originalFilename.endsWith('.md') || file.originalFilename.endsWith('.markdown')) {
        // Parse Markdown file
        // Simple markdown parser that extracts front matter and content
        const frontMatterRegex = /^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/;
        const match = fileContent.match(frontMatterRegex);
        
        if (match) {
          const frontMatter = match[1];
          const content = match[2];
          
          // Parse front matter
          const frontMatterData = {};
          frontMatter.split('\\n').forEach(line => {
            const [key, value] = line.split(':').map(part => part.trim());
            if (key && value) {
              frontMatterData[key] = value;
            }
          });
          
          blogData = {
            ...frontMatterData,
            content: content
          };
        } else {
          // No front matter, treat the whole file as content
          blogData = {
            title: path.basename(file.originalFilename, path.extname(file.originalFilename)),
            content: fileContent
          };
        }
      } else {
        // Unsupported file type
        return res.status(400).json({ error: 'Unsupported file type. Please upload a JSON or Markdown file.' });
      }
    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      return res.status(400).json({ error: `Error parsing file: ${parseError.message}` });
    }

    // Validate required fields
    if (!blogData.title) {
      return res.status(400).json({ error: 'Blog post title is required' });
    }

    if (!blogData.content) {
      return res.status(400).json({ error: 'Blog post content is required' });
    }

    // Generate slug from title if not provided
    if (!blogData.slug) {
      blogData.slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }

    // Check if slug already exists
    const existingPost = db.getAll('blog_posts').find(p => p.slug === blogData.slug);
    if (existingPost) {
      // Append a timestamp to make the slug unique
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }

    // Set default values
    const now = new Date().toISOString();
    const newPost = {
      ...blogData,
      createdAt: now,
      updatedAt: now,
      published: blogData.published !== undefined ? blogData.published : false,
      publishedAt: blogData.published ? now : null,
      views: 0
    };

    // Create the post
    const createdPost = db.create('blog_posts', newPost);

    // Process cover image if provided as a URL
    if (blogData.coverImage && blogData.coverImage.startsWith('http')) {
      // The cover image is already a URL, no need to process it
      // You could add code here to download and store the image locally if needed
    }

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    return res.status(201).json({
      success: true,
      message: 'Blog post imported successfully',
      post: createdPost
    });
  } catch (error) {
    console.error('Error importing blog post:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
