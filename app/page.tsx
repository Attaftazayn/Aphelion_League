import { getLeaderboardData } from './leaderboard/actions'
import { getChampionsData } from './champions/actions'
import { HomeDashboardClient } from './HomeDashboardClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

export const metadata = {
  title: 'Aphelion League | Home',
}

export default async function HomePage() {
  const [{ players, sessions, matches }, { confirmedChampions }] = await Promise.all([
    getLeaderboardData(),
    getChampionsData(),
  ])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <PublicHeader />
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
