import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure the build output is clean for the extension folder
  distDir: 'out',
};

export default nextConfig;
