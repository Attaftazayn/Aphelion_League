import type { Player, MatchWithPlayers, PlayerStats } from './types'

export interface MatchScoreResult {
  winnerTeam: 'A' | 'B'
  scoreA: number
  scoreB: number
  pointsA: number
  pointsB: number
  isDominant: boolean
}

/**
 * Calculates points awarded to Team A and Team B for a completed match per APHELION LEAGUE rules:
 * - 4-0 => Winner +7, Loser 0
 * - 4-1 => Winner +6, Loser +1
 * - 4-2 => Winner +5, Loser +2
 * - 4-3 => Winner +4, Loser +3
 *
 * Formula: Winner Points = 7 - LoserScore, Loser Points = LoserScore
 */
export function calculateMatchPoints(scoreA: number, scoreB: number): MatchScoreResult {
  if (scoreA === scoreB) {
    throw new Error('Tied scores are not allowed')
  }

  const isAWinner = scoreA > scoreB
  const winnerScore = Math.max(scoreA, scoreB)
  const loserScore = Math.min(scoreA, scoreB)

  // Aphelion Race to 4 conversion
  const winnerPoints = Math.max(0, 7 - loserScore)
  const loserPoints = loserScore

  return {
    winnerTeam: isAWinner ? 'A' : 'B',
    scoreA,
    scoreB,
    pointsA: isAWinner ? winnerPoints : loserPoints,
    pointsB: isAWinner ? loserPoints : winnerPoints,
    isDominant: winnerScore - loserScore >= 3,
  }
}

/**
 * Derives player standings & rankings directly from raw players and matches.
 * Pure dynamic calculation ensures 100% data integrity without duplicate points.
 */
export function calculateLeaderboard(
  allPlayers: Player[],
  completedMatches: MatchWithPlayers[]
): PlayerStats[] {
  // Map of player_id -> cumulative stats accumulator
  const statsMap = new Map<string, { matches_played: number; wins: number; losses: number; total_points: number }>()

  // Initialize stats for all registered players
  allPlayers.forEach((p) => {
    statsMap.set(p.id, {
      matches_played: 0,
      wins: 0,
      losses: 0,
      total_points: 0,
    })
  })

  // Process each completed match
  completedMatches.forEach((match) => {
    if (match.status !== 'completed' || match.score_a === null || match.score_b === null) {
      return
    }

    if (match.score_a === match.score_b) return

    const { pointsA, pointsB, winnerTeam } = calculateMatchPoints(match.score_a, match.score_b)

    match.match_players?.forEach((mp) => {
      const pStats = statsMap.get(mp.player_id)
      if (!pStats) return

      pStats.matches_played += 1
      const isWinner = mp.team === winnerTeam

      if (isWinner) {
        pStats.wins += 1
        pStats.total_points += pointsA
      } else {
        pStats.losses += 1
        pStats.total_points += pointsB
      }
    })
  })

  // Format into PlayerStats array
  const standings: PlayerStats[] = allPlayers.map((player) => {
    const s = statsMap.get(player.id) ?? { matches_played: 0, wins: 0, losses: 0, total_points: 0 }
    const win_rate = s.matches_played > 0 ? s.wins / s.matches_played : 0

    return {
      rank: 0, // Assigned after sorting
      player,
      matches_played: s.matches_played,
      wins: s.wins,
      losses: s.losses,
      total_points: s.total_points,
      win_rate,
    }
  })

  // Sort standings by tie-breaking hierarchy:
  // 1. Highest total points (descending)
  // 2. Highest total wins (descending)
  // 3. Highest win rate (descending)
  // 4. Alphabetical player name (ascending)
  standings.sort((a, b) => {
    if (b.total_points !== a.total_points) {
      return b.total_points - a.total_points
    }
    if (b.wins !== a.wins) {
      return b.wins - a.wins
    }
    if (b.win_rate !== a.win_rate) {
      return b.win_rate - a.win_rate
    }
    return a.player.name.localeCompare(b.player.name)
  })

  // Assign 1-indexed ranks
  return standings.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}
