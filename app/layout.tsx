import type { Metadata } from 'next'
import './globals.css'
import { MobileBottomNav } from '@/components/navigation/PublicNavbar'
import { PublicFooter } from '@/components/navigation/PublicFooter'
import { HeroBackdrop } from '@/components/ui/HeroBackdrop'

export const metadata: Metadata = {
  title: 'Aphelion League',
  description: 'Sistem Manajemen Liga Tenis Aphelion League',
  icons: {
    icon: [
      { url: '/aphelion.jpeg?v=3', type: 'image/jpeg' },
      { url: '/favicon.ico?v=3' },
    ],
    shortcut: '/aphelion.jpeg?v=3',
    apple: '/aphelion.jpeg?v=3',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/aphelion.jpeg?v=3" type="image/jpeg" />
        <link rel="shortcut icon" href="/aphelion.jpeg?v=3" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/aphelion.jpeg?v=3" />
      </head>
      <body
        className="antialiased"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--bg-base)',
          position: 'relative',
        }}
      >
        <HeroBackdrop />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <PublicFooter />
        </div>
        <MobileBottomNav />
      </body>
    </html>
  )
}
