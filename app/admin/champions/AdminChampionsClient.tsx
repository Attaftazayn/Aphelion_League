'use client'

import { useState, useMemo, useTransition } from 'react'
import type { MonthlyChampion, Player, MatchWithPlayers } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import { confirmChampion, deleteChampion } from '@/app/champions/actions'
import { Award, Trophy, ShieldCheck, Loader2, Check, AlertTriangle, Trash2, X } from 'lucide-react'

function formatMonthLabel(monthKey: string) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

/* ============================================================
   Delete Champion Modal
   ============================================================ */
function DeleteChampionModal({
  champion,
  onClose,
}: {
  champion: MonthlyChampion
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteChampion(champion.id)
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
            Hapus Data Juara Bulanan
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
                Hapus {champion.player?.name} sebagai Juara untuk {formatMonthLabel(champion.month_key)}?
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Tindakan ini akan menghapus data juara dari Hall of Fame publik.
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
          <button onClick={onClose} className="btn btn-secondary">
            Batal
          </button>
          <button onClick={handleDelete} disabled={isPending} className="btn btn-danger">
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 size={15} />
                Hapus Juara
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Main Admin Champions Client Component
   ============================================================ */
export function AdminChampionsClient({
  confirmedChampions,
  players,
  matches,
  availableMonths,
}: {
  confirmedChampions: MonthlyChampion[]
  players: Player[]
  matches: MatchWithPlayers[]
  availableMonths: string[]
}) {
  const [isPending, startTransition] = useTransition()
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] ?? '')
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null)
  const [deletingChampion, setDeletingChampion] = useState<MonthlyChampion | null>(null)

  const monthCandidate = useMemo(() => {
    if (!selectedMonth) return null
    const monthMatches = matches.filter(
      (m) => m.session?.date && m.session.date.startsWith(selectedMonth)
    )
    const leaderboard = calculateLeaderboard(players, monthMatches)
    const topPlayer = leaderboard[0]
    if (!topPlayer || topPlayer.matches_played === 0) return null
    return topPlayer
  }, [players, matches, selectedMonth])

  const isSelectedMonthConfirmed = useMemo(() => {
    return confirmedChampions.some((c) => c.month_key === selectedMonth)
  }, [confirmedChampions, selectedMonth])

  function handleConfirmChampion() {
    if (!selectedMonth || !monthCandidate) return
    setMsg(null)

    startTransition(async () => {
      const res = await confirmChampion(
        selectedMonth,
        monthCandidate.player.id,
        monthCandidate.total_points,
        monthCandidate.wins,
        monthCandidate.win_rate,
      )
      if (res?.error) {
        setMsg({ text: res.error, error: true })
      } else {
        setMsg({ text: `Juara Bulanan untuk ${formatMonthLabel(selectedMonth)} berhasil dikonfirmasi dan dipublikasikan!` })
      }
    })
  }

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Kelola Juara</h1>
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
              {confirmedChampions.length} Terkonfirmasi
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Konfirmasi, kelola, atau hapus juara bulanan di Hall of Fame
          </p>
        </div>
      </div>

      {/* Confirm Champion Control Card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 14,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Alat Konfirmasi Juara Bulanan
          </h2>
        </div>

        {availableMonths.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Belum ada sesi atau pertandingan untuk mengonfirmasi juara.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Pilih Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input"
                style={{ maxWidth: 260 }}
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)} {confirmedChampions.some((c) => c.month_key === m) ? '(Terkonfirmasi)' : '(Sementara)'}
                  </option>
                ))}
              </select>
            </div>

            {monthCandidate ? (
              <div
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                    }}
                  >
                    <Trophy size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Pemimpin Klasemen ({formatMonthLabel(selectedMonth)})
                    </span>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 1 }}>
                      {monthCandidate.player.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {monthCandidate.total_points} poin · {monthCandidate.wins} menang · {(monthCandidate.win_rate * 100).toFixed(0)}% Persentase Menang
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirmChampion}
                  disabled={isPending}
                  className="btn btn-primary"
                  style={{ gap: 6 }}
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {isSelectedMonthConfirmed ? 'Konfirmasi Ulang Juara' : 'Konfirmasi & Simpan Juara'}
                </button>
              </div>
            ) : (
              <div style={{ padding: '16px', background: 'var(--bg-raised)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                Belum ada pertandingan selesai untuk {formatMonthLabel(selectedMonth)}.
              </div>
            )}

            {msg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: msg.error ? 'var(--danger-dim)' : 'var(--accent-dim)',
                  color: msg.error ? 'var(--danger)' : '#ffffff',
                  border: `1px solid ${msg.error ? 'var(--danger-border)' : 'var(--accent-border)'}`,
                }}
              >
                {msg.error ? <AlertTriangle size={15} /> : <Check size={15} />}
                {msg.text}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmed Champions History */}
      <div>
        <h2 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Daftar Juara Terkonfirmasi ({confirmedChampions.length})
        </h2>

        {confirmedChampions.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-base)',
              borderRadius: 14,
              padding: '36px 24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            Belum ada juara bulanan yang dikonfirmasi. Gunakan alat di atas untuk mengonfirmasi juara pertama.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {confirmedChampions.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 14,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Award size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)' }}>
                      {formatMonthLabel(c.month_key)}
                    </span>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {c.player?.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {c.total_points} poin · {c.wins} menang
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDeletingChampion(c)}
                  className="btn btn-ghost btn-icon btn-sm"
                  title="Hapus data juara"
                  style={{ color: 'var(--danger)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deletingChampion && (
        <DeleteChampionModal
          champion={deletingChampion}
          onClose={() => setDeletingChampion(null)}
        />
      )}
    </div>
  )
}
