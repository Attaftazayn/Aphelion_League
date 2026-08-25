import { notFound } from 'next/navigation'
import { getLeaderboardData } from '../../leaderboard/actions'
import { getChampionsData } from '../../champions/actions'
import { computePlayerProfileDetails } from '@/lib/player-stats'
import { PlayerProfileClient } from './PlayerProfileClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const { players } = await getLeaderboardData()
  const p = players.find((x) => x.id === id)
  return {
    title: p ? `${p.name} | Profil Pemain` : 'Profil Pemain | Aphelion League',
  }
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params
  const [{ players, matches }, { confirmedChampions }] = await Promise.all([
    getLeaderboardData(),
    getChampionsData(),
  ])

  const profileDetails = computePlayerProfileDetails(id, players, matches, confirmedChampions)

  if (!profileDetails) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <PlayerProfileClient profile={profileDetails} />
      </main>
    </div>
  )
}
