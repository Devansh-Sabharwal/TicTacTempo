"use client"
import TicTacToeGame from '@/game/tictac'
import React, { useState } from 'react'
import { Users } from 'lucide-react';
import LocalGame from './LocalGame';

export default function Form() {
  return (<div className='min-h-screen bg-gradient-to-b from-emerald-950 via-green-1000 to-emerald-950'>
    
      <TicTacToeGame/>
        
      </div>
  )
}





export function LocalGameMode(){
  const [player1Name,setPlayer1Name] = useState('');
  const [player2Name,setPlayer2Name] = useState('');
  const [start,setStart] = useState(false);
  const canStartGame = player1Name.trim() !== '' && player2Name.trim() !== '';

  return !start ? (
    <div className="relative w-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl" />
      <div className="relative bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-green-500/50" />
          <h3 className="text-green-500/50 font-medium text-lg">Local Game Mode</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="player1Name" className="block text-green-200 text-sm font-medium mb-2">
              Player 1 Name
            </label>
            <input
              id="player1Name"
              type="text"
              onChange={(e)=>{
                setPlayer1Name(e.target.value)
              }}
              placeholder="Enter Player 1 Name"
              className={`
                w-full  bg-emerald-950/50 border rounded-lg px-4 py-3
                text-white placeholder-emerald-500
                transition-all duration-200
              `}
              aria-label="Player 1 Name"
            />
          </div>

          <div>
            <label htmlFor="player2Name" className="block text-green-200 text-sm font-medium mb-2">
              Player 2 Name
            </label>
            <input
              id="player2Name"
              type="text"
              value={player2Name}
              onChange={(e)=>{
                setPlayer2Name(e.target.value);
              }}
              placeholder="Enter Player 2 Name"
              className={`
                w-full  bg-emerald-950/50 border rounded-lg px-4 py-3
                text-white placeholder-emerald-500
                transition-all duration-200
              `}
              aria-label="Player 2 Name"
            />
          </div>

          <button
            onClick={()=>{setStart(true);
            }}
            disabled={!canStartGame}
            className={`
              w-full py-4 px-6 rounded-xl
              transition-all duration-300 transform
              flex items-center justify-center gap-3
              font-semibold text-lg mt-6
              ${canStartGame ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover':'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
            `}
          >Start Game
          </button>
        </div>
      </div>
    </div>
  ):(
    <div>
      <LocalGame player1={player1Name} player1Symbol='X' player2={player2Name} player2Symbol='O'/>
    </div>
  )
};

