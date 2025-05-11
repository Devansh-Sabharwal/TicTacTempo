"use client"
import React, {useEffect, useRef, useState } from 'react'

export default function GamePreview() {
  return (
    <div>
      <Board/>
    </div>
  )
}


function Cell({ index,board,fadeIndex,winningLine }: { index: number,board:any[],fadeIndex:number,winningLine:number[]|null }) {
  const value = board[index];
  const isFade = index === fadeIndex;
  const isWinning = winningLine?.includes(index);
  const winningClass = isWinning ? 'animate-winning-pulse' : '';
  const animationClass = value && !isFade ? 'animate-cell-appear' : '';
  const textColor = value === 'O'
    ? isFade
      ? 'text-teal-200/15'    
      : 'text-teal-300'      
    : value === 'X'
      ? isFade
        ? 'text-green-200/30'    
        : 'text-green-300'       
      : '';
    return <div className={`${isWinning? 'bg-emerald-500/60' : 'bg-emerald-800/40'} sm:p-10 rounded-xl text-6xl m-1.5 border border-emerald-300/20 w-20 h-20 sm:w-32 sm:h-32 flex justify-center items-center ${winningClass}`}>
        <div className={`flex ${textColor} items-center justify-center text-3xl sm:text-5xl font-bold ${animationClass}`}>
        {value || '\u00A0'}
        </div>
    </div>
}
function Board(){
const [winningLine,setWinningLine] = useState<number[] | null>(null);
const fadeRef = useRef<number>(10);
const [board,setBoard] = useState(Array(9).fill(null));
const [isResetting, setIsResetting] = useState(false);

const [step,setStep] = useState(0)
useEffect(()=>{
  if (isResetting) return;
  const sequence = [
    { index: 4, value: 'X' },
    { index: 0, value: 'O' },
    { index: 8, value: 'X' },
    { index: 6, value: 'O' },
    { index: 3, value: 'X' },
    { index: 5, value: 'O' },
    { index: 7, value: 'X' },
    { index: 4, value: 'O' },
    { index: 0, value: 'X' },
    { index: 8, value: 'O' },
    { index: 2, value: 'X' },
    { index: 6, value: 'O' },
    { index: 1, value: 'X' },
  ];
  const fadeSequence = [
    10,10,10,10,10,4,0,8,6,3,5,7
  ]
  const timer = setTimeout(()=>{
    if(step<sequence.length){
      const newBoard = [...board];
      newBoard[sequence[step].index] = sequence[step].value;
      if(fadeRef.current!=10) newBoard[fadeRef.current] = null;
      
      fadeRef.current = fadeSequence[step];
      setBoard(newBoard); 
      if (step === sequence.length - 1) {
        setWinningLine([0, 1, 2]);
        setIsResetting(true); 
        setTimeout(() => {
          setBoard(Array(9).fill(null));
          setWinningLine(null);
          setStep(0);
          fadeRef.current = 10;
          setIsResetting(false);
        }, 3000);
      } else {
        setStep(step + 1);
      }
    }
  },3000)
  return () => clearTimeout(timer);
}, [step, board,isResetting]);
 
    return<div className=' bg-emerald-900/70 p-2 rounded-2xl w-[300px] sm:w-[500px] lg:w-full'>
          <div className='grid grid-cols-3 rounded-2xl sm:p-4'>
            {board.map((e, index) => (
                <Cell key={index} index={index} board={board} fadeIndex={fadeRef.current} winningLine={winningLine} />
            ))}
          </div>
          <div className="my-2 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span className="ml-2 text-green-300">Player X</span>
            </div>
            <div className="font-bold text-emerald-300">vs</div>
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-teal-500"></div>
              <span className="ml-2 text-teal-300">Player O</span>
            </div>
          </div>
    </div>
}
