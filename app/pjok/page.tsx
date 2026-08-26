'use client'

import TreasureMap from '@/components/pjok/TreasureMap'
import AiMascot from '@/components/pjok/AiMascot'

export default function PjokPage() {
  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <TreasureMap />
      <AiMascot />
    </main>
  )
}
