'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { MonthlyChampion, Player, MatchWithPlayers } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import {
  Trophy,
  Award,
  Calendar,
  UserRound,
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
        onError={(e) => {
          ;(e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size > 50 ? 20 : 13 }}
    >
      {initials || <UserRound size={20} />}
    </div>
  )
}

function formatMonthLabel(monthKey: string) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

export function ChampionsClient({
  confirmedChampions,
  players,
  matches,
  availableMonths,
}: {
  confirmedChampions: MonthlyChampion[]
  players: Player[]
  matches: MatchWithPlayers[]
  availableMonths: string[]
}) {
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] ?? '')

  const monthCandidate = useMemo(() => {
    if (!selectedMonth) return null
    const monthMatches = matches.filter(
      (m) => m.session?.date && m.session.date.startsWith(selectedMonth)
    )
    const leaderboard = calculateLeaderboard(players, monthMatches)
    const topPlayer = leaderboard[0]
    if (!topPlayer || topPlayer.matches_played === 0) return null
    return topPlayer
  }, [players, matches, selectedMonth])

  const displayedChampion = useMemo(() => {
    if (!selectedMonth) return null
    const confirmed = confirmedChampions.find((c) => c.month_key === selectedMonth)
    if (confirmed && confirmed.player) {
      return {
        isConfirmed: true,
        monthKey: confirmed.month_key,
        player: confirmed.player,
        totalPoints: confirmed.total_points,
        wins: confirmed.wins,
        winRate: confirmed.win_rate,
      }
    }
    return null
  }, [confirmedChampions, selectedMonth])

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header & Month Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Award size={20} style={{ color: 'var(--accent)' }} />
            <h1 className="page-title">Juara Bulanan</h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Aphelion League Hall of Fame
          </p>
        </div>

        {availableMonths.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="month-select" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Pilih Bulan:
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
              style={{ width: 'auto', minWidth: 180, fontSize: 13, height: 38 }}
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)} {confirmedChampions.some((c) => c.month_key === m) ? '★' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Champion Banner */}
      {displayedChampion ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 16,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Trophy icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent)',
              border: '1px solid var(--accent-border)',
              color: '#ffffff',
            }}
          >
            <Trophy size={26} />
          </div>

          {/* Badge + Month */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="badge badge-accent" style={{ fontSize: 10 }}>
              {displayedChampion.isConfirmed ? 'Juara Resmi Bulanan' : 'Pemimpin Bulan Ini'}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
              }}
            >
              {formatMonthLabel(displayedChampion.monthKey)}
            </span>
          </div>

          {/* Player */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <PlayerAvatar player={displayedChampion.player} size={80} />
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: 'var(--text-primary)',
              }}
            >
              {displayedChampion.player.name}
            </h2>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              paddingTop: 16,
              marginTop: 4,
              borderTop: '1px solid var(--border-base)',
              width: '100%',
              maxWidth: 320,
            }}
          >
            {[
              { label: 'Poin', value: displayedChampion.totalPoints, accent: true },
              { label: 'Menang', value: displayedChampion.wins, accent: false },
              { label: '% Menang', value: `${(displayedChampion.winRate * 100).toFixed(0)}%`, accent: false },
            ].map(({ label, value, accent }, i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 20,
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      color: accent ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, height: 28, background: 'var(--border-base)' }} />
                )}
              </div>
            ))}
          </div>

          {!displayedChampion.isConfirmed && (
            <p
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                marginTop: 4,
              }}
            >
              Klasemen sementara — menunggu penetapan resmi bulanan
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 16,
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Trophy size={32} style={{ color: 'var(--text-disabled)' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
            Tidak ada data juara untuk {formatMonthLabel(selectedMonth) || 'Bulan ini'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Selesaikan pertandingan di bulan ini untuk melihat klasemen.</p>
        </div>
      )}

      {/* Hall of Fame List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Calendar size={15} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Riwayat Juara Terkonfirmasi ({confirmedChampions.length})
          </h2>
        </div>

        {confirmedChampions.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 14,
              padding: '36px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            Belum ada juara bulanan resmi yang dikonfirmasi. Pilih bulan di atas untuk melihat klasemen sementara.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 10,
            }}
          >
            {confirmedChampions.map((c) => (
              <Link
                key={c.id}
                href={`/players/${c.player?.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-base)',
                  transition: 'border-color 0.14s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.borderColor = 'var(--border-base)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <PlayerAvatar player={c.player!} size={42} />
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--accent)',
                        marginBottom: 2,
                      }}
                    >
                      {formatMonthLabel(c.month_key)}
                    </span>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                      {c.player?.name}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {c.total_points} poin · {c.wins} menang
                    </p>
                  </div>
                </div>
                <Trophy size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
