'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Player, MatchWithPlayers, Session } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import {
  Trophy,
  Award,
  Filter,
  Calendar,
  Layers,
  Search,
  UserRound,
  ChevronRight,
} from 'lucide-react'

function PlayerAvatar({ player, size = 36 }: { player: Player; size?: number }) {
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
      {initials || <UserRound size={14} />}
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    fontWeight: 800,
    fontSize: 12,
    flexShrink: 0,
  }

  if (rank === 1) return <span style={{ ...styles, background: 'var(--accent)', color: '#ffffff' }}>1</span>
  if (rank === 2) return <span style={{ ...styles, background: 'rgba(255,255,255,0.10)', color: 'var(--text-secondary)' }}>2</span>
  if (rank === 3) return <span style={{ ...styles, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>3</span>
  return <span style={{ ...styles, background: 'transparent', color: 'var(--text-muted)', fontSize: 11 }}>#{rank}</span>
}

export function LeaderboardClient({
  players,
  sessions,
  matches,
}: {
  players: Player[]
  sessions: Session[]
  matches: MatchWithPlayers[]
}) {
  const [mode, setMode] = useState<'overall' | 'session' | 'month'>('overall')
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id ?? '')
  const [search, setSearch] = useState<string>('')

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>()
    sessions.forEach((s) => { if (s.date) monthsSet.add(s.date.slice(0, 7)) })
    return Array.from(monthsSet).sort().reverse()
  }, [sessions])

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] ?? '')

  const filteredMatches = useMemo(() => {
    if (mode === 'session') return matches.filter((m) => m.session_id === selectedSessionId)
    if (mode === 'month') return matches.filter((m) => m.session?.date?.startsWith(selectedMonth))
    return matches
  }, [matches, mode, selectedSessionId, selectedMonth])

  const standings = useMemo(() => {
    const calculated = calculateLeaderboard(players, filteredMatches)
    if (!search.trim()) return calculated
    return calculated.filter((s) => s.player.name.toLowerCase().includes(search.toLowerCase()))
  }, [players, filteredMatches, search])

  function formatMonthLabel(monthKey: string) {
    if (!monthKey) return ''
    const [year, month] = monthKey.split('-')
    return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const tabs = [
    { key: 'overall', label: 'All', icon: Layers },
    { key: 'month',   label: 'Monthly', icon: Calendar },
    { key: 'session', label: 'Per Session', icon: Filter },
  ] as const

  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Trophy size={18} style={{ color: 'var(--accent)' }} />
            <h1 className="page-title">Leaderboard</h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Official Aphelion League Standings
          </p>
        </div>

        {/* Filter Tabs + Search row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 10,
              padding: 3,
              gap: 2,
            }}
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 34,
                  padding: '0 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.14s ease, color 0.14s ease',
                  background: mode === key ? 'var(--accent)' : 'transparent',
                  color: mode === key ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Sub-filter selects */}
          {mode === 'session' && sessions.length > 0 && (
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="input"
              style={{ maxWidth: 280, minHeight: 42 }}
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.date}</option>
              ))}
            </select>
          )}

          {mode === 'month' && availableMonths.length > 0 && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
              style={{ maxWidth: 200, minHeight: 42 }}
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>{formatMonthLabel(m)}</option>
              ))}
            </select>
          )}

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180, maxWidth: 280, marginLeft: 'auto' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 36 }}
              placeholder="Search player name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table / Cards */}
        {players.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Trophy size={32} style={{ margin: '0 auto 12px', color: 'var(--text-disabled)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No registered players yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Add players in the admin portal to begin tracking leaderboard standings.
            </p>
          </div>
        ) : standings.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Search size={32} style={{ margin: '0 auto 12px', color: 'var(--text-disabled)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Player not found</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Try changing your search keywords or filter.</p>
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="table-wrapper hide-mobile">
              <table className="data-table" style={{ background: 'var(--bg-surface)' }}>
                <thead>
                  <tr>
                    <th style={{ width: 56, textAlign: 'center' }}>Rank</th>
                    <th>Player</th>
                    <th style={{ textAlign: 'center' }}>Played</th>
                    <th style={{ textAlign: 'center' }}>W</th>
                    <th style={{ textAlign: 'center' }}>L</th>
                    <th style={{ textAlign: 'center' }}>Win %</th>
                    <th style={{ textAlign: 'right', paddingRight: 20 }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((st) => (
                    <tr key={st.player.id}>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <RankBadge rank={st.rank} />
                        </div>
                      </td>
                      <td>
                        <Link
                          href={`/players/${st.player.id}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                          <PlayerAvatar player={st.player} size={34} />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{st.player.name}</p>
                            {st.rank === 1 && (
                              <span style={{ fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Award size={11} /> Leaderboard Leader
                              </span>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{st.matches_played}</td>
                      <td style={{ textAlign: 'center', color: 'var(--accent)', fontWeight: 700 }}>{st.wins}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{st.losses}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {st.matches_played > 0 ? `${(st.win_rate * 100).toFixed(0)}%` : '—'}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 20 }}>
                        <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px' }}>
                          {st.total_points}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 3 }}>pts</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="hide-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {standings.map((st) => (
                <Link
                  key={st.player.id}
                  href={`/players/${st.player.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'var(--bg-surface)',
                    border: `1px solid ${st.rank === 1 ? 'var(--accent-border)' : 'var(--border-base)'}`,
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <RankBadge rank={st.rank} />
                    <PlayerAvatar player={st.player} size={38} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {st.player.name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        {st.matches_played} Played · {st.wins}W · {st.losses}L
                        {st.matches_played > 0 && ` · ${(st.win_rate * 100).toFixed(0)}%`}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px', display: 'block' }}>
                      {st.total_points}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>pts</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
