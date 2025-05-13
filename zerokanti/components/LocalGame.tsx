import React, { useState } from 'react'
import GameBoard from './Board'
interface LocalGameProps{
    player1:string,
    player2:string,
    player1Symbol:string,
    player2Symbol:string,
}
export default function LocalGame(props:LocalGameProps){
    const [lastTurn,setLastTurn] = useState(1);
    const[turn,setTurn] = useState(1);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [lastMove, setLastMove] = useState<number | null>(null);
    const [fadeIndex, setFadeIndex] = useState<number | null>(null);
    const [moveSequence,setMoveSequence] = useState<number[]>([]);
    const [winner,setWinner] = useState<string|null>(null);
    const [gameOver, setGameOver] = useState(false);

    const makeMove = (index: number) => {
        if (gameOver || board[index] !== null) return;
      
        const currentSymbol = turn === 0 ? props.player2Symbol : props.player1Symbol;
        const newBoard = [...board];
        newBoard[index] = currentSymbol;
        if(fadeIndex!=null) newBoard[fadeIndex] = null;
        console.log(fadeIndex,newBoard);
        let updatedSequence = [...moveSequence, index];
        let newFadeIndex: number | null = null;
      
        if (updatedSequence.length > 5) {
            newFadeIndex = updatedSequence[0];
            updatedSequence = updatedSequence.slice(1);
        }
        
        setBoard(newBoard);
        setMoveSequence(updatedSequence);
        setFadeIndex(newFadeIndex);
        setTurn(turn === 0 ? 1 : 0);
      
        const result = checkResult(newBoard);
        if (result) {
          setWinningLine(result.line);
          setWinner(result.winner);
          setGameOver(true);
        }
      };
      
    const handleCellClick = async (index: number) => {
        if (board[index] !== null || gameOver) return;
          makeMove(index);
      };
    function checkResult(board:(string|null)[]) {
        const winPatterns = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
          [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        // Check for winner
        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: pattern };
          }
        }
      }
      const handleRestart = ()=>{
        if(lastTurn==0){
            setTurn(1);
            setLastTurn(1);
        }else{
            setTurn(0);
            setLastTurn(0);
        }
        setBoard(Array(9).fill(null))
        setFadeIndex(null);
        setMoveSequence([]);
        setGameOver(false);
        setWinningLine(null);
        setLastMove(null);
      }
  return (
    <div className='p-5 sm:p-10 bg-gradient-to-b from-emerald-950 via-green-1000 to-emerald-950'>
      <GameStatus 
            player1={props.player1} 
            player1Symbol={props.player1Symbol}
            player2={props.player2}
            player2Symbol={props.player2Symbol}
            turn={turn}
            winner={winner}
            onRestart={handleRestart}
            />

        {/* Play Again Button */}
      <GameBoard
        board={board}
        winningLine={winningLine}
        lastMove={lastMove}
        fadeIndex={fadeIndex}
        onCellClick={handleCellClick}
        />
  
    </div>
  )
}


import { Trophy, User, Clock, Circle, X, RefreshCw } from "lucide-react";

interface GameStatusProps {
  player1: string;
  player2: string;
  player1Symbol: string;
  player2Symbol: string;
  turn: number;
  winner: string | null;
  onRestart?: () => void;
}

export function GameStatus({
  player1,
  player2,
  player1Symbol,
  player2Symbol,
  turn,
  winner,
  onRestart
}: GameStatusProps) {
  const isGameOver = winner === 'O' || winner === 'X';
  const currentPlayer = turn === 1 ? player1 : player2;
  
  const getStatusMessage = () => {
    if (isGameOver) {
      return winner === player1Symbol 
        ? `${player1} Wins!` 
        : `${player2} Wins!`;
    }
    return `Turn: ${currentPlayer}`;
  };

  const getStatusIcon = () => {
    if (isGameOver) {
      return <Trophy className="h-5 w-5 text-amber-400" />;
    }
    return <Clock className="h-5 w-5 text-emerald-400" />;
  };

  const getStatusColor = () => {
    if (isGameOver) {
      return 'bg-emerald-500/10 text-emerald-300';
    }
    return 'bg-emerald-900/50 text-emerald-200';
  };

  return (
    <div className={`
      m-3
      w-full
      lg:w-72
      lg:fixed
      lg:left-2
      lg:top-2
      lg:bottom-auto
      lg:p-4
      lg:space-y-4
      bg-emerald-950/30
      lg:h-auto
      lg:rounded-2xl
      border border-emerald-800/50
      flex
      flex-col
      lg:flex-col
      lg:items-start
      items-center
      justify-between
      lg:justify-start
      px-4 py-2
      lg:py-6
      z-10
    `}>
      {/* Header */}
      <h2 className="text-xl font-bold text-emerald-300 mb-4 text-center flex items-center justify-center gap-2">
        <Circle className="h-5 w-5 text-emerald-400 fill-emerald-400/30" strokeWidth={2} /> 
        Game Status
      </h2>

      {/* Player info section in a card */}
      <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-4 w-full mb-3">
        <div className="space-y-3">
          {/* Player 1 */}
          <div className={`
            flex justify-between items-center p-2 rounded-lg 
            ${turn === 1 && !isGameOver ? 'bg-emerald-900/50' : ''} 
            transition-colors
            w-full
          `}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-300" strokeWidth={1.5} />
              <span className="font-medium text-emerald-100">{player1}</span>
            </div>
            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-emerald-800/80">
              {player1Symbol === 'X' ? (
                <X className="h-5 w-5 text-emerald-300" strokeWidth={2.5} />
              ) : (
                <Circle className="h-4 w-4 text-emerald-300" strokeWidth={2.5} />
              )}
            </div>
          </div>

          {/* Player 2 */}
          <div className={`
            flex justify-between items-center p-2 rounded-lg 
            ${turn === 0 && !isGameOver ? 'bg-emerald-900/50' : ''} 
            transition-colors
            w-full
          `}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-300" strokeWidth={1.5} />
              <span className="font-medium text-emerald-100">{player2}</span>
            </div>
            <div className="h-7 w-7 flex items-center justify-center rounded-full bg-emerald-800/80">
              {player2Symbol === 'X' ? (
                <X className="h-5 w-5 text-emerald-300" strokeWidth={2.5} />
              ) : (
                <Circle className="h-4 w-4 text-emerald-300" strokeWidth={2.5} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game status message */}
      <div className={`flex items-center justify-center gap-2 p-3 rounded-lg w-full ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-medium text-sm">{getStatusMessage()}</span>
      </div>
      
      {/* Restart button */}
      <button 
        onClick={onRestart}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 
                 bg-emerald-800/70 hover:bg-emerald-700/70 
                 border border-emerald-600/50 hover:border-emerald-500/50
                 rounded-lg transition-all duration-300 text-emerald-200 
                 hover:text-emerald-100 font-medium shadow-lg 
                 hover:shadow-emerald-900/20 group"
      >
        <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
        Restart Game
      </button>
    </div>
  );
}