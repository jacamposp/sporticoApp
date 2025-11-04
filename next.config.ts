import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // Excluir Prisma del bundle en server components (compatible con Turbopack)
  serverExternalPackages: ['prisma', '@prisma/client'],
  images: {
    // Allow loading images from any remote HTTPS/HTTP host (useful for user-uploaded photos)
    // Prefer tightening this list in production to specific domains or CDNs
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
}

export default nextConfig
