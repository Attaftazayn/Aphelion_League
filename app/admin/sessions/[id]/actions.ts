'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { MatchWithPlayers, Player } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

export async function getMatchesForSession(sessionId: string): Promise<MatchWithPlayers[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('matches')
      .select('*, match_players(*, players(*))')
      .eq('session_id', sessionId)
      .order('match_number', { ascending: true })

    if (error) {
      console.warn('Supabase getMatchesForSession error:', error.message)
      return []
    }
    return (data ?? []) as unknown as MatchWithPlayers[]
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getMatchesForSession exception:', err)
    return []
  }
}

export async function createMatch(sessionId: string, formData: FormData) {
  const teamA = formData.getAll('team_a') as string[]
  const teamB = formData.getAll('team_b') as string[]

  if (teamA.length !== 2) return { error: 'Team A must have exactly 2 players' }
  if (teamB.length !== 2) return { error: 'Team B must have exactly 2 players' }

  const allIds = [...teamA, ...teamB]
  const uniqueIds = new Set(allIds)
  if (uniqueIds.size !== 4) return { error: 'Each player can only appear once per match' }

  try {
    const supabase = await createClient()

    const { count } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)

    const matchNumber = (count ?? 0) + 1

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        session_id: sessionId,
        match_number: matchNumber,
        status: 'upcoming',
      })
      .select()
      .single()

    if (matchError) {
      if (matchError.message.includes('schema cache') || matchError.message.includes('relation')) {
        return { error: 'Database table public.matches does not exist. Please run supabase/schema.sql in your Supabase SQL Editor.' }
      }
      return { error: matchError.message }
    }

    const matchPlayers = [
      ...teamA.map((player_id) => ({ match_id: match.id, player_id, team: 'A' })),
      ...teamB.map((player_id) => ({ match_id: match.id, player_id, team: 'B' })),
    ]

    const { error: mpError } = await supabase.from('match_players').insert(matchPlayers)
    if (mpError) return { error: mpError.message }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to create match' }
  }
}

export async function updateMatch(matchId: string, sessionId: string, formData: FormData) {
  const teamA = formData.getAll('team_a') as string[]
  const teamB = formData.getAll('team_b') as string[]
  const status = formData.get('status') as string

  if (teamA.length !== 2) return { error: 'Team A must have exactly 2 players' }
  if (teamB.length !== 2) return { error: 'Team B must have exactly 2 players' }

  const allIds = [...teamA, ...teamB]
  const uniqueIds = new Set(allIds)
  if (uniqueIds.size !== 4) return { error: 'Each player can only appear once per match' }

  if (!['upcoming', 'completed'].includes(status)) {
    return { error: 'Invalid status' }
  }

  try {
    const supabase = await createClient()

    const { error: matchError } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId)

    if (matchError) return { error: matchError.message }

    const { error: deleteError } = await supabase
      .from('match_players')
      .delete()
      .eq('match_id', matchId)

    if (deleteError) return { error: deleteError.message }

    const matchPlayers = [
      ...teamA.map((player_id) => ({ match_id: matchId, player_id, team: 'A' })),
      ...teamB.map((player_id) => ({ match_id: matchId, player_id, team: 'B' })),
    ]

    const { error: mpError } = await supabase.from('match_players').insert(matchPlayers)
    if (mpError) return { error: mpError.message }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to update match' }
  }
}

export async function saveMatchScore(
  matchId: string,
  sessionId: string,
  scoreA: number,
  scoreB: number
) {
  if (isNaN(scoreA) || scoreA < 0) return { error: 'Team A score must be a non-negative number' }
  if (isNaN(scoreB) || scoreB < 0) return { error: 'Team B score must be a non-negative number' }
  if (scoreA === scoreB) return { error: 'Tied scores are not allowed. One team must win.' }

  try {
    const supabase = await createClient()

    const { data: match, error: fetchErr } = await supabase
      .from('matches')
      .select('*, match_players(*)')
      .eq('id', matchId)
      .single()

    if (fetchErr || !match) return { error: 'Match not found' }
    if (!match.match_players || match.match_players.length !== 4) {
      return { error: 'Match must contain exactly 4 players (2 per team) before setting score' }
    }

    const { error: updateErr } = await supabase
      .from('matches')
      .update({
        score_a: scoreA,
        score_b: scoreB,
        status: 'completed',
      })
      .eq('id', matchId)

    if (updateErr) return { error: updateErr.message }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to save score' }
  }
}

export async function resetMatchScore(matchId: string, sessionId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('matches')
      .update({
        score_a: null,
        score_b: null,
        status: 'upcoming',
      })
      .eq('id', matchId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to reset score' }
  }
}

export async function deleteMatch(matchId: string, sessionId: string) {
  try {
    const supabase = await createClient()

    const { data: matchToDelete } = await supabase
      .from('matches')
      .select('match_number')
      .eq('id', matchId)
      .single()

    const { error } = await supabase.from('matches').delete().eq('id', matchId)
    if (error) return { error: error.message }

    if (matchToDelete) {
      const { data: remaining } = await supabase
        .from('matches')
        .select('id, match_number')
        .eq('session_id', sessionId)
        .gt('match_number', matchToDelete.match_number)
        .order('match_number', { ascending: true })

      if (remaining && remaining.length > 0) {
        await Promise.all(
          remaining.map((m) =>
            supabase
              .from('matches')
              .update({ match_number: m.match_number - 1 })
              .eq('id', m.id)
          )
        )
      }
    }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to delete match' }
  }
}

export async function updateMatchStatus(
  matchId: string,
  sessionId: string,
  status: 'upcoming' | 'completed'
) {
  try {
    const supabase = await createClient()

    const updateData: Record<string, any> = { status }
    if (status === 'upcoming') {
      updateData.score_a = null
      updateData.score_b = null
    }

    const { error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId)

    if (error) return { error: error.message }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to update match status' }
  }
}

export async function generateAutoPairingsAction(sessionId: string) {
  try {
    const supabase = await createClient()

    const { data: sessionData, error: sErr } = await supabase
      .from('sessions')
      .select('*, session_players(*, players(*))')
      .eq('id', sessionId)
      .single()

    if (sErr || !sessionData) return { error: 'Session not found' }

    const participants: Player[] = sessionData.session_players
      ?.map((sp: any) => sp.players)
      ?.filter(Boolean) ?? []

    if (participants.length < 4) {
      return { error: 'At least 4 participants are required to auto-generate pairings.' }
    }

    const { generateSessionPairings } = await import('@/lib/pairing')
    const pairings = generateSessionPairings(participants)

    const { count } = await supabase
      .from('matches')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)

    let currentMatchNumber = count ?? 0

    for (const p of pairings) {
      currentMatchNumber += 1

      const { data: match, error: mErr } = await supabase
        .from('matches')
        .insert({
          session_id: sessionId,
          match_number: currentMatchNumber,
          status: 'upcoming',
        })
        .select()
        .single()

      if (mErr) return { error: mErr.message }

      const matchPlayers = [
        ...p.teamA.map((player) => ({ match_id: match.id, player_id: player.id, team: 'A' })),
        ...p.teamB.map((player) => ({ match_id: match.id, player_id: player.id, team: 'B' })),
      ]

      const { error: mpErr } = await supabase.from('match_players').insert(matchPlayers)
      if (mpErr) return { error: mpErr.message }
    }

    revalidatePath(`/admin/sessions/${sessionId}`)
    revalidatePath('/leaderboard')
    return { success: true, generatedCount: pairings.length }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to auto-generate pairings' }
  }
}
