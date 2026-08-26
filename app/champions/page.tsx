import { getChampionsData } from './actions'
import { ChampionsClient } from './ChampionsClient'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Monthly Champions | Aphelion League',
}

export default async function ChampionsPage() {
  const { confirmedChampions, players, matches, availableMonths } = await getChampionsData()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ChampionsClient
          confirmedChampions={confirmedChampions}
          players={players}
          matches={matches}
          availableMonths={availableMonths}
        />
      </main>
    </div>
  )
}
