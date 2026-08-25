import { notFound } from 'next/navigation'
import { getSessionById } from '../actions'
import { getMatchesForSession } from './actions'
import { getPlayers } from '../../players/actions'
import { SessionDetailClient } from './SessionDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const session = await getSessionById(id)
  return {
    title: session ? `${session.name} | Aphelion League` : 'Session | Aphelion League',
  }
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params
  const [session, matches, allPlayers] = await Promise.all([
    getSessionById(id),
    getMatchesForSession(id),
    getPlayers(),
  ])

  if (!session) {
    notFound()
  }

  return (
    <SessionDetailClient
      session={session}
      matches={matches}
      allPlayers={allPlayers}
    />
  )
}
