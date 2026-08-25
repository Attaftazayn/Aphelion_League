import type { Metadata } from 'next'
import './globals.css'
import { MobileBottomNav } from '@/components/navigation/PublicNavbar'
import { PublicFooter } from '@/components/navigation/PublicFooter'

import { HeroBackdrop } from '@/components/ui/HeroBackdrop'

export const metadata: Metadata = {
  title: 'Aphelion League',
  description: 'Internal Tennis League Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
