'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Player, SessionWithPlayers } from '@/lib/types'
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
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

export function PublicSessionsClient({
  sessions,
}: {
  sessions: SessionWithPlayers[]
  allPlayers: Player[]
}) {
  const sortedSessions = useMemo(() => {
    const now = new Date()
    const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

    return [...sessions].sort((a, b) => {
      const dateA = a.date ? new Date(a.date + 'T00:00:00').getTime() : 0
      const dateB = b.date ? new Date(b.date + 'T00:00:00').getTime() : 0

      const diffA = Math.abs(dateA - todayTime)
      const diffB = Math.abs(dateB - todayTime)

      if (diffA !== diffB) {
        return diffA - diffB
      }
      return dateB - dateA
    })
  }, [sessions])

  return (
    <div>
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Calendar size={18} style={{ color: 'var(--accent)' }} />
            <h1 className="page-title">Sesi Pertandingan</h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Total {sortedSessions.length} sesi pertandingan
          </p>
        </div>

        {sortedSessions.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <Calendar size={32} style={{ margin: '0 auto 12px', color: 'var(--text-disabled)' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Belum ada sesi pertandingan</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              Sesi pertandingan akan muncul di sini setelah dibuat oleh admin.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedSessions.map((s) => {
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
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 14px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <Calendar size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          {formatDate(s.date)}
                        </span>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 6,
                            background: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                          }}
                        >
                          <Clock size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          {formatTime(s.start_time)} – {formatTime(s.end_time)} WIB
                        </span>

                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <MapPin size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          {s.location}
                        </span>
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
                      {playerCount} pemain
                    </span>
                    <Link href={`/sessions/${s.id}`} className="btn btn-secondary btn-sm" style={{ fontSize: 12 }}>
                      Jadwal Pertandingan
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
