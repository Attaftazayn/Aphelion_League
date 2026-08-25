'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Player, SessionWithPlayers } from '@/lib/types'
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react'
import { MonthlySessionCalendar } from '@/components/calendar/MonthlySessionCalendar'

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

function parseDateParts(dateStr: string) {
  if (!dateStr) return { dayName: '', dayNum: '', monthName: '', year: '' }
  const d = new Date(dateStr + 'T00:00:00')
  const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()
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
        minWidth: 64,
        padding: '8px 10px',
        borderRadius: 12,
        background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.22) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#60A5FA',
          lineHeight: 1,
          marginBottom: 3,
        }}
      >
        {dayName}
      </span>
      <span
        style={{
          fontSize: 22,
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
          fontSize: 9,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#93C5FD',
          lineHeight: 1,
          marginTop: 3,
        }}
      >
        {monthName} {year}
      </span>
    </div>
  )
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

        {/* ── Interactive Monthly Calendar Widget ── */}
        <MonthlySessionCalendar sessions={sessions} />

        {/* ── Sessions Cards List Header ── */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Daftar Sesi Terjadwal ({sortedSessions.length})
          </h2>
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
                  {/* Top row with Calendar Date Block */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <CalendarDateBlock dateStr={s.date} />

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
                        {s.name}
                      </h2>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                        {/* Jam / Waktu Badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 9px',
                            borderRadius: 6,
                            background: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          <Clock size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          {formatTime(s.start_time)} – {formatTime(s.end_time)} WIB
                        </span>

                        {/* Tempat / Lokasi Badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 9px',
                            borderRadius: 6,
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#FBBF24',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <MapPin size={12} style={{ color: '#FBBF24', flexShrink: 0 }} />
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
