import { getLeaderboardData } from './leaderboard/actions'
import { getChampionsData } from './champions/actions'
import { HomeDashboardClient } from './HomeDashboardClient'

export const metadata = {
  title: 'Aphelion League | Home',
}

export default async function HomePage() {
  const [{ players, sessions, matches }, { confirmedChampions }] = await Promise.all([
    getLeaderboardData(),
    getChampionsData(),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HomeDashboardClient
          players={players}
          sessions={sessions}
          matches={matches}
          confirmedChampions={confirmedChampions}
        />
      </main>
    </div>
  )
}
