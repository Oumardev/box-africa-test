/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Si nécessaire pour des fonctionnalités expérimentales
  },
};

module.exports = nextConfig;
