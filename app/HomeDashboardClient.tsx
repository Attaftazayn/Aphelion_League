'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Player, MatchWithPlayers, Session, MonthlyChampion } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import { MonthlySessionCalendar } from '@/components/calendar/MonthlySessionCalendar'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
  UserRound,
  TrendingUp,
} from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  const h = parts[0]?.padStart(2, '0') ?? '00'
  const m = parts[1]?.padStart(2, '0') ?? '00'
  return `${h}.${m}`
}

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
    <div className="avatar" style={{ width: size, height: size, fontSize: size > 40 ? 15 : 12 }}>
      {initials || <UserRound size={14} />}
    </div>
  )
}

function RankIndicator({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: 6,
          background: 'var(--accent)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        1
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: 6,
          background: 'rgba(255,255,255,0.12)',
          color: 'var(--text-secondary)',
          fontWeight: 800,
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        2
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 6,
        background: 'rgba(255,255,255,0.06)',
        color: 'var(--text-muted)',
        fontWeight: 700,
        fontSize: 11,
        flexShrink: 0,
      }}
    >
      {rank}
    </span>
  )
}

function parseDateParts(dateStr: string) {
  if (!dateStr) return { dayName: '', dayNum: '', monthName: '', year: '' }
  const d = new Date(dateStr + 'T00:00:00')
  const dayName = d.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()
  const dayNum = d.getDate().toString().padStart(2, '0')
  const monthName = d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()
  const year = d.getFullYear().toString()
  return { dayName, dayNum, monthName, year }
}

function CalendarDateBlock({ dateStr }: { dateStr: string }) {
  const { dayName, dayNum, monthName, year } = parseDateParts(dateStr)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 68,
        padding: '10px 12px',
        borderRadius: 12,
        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.22) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#60A5FA',
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {dayName}
      </span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}
      >
        {dayNum}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#93C5FD',
          lineHeight: 1,
          marginTop: 4,
        }}
      >
        {monthName} {year}
      </span>
    </div>
  )
}

