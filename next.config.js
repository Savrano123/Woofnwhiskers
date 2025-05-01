/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // This will help with deployment on Railway
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // This ensures that static assets like images are included in the build
  output: 'standalone',
  // Increase the asset size limit for images
  experimental: {
    largePageDataBytes: 128 * 100000, // 12.8MB instead of the default 128KB
  },
}

module.exports = nextConfig
