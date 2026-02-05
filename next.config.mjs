/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  turbopack: {},
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
  experimentalLog: {
    level: 'verbose'
  }
}

export default nextConfig
