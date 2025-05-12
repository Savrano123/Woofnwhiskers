/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // This will help with deployment on Railway
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  // This ensures that static assets like images are included in the build
  output: 'standalone',
}

module.exports = nextConfig
