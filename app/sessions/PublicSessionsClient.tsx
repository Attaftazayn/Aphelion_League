'use client'

import Link from 'next/link'
import type { Player, SessionWithPlayers } from '@/lib/types'
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${m} ${ampm}`
}

export function PublicSessionsClient({
  sessions,
}: {
  sessions: SessionWithPlayers[]
  allPlayers: Player[]
}) {
  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            <h1 className="page-title">Sessions</h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} in total
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Calendar size={32} style={{ margin: '0 auto 12px', color: 'var(--text-disabled)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No sessions yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Sessions will appear here once an admin creates them.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sessions.map((s) => {
              const playerCount = s.session_players?.length ?? 0
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px', marginBottom: 6 }}>
                        {s.name}
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
                        {[
                          { icon: Calendar, text: formatDate(s.date) },
                          { icon: Clock,    text: `${formatTime(s.start_time)} – ${formatTime(s.end_time)}` },
                          { icon: MapPin,   text: s.location },
                        ].map(({ icon: Icon, text }, i) => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                            <Icon size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            {text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Users size={13} />
                      {playerCount} player{playerCount !== 1 ? 's' : ''}
                    </span>
                    <Link href={`/sessions/${s.id}`} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                      Match Schedule
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
