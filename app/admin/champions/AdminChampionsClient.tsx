'use client'

import { useState, useMemo, useTransition } from 'react'
import type { MonthlyChampion, Player, MatchWithPlayers } from '@/lib/types'
import { calculateLeaderboard } from '@/lib/leaderboard'
import { confirmChampion } from '@/app/champions/actions'
import { Award, Trophy, ShieldCheck, Loader2, Check, AlertTriangle } from 'lucide-react'

function formatMonthLabel(monthKey: string) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-')
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
}

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
        setMsg({ text: `Monthly Champion for ${formatMonthLabel(selectedMonth)} confirmed and published!` })
      }
    })
  }

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="page-title">Champions</h1>
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
              {confirmedChampions.length} Confirmed
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Confirm and declare monthly champions into the Hall of Fame
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
            Confirm Monthly Champion Tool
          </h2>
        </div>

        {availableMonths.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            No sessions or matches found for champion confirmation.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input"
                style={{ maxWidth: 260 }}
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)} {confirmedChampions.some((c) => c.month_key === m) ? '(Confirmed)' : '(Provisional)'}
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
                      Leading Player ({formatMonthLabel(selectedMonth)})
                    </span>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 1 }}>
                      {monthCandidate.player.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {monthCandidate.total_points} pts · {monthCandidate.wins} wins · {(monthCandidate.win_rate * 100).toFixed(0)}% Win Rate
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
                  {isSelectedMonthConfirmed ? 'Re-Confirm Champion' : 'Confirm & Save Champion'}
                </button>
              </div>
            ) : (
              <div style={{ padding: '16px', background: 'var(--bg-raised)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                No completed matches recorded for {formatMonthLabel(selectedMonth)} yet.
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
          Confirmed Champions Roster ({confirmedChampions.length})
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
            No monthly champions have been confirmed yet. Use the tool above to confirm your first champion.
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
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Award size={20} style={{ color: 'var(--accent)' }} />
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)' }}>
                      {formatMonthLabel(c.month_key)}
                    </span>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {c.player?.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {c.total_points} pts · {c.wins} wins
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
