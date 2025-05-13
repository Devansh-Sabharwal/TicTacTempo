'use client';
import LocalGame from '@/components/LocalGame';
import { useSearchParams } from 'next/navigation';

export default function LocalGamePage() {
  const searchParams = useSearchParams();
  const player1 = searchParams.get('player1') || 'player1';
  const player2 = searchParams.get('player2') || 'player2';
  

  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-950 via-green-1000 to-emerald-950'>
      <LocalGame player1={player1} player1Symbol='X' player2={player2} player2Symbol='O'/>
    </div>
  );
}
