# WoofnWhiskers Pet Shop Website

A modern, responsive website for a pet shop built with Next.js and Tailwind CSS.

## Features

- Responsive design for all devices
- Pet and product showcases
- Admin dashboard for content management
- Blog system with import functionality
- Image upload and management
- Contact form for lead generation

## Local Development

1. Clone the repository:
   ```
   git clone https://github.com/Savrano123/Woofnwhiskers.git
   cd Woofnwhiskers
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Railway

### Prerequisites

- A Railway account
- Git installed on your local machine

### Deployment Steps

1. Push your code to GitHub:
   ```
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. Connect your GitHub repository to Railway:
   - Go to [Railway](https://railway.app/)
   - Create a new project
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. Configure the deployment:
   - Set the build command to `npm run build`
   - Set the start command to `npm start`
   - Add any necessary environment variables

4. Deploy your application:
   - Railway will automatically build and deploy your application
   - You can monitor the deployment in the Railway dashboard

### Troubleshooting Image Issues

If images are not displaying correctly on Railway:

1. Make sure the `sharp` package is installed:
   ```
   npm install sharp
   ```

2. Run the copy-images script to ensure placeholder images are available:
   ```
   npm run copy-images
   ```

3. Check that your image paths are correct in the code.

4. Verify that the images are being properly uploaded to the `/public/images/` directory.

## Admin Access

To access the admin dashboard:

1. Go to `/admin/login`
2. Use the credentials:
   - Username: `Ripuldude`
   - Password: `ripul99115522`

## License

This project is licensed under the MIT License.
