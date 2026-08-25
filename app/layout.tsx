import type { Metadata } from 'next'
import './globals.css'
import { MobileBottomNav } from '@/components/navigation/PublicNavbar'
import { PublicFooter } from '@/components/navigation/PublicFooter'

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
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <PublicFooter />
        <MobileBottomNav />
      </body>
    </html>
  )
}
