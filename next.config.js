/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SESSION_SECRET: "jaodjjdoaisjdioajdijfrfjrgirghrncncncncnc",
    AES_KEY: "f92066e7536a1991d78875604b904bafa982efc2eb1c9218cce9cff3a2ade2af",
    AES_IV: "895c730b5d450c6a825a0554754b19aa",
    AES_ALGO: "aes-256-cbc",
  },
};

module.exports = nextConfig;
