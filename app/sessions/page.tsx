import { getSessions } from '../admin/sessions/actions'
import { getPlayers } from '../admin/players/actions'
import { PublicSessionsClient } from './PublicSessionsClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

export const metadata = {
  title: 'Sessions | Aphelion League',
}

export default async function PublicSessionsPage() {
  const [sessions, players] = await Promise.all([getSessions(), getPlayers()])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <PublicHeader />
      <main className="flex-1">
        <PublicSessionsClient sessions={sessions} allPlayers={players} />
      </main>
    </div>
  )
}
