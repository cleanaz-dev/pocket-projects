import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Added "-1" to match your actual S3 bucket region
        hostname: 'pocket-projects.s3.us-east-1.amazonaws.com', 
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;