/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendURL = isDev ? process.env.NEXT_PUBLIC_BACKEND_URL_DEV : process.env.NEXT_PUBLIC_BACKEND_URL_PROD;

    return [
      {
        source: "/api/:path*",
        destination: `${backendURL}/api/:path*`,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
