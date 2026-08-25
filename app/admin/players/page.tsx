import { getPlayers } from './actions'
import { PlayersClient } from './PlayersClient'

export const metadata = {
  title: 'Players | Aphelion League',
}

export default async function PlayersPage() {
  const players = await getPlayers()
  return <PlayersClient players={players} />
}
