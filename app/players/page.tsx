import { getLeaderboardData } from '../leaderboard/actions'
import { PlayersListClient } from './PlayersListClient'

export const metadata = {
  title: 'Players | Aphelion League',
}

export default async function PlayersPage() {
  const { players, matches } = await getLeaderboardData()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <PlayersListClient players={players} matches={matches} />
      </main>
    </div>
  )
}
