/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://api.quicklegalbiz.com",
  },
  experimental: {
    turbo: {
      rules: {
        "*.ts": ["ts-loader"],
        "*.tsx": ["ts-loader"],
      },
    },
  },
};

module.exports = nextConfig;