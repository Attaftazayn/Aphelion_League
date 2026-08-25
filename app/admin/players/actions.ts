'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Player } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 80) return 'Name must be 80 characters or fewer'
  return null
}

export async function getPlayers(): Promise<Player[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Supabase getPlayers error:', error.message)
      return []
    }
    return data ?? []
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getPlayers exception:', err)
    return []
  }
}

export async function createPlayer(formData: FormData) {
  const name = formData.get('name') as string
  const avatar_url = (formData.get('avatar_url') as string) || null

  const nameError = validateName(name)
  if (nameError) return { error: nameError }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('players')
      .insert({ name: name.trim(), avatar_url: avatar_url || null })

    if (error) {
      if (error.message.includes('schema cache') || error.message.includes('relation')) {
        return { error: 'Database table public.players does not exist. Please run supabase/schema.sql in your Supabase SQL Editor.' }
      }
      return { error: error.message }
    }

    revalidatePath('/admin/players')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to connect to database' }
  }
}

export async function updatePlayer(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const avatar_url = (formData.get('avatar_url') as string) || null

  const nameError = validateName(name)
  if (nameError) return { error: nameError }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('players')
      .update({ name: name.trim(), avatar_url: avatar_url || null })
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/players')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to update player' }
  }
}

export async function deletePlayer(id: string) {
  try {
    const supabase = await createClient()

    // Check if player is in any match
    const { count } = await supabase
      .from('match_players')
      .select('id', { count: 'exact', head: true })
      .eq('player_id', id)

    if (count && count > 0) {
      return {
        error:
          'Cannot delete this player because they appear in one or more matches. Remove them from matches first.',
      }
    }

    const { error } = await supabase.from('players').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/players')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to delete player' }
  }
}
