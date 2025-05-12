// components/GameBoard.tsx
import React from 'react';

interface GameBoardProps {
  board: (string | null)[];
  winningLine: number[] | null;
  lastMove: number | null;
  fadeIndex: number | null;
  onCellClick: (index: number) => void;
  disabled?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  winningLine, 
  lastMove, 
  fadeIndex,
  onCellClick,
  disabled = false
}) => {
  const getCellClasses = (index: number) => {
    const isFade = index === fadeIndex;
    const value = board[index];
    const animationClass = value && !isFade ? 'animate-cell-appear' : '';
    
    let classes = [
      'bg-emerald-800/40',
      'm-1.5 border border-emerald-300/20',
      'h-32 w-32', // Size
      'flex items-center justify-center', // Layout
      'text-5xl font-bold', // Text
      'rounded-xl',
      'transition-all duration-200', // Animation
      'cursor-pointer', // Interaction
      animationClass
    ];

    if (disabled) {
      classes.push('cursor-not-allowed opacity-80');
    }

    if (winningLine?.includes(index)) {
      classes.push('bg-emerald-500/60 shadow-md animate-winning-pulse');
    } else if (lastMove === index) {
      classes.push('bg-blue-50 border-blue-300');
    }

    return classes.join(' ');
  };

  const getSymbolClasses = (symbol: string | null,index:number) => {
    const isFade = index === fadeIndex;
    const value = board[index];
    const textColor = value === 'O'
    ? isFade
      ? 'text-teal-200/15'    
      : 'text-teal-300'      
    : value === 'X'
      ? isFade
        ? 'text-green-200/30'    
        : 'text-green-300'       
      : '';
    return textColor;
  };

  return (
    <div 
      className="grid grid-cols-3  bg-emerald-900/70 rounded-2xl sm:p-4"
      data-testid="game-board"
    >
      {board.map((cell, index) => (
        <div
          key={index}
          className={getCellClasses(index)}
          onClick={() => !disabled && onCellClick(index)}
          aria-label={`Cell ${index} ${cell ? `containing ${cell}` : 'empty'}`}
        >
          <span className={getSymbolClasses(cell,index)}>
            {cell}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GameBoard;