/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/ads.txt',
        destination: '/public/ads.txt',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
