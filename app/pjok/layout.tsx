import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'Peta Harta Karun Kebugaran Jasmani | PJOK Interaktif',
  description:
    'Platform pembelajaran PJOK interaktif berbasis Deep Learning, Coding, dan AI untuk siswa SD. Ajang Apresiasi Guru Inovasi Pembelajaran (INOBEL) Kabupaten Gresik 2026.',
}

export default function PjokLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${nunito.variable} font-nunito`}
      style={{ minHeight: '100vh', position: 'relative', isolation: 'isolate' }}
    >
      {/* Hide the root layout's footer and bottom-nav when inside /pjok */}
      <style>{`
        body > div > footer,
        body > div > nav,
        body footer,
        body nav[aria-label="mobile-bottom-nav"] {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  )
}

