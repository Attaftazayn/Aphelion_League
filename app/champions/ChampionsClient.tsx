'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import type { MonthlyChampion, Player, MatchWithPlayers } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import { confirmChampion } from './actions'
import {
  Trophy,
  Award,
  Calendar,
  Loader2,
  UserRound,
  ShieldCheck,
  Check,
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
  isAdmin,
}: {
  confirmedChampions: MonthlyChampion[]
  players: Player[]
  matches: MatchWithPlayers[]
  availableMonths: string[]
  isAdmin: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] ?? '')
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null)

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

  const latestChampion = useMemo(() => {
    if (confirmedChampions.length > 0) {
      return {
        isConfirmed: true,
        monthKey: confirmedChampions[0].month_key,
        player: confirmedChampions[0].player!,
        totalPoints: confirmedChampions[0].total_points,
        wins: confirmedChampions[0].wins,
        winRate: confirmedChampions[0].win_rate,
      }
    }
    if (monthCandidate) {
      return {
        isConfirmed: false,
        monthKey: selectedMonth,
        player: monthCandidate.player,
        totalPoints: monthCandidate.total_points,
        wins: monthCandidate.wins,
        winRate: monthCandidate.win_rate,
      }
    }
    return null
  }, [confirmedChampions, monthCandidate, selectedMonth])

  const isSelectedMonthConfirmed = useMemo(() => {
    return confirmedChampions.some((c) => c.month_key === selectedMonth)
  }, [confirmedChampions, selectedMonth])

  function handleConfirmChampion() {
    if (!selectedMonth || !monthCandidate) return
    setMsg(null)

    startTransition(async () => {
      const res = await confirmChampion(
        selectedMonth,
        monthCandidate.player.id,
        monthCandidate.total_points,
        monthCandidate.wins,
        monthCandidate.win_rate,
      )
      if (res?.error) {
        setMsg({ text: res.error, error: true })
      } else {
        setMsg({ text: 'Champion confirmed and saved to Hall of Fame.' })
      }
    })
  }

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Award size={18} style={{ color: 'var(--accent)' }} />
          <h1 className="page-title">Monthly Champions</h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Aphelion League Hall of Fame
        </p>
      </div>

      {/* Champion Banner */}
      {latestChampion ? (
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
              Monthly Champion
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
              {formatMonthLabel(latestChampion.monthKey)}
            </span>
          </div>

          {/* Player */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <PlayerAvatar player={latestChampion.player} size={80} />
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: 'var(--text-primary)',
              }}
            >
              {latestChampion.player.name}
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
              { label: 'Points', value: latestChampion.totalPoints, accent: true },
              { label: 'Wins', value: latestChampion.wins, accent: false },
              { label: 'Win Rate', value: `${(latestChampion.winRate * 100).toFixed(0)}%`, accent: false },
            ].map(({ label, value, accent }, i, arr) => (
              <>
                <div key={label} style={{ textAlign: 'center' }}>
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
                  <div key={`sep-${i}`} style={{ width: 1, height: 28, background: 'var(--border-base)' }} />
                )}
              </>
            ))}
          </div>

          {!latestChampion.isConfirmed && (
            <p
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                marginTop: 4,
              }}
            >
              Provisional — not yet confirmed
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
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>No Champion Declared Yet</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Complete matches to generate standings.</p>
        </div>
      )}

      {/* Admin: Confirm Champion Tool */}
      {isAdmin && availableMonths.length > 0 && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 12,
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Confirm Monthly Champion
            </h2>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>
            Snapshot the winner into the Hall of Fame so historical standings remain stable.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
              style={{ maxWidth: 220, minHeight: 40 }}
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>

            {monthCandidate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Winner:{' '}
                  <span style={{ color: 'var(--accent)' }}>{monthCandidate.player.name}</span>
                  {' '}({monthCandidate.total_points} pts)
                </span>
                <button
                  onClick={handleConfirmChampion}
                  disabled={isPending}
                  className="btn btn-primary btn-sm"
                >
                  {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  {isSelectedMonthConfirmed ? 'Re-Confirm' : 'Confirm Champion'}
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                No completed match data for this month yet.
              </span>
            )}
          </div>

          {msg && (
            <p
              style={{
                fontSize: 12,
                marginTop: 10,
                fontWeight: 600,
                color: msg.error ? 'var(--danger)' : 'var(--accent)',
              }}
            >
              {msg.text}
            </p>
          )}
        </div>
      )}

      {/* Hall of Fame */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Calendar size={15} style={{ color: 'var(--accent)' }} />
          <span className="section-label">Hall of Fame</span>
        </div>

        {confirmedChampions.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 12,
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              No confirmed champions yet.
            </p>
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
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-base)')}
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
                      {c.total_points} pts · {c.wins} wins
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
