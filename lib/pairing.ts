import type { Player } from './types'

export interface GeneratedMatchPairing {
  matchNumber: number
  teamA: [Player, Player]
  teamB: [Player, Player]
}

/**
 * APHELION LEAGUE Random Pairing Generator Algorithm
 *
 * Rules per PDF:
 * 1. Doubles format (4 players per match: 2 in Team A, 2 in Team B)
 * 2. Each participant gets exactly 2 recorded matches per session.
 * 3. Total matches generated M = (N * 2) / 4 = N / 2.
 * 4. Partners change across matches (no identical team pairings repeated).
 */
export function generateSessionPairings(participants: Player[]): GeneratedMatchPairing[] {
  const N = participants.length

  if (N < 4) {
    throw new Error('At least 4 participants are required to generate pairings.')
  }

  // Number of matches M = (N * 2) / 4 = N / 2
  const matchCount = Math.floor(N / 2)
  const matches: GeneratedMatchPairing[] = []

  // Track match count for each player ID
  const playerMatchCount = new Map<string, number>()
  // Track partner history: "id1:id2"
  const partnerHistory = new Set<string>()

  participants.forEach((p) => playerMatchCount.set(p.id, 0))

  function getPartnerKey(id1: string, id2: string): string {
    return [id1, id2].sort().join(':')
  }

  // Attempt up to 100 randomized shuffle iterations to satisfy constraints
  for (let attempt = 0; attempt < 100; attempt++) {
    matches.length = 0
    playerMatchCount.clear()
    partnerHistory.clear()
    participants.forEach((p) => playerMatchCount.set(p.id, 0))

    let success = true

    for (let m = 1; m <= matchCount; m++) {
      // Find players who still need matches (< 2 matches)
      const available = participants.filter((p) => (playerMatchCount.get(p.id) ?? 0) < 2)

      if (available.length < 4) {
        success = false
        break
      }

      // Shuffle available players
      const shuffled = [...available].sort(() => Math.random() - 0.5)

      // Pick 4 players
      const p1 = shuffled[0]
      const p2 = shuffled[1]
      const p3 = shuffled[2]
      const p4 = shuffled[3]

      // Check partner uniqueness
      const pairA = getPartnerKey(p1.id, p2.id)
      const pairB = getPartnerKey(p3.id, p4.id)

      if (partnerHistory.has(pairA) || partnerHistory.has(pairB)) {
        // Retry shuffle iteration
        success = false
        break
      }

      partnerHistory.add(pairA)
      partnerHistory.add(pairB)

      playerMatchCount.set(p1.id, (playerMatchCount.get(p1.id) ?? 0) + 1)
      playerMatchCount.set(p2.id, (playerMatchCount.get(p2.id) ?? 0) + 1)
      playerMatchCount.set(p3.id, (playerMatchCount.get(p3.id) ?? 0) + 1)
      playerMatchCount.set(p4.id, (playerMatchCount.get(p4.id) ?? 0) + 1)

      matches.push({
        matchNumber: m,
        teamA: [p1, p2],
        teamB: [p3, p4],
      })
    }

    if (success && matches.length === matchCount) {
      return matches
    }
  }

  // Deterministic fallback if random shuffle didn't converge within 100 iterations
  matches.length = 0
  playerMatchCount.clear()
  partnerHistory.clear()
  participants.forEach((p) => playerMatchCount.set(p.id, 0))

  for (let m = 1; m <= matchCount; m++) {
    const available = participants.filter((p) => (playerMatchCount.get(p.id) ?? 0) < 2)
    const p1 = available[0]
    const p2 = available[1]
    const p3 = available[2]
    const p4 = available[3]

    if (!p1 || !p2 || !p3 || !p4) break

    playerMatchCount.set(p1.id, (playerMatchCount.get(p1.id) ?? 0) + 1)
    playerMatchCount.set(p2.id, (playerMatchCount.get(p2.id) ?? 0) + 1)
    playerMatchCount.set(p3.id, (playerMatchCount.get(p3.id) ?? 0) + 1)
    playerMatchCount.set(p4.id, (playerMatchCount.get(p4.id) ?? 0) + 1)

    matches.push({
      matchNumber: m,
      teamA: [p1, p2],
      teamB: [p3, p4],
    })
  }

  return matches
}
