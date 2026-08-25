'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TennisBall } from '@/components/ui/icons'
import {
  LayoutDashboard,
  Calendar,
  Trophy,
  Users,
  Award,
  Lock,
} from 'lucide-react'

const navLinks = [
  { href: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/sessions',    label: 'Sessions',     icon: Calendar },
  { href: '/leaderboard', label: 'Leaderboard',  icon: Trophy },
  { href: '/players',     label: 'Players',      icon: Users },
  { href: '/champions',   label: 'Champions',    icon: Award },
]

export function PublicHeader() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        width: '100%',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(18,21,23,0.88)',
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          marginInline: 'auto',
          padding: '0 24px',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aphelion.jpeg"
            alt="Aphelion League"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              objectFit: 'cover',
              border: '1px solid var(--border-base)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          />
          <span
            style={{
              fontWeight: 900,
              fontSize: 21,
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
            }}
          >
            Aphelion League
          </span>
        </Link>

        {/* Desktop Nav — center */}
        <nav
          className="hidden md:flex"
          style={{ alignItems: 'center', gap: 6 }}
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  height: 48,
                  padding: '0 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: active ? 800 : 600,
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  background: 'transparent',
                  border: '1px solid transparent',
                  transition: 'color 0.14s ease, background 0.14s ease',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-raised)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Club Logo / Instagram Link */}
        <a
          href="https://www.instagram.com/jejaktennis.club?igsi=MTY4czA2dW1hcmZzbQ=="
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
          title="Jejak Tennis Club Instagram"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo%20Putih%20no%20BG.png"
            alt="Jejak Tennis Club"
            style={{
              width: 48,
              height: 48,
              objectFit: 'contain',
              transition: 'transform 0.14s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.0)'
            }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </a>
      </div>
    </header>
  )
}

export function MobileBottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/login') return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(18,21,23,0.95)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${navLinks.length}, 1fr)`,
          /* safe area inset for notch devices */
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                minHeight: 56,
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'color 0.14s ease',
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.03em' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
