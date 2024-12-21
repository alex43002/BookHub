/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'books.google.com',
      'images.unsplash.com',
      'example.com'
    ],
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;