/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // API configuration
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
}

module.exports = nextConfig
