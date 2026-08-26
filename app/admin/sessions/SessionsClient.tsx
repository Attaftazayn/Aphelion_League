'use client'

import { useState, useTransition, useMemo } from 'react'
import Link from 'next/link'
import type { Player, SessionWithPlayers } from '@/lib/types'
import { createSession, updateSession, deleteSession } from './actions'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'

/* ============================================================
   Helpers
   ============================================================ */
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

/* ============================================================
   Player selector component
   ============================================================ */
function PlayerSelector({
  allPlayers,
  selectedIds,
  onToggle,
}: {
  allPlayers: Player[]
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div>
      <label className="label">
        Participants ({selectedIds.length} selected)
      </label>
      {allPlayers.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          No players registered yet. Add players first.
        </p>
      ) : (
        <div className="checkbox-group">
          {allPlayers.map((player) => {
            const checked = selectedIds.includes(player.id)
            return (
              <label
                key={player.id}
                className={`checkbox-item ${checked ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  name="player_ids"
                  value={player.id}
                  checked={checked}
                  onChange={() => onToggle(player.id)}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {player.name}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Session Modal Form
   ============================================================ */
function SessionModal({
  session,
  allPlayers,
  onClose,
}: {
  session?: SessionWithPlayers
  allPlayers: Player[]
  onClose: () => void
}) {
  const isEditing = !!session
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const existingPlayerIds = session?.session_players?.map((sp) => sp.player_id) ?? []

  const [name, setName] = useState(session?.name ?? '')
  const [date, setDate] = useState(session?.date ?? '')
  const [startTime, setStartTime] = useState(
    session?.start_time ? session.start_time.slice(0, 5) : ''
  )
  const [endTime, setEndTime] = useState(
    session?.end_time ? session.end_time.slice(0, 5) : ''
  )
  const [location, setLocation] = useState(session?.location ?? '')
  const [locationUrl, setLocationUrl] = useState(session?.location_url ?? '')
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(existingPlayerIds)

  function togglePlayer(id: string) {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const formData = new FormData()
    formData.set('name', name)
    formData.set('date', date)
    formData.set('start_time', startTime)
    formData.set('end_time', endTime)
    formData.set('location', location)
    formData.set('location_url', locationUrl)
    selectedPlayerIds.forEach((id) => formData.append('player_ids', id))

    startTransition(async () => {
      const result = isEditing
        ? await updateSession(session.id, formData)
        : await createSession(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEditing ? 'Edit Session' : 'Create Session'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div>
              <label htmlFor="session-name" className="label">
                Session Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="session-name"
                type="text"
                className="input"
                placeholder="e.g. Friday Night Session"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                maxLength={100}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label htmlFor="session-date" className="label">
                  Date <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="session-date"
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="start-time" className="label">
                  Start <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="start-time"
                  type="time"
                  className="input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="end-time" className="label">
                  End <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  id="end-time"
                  type="time"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="session-location" className="label">
                Location / Court Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="session-location"
                type="text"
                className="input"
                placeholder="e.g. Aphelion Tennis Court"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                maxLength={120}
              />
            </div>

            <div>
              <label htmlFor="session-location-url" className="label">
                Google Maps Link (URL / Share Link)
              </label>
              <input
                id="session-location-url"
                type="url"
                className="input"
                placeholder="https://maps.app.goo.gl/... or https://google.com/maps/..."
                value={locationUrl}
                onChange={(e) => setLocationUrl(e.target.value)}
              />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Enter Google Maps link to display an interactive map on the user page.
              </p>
            </div>

            <PlayerSelector
              allPlayers={allPlayers}
              selectedIds={selectedPlayerIds}
              onToggle={togglePlayer}
            />

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--danger-dim)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                }}
              >
                <AlertTriangle size={15} />
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Delete Session Modal
   ============================================================ */
function DeleteSessionModal({
  session,
  onClose,
}: {
  session: SessionWithPlayers
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSession(session.id)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Delete Session
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--danger-dim)',
                color: 'var(--danger)',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                Delete &quot;{session.name}&quot;?
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                This will permanently delete the session, player assignments, and matches.
              </p>
            </div>
          </div>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                background: 'var(--danger-dim)',
                color: 'var(--danger)',
                border: '1px solid var(--danger-border)',
              }}
            >
              {error}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={isPending} className="btn btn-danger">
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Delete Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Session Card
   ============================================================ */
function SessionCard({
  session,
  onEdit,
  onDelete,
}: {
  session: SessionWithPlayers
  onEdit: () => void
  onDelete: () => void
}) {
  const playerCount = session.session_players?.length ?? 0

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-base)',
        borderRadius: 14,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {session.name}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
              <Calendar size={13} style={{ color: 'var(--accent)' }} />
              {formatDate(session.date)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
              <Clock size={13} style={{ color: 'var(--accent)' }} />
              {formatTime(session.start_time)} – {formatTime(session.end_time)}
            </span>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            <MapPin size={13} />
            {session.location}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button
            id={`edit-session-${session.id}`}
            onClick={onEdit}
            className="btn btn-ghost btn-icon btn-sm"
            title="Edit session"
          >
            <Pencil size={15} />
          </button>
          <button
            id={`delete-session-${session.id}`}
            onClick={onDelete}
            className="btn btn-ghost btn-icon btn-sm"
            title="Delete session"
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--border-base)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <Users size={14} style={{ color: 'var(--accent)' }} />
          {playerCount} {playerCount === 1 ? 'player' : 'players'}
        </span>
        <Link
          href={`/admin/sessions/${session.id}`}
          id={`view-session-${session.id}`}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: 12, gap: 4, height: 34 }}
        >
          Manage Session
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ============================================================
   Main Sessions Client Component
   ============================================================ */
export function SessionsClient({
  sessions,
  allPlayers,
}: {
  sessions: SessionWithPlayers[]
  allPlayers: Player[]
}) {
  const [modal, setModal] = useState<
    | { type: 'create' }
    | { type: 'edit'; session: SessionWithPlayers }
    | { type: 'delete'; session: SessionWithPlayers }
    | null
  >(null)

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
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Sessions</h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 9999,
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-secondary)',
              }}
            >
              {sortedSessions.length}
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage tennis sessions, player pools, and match pairings
          </p>
        </div>
        <button
          id="create-session-btn"
          onClick={() => setModal({ type: 'create' })}
          className="btn btn-primary"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Sessions Grid */}
      {sortedSessions.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-base)',
            borderRadius: 14,
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'var(--bg-raised)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Calendar size={24} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>No sessions created yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Create your first session to start pairing matches.</p>
          </div>
          <button onClick={() => setModal({ type: 'create' })} className="btn btn-primary btn-sm">
            <Plus size={15} />
            New Session
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 12,
          }}
        >
          {sortedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={() => setModal({ type: 'edit', session })}
              onDelete={() => setModal({ type: 'delete', session })}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'create' && (
        <SessionModal allPlayers={allPlayers} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'edit' && (
        <SessionModal
          session={modal.session}
          allPlayers={allPlayers}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteSessionModal session={modal.session} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
