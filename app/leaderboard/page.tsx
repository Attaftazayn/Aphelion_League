import { getLeaderboardData } from './actions'
import { LeaderboardClient } from './LeaderboardClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

export const metadata = {
  title: 'Leaderboard | Aphelion League',
}

export default async function LeaderboardPage() {
  const { players, sessions, matches } = await getLeaderboardData()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <LeaderboardClient
          players={players}
          sessions={sessions}
          matches={matches}
        />
      </main>
    </div>
  )
}
