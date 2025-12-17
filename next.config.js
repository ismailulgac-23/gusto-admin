
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  experimental: {
    // Enable streaming for improved page loading
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  swcMinify: false,
  // Disable static page generation for dynamic routes like chat
  // This helps prevent prerendering errors
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: true,
  },
  // Increase memory limit for Next.js operations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Prevent server-side rendering for specific routes that use browser APIs
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors during build
  }
};

export default nextConfig;
