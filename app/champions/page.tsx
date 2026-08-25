import { getChampionsData } from './actions'
import { ChampionsClient } from './ChampionsClient'
import { PublicHeader } from '@/components/navigation/PublicNavbar'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Monthly Champions | Aphelion League',
}

export default async function ChampionsPage() {
  const { confirmedChampions, players, matches, availableMonths } = await getChampionsData()

  // Check if current user is admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-primary)' }}>
      <PublicHeader />
      <main className="flex-1">
        <ChampionsClient
          confirmedChampions={confirmedChampions}
          players={players}
          matches={matches}
          availableMonths={availableMonths}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  )
}
