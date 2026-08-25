import { createClient } from '@/lib/supabase/server'
import type { SessionWithPlayers, MatchWithPlayers } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

export async function getSessionWithMatches(sessionId: string): Promise<{
  session: SessionWithPlayers | null
  matches: MatchWithPlayers[]
}> {
  try {
    const supabase = await createClient()

    const { data: session, error: sErr } = await supabase
      .from('sessions')
      .select('*, session_players(*, players(*))')
      .eq('id', sessionId)
      .single()

    if (sErr || !session) {
      return { session: null, matches: [] }
    }

    const { data: matches, error: mErr } = await supabase
      .from('matches')
      .select('*, match_players(*, players(*))')
      .eq('session_id', sessionId)
      .order('match_number', { ascending: true })

    return {
      session: session as unknown as SessionWithPlayers,
      matches: mErr ? [] : ((matches ?? []) as unknown as MatchWithPlayers[]),
    }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getSessionWithMatches exception:', err)
    return { session: null, matches: [] }
  }
}
