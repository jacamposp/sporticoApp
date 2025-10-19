import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Excluir archivos de Prisma del bundle
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'prisma/seed': 'commonjs prisma/seed',
      })
    }
    return config
  },
  // Excluir el directorio prisma de la compilación
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
}

export default nextConfig
