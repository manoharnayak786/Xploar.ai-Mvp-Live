
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing config...

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Image optimization security
  images: {
    domains: ['meoyfsrpuocdrkzjzbvk.supabase.co'],
    formats: ['image/webp', 'image/avif']
  },

  // Compression
  compress: true,

  // Security: Remove X-Powered-By header
  poweredByHeader: false
};

export default nextConfig;