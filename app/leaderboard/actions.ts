'use server'

import { createClient } from '@/lib/supabase/server'
import type { Player, MatchWithPlayers, Session } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

export async function getLeaderboardData() {
  try {
    const supabase = await createClient()

    const [{ data: playersData }, { data: sessionsData }, { data: matchesData }] = await Promise.all([
      supabase.from('players').select('*').order('name', { ascending: true }),
      supabase.from('sessions').select('*').order('date', { ascending: false }),
      supabase
        .from('matches')
        .select('*, match_players(*, players(*)), session:sessions(*)')
        .order('match_number', { ascending: true }),
    ])

    const players = (playersData ?? []) as Player[]
    const sessions = (sessionsData ?? []) as Session[]
    const matches = (matchesData ?? []) as unknown as MatchWithPlayers[]

    return {
      players,
      sessions,
      matches,
    }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getLeaderboardData exception:', err)
    return {
      players: [],
      sessions: [],
      matches: [],
    }
  }
}
