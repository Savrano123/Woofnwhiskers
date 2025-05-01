# WoofnWhiskers Blog System Documentation

This document explains how the blog system works in the WoofnWhiskers website, including how to create, edit, and manage blog posts.

## Overview

The blog system consists of:

1. **Public-facing pages**:
   - Blog index page (`/blog`) - Lists all published blog posts
   - Individual blog post pages (`/blog/[slug]`) - Displays a single blog post

2. **Admin pages**:
   - Blog management page (`/admin/blog`) - Lists all blog posts with management options
   - Blog post editor (`/admin/blog/[id]`) - Interface for creating and editing blog posts

3. **API endpoints**:
   - `/api/blog` - For listing and creating blog posts
   - `/api/blog/[id]` - For retrieving, updating, and deleting individual blog posts

## Creating a New Blog Post

1. Log in to the admin dashboard at `/admin/login`
2. Navigate to the Blog section from the sidebar
3. Click the "Create New Post" button
4. Fill in the required fields:
   - **Title**: The title of your blog post
   - **Excerpt**: A brief summary of the post (displayed in previews)
   - **Content**: The main content of your post (supports rich text formatting)
5. Configure additional settings:
   - **Slug**: The URL-friendly version of the title (auto-generated, but can be customized)
   - **Cover Image**: URL of the main image for the post
   - **Category**: Select a category for the post
   - **Tags**: Add relevant tags to help with organization and search
   - **Author Information**: Name, title, and image of the author
   - **Read Time**: Estimated reading time in minutes
6. Choose whether to publish immediately or save as a draft
7. Click "Save Post"

## Editing an Existing Blog Post

1. Navigate to the Blog section in the admin dashboard
2. Find the post you want to edit in the list
3. Click the "Edit" link
4. Make your changes
5. Click "Save Post"

## Publishing a Draft Post

1. Navigate to the Blog section in the admin dashboard
2. Find the draft post you want to publish
3. Click the "Edit" link
4. Check the "Publish post" checkbox
5. Click "Save Post"

## Deleting a Blog Post

1. Navigate to the Blog section in the admin dashboard
2. Find the post you want to delete
3. Click the "Delete" link
4. Confirm the deletion when prompted

## Blog Post Content Formatting

The blog post editor uses a rich text editor that supports:

- Headings (H1-H6)
- Bold, italic, underline, and strikethrough text
- Ordered and unordered lists
- Indentation
- Text alignment
- Links
- Images

To add an image within your content:

1. Click the image icon in the editor toolbar
2. Enter the URL of the image
3. The image will be inserted at the current cursor position

## SEO Best Practices

For optimal SEO performance, follow these guidelines when creating blog posts:

1. **Use descriptive titles**: Include relevant keywords in your title
2. **Write comprehensive excerpts**: Summarize your content effectively
3. **Use appropriate categories and tags**: Help organize your content
4. **Include high-quality images**: Enhance visual appeal and engagement
5. **Structure your content with headings**: Use H2, H3, etc. to organize your post
6. **Link to other relevant content**: Include internal links to other pages on your site
7. **Optimize image alt text**: Describe images accurately for accessibility and SEO
8. **Keep URLs clean and descriptive**: The slug should reflect the content of the post

## Technical Details

### Data Structure

Each blog post contains the following fields:

- `id`: Unique identifier
- `title`: Post title
- `slug`: URL-friendly version of the title
- `excerpt`: Brief summary
- `content`: Main content (HTML)
- `coverImage`: URL of the main image
- `category`: Post category
- `tags`: Array of tags
- `author`: Author name
- `authorTitle`: Author's title/position
- `authorImage`: URL of author's image
- `published`: Boolean indicating if the post is published
- `publishedAt`: Date when the post was published
- `createdAt`: Date when the post was created
- `updatedAt`: Date when the post was last updated
- `views`: Number of views
- `readTime`: Estimated reading time in minutes

### Storage

Blog posts are stored in the database using the `blog_posts` collection. In the current implementation, this uses a simple JSON-based storage system, but it can be extended to use a more robust database solution as needed.

## Extending the Blog System

The blog system can be extended in several ways:

1. **Comments**: Add a commenting system to allow readers to engage with your content
2. **Social sharing**: Add buttons to share posts on social media
3. **Related posts**: Enhance the related posts algorithm to show more relevant suggestions
4. **Analytics integration**: Track more detailed metrics about post performance
5. **Email notifications**: Send notifications when new posts are published
6. **Featured posts**: Highlight specific posts on the homepage or blog index
7. **Advanced search**: Implement more sophisticated search functionality

## Troubleshooting

### Common Issues

1. **Images not displaying**: Ensure image URLs are correct and accessible
2. **Formatting issues**: If content appears incorrectly formatted, check the HTML in the editor
3. **Slug conflicts**: If you get an error about duplicate slugs, choose a different slug
4. **Draft posts appearing**: Make sure posts are marked as published before expecting them to appear on the public site

### Support

For additional help or feature requests, please contact the website administrator.
