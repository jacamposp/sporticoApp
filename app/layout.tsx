import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sportico | Reserva tu cancha',
  description: 'Reserva tu cancha de futbol en Sportico',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased bg-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
