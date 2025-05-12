import TicTacToeGame from '@/game/tictac'
import React from 'react'

export default function Form() {
  return (
    <div className='min-h-screen min-w-screen bg-gradient-to-b from-emerald-950 via-green-1000 to-emerald-950
    flex justify-center items-center'>
      <div className='p-4 rounded-2xl'>
            <TicTacToeGame/>
      </div>
    </div>
  )
}
