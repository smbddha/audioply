/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project so Next doesn't mis-detect it
  // from an unrelated lockfile higher up the filesystem.
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
