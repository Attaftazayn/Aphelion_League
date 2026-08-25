import { getSessions } from './actions'
import { getPlayers } from '../players/actions'
import { SessionsClient } from './SessionsClient'

export const metadata = {
  title: 'Sessions | Aphelion League',
}

export default async function SessionsPage() {
  const [sessions, players] = await Promise.all([getSessions(), getPlayers()])
  return <SessionsClient sessions={sessions} allPlayers={players} />
}
