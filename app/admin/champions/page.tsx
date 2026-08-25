import type { Metadata } from 'next'
import { getChampionsData } from '@/app/champions/actions'
import { AdminChampionsClient } from './AdminChampionsClient'

export const metadata: Metadata = {
  title: 'Manage Champions | Aphelion League Admin',
  description: 'Confirm and publish monthly champions into the Hall of Fame.',
}

export default async function AdminChampionsPage() {
  const { confirmedChampions, players, matches, availableMonths } = await getChampionsData()

  return (
    <AdminChampionsClient
      confirmedChampions={confirmedChampions}
      players={players}
      matches={matches}
      availableMonths={availableMonths}
    />
  )
}
