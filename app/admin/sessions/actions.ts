'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { SessionWithPlayers } from '@/lib/types'

function isDynamicServerError(err: any) {
  return err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('DYNAMIC_SERVER_USAGE')
}

function validateSessionFields(data: {
  name: string
  date: string
  start_time: string
  end_time: string
  location: string
}): string | null {
  if (!data.name || data.name.trim().length === 0) return 'Session name is required'
  if (!data.date) return 'Date is required'
  if (!data.start_time) return 'Start time is required'
  if (!data.end_time) return 'End time is required'
  if (!data.location || data.location.trim().length === 0) return 'Location is required'
  if (data.start_time >= data.end_time) return 'End time must be after start time'
  return null
}

export async function getSessions(): Promise<SessionWithPlayers[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sessions')
      .select('*, session_players(*, players(*))')
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) {
      console.warn('Supabase getSessions error:', error.message)
      return []
    }
    return (data ?? []) as unknown as SessionWithPlayers[]
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    console.warn('getSessions exception:', err)
    return []
  }
}

export async function getSessionById(id: string): Promise<SessionWithPlayers | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sessions')
      .select('*, session_players(*, players(*))')
      .eq('id', id)
      .single()

    if (error) return null
    return data as unknown as SessionWithPlayers
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return null
  }
}

export async function createSession(formData: FormData) {
  const name = formData.get('name') as string
  const date = formData.get('date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const location = formData.get('location') as string
  const playerIds = formData.getAll('player_ids') as string[]

  const validationError = validateSessionFields({ name, date, start_time, end_time, location })
  if (validationError) return { error: validationError }

  try {
    const supabase = await createClient()

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        name: name.trim(),
        date,
        start_time,
        end_time,
        location: location.trim(),
      })
      .select()
      .single()

    if (sessionError) {
      if (sessionError.message.includes('schema cache') || sessionError.message.includes('relation')) {
        return { error: 'Database table public.sessions does not exist. Please run supabase/schema.sql in your Supabase SQL Editor.' }
      }
      return { error: sessionError.message }
    }

    if (playerIds.length > 0) {
      const { error: spError } = await supabase
        .from('session_players')
        .insert(playerIds.map((player_id) => ({ session_id: session.id, player_id })))

      if (spError) return { error: spError.message }
    }

    revalidatePath('/admin/sessions')
    return { success: true, id: session.id }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to create session' }
  }
}

export async function updateSession(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const date = formData.get('date') as string
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string
  const location = formData.get('location') as string
  const playerIds = formData.getAll('player_ids') as string[]

  const validationError = validateSessionFields({ name, date, start_time, end_time, location })
  if (validationError) return { error: validationError }

  try {
    const supabase = await createClient()

    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        name: name.trim(),
        date,
        start_time,
        end_time,
        location: location.trim(),
      })
      .eq('id', id)

    if (sessionError) return { error: sessionError.message }

    const { error: deleteError } = await supabase
      .from('session_players')
      .delete()
      .eq('session_id', id)

    if (deleteError) return { error: deleteError.message }

    if (playerIds.length > 0) {
      const { error: insertError } = await supabase
        .from('session_players')
        .insert(playerIds.map((player_id) => ({ session_id: id, player_id })))

      if (insertError) return { error: insertError.message }
    }

    revalidatePath('/admin/sessions')
    revalidatePath(`/admin/sessions/${id}`)
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to update session' }
  }
}

export async function deleteSession(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/sessions')
    return { success: true }
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
    return { error: err.message || 'Failed to delete session' }
  }
}

export async function deleteSessionAndRedirect(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/sessions')
  } catch (err: any) {
    if (isDynamicServerError(err)) throw err
  }
  redirect('/admin/sessions')
}
