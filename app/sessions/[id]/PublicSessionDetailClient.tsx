'use client'

import Link from 'next/link'
import type { SessionWithPlayers, MatchWithPlayers } from '@/lib/types'
import { Calendar, Clock, MapPin, Users, ChevronLeft, CheckCircle2, Circle } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  const h = parts[0]?.padStart(2, '0') ?? '00'
  const m = parts[1]?.padStart(2, '0') ?? '00'
  return `${h}.${m}`
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function PublicSessionDetailClient({
  session,
  matches,
}: {
  session: SessionWithPlayers
  matches: MatchWithPlayers[]
}) {
  const participants = session.session_players?.map((sp) => sp.players) ?? []
  const completedMatches = matches.filter((m) => m.status === 'completed')

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Header Banner */}
      <div
        style={{
          borderBottom: '1px solid var(--border-base)',
          background: 'var(--bg-surface)',
          padding: '24px 0',
        }}
      >
        <div className="page-wrapper" style={{ padding: '0 16px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>
            Ringkasan Sesi
          </span>
          <h1 className="page-title" style={{ marginTop: 4 }}>{session.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Pasangan pertandingan, jadwal, dan hasil poin terkini
          </p>
        </div>
      </div>

      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
        {/* Back button */}
        <div>
          <Link
            href="/sessions"
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px 6px 10px',
              borderRadius: 10,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <ChevronLeft size={16} style={{ color: 'var(--accent)' }} />
            Semua Sesi
          </Link>
        </div>

        {/* Session Summary Hero Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Calendar size={14} style={{ color: 'var(--accent)' }} />
              {formatDate(session.date)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Clock size={14} style={{ color: 'var(--accent)' }} />
              {formatTime(session.start_time)} – {formatTime(session.end_time)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <MapPin size={14} style={{ color: 'var(--accent)' }} />
              {session.location}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Pemain</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{participants.length}</p>
            </div>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Pertandingan</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{matches.length}</p>
            </div>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Selesai</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>{completedMatches.length}</p>
            </div>
          </div>
        </div>

        {/* Confirmed Participants */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={15} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Peserta Terkonfirmasi ({participants.length})
            </h2>
          </div>
          {participants.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Belum ada peserta yang dikonfirmasi.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {participants.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px 6px 6px',
                    borderRadius: 9999,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      width: 26,
                      height: 26,
                      fontSize: 10,
                      background: 'var(--bg-overlay)',
                      border: '1px solid var(--border-strong)',
                      color: '#ffffff',
                    }}
                  >
                    {p.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.avatar_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      getInitials(p.name)
                    )}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Match Record / Pairings Schedule */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Jadwal & Hasil Pertandingan ({matches.length})
            </h2>
          </div>

          {matches.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 14,
                padding: '36px 24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Belum ada jadwal pertandingan</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Jadwal pertandingan akan muncul di sini setelah dibuat oleh admin.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {matches.map((m) => {
                const teamA = m.match_players?.filter((mp) => mp.team === 'A') ?? []
                const teamB = m.match_players?.filter((mp) => mp.team === 'B') ?? []
                const isCompleted = m.status === 'completed' && m.score_a !== null && m.score_b !== null
                const isWinnerA = isCompleted && m.score_a! > m.score_b!
                const isWinnerB = isCompleted && m.score_b! > m.score_a!

                const loserScore = isCompleted ? Math.min(m.score_a!, m.score_b!) : 0
                const winPts = 7 - loserScore
                const losePts = loserScore

                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: `1px solid ${isCompleted ? 'var(--accent-border)' : 'var(--border-base)'}`,
                      borderRadius: 14,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Match #{m.match_number}
                      </span>
                      <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-upcoming'}`}>
                        {isCompleted ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                        {isCompleted ? 'Selesai' : 'Mendatang'}
                      </span>
                    </div>

                    {/* Match Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
                      {/* Team A */}
                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          background: isWinnerA ? 'rgba(3,65,44,0.35)' : 'var(--bg-raised)',
                          border: `1px solid ${isWinnerA ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Tim A
                          </span>
                          {isWinnerA && <span className="badge badge-accent" style={{ fontSize: 9 }}>+{winPts} poin</span>}
                          {!isWinnerA && isCompleted && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{losePts} poin</span>}
                        </div>
                        {teamA.map((mp) => (
                          <div key={mp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="avatar" style={{ width: 22, height: 22, fontSize: 9, color: '#ffffff' }}>
                              {getInitials(mp.players.name)}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {mp.players.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* VS / Score */}
                      <div style={{ textAlign: 'center' }}>
                        {isCompleted ? (
                          <div>
                            <div
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 16,
                                fontWeight: 900,
                                background: 'var(--bg-raised)',
                                border: '1px solid var(--border-strong)',
                                color: '#ffffff',
                              }}
                            >
                              {m.score_a} — {m.score_b}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>VS</span>
                        )}
                      </div>

                      {/* Team B */}
                      <div
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          background: isWinnerB ? 'rgba(3,65,44,0.35)' : 'var(--bg-raised)',
                          border: `1px solid ${isWinnerB ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Tim B
                          </span>
                          {isWinnerB && <span className="badge badge-accent" style={{ fontSize: 9 }}>+{winPts} poin</span>}
                          {!isWinnerB && isCompleted && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{losePts} poin</span>}
                        </div>
                        {teamB.map((mp) => (
                          <div key={mp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="avatar" style={{ width: 22, height: 22, fontSize: 9, color: '#ffffff' }}>
                              {getInitials(mp.players.name)}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {mp.players.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