export function HomeDashboardClient({
  players,
  sessions,
  matches,
  confirmedChampions,
}: {
  players: Player[]
  sessions: Session[]
  matches: MatchWithPlayers[]
  confirmedChampions: MonthlyChampion[]
}) {
  const currentSession = useMemo(() => {
    if (sessions.length === 0) return null

    const now = new Date()
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    let closest = sessions[0]
    let minDiff = Infinity

    for (const session of sessions) {
      if (!session.date) continue
      const sessionTimestamp = new Date(session.date + 'T00:00:00').getTime()
      const diff = Math.abs(sessionTimestamp - todayTimestamp)
      if (diff < minDiff) {
        minDiff = diff
        closest = session
      }
    }

    return closest
  }, [sessions])

  const currentSessionMatches = useMemo(() => {
    if (!currentSession) return []
    return matches.filter((m) => m.session_id === currentSession.id)
  }, [currentSession, matches])

  const nextMatch = useMemo(() => {
    if (currentSessionMatches.length > 0) {
      const matchInCurrent = currentSessionMatches.find((m) => m.status === 'upcoming')
      if (matchInCurrent) return matchInCurrent
    }
    return matches.find((m) => m.status === 'upcoming') ?? null
  }, [currentSessionMatches, matches])

  const topStandings = useMemo(() => {
    const leaderboard = calculateLeaderboard(players, matches)
    return leaderboard.slice(0, 5)
  }, [players, matches])

  const completedCount = currentSessionMatches.filter((m) => m.status === 'completed').length

  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="badge badge-accent" style={{ fontSize: 10 }}>Liga Aktif</span>
          </div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Pantau sesi pertandingan, skor, dan klasemen terkini.
          </p>
        </div>

        {/* ── MAIN DASHBOARD GRID (Left: 2 stacked cards, Right: 1 tall standings card) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'stretch' }}>

          {/* ── LEFT COLUMN: Sesi Saat Ini + Pertandingan Berikutnya ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Current Session */}
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} style={{ color: 'var(--accent)' }} />
                  <span className="section-label">Sesi Saat Ini</span>
                </div>
                {currentSession && (
                  <span className="badge badge-accent" style={{ fontSize: 10 }}>Aktif</span>
                )}
              </div>

              {currentSession ? (
                <>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    {/* Big Calendar Box */}
                    <CalendarDateBlock dateStr={currentSession.date} />

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <h2
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.3px',
                          lineHeight: 1.2,
                        }}
                      >
                        {currentSession.name}
                      </h2>

                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                        {/* Jam / Waktu Badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 7,
                            background: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          <Clock size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          {formatTime(currentSession.start_time)} – {formatTime(currentSession.end_time)} WIB
                        </span>

                        {/* Tempat / Lokasi Badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 7,
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#FBBF24',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <MapPin size={13} style={{ color: '#FBBF24', flexShrink: 0 }} />
                          {currentSession.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {completedCount} / {currentSessionMatches.length} pertandingan selesai
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                        {currentSessionMatches.length > 0
                          ? Math.round((completedCount / currentSessionMatches.length) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div style={{ height: 4, borderRadius: 99, background: 'var(--bg-raised)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: 99,
                          background: 'var(--accent)',
                          width: `${currentSessionMatches.length > 0 ? (completedCount / currentSessionMatches.length) * 100 : 0}%`,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  <Link href={`/sessions/${currentSession.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                    Lihat Detail Sesi
                    <ChevronRight size={14} />
                  </Link>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 13, flex: 1 }}>
                  Belum ada sesi aktif yang dijadwalkan.
                </p>
              )}
            </div>

            {/* Next Match */}
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} style={{ color: 'var(--accent)' }} />
                  <span className="section-label">Pertandingan Berikutnya</span>
                </div>
                {nextMatch && (
                  <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                    Match #{nextMatch.match_number}
                  </span>
                )}
              </div>

              {nextMatch ? (
                <>
                  <div
                    style={{
                      borderRadius: 10,
                      padding: '16px',
                      background: 'var(--bg-raised)',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    {/* Team A */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tim A
                      </span>
                      {nextMatch.match_players?.filter((mp) => mp.team === 'A').map((mp) => (
                        <span key={mp.id} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {mp.players.name}
                        </span>
                      ))}
                    </div>

                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>VS</span>

                    {/* Team B */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tim B
                      </span>
                      {nextMatch.match_players?.filter((mp) => mp.team === 'B').map((mp) => (
                        <span key={mp.id} style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {mp.players.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={`/sessions/${nextMatch.session_id}`} className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
                    Jadwal Pertandingan
                  </Link>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Belum ada pertandingan mendatang.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN: Memanjang Klasemen Teratas ── */}
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={15} style={{ color: 'var(--accent)' }} />
                <span className="section-label">Klasemen Teratas</span>
              </div>
              <Link
                href="/leaderboard"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}
              >
                Lihat Semua <ChevronRight size={12} />
              </Link>
            </div>

            {topStandings.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Belum ada klasemen.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                {topStandings.map((st) => (
                  <Link
                    key={st.player.id}
                    href={`/players/${st.player.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.14s ease, transform 0.14s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-base)'
                      e.currentTarget.style.transform = 'translateX(2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RankIndicator rank={st.rank} />
                      <PlayerAvatar player={st.player} size={36} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          {st.player.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {st.wins}M – {st.losses}K
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px', display: 'block' }}>
                        {st.total_points}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>poin</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/leaderboard" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
              Lihat Klasemen Lengkap
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>

        {/* ── BOTTOM SECTION: Kalender Sesi Bulanan ── */}
        <div style={{ marginTop: 8 }}>
          <MonthlySessionCalendar sessions={sessions as any} />
        </div>

      </div>
    </div>
  )
}
