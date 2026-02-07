/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [75, 80, 85],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'api.skillvedika.com', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

          // ✅ ADD THIS
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://www.googletagmanager.com
                https://www.google-analytics.com;
              connect-src 'self'
                http://127.0.0.1:8000
                http://localhost:8000
                http://localhost:3001
                https://www.google.com
                https://www.gstatic.com
                https://www.google-analytics.com
                https://www.googletagmanager.com;
              img-src 'self' data: blob:
                https://www.google-analytics.com
                https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline';
              font-src 'self' data:;
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
    ];
  },


  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-phone-input-2',
    ],
  },

  serverExternalPackages: [],

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
    styledComponents: false,
  },

  webpack: (config, { dev, isServer }) => {
    if (dev) return config;

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@next/devtools': false,
      };
    }

    return config;
  },

  turbopack: {},
};

export default nextConfig;
