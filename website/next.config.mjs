/** @type {import('next').NextConfig} */

const CSP = {
  'connect-src': [`'self'`, 'https://api.coingate.com/api/v2']
}
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: Object.entries(CSP)
              .map(([key, value]) => `${key} ${value.join(' ')}`)
              .join('; '),
          }
        ],
      },
    ];
  },
}

export default nextConfig;
