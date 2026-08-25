import type { Player, MatchWithPlayers, PlayerProfileDetails, PlayerRecentMatch } from './types'
import { calculateLeaderboard, calculateMatchPoints } from './leaderboard'

export function computePlayerProfileDetails(
  targetPlayerId: string,
  allPlayers: Player[],
  allMatches: MatchWithPlayers[]
): PlayerProfileDetails | null {
  const player = allPlayers.find((p) => p.id === targetPlayerId)
  if (!player) return null

  // Calculate global leaderboard to get player's current rank & standings
  const leaderboard = calculateLeaderboard(allPlayers, allMatches)
  const playerRankItem = leaderboard.find((st) => st.player.id === targetPlayerId)
  const rank = playerRankItem?.rank ?? 0

  // Filter completed matches involving target player
  const completedPlayerMatches = allMatches
    .filter(
      (m) =>
        m.status === 'completed' &&
        m.score_a !== null &&
        m.score_b !== null &&
        m.match_players?.some((mp) => mp.player_id === targetPlayerId)
    )
    .sort((a, b) => {
      // Sort chronologically by session date or created_at
      const dateA = a.session?.date ?? a.created_at
      const dateB = b.session?.date ?? b.created_at
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

  let total_points = 0
  let wins = 0
  let losses = 0

  const recent_matches: PlayerRecentMatch[] = []

  // Stats for partners & opponents
  const partnerMap = new Map<string, { matches: number; wins: number }>()
  const opponentMap = new Map<string, { matches: number; wins: number }>()

  // Process matches in reverse chronological order for streak calculation
  const matchOutcomes: boolean[] = [] // true for win, false for loss

  completedPlayerMatches.forEach((match) => {
    if (match.score_a === null || match.score_b === null || match.score_a === match.score_b) return

    const { winnerTeam, pointsA, pointsB } = calculateMatchPoints(match.score_a, match.score_b)
    const myPlayerRecord = match.match_players.find((mp) => mp.player_id === targetPlayerId)
    if (!myPlayerRecord) return

    const myTeam = myPlayerRecord.team
    const isWin = myTeam === winnerTeam

    matchOutcomes.push(isWin)

    if (isWin) {
      wins++
      total_points += myTeam === 'A' ? pointsA : pointsB
    } else {
      losses++
      total_points += myTeam === 'A' ? pointsA : pointsB
    }

    // Partner
    const partnerRecord = match.match_players.find(
      (mp) => mp.team === myTeam && mp.player_id !== targetPlayerId
    )
    if (partnerRecord) {
      const pStats = partnerMap.get(partnerRecord.player_id) ?? { matches: 0, wins: 0 }
      pStats.matches++
      if (isWin) pStats.wins++
      partnerMap.set(partnerRecord.player_id, pStats)
    }

    // Opponents
    const opponentRecords = match.match_players.filter((mp) => mp.team !== myTeam)
    opponentRecords.forEach((op) => {
      const opStats = opponentMap.get(op.player_id) ?? { matches: 0, wins: 0 }
      opStats.matches++
      if (isWin) opStats.wins++
      opponentMap.set(op.player_id, opStats)
    })

    // Score display: myTeam score vs opponent team score
    const myScore = myTeam === 'A' ? match.score_a : match.score_b
    const oppScore = myTeam === 'A' ? match.score_b : match.score_a

    recent_matches.push({
      match_id: match.id,
      session_name: match.session?.name ?? `Session Match ${match.match_number}`,
      date: match.session?.date ?? match.created_at.slice(0, 10),
      outcome: isWin ? 'W' : 'L',
      score_display: `${myScore}-${oppScore}`,
      partner: partnerRecord ? allPlayers.find((p) => p.id === partnerRecord.player_id) : undefined,
      opponents: opponentRecords
        .map((op) => allPlayers.find((p) => p.id === op.player_id))
        .filter(Boolean) as Player[],
    })
  })

  // Calculate streaks (matchOutcomes is in reverse chronological order: index 0 is latest match)
  let current_streak = 0
  for (let i = 0; i < matchOutcomes.length; i++) {
    if (matchOutcomes[i]) {
      current_streak++
    } else {
      break
    }
  }

  let best_streak = 0
  let temp_streak = 0
  // Chronological order for best streak
  const chronoOutcomes = [...matchOutcomes].reverse()
  chronoOutcomes.forEach((isWin) => {
    if (isWin) {
      temp_streak++
      if (temp_streak > best_streak) best_streak = temp_streak
    } else {
      temp_streak = 0
    }
  })

  // Favorite Partner (highest matches played together)
  let favorite_partner: PlayerProfileDetails['favorite_partner'] = undefined
  let maxPartnerMatches = 0
  partnerMap.forEach((stats, pId) => {
    if (stats.matches > maxPartnerMatches) {
      maxPartnerMatches = stats.matches
      const p = allPlayers.find((x) => x.id === pId)
      if (p) {
        favorite_partner = {
          player: p,
          matches_together: stats.matches,
          win_rate: stats.matches > 0 ? stats.wins / stats.matches : 0,
        }
      }
    }
  })

  // Toughest Opponent (lowest win rate, min 1 match)
  let toughest_opponent: PlayerProfileDetails['toughest_opponent'] = undefined
  let lowestWinRate = 2.0
  opponentMap.forEach((stats, opId) => {
    const winRateAgainst = stats.wins / stats.matches
    if (winRateAgainst < lowestWinRate) {
      lowestWinRate = winRateAgainst
      const opPlayer = allPlayers.find((x) => x.id === opId)
      if (opPlayer) {
        toughest_opponent = {
          player: opPlayer,
          matches_against: stats.matches,
          win_rate: winRateAgainst,
        }
      }
    }
  })

  const matches_played = wins + losses
  const win_rate = matches_played > 0 ? wins / matches_played : 0

  return {
    player,
    rank,
    total_points,
    matches_played,
    wins,
    losses,
    win_rate,
    current_streak,
    best_streak,
    favorite_partner,
    toughest_opponent,
    recent_matches,
  }
}
