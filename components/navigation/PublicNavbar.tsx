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
  { href: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/sessions',    label: 'Sessions',    icon: Calendar },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/players',     label: 'Players',     icon: Users },
  { href: '/champions',   label: 'Champions',   icon: Award },
]

export function PublicHeader() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') || pathname === '/login') return null
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aphelion.jpeg"
            alt="Aphelion League"
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              objectFit: 'cover',
              border: '1px solid var(--border-base)',
              boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
            }}
          />
          <span
            className="hidden sm:inline"
            style={{
              fontWeight: 900,
              fontSize: 20,
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
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
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
              width: 58,
              height: 58,
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
    <div
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        left: 12,
        right: 12,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          pointerEvents: 'auto',
          maxWidth: 440,
          marginInline: 'auto',
          background: 'rgba(27, 30, 34, 0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: 9999,
          padding: '6px 10px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.55), 0 2px 10px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${navLinks.length}, 1fr)`,
            alignItems: 'center',
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
                  padding: '8px 4px',
                  borderRadius: 9999,
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  background: active ? 'var(--accent)' : 'transparent',
                  boxShadow: active ? '0 4px 14px rgba(3, 65, 44, 0.5)' : 'none',
                  border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none',
                }}
              >
                <Icon size={19} style={{ color: active ? '#ffffff' : 'var(--text-secondary)' }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: active ? 800 : 500,
                    letterSpacing: '-0.2px',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    lineHeight: 1.1,
                  }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
