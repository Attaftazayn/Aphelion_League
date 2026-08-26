'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Player, MatchWithPlayers } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import { Users, Search, ChevronRight, UserRound } from 'lucide-react'

function PlayerAvatar({ player, size = 44 }: { player: Player; size?: number }) {
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (player.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={player.avatar_url}
        alt={player.name}
        className="avatar"
        style={{ width: size, height: size }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size > 40 ? 16 : 12 }}>
      {initials || <UserRound size={16} />}
    </div>
  )
}

export function PlayersListClient({
  players,
  matches,
}: {
  players: Player[]
  matches: MatchWithPlayers[]
}) {
  const [search, setSearch] = useState('')

  const standings = useMemo(() => {
    return calculateLeaderboard(players, matches)
  }, [players, matches])

  const filtered = useMemo(() => {
    if (!search.trim()) return []
    return standings.filter((s) => s.player.name.toLowerCase().includes(search.toLowerCase()))
  }, [standings, search])

  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Users size={18} style={{ color: 'var(--accent)' }} />
              <h1 className="page-title">Daftar Pemain</h1>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Cari nama pemain untuk melihat profil dan statistik detail.
            </p>
          </div>

          {players.length > 0 && (
            <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="input"
                style={{ paddingLeft: 36 }}
                placeholder="Ketik nama pemain…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        {players.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Users size={32} style={{ margin: '0 auto 12px', color: 'var(--text-disabled)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Belum ada pemain</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Tambahkan pemain di portal admin untuk memulai.
            </p>
          </div>
        ) : !search.trim() ? (
          <div className="card" style={{ padding: '56px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Search size={22} style={{ color: 'var(--accent)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Pencarian Profil Pemain
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.5 }}>
              Untuk melihat profil pemain, Anda harus mencari nama pemain terlebih dahulu melalui kolom pencarian di atas.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Tidak ada hasil untuk &quot;{search}&quot;</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Pastikan ejaan nama yang Anda ketik sudah benar.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 12,
            }}
          >
            {filtered.map((st) => (
              <Link
                key={st.player.id}
                href={`/players/${st.player.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'var(--bg-surface)',
                  border: `1px solid ${st.rank === 1 ? 'var(--accent-border)' : 'var(--border-base)'}`,
                  transition: 'border-color 0.14s ease, transform 0.14s ease',
                  gap: 12,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = st.rank === 1 ? 'var(--accent-border)' : 'var(--border-base)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PlayerAvatar player={st.player} size={44} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {st.player.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Pos #{st.rank}</span>
                      {' · '}
                      {st.matches_played} pertandingan
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px', display: 'block' }}>
                      {st.total_points}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>poin</span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-disabled)' }} />
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
