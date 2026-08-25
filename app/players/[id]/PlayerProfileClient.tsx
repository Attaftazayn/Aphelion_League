'use client'

import Link from 'next/link'
import type { PlayerProfileDetails, Player } from '@/lib/types'
import {
  ChevronLeft,
  UserRound,
  Calendar,
  Award,
  Trophy,
} from 'lucide-react'

function PlayerAvatar({ player, size = 64 }: { player: Player; size?: number }) {
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
    <div className="avatar" style={{ width: size, height: size, fontSize: size > 50 ? 22 : 14 }}>
      {initials || <UserRound size={24} />}
    </div>
  )
}

function StatBox({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.5px',
          lineHeight: 1,
          color: accent ? 'var(--accent)' : 'var(--text-primary)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function PlayerProfileClient({ profile }: { profile: PlayerProfileDetails }) {
  const {
    player,
    rank,
    total_points,
    matches_played,
    wins,
    losses,
    win_rate,
    recent_matches,
    achievements,
  } = profile

  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Back link */}
        <div>
          <Link href="/players" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, gap: 4, minHeight: 36 }}>
            <ChevronLeft size={15} />
            Semua Pemain
          </Link>
        </div>

        {/* ── Profile Hero Card ── */}
        <div
          className="card"
          style={{ padding: '24px 24px 20px', overflow: 'hidden' }}
        >
          {/* Top: Avatar + Name + Rank/Points */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <PlayerAvatar player={player} size={68} />
            <div style={{ flex: 1, minWidth: 140 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', display: 'block', marginBottom: 4 }}>
                Profil Pemain
              </span>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {player.name}
              </h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Terdaftar sejak {new Date(player.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-raised)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Pos</span>
                <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-1px', color: 'var(--accent)', lineHeight: 1 }}>#{rank}</span>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-raised)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Poin</span>
                <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-1px', color: 'var(--text-primary)', lineHeight: 1 }}>{total_points}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <StatBox label="Pertandingan" value={matches_played} />
            <StatBox label="Menang" value={wins} accent />
            <StatBox label="Kalah" value={losses} />
            <StatBox
              label="% Menang"
              value={matches_played > 0 ? `${(win_rate * 100).toFixed(0)}%` : '—'}
            />
          </div>
        </div>

        {/* ── Achievements Card Section ── */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Award size={16} style={{ color: '#F59E0B' }} />
            <span className="section-label">Pencapaian & Gelar ({achievements.length})</span>
          </div>

          {achievements.length === 0 ? (
            <div
              style={{
                padding: '24px 16px',
                background: 'var(--bg-raised)',
                borderRadius: 12,
                border: '1px dashed var(--border-subtle)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <Trophy size={18} style={{ color: 'var(--text-disabled)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Belum ada gelar juara bulanan yang diraih.
              </span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(27, 30, 34, 0.8) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'rgba(245, 158, 11, 0.18)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F59E0B',
                      flexShrink: 0,
                    }}
                  >
                    <Trophy size={22} />
                  </div>

                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F59E0B' }}>
                      Juara Bulanan
                    </span>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2, lineHeight: 1.2 }}>
                      Juara APL Bulan {ach.monthLabel}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
                      {ach.total_points} poin · {ach.wins} menang
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Matches ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Calendar size={15} style={{ color: 'var(--accent)' }} />
            <span className="section-label">Pertandingan Terakhir ({recent_matches.length})</span>
          </div>

          {recent_matches.length === 0 ? (
            <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Belum ada riwayat pertandingan.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent_matches.map((m) => (
                <div
                  key={m.match_id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  {/* W / L badge */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                      background: m.outcome === 'W' ? 'var(--accent-dim)' : 'var(--danger-dim)',
                      color: m.outcome === 'W' ? 'var(--accent)' : 'var(--danger)',
                      border: `1px solid ${m.outcome === 'W' ? 'var(--accent-border)' : 'var(--danger-border)'}`,
                    }}
                  >
                    {m.outcome}
                  </div>

                  {/* Match info */}
                  <div style={{ flex: 1, minWidth: 150 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                        {m.session_name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'var(--bg-raised)',
                          color: 'var(--accent)',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {m.score_display}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.date}</p>
                  </div>

                  {/* Partner/Opponents */}
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {m.partner && (
                      <span>
                        <span style={{ color: 'var(--text-muted)' }}>w/ </span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.partner.name}</span>
                      </span>
                    )}
                    <span>
                      <span style={{ color: 'var(--text-muted)' }}>vs </span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.opponents.map((op) => op.name).join(' & ')}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
