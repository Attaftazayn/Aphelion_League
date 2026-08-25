'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import type { Player, SessionWithPlayers, MatchWithPlayers } from '@/lib/types'
import {
  createMatch,
  updateMatch,
  deleteMatch,
  saveMatchScore,
  resetMatchScore,
  generateAutoPairingsAction,
} from './actions'
import { updateSession, deleteSessionAndRedirect } from '../actions'
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
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Trophy,
  RotateCcw,
  Shuffle,
} from 'lucide-react'

/* ============================================================
   Helpers
   ============================================================ */
function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function PlayerChip({ name, avatarUrl, isWinner }: { name: string; avatarUrl?: string | null; isWinner?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        className="avatar"
        style={{
          width: 28,
          height: 28,
          fontSize: 11,
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-strong)',
          color: '#ffffff',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          getInitials(name)
        )}
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: isWinner ? '#ffffff' : 'var(--text-primary)',
        }}
      >
        {name}
      </span>
    </div>
  )
}

/* ============================================================
   Team Selector Component
   ============================================================ */
function TeamSelector({
  label,
  teamKey,
  participants,
  selected,
  onToggle,
  disabledIds,
}: {
  label: string
  teamKey: string
  participants: Player[]
  selected: string[]
  onToggle: (id: string) => void
  disabledIds: string[]
}) {
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-base)',
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
          Team {label}
        </p>
        <span style={{ fontSize: 11, color: selected.length === 2 ? 'var(--accent-light)' : 'var(--text-muted)' }}>
          {selected.length}/2 selected
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {participants.map((p) => {
          const isSelected = selected.includes(p.id)
          const isDisabled = disabledIds.includes(p.id) && !isSelected
          return (
            <label
              key={p.id}
              className={`checkbox-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'opacity-40' : ''}`}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
            >
              <input
                type="checkbox"
                name={teamKey}
                value={p.id}
                checked={isSelected}
                disabled={isDisabled || (!isSelected && selected.length >= 2)}
                onChange={() => onToggle(p.id)}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {p.name}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/* ============================================================
   Score Modal (Race to 4 Matrix)
   ============================================================ */
function ScoreModal({
  match,
  sessionId,
  onClose,
}: {
  match: MatchWithPlayers
  sessionId: string
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [scoreA, setScoreA] = useState<string>(match.score_a !== null ? String(match.score_a) : '')
  const [scoreB, setScoreB] = useState<string>(match.score_b !== null ? String(match.score_b) : '')

  const teamA = match.match_players?.filter((mp) => mp.team === 'A') ?? []
  const teamB = match.match_players?.filter((mp) => mp.team === 'B') ?? []

  const numA = parseInt(scoreA, 10)
  const numB = parseInt(scoreB, 10)

  const isValidScores = !isNaN(numA) && !isNaN(numB) && numA >= 0 && numB >= 0 && numA !== numB
  const isAWinner = isValidScores && numA > numB

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isValidScores) {
      if (numA === numB && !isNaN(numA)) {
        setError('Tied scores are not allowed. One team must win.')
      } else {
        setError('Please enter valid scores (e.g. 4-0, 4-1, 4-2, 4-3).')
      }
      return
    }

    startTransition(async () => {
      const result = await saveMatchScore(match.id, sessionId, numA, numB)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Record Match {match.match_number} Score
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
              {/* Team A */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Team A
                </span>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {teamA.map((mp) => mp.players.name).join(' & ')}
                </div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input"
                  style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}
                  value={scoreA}
                  onChange={(e) => setScoreA(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-muted)' }}>VS</span>

              {/* Team B */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Team B
                </span>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {teamB.map((mp) => mp.players.name).join(' & ')}
                </div>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input"
                  style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}
                  value={scoreB}
                  onChange={(e) => setScoreB(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Point Distribution Preview */}
            {isValidScores && (() => {
              const loserScore = Math.min(numA, numB)
              const winPts = 7 - loserScore
              const losePts = loserScore
              return (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--accent-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                      Winner ({isAWinner ? 'Team A' : 'Team B'}): +{winPts} pts
                    </span>
                    <span className="badge badge-accent">APHELION Matrix</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Loser ({isAWinner ? 'Team B' : 'Team A'}): +{losePts} {losePts === 1 ? 'pt' : 'pts'}
                  </span>
                </div>
              )
            })()}

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
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
              ) : (
                'Save Score'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Create/Edit Match Modal
   ============================================================ */
function MatchModal({
  sessionId,
  participants,
  match,
  onClose,
}: {
  sessionId: string
  participants: Player[]
  match?: MatchWithPlayers
  onClose: () => void
}) {
  const isEditing = !!match
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const existingTeamA = match?.match_players?.filter((mp) => mp.team === 'A').map((mp) => mp.player_id) ?? []
  const existingTeamB = match?.match_players?.filter((mp) => mp.team === 'B').map((mp) => mp.player_id) ?? []

  const [teamA, setTeamA] = useState<string[]>(existingTeamA)
  const [teamB, setTeamB] = useState<string[]>(existingTeamB)

  function toggleTeamA(id: string) {
    setTeamA((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleTeamB(id: string) {
    setTeamB((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (teamA.length !== 2) return setError('Team A must have exactly 2 players')
    if (teamB.length !== 2) return setError('Team B must have exactly 2 players')

    const formData = new FormData()
    teamA.forEach((id) => formData.append('team_a', id))
    teamB.forEach((id) => formData.append('team_b', id))
    if (match) formData.set('status', match.status)

    startTransition(async () => {
      const result = isEditing
        ? await updateMatch(match.id, sessionId, formData)
        : await createMatch(sessionId, formData)

      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEditing ? `Edit Match ${match.match_number}` : 'Create New Match'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <TeamSelector
                label="A"
                teamKey="team_a"
                participants={participants}
                selected={teamA}
                onToggle={toggleTeamA}
                disabledIds={teamB}
              />
              <TeamSelector
                label="B"
                teamKey="team_b"
                participants={participants}
                selected={teamB}
                onToggle={toggleTeamB}
                disabledIds={teamA}
              />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={15} />
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || teamA.length !== 2 || teamB.length !== 2}
              className="btn btn-primary"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Match'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ============================================================
   Delete Match Modal
   ============================================================ */
function DeleteMatchModal({
  match,
  sessionId,
  onClose,
}: {
  match: MatchWithPlayers
  sessionId: string
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMatch(match.id, sessionId)
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
            Delete Match {match.match_number}
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
                Delete Match {match.match_number}?
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                This match record will be permanently deleted.
              </p>
            </div>
          </div>
          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
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
                Delete Match
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Match Card Component
   ============================================================ */
function MatchCard({
  match,
  sessionId,
  onEdit,
  onDelete,
  onScore,
}: {
  match: MatchWithPlayers
  sessionId: string
  onEdit: () => void
  onDelete: () => void
  onScore: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const teamA = match.match_players?.filter((mp) => mp.team === 'A') ?? []
  const teamB = match.match_players?.filter((mp) => mp.team === 'B') ?? []

  const isCompleted = match.status === 'completed' && match.score_a !== null && match.score_b !== null
  const isWinnerA = isCompleted && match.score_a! > match.score_b!
  const isWinnerB = isCompleted && match.score_b! > match.score_a!

  function handleReset() {
    startTransition(async () => {
      await resetMatchScore(match.id, sessionId)
    })
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${isCompleted ? 'var(--accent-border)' : 'var(--border-base)'}`,
        borderRadius: 14,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Match Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            Match {match.match_number}
          </span>
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-upcoming'}`}>
            {isCompleted ? <CheckCircle2 size={11} /> : <Circle size={11} />}
            {match.status}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={onScore}
            className="btn btn-primary btn-sm"
            style={{ padding: '0 10px', fontSize: 12, height: 32 }}
          >
            <Trophy size={13} />
            {isCompleted ? 'Edit Score' : 'Record Score'}
          </button>

          {isCompleted && (
            <button
              onClick={handleReset}
              disabled={isPending}
              className="btn btn-ghost btn-icon btn-sm"
              title="Reset score"
              style={{ width: 32, height: 32 }}
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
            </button>
          )}

          <button
            onClick={onEdit}
            className="btn btn-ghost btn-icon btn-sm"
            title="Edit players"
            style={{ width: 32, height: 32 }}
          >
            <Pencil size={13} />
          </button>

          <button
            onClick={onDelete}
            className="btn btn-ghost btn-icon btn-sm"
            title="Delete match"
            style={{ width: 32, height: 32, color: 'var(--danger)' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Match Teams & Score Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
        {/* Team A */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: isWinnerA ? 'rgba(3,65,44,0.35)' : 'var(--bg-raised)',
            border: `1px solid ${isWinnerA ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Team A
            </span>
            {isWinnerA && <span className="badge badge-accent" style={{ fontSize: 9 }}>WIN</span>}
          </div>
          {teamA.map((mp) => (
            <PlayerChip key={mp.id} name={mp.players.name} avatarUrl={mp.players.avatar_url} isWinner={isWinnerA} />
          ))}
        </div>

        {/* Score / VS Center */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
          {isCompleted ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-strong)',
                  color: '#ffffff',
                }}
              >
                {match.score_a} — {match.score_b}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                FINAL
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              VS
            </span>
          )}
        </div>

        {/* Team B */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: isWinnerB ? 'rgba(3,65,44,0.35)' : 'var(--bg-raised)',
            border: `1px solid ${isWinnerB ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
              Team B
            </span>
            {isWinnerB && <span className="badge badge-accent" style={{ fontSize: 9 }}>WIN</span>}
          </div>
          {teamB.map((mp) => (
            <PlayerChip key={mp.id} name={mp.players.name} avatarUrl={mp.players.avatar_url} isWinner={isWinnerB} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Edit Session Modal
   ============================================================ */
function EditSessionModal({
  session,
  allPlayers,
  onClose,
}: {
  session: SessionWithPlayers
  allPlayers: Player[]
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(session.name)
  const [date, setDate] = useState(session.date)
  const [startTime, setStartTime] = useState(session.start_time.slice(0, 5))
  const [endTime, setEndTime] = useState(session.end_time.slice(0, 5))
  const [location, setLocation] = useState(session.location)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    session.session_players?.map((sp) => sp.player_id) ?? []
  )

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
    selectedIds.forEach((id) => formData.append('player_ids', id))

    startTransition(async () => {
      const result = await updateSession(session.id, formData)
      if (result?.error) setError(result.error)
      else onClose()
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 540 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Edit Session
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Session Name *</label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label className="label">Date *</label>
                <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <label className="label">Start *</label>
                <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div>
                <label className="label">End *</label>
                <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="label">Location *</label>
              <input type="text" className="input" value={location} onChange={(e) => setLocation(e.target.value)} required maxLength={120} />
            </div>
            <div>
              <label className="label">Participants ({selectedIds.length} selected)</label>
              <div className="checkbox-group">
                {allPlayers.map((p) => {
                  const checked = selectedIds.includes(p.id)
                  return (
                    <label key={p.id} className={`checkbox-item ${checked ? 'selected' : ''}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggle(p.id)} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
                <AlertTriangle size={15} />{error}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? <><Loader2 size={16} className="animate-spin" />Saving...</> : 'Save Changes'}
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
      const result = await deleteSessionAndRedirect(session.id)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Delete Session</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger-dim)', color: 'var(--danger)', flexShrink: 0 }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>Delete &quot;{session.name}&quot;?</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>This will permanently delete the session and all matches.</p>
            </div>
          </div>
          {error && <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>{error}</div>}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={isPending} className="btn btn-danger">
            {isPending ? <><Loader2 size={15} className="animate-spin" />Deleting...</> : <><Trash2 size={15} />Delete Session</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Main Session Detail Client Component
   ============================================================ */
export function SessionDetailClient({
  session,
  matches,
  allPlayers,
}: {
  session: SessionWithPlayers
  matches: MatchWithPlayers[]
  allPlayers: Player[]
}) {
  const [modal, setModal] = useState<
    | { type: 'createMatch' }
    | { type: 'editMatch'; match: MatchWithPlayers }
    | { type: 'deleteMatch'; match: MatchWithPlayers }
    | { type: 'scoreMatch'; match: MatchWithPlayers }
    | { type: 'editSession' }
    | { type: 'deleteSession' }
    | null
  >(null)

  const [isGenerating, startGenerating] = useTransition()
  const [genError, setGenError] = useState<string | null>(null)

  function handleAutoPairings() {
    setGenError(null)
    startGenerating(async () => {
      const res = await generateAutoPairingsAction(session.id)
      if (res?.error) setGenError(res.error)
    })
  }

  const participants: Player[] = session.session_players?.map((sp) => sp.players) ?? []
  const playerCount = participants.length
  const matchCount = matches.length
  const completedCount = matches.filter((m) => m.status === 'completed').length

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back link */}
      <div>
        <Link
          href="/admin/sessions"
          className="btn btn-ghost btn-sm inline-flex"
          style={{ paddingLeft: 0, gap: 4, color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} />
          All Sessions
        </Link>
      </div>

      {/* Session Hero Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-base)',
          borderRadius: 14,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              Session
            </span>
            <h1 className="page-title" style={{ marginTop: 2 }}>
              {session.name}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setModal({ type: 'editSession' })}
              className="btn btn-secondary btn-sm"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => setModal({ type: 'deleteSession' })}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Calendar size={14} style={{ color: 'var(--accent)' }} />
            {formatDate(session.date)}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <Clock size={14} style={{ color: 'var(--accent)' }} />
            {formatTime(session.start_time)} – {formatTime(session.end_time)}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <MapPin size={14} style={{ color: 'var(--accent)' }} />
            {session.location}
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Players</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{playerCount}</p>
          </div>
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Matches</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{matchCount}</p>
          </div>
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-base)', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Completed</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Users size={15} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Participants ({playerCount})
          </h2>
        </div>
        {participants.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            No participants added to this session yet.
          </p>
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

      {/* Matches Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Match Record ({matchCount})
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleAutoPairings}
              disabled={isGenerating || playerCount < 4}
              className="btn btn-secondary btn-sm"
              title={playerCount < 4 ? 'Need at least 4 participants' : 'Auto-generate pairings for this session'}
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Shuffle size={14} />}
              Auto Pairings
            </button>
            <button
              onClick={() => setModal({ type: 'createMatch' })}
              className="btn btn-primary btn-sm"
              disabled={playerCount < 4}
              title={playerCount < 4 ? 'Need at least 4 participants' : undefined}
            >
              <Plus size={14} />
              Add Match
            </button>
          </div>
        </div>

        {genError && (
          <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14, background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={15} />
            {genError}
          </div>
        )}

        {matches.length === 0 ? (
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
              <Plus size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>No matches created yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {playerCount < 4 ? 'Add at least 4 participants to create matches.' : 'Click "Auto Pairings" or "Add Match" to start.'}
              </p>
            </div>
            {playerCount >= 4 && (
              <button onClick={() => setModal({ type: 'createMatch' })} className="btn btn-primary btn-sm">
                <Plus size={15} />
                Add Match
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                sessionId={session.id}
                onEdit={() => setModal({ type: 'editMatch', match })}
                onDelete={() => setModal({ type: 'deleteMatch', match })}
                onScore={() => setModal({ type: 'scoreMatch', match })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'createMatch' && (
        <MatchModal
          sessionId={session.id}
          participants={participants}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'editMatch' && (
        <MatchModal
          sessionId={session.id}
          participants={participants}
          match={modal.match}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'scoreMatch' && (
        <ScoreModal
          match={modal.match}
          sessionId={session.id}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'deleteMatch' && (
        <DeleteMatchModal
          match={modal.match}
          sessionId={session.id}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'editSession' && (
        <EditSessionModal
          session={session}
          allPlayers={allPlayers}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'deleteSession' && (
        <DeleteSessionModal session={session} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
