import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSessionWithMatches } from './actions'
import { PublicSessionDetailClient } from './PublicSessionDetailClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { session } = await getSessionWithMatches(id)
  return {
    title: session ? `${session.name} | Aphelion League` : 'Session Details | Aphelion League',
    description: 'View match pairings, schedule, and live results for this Aphelion League session.',
  }
}

export default async function PublicSessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { session, matches } = await getSessionWithMatches(id)

  if (!session) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <PublicSessionDetailClient session={session} matches={matches} />
      </main>
    </div>
  )
}
