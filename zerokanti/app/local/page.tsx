'use client'

import { useSearchParams } from 'next/navigation'
import LocalGame from '@/components/LocalGame'
import { Suspense } from 'react'

function GameWithParams() {
  const searchParams = useSearchParams()

  const player1 = searchParams?.get('player1') || 'Player 1'
  const player2 = searchParams?.get('player2') || 'Player 2'

  return (
    <LocalGame 
      player1={player1} 
      player1Symbol='X' 
      player2={player2} 
      player2Symbol='O'
    />
  )
}

export default function LocalGameWithSuspense() {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GameWithParams />
    </Suspense>
  )
}
