import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // Excluir Prisma del bundle en server components (compatible con Turbopack)
  serverExternalPackages: ['prisma', '@prisma/client'],
}

export default nextConfig
