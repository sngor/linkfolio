import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ['qrcode.react']
  },
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false
  },
  outputFileTracingRoot: process.cwd()
};

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true
})(baseConfig);
