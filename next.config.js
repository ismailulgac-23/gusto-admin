
const nextConfig = {
  // Use webpack for SVG handling with @svgr/webpack
  // Turbopack support for @svgr is still experimental
  webpack(config, { isServer }) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Memory optimizations for webpack
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },
  // Empty turbopack config to silence the warning
  // Next.js will use webpack when webpack config is present
  turbopack: {},
  experimental: {
    // Enable streaming for improved page loading
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Disable static page generation for dynamic routes like chat
  // This helps prevent prerendering errors
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: true,
  },
  // Memory optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors during build
  },
};

export default nextConfig;
