/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    SESSION_SECRET: "jaodjjdoaisjdioajdijfrfjrgirghrncncncncnc",
    AES_KEY: "f92066e7536a1991d78875604b904bafa982efc2eb1c9218cce9cff3a2ade2af",
    AES_IV: "895c730b5d450c6a825a0554754b19aa",
    AES_ALGO: "aes-256-cbc",
  },
  experimental: {
    // esmExternals: true,
    // topLevelAwait: true,
    // asyncWebAssembly: true
  },
  webpack: (config, { isServer }) => {
    // Handle non-server specific fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Extension handling
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts', '.mtsx']
    };

    // Preserve any existing experiments config
    config.experiments = {
      ...config.experiments,
      // topLevelAwait: true,
      // asyncWebAssembly: true,
    };

    return config;
  },
  // Add transpilePackages for Plena
  transpilePackages: [
    '@plenaconnect/wagmi-connector',
    '@plenaconnect/provider',
  ],
};

module.exports = nextConfig;