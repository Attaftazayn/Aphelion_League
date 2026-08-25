import { getLeaderboardData } from '../leaderboard/actions'
import { PlayersListClient } from './PlayersListClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

export const metadata = {
  title: 'Players | Aphelion League',
}

export default async function PlayersPage() {
  const { players, matches } = await getLeaderboardData()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <PublicHeader />
      <main className="flex-1">
        <PlayersListClient players={players} matches={matches} />
      </main>
    </div>
  )
}
