import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Amazon images
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-amazon.com',
      },
      // Best Buy images
      {
        protocol: 'https',
        hostname: 'pisces.bbystatic.com',
      },
      {
        protocol: 'https',
        hostname: 'multimedia.bbycastatic.ca',
      },
      // Target images
      {
        protocol: 'https',
        hostname: 'target.scene7.com',
      },
      // Walmart images
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.ca',
      },
      // Nike images
      {
        protocol: 'https',
        hostname: 'static.nike.com',
      },
      // Apple images
      {
        protocol: 'https',
        hostname: 'store.storeimages.cdn-apple.com',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
      },
      // Google images (for search results)
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Generic e-commerce domains
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Catch-all for other domains (be more specific in production)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Fallback for domains not in remotePatterns
    domains: [
      'm.media-amazon.com',
      'images-na.ssl-images-amazon.com',
      'pisces.bbystatic.com',
      'target.scene7.com',
      'i5.walmartimages.com',
      'static.nike.com',
      'encrypted-tbn0.gstatic.com',
      'lh3.googleusercontent.com'
    ],
  },
};

export default nextConfig;
