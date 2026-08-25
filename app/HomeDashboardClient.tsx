'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Player, MatchWithPlayers, Session, MonthlyChampion } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Award,
  Zap,
  UserRound,
  TrendingUp,
} from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${ampm}`
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
  const currentSession = sessions[0] ?? null

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

  const top3Standings = useMemo(() => {
    const leaderboard = calculateLeaderboard(players, matches)
    return leaderboard.slice(0, 3)
  }, [players, matches])

  const latestChampion = useMemo(() => {
    return confirmedChampions[0] ?? null
  }, [confirmedChampions])

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

        {/* ── ROW 1: Session + Next Match ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

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
                <div>
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.2px',
                      marginBottom: 8,
                    }}
                  >
                    {currentSession.name}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[
                      { icon: Calendar, text: formatDate(currentSession.date) },
                      { icon: Clock, text: `${formatTime(currentSession.start_time)} – ${formatTime(currentSession.end_time)}` },
                      { icon: MapPin, text: currentSession.location },
                    ].map(({ icon: Icon, text }, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                        <Icon size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        {text}
                      </span>
                    ))}
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
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
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

                <Link href={`/sessions/${nextMatch.session_id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
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

        {/* ── ROW 2: Top Standings + Latest Champion ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

          {/* Standings */}
          <div
            className="card"
            style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
                <span className="section-label">Klasemen Teratas</span>
              </div>
              <Link
                href="/leaderboard"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}
              >
                Lihat Semua <ChevronRight size={12} />
              </Link>
            </div>

            {top3Standings.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Belum ada klasemen.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {top3Standings.map((st) => (
                  <Link
                    key={st.player.id}
                    href={`/players/${st.player.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color 0.14s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-base)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <RankIndicator rank={st.rank} />
                      <PlayerAvatar player={st.player} size={32} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                          {st.player.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {st.wins}M – {st.losses}K
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.5px' }}>
                        {st.total_points}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 3 }}>poin</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Latest Champion */}
          <div
            className="card"
            style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={14} style={{ color: 'var(--accent)' }} />
                <span className="section-label">Juara Bulan Terakhir</span>
              </div>
            </div>

            {latestChampion ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center', paddingBlock: 8 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    flexShrink: 0,
                  }}
                >
                  <Trophy size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <PlayerAvatar player={latestChampion.player!} size={52} />
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
                    {latestChampion.player?.name}
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {latestChampion.month_key}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '8px 16px',
                    background: 'var(--bg-raised)',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)', display: 'block' }}>
                      {latestChampion.total_points}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>poin</span>
                  </div>
                  <div style={{ width: 1, background: 'var(--border-base)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                      {latestChampion.wins}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>menang</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBlock: 16 }}>
                <Trophy size={28} style={{ color: 'var(--text-disabled)' }} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Belum ada juara terkonfirmasi.</p>
              </div>
            )}

            <Link href="/champions" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              Hall of Fame
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
