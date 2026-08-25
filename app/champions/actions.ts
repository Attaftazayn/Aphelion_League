'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { MonthlyChampion, Player, MatchWithPlayers, Session } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

export async function getChampionsData() {
  try {
    const supabase = await createClient()

    const [{ data: championsData }, { data: playersData }, { data: sessionsData }, { data: matchesData }] =
      await Promise.all([
        supabase.from('monthly_champions').select('*, player:players(*)').order('month_key', { ascending: false }),
        supabase.from('players').select('*').order('name', { ascending: true }),
        supabase.from('sessions').select('*').order('date', { ascending: false }),
        supabase
          .from('matches')
          .select('*, match_players(*, players(*)), session:sessions(*)')
          .eq('status', 'completed')
          .not('score_a', 'is', null)
          .not('score_b', 'is', null),
      ])

    const confirmedChampions = (championsData ?? []) as MonthlyChampion[]
    const players = (playersData ?? []) as Player[]
    const sessions = (sessionsData ?? []) as Session[]
    const matches = (matchesData ?? []) as unknown as MatchWithPlayers[]

    const monthsSet = new Set<string>()
    sessions.forEach((s) => {
      if (s.date) monthsSet.add(s.date.slice(0, 7))
    })
    const availableMonths = Array.from(monthsSet).sort().reverse()

    return {
      confirmedChampions,
      players,
      sessions,
      matches,
      availableMonths,
    }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getChampionsData exception:', err)
    return {
      confirmedChampions: [],
      players: [],
      sessions: [],
      matches: [],
      availableMonths: [],
    }
  }
}

export async function confirmChampion(
  monthKey: string,
  playerId: string,
  totalPoints: number,
  wins: number,
  winRate: number
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized: Admin login required' }
    }

    const { error } = await supabase.from('monthly_champions').upsert(
      {
        month_key: monthKey,
        player_id: playerId,
        total_points: totalPoints,
        wins: wins,
        win_rate: winRate,
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: 'month_key' }
    )

    if (error) {
      if (error.message.includes('schema cache') || error.message.includes('relation')) {
        return { error: 'Table public.monthly_champions missing. Please run supabase/schema.sql in Supabase SQL Editor.' }
      }
      return { error: error.message }
    }

    revalidatePath('/champions')
    revalidatePath('/admin/champions')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to confirm champion' }
  }
}

export async function deleteChampion(id: string) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Unauthorized: Admin login required' }
    }

    const { error } = await supabase
      .from('monthly_champions')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/champions')
    revalidatePath('/admin/champions')
    revalidatePath('/')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to delete champion' }
  }
}
