'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Users, Calendar, LogOut, Menu, X } from 'lucide-react'
import { TennisBall } from '@/components/ui/icons'
import { useState } from 'react'

const navItems = [
  { href: '/admin/players',  label: 'Players',  icon: Users },
  { href: '/admin/sessions', label: 'Sessions', icon: Calendar },
]

const SIDEBAR_W = 200

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [drawerOpen, setDrawerOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin/players'
      ? pathname === '/admin/players'
      : pathname.startsWith(href)

  /* ── Shared pieces ──────────────────────────────────── */

  const brandBlock = (
    <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border-base)', flexShrink: 0 }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>Aphelion League</p>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Admin Portal</p>
    </div>
  )

  const navBlock = (
    <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              background: active ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${active ? 'var(--accent-border)' : 'transparent'}`,
              textDecoration: 'none',
              minHeight: 44,
              transition: 'background 0.12s ease, color 0.12s ease',
            }}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </nav>
  )

  const signOutBlock = (
    <div style={{ padding: '8px', borderTop: '1px solid var(--border-base)', flexShrink: 0 }}>
      <button
        onClick={handleSignOut}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          minHeight: 44,
          padding: '10px 12px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--danger)',
          background: 'transparent',
          border: '1px solid transparent',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-dim)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  )

  /* ── Desktop sidebar (hidden on mobile via CSS class only, NO inline display) ── */
  return (
    <>
      <aside className="admin-sidebar-desktop">
        {brandBlock}
        {navBlock}
        {signOutBlock}
      </aside>

      {/* Mobile fixed top bar */}
      <div className="admin-topbar-mobile">
        <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Aphelion League Admin</span>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 8, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            style={{ width: SIDEBAR_W + 20, height: '100%', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-base)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border-base)', flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>Aphelion League Admin</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', width: 32, height: 32, justifyContent: 'center', borderRadius: 6 }}>
                <X size={17} />
              </button>
            </div>
            {navBlock}
            {signOutBlock}
          </aside>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.55)' }} />
        </div>
      )}
    </>
  )
}
