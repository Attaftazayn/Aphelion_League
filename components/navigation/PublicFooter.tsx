'use client'

import { usePathname } from 'next/navigation'

export function PublicFooter() {
  const pathname = usePathname()

  // Do not render footer inside admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-base)',
        padding: '36px 16px 96px', // Extra bottom padding on mobile for fixed bottom nav bar
        marginTop: 'auto',
      }}
    >
      <div
        className="page-wrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
          padding: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo%20jejak%20hijau.png"
            alt="Jejak Tennis Club"
            style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border-base)' }}
          />
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              Aphelion League
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Jejak Tennis Club • Play • Learn • Grow
            </p>
          </div>
        </div>

        {/* Instagram Link */}
        <a
          href="https://www.instagram.com/jejaktennis.club?igsi=MTY4czA2dW1hcmZzbQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: 9999,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Follow us on Instagram
        </a>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          © {new Date().getFullYear()} Jejak Tennis Club. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
