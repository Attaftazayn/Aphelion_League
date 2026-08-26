import { getSessions } from '../admin/sessions/actions'
import { getPlayers } from '../admin/players/actions'
import { PublicSessionsClient } from './PublicSessionsClient'

export const metadata = {
  title: 'Sessions | Aphelion League',
}

export default async function PublicSessionsPage() {
  const [sessions, players] = await Promise.all([getSessions(), getPlayers()])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <PublicSessionsClient sessions={sessions} allPlayers={players} />
      </main>
    </div>
  )
}
