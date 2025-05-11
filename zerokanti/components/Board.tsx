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
    let classes = [
      'h-24 w-24', // Size
      'flex items-center justify-center', // Layout
      'text-4xl font-bold', // Text
      'border-2 rounded-lg', // Border
      'transition-all duration-200', // Animation
      'cursor-pointer' // Interaction
    ];

    if (disabled) {
      classes.push('cursor-not-allowed opacity-80');
    }

    if (winningLine?.includes(index)) {
      classes.push('bg-green-100 border-green-500 shadow-md');
    } else if (lastMove === index) {
      classes.push('bg-blue-50 border-blue-300');
    } else {
      classes.push('border-gray-300 hover:bg-gray-50');
    }

    return classes.join(' ');
  };

  const getSymbolClasses = (symbol: string | null,index:number) => {
    if (!symbol) return '';
    if(index==fadeIndex) return symbol === 'X' ? 'text-red-300' : 'text-blue-300';
    return symbol === 'X' ? 'text-red-500' : 'text-blue-500';
  };

  return (
    <div 
      className="grid grid-cols-3 gap-2 my-6"
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