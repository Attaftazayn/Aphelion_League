'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { SessionWithPlayers } from '@/lib/types'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, ArrowUpRight } from 'lucide-react'

const DAY_NAMES = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  const h = parts[0]?.padStart(2, '0') ?? '00'
  const m = parts[1]?.padStart(2, '0') ?? '00'
  return `${h}.${m}`
}

export function MonthlySessionCalendar({
  sessions,
}: {
  sessions: SessionWithPlayers[]
}) {
  const defaultDate = useMemo(() => {
    if (sessions.length > 0 && sessions[0].date) {
      return new Date(sessions[0].date + 'T00:00:00')
    }
    return new Date()
  }, [sessions])

  const [currentYear, setCurrentYear] = useState(defaultDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(defaultDate.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  function prevMonth() {
    setSelectedDay(null)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    setSelectedDay(null)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

  const sessionsByDate = useMemo(() => {
    const map: Record<string, SessionWithPlayers[]> = {}
    for (const session of sessions) {
      if (!session.date) continue
      if (!map[session.date]) {
        map[session.date] = []
      }
      map[session.date].push(session)
    }
    return map
  }, [sessions])

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const yearOptions = useMemo(() => {
    const years = new Set<number>()
    years.add(today.getFullYear())
    years.add(currentYear)
    for (const s of sessions) {
      if (s.date) {
        const y = new Date(s.date + 'T00:00:00').getFullYear()
        if (!isNaN(y)) years.add(y)
      }
    }
    return Array.from(years).sort((a, b) => a - b)
  }, [sessions, currentYear, today])

  const selectedDateStr = selectedDay
    ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  const activeDaySessions = selectedDateStr ? (sessionsByDate[selectedDateStr] ?? []) : []

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: 16,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Calendar Header: Month/Year Dropdown + Nav Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <CalendarIcon size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.2px', marginRight: 4 }}>
            Kalender Sesi:
          </h2>

          {/* Month Dropdown */}
          <select
            value={currentMonth}
            onChange={(e) => {
              setSelectedDay(null)
              setCurrentMonth(Number(e.target.value))
            }}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-base)',
              borderRadius: 8,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={currentYear}
            onChange={(e) => {
              setSelectedDay(null)
              setCurrentYear(Number(e.target.value))
            }}
            style={{
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-primary)',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border-base)',
              borderRadius: 8,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={prevMonth}
            className="btn btn-secondary btn-icon"
            style={{ width: 32, height: 32, padding: 0 }}
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => {
              setCurrentYear(today.getFullYear())
              setCurrentMonth(today.getMonth())
              setSelectedDay(today.getDate())
            }}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11, padding: '4px 10px', height: 32 }}
          >
            Hari Ini
          </button>
          <button
            onClick={nextMonth}
            className="btn btn-secondary btn-icon"
            style={{ width: 32, height: 32, padding: 0 }}
            title="Bulan Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Grid Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
        {DAY_NAMES.map((day) => (
          <span
            key={day}
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: day === 'MIN' || day === 'SAB' ? 'var(--accent)' : 'var(--text-muted)',
              paddingBlock: 4,
              letterSpacing: '0.06em',
            }}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`blank-${i}`} style={{ height: 44 }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          const daySessions = sessionsByDate[dateStr] ?? []
          const hasSessions = daySessions.length > 0
          const isToday = dateStr === todayStr
          const isSelected = selectedDay === dayNum

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(isSelected ? null : dayNum)}
              style={{
                height: 46,
                borderRadius: 10,
                border: isSelected
                  ? '2px solid var(--accent)'
                  : isToday
                  ? '1px solid var(--accent-border)'
                  : hasSessions
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid transparent',
                background: isSelected
                  ? 'var(--accent-dim)'
                  : isToday
                  ? 'rgba(16, 185, 129, 0.12)'
                  : hasSessions
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'var(--bg-raised)',
                color: isSelected || isToday
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                fontWeight: isSelected || isToday || hasSessions ? 800 : 500,
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.14s ease',
              }}
            >
              <span>{dayNum}</span>

              {hasSessions && (
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px var(--accent)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Day Sessions Drawer */}
      {selectedDay && (
        <div
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-base)',
            borderRadius: 12,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sesi Tanggal {selectedDay} {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {activeDaySessions.length} Sesi Terjadwal
            </span>
          </div>

          {activeDaySessions.length === 0 ? (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingBlock: 8 }}>
              Tidak ada sesi pertandingan di tanggal ini.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeDaySessions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {s.name}
                    </h4>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} style={{ color: 'var(--accent)' }} />
                        {formatTime(s.start_time)} – {formatTime(s.end_time)} WIB
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} style={{ color: 'var(--accent)' }} />
                        {s.location}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/sessions/${s.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11, padding: '4px 10px', height: 30 }}
                  >
                    Detail
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
