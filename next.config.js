/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lush.sa.com' },
      { protocol: 'https', hostname: 'lush.com.ph' },
      { protocol: 'https', hostname: 'lushlebanon.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
};
module.exports = nextConfig;
