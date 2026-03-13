import type {NextConfig} from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Required for Chrome Extensions (Static site generation)
  output: 'export',
  // Required as Chrome Extensions cannot fetch images from external servers easily
  images: {
    unoptimized: true,
  },
  // Ensure the build output is clean for the extension folder
  distDir: 'out',
};

export default nextConfig;