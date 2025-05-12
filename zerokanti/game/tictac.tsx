// components/TicTacToeGame.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Game from './game';
import Board from '@/components/Board';
import GameControls from '@/components/GameControls';
import GameStatus from '@/components/GameStatus';
import ErrorMessage from '@/components/ErrorMessage';

export default function TicTacToeGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [connected, setConnected] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [playerSymbol, setPlayerSymbol] = useState<string | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [fadeIndex, setFadeIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  
  const gameInstance = useRef<Game | null>(null);

  useEffect(() => {
    gameInstance.current = new Game();
    setGame(gameInstance.current);

    const initGame = async () => {
      try {
        await gameInstance.current?.connect();
        setConnected(true);
        setupGameEventHandlers(gameInstance.current);
      } catch (error) {
        console.error('Failed to connect:', error);
        setErrorMessage('Failed to connect to server. Please try again.');
      }
    };

    initGame();

    return () => {
      gameInstance.current?.disconnect();
    };
  }, []);

  const setupGameEventHandlers = (gameObj: Game | null) => {
    if (!gameObj) return;

    gameObj.onBoardUpdate = (data) => {
      setBoard(data.board);
      setLastMove(data.lastMove);
      setIsMyTurn(data.isMyTurn);
      setFadeIndex(data.fadeIndex);
    };

    gameObj.onGameStart = (data) => {
      setBoard(data.board);
      setIsMyTurn(data.isMyTurn);
      setGameStarted(true);
      setWaitingForOpponent(false);
      setGameOver(false);
      setWinner(null);
      setWinningLine(null);
      setIsDraw(false);
      setOpponentLeft(false);
    };

    gameObj.onGameOver = (data) => {
      setBoard(data.board);
      setGameOver(true);
      setWinner(data.winner);
      setWinningLine(data.winningLine);
      setIsDraw(data.draw);
      setOpponentLeft(data.opponentLeft);
    };

    gameObj.onPlayerJoin = () => {
      setWaitingForOpponent(false);
    };

    gameObj.onPlayerLeave = () => {
      setOpponentLeft(true);
      setGameOver(true);
    };

    gameObj.onError = (message) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(''), 3000);
    };
  };

  const handleCellClick = async (index: number) => {
    if (!gameStarted || gameOver || !isMyTurn || board[index] !== null) return;

    try {
      await gameInstance.current?.makeMove(index);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response:any = await gameInstance.current?.createRoom();
      if (response) {
        setRoomId(response.roomId || '');
        setPlayerSymbol(response.symbol || null);
        setWaitingForOpponent(true);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create room');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleJoinRoom = async () => {
    if (!inputRoomId) {
      setErrorMessage('Please enter a room ID');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const response:any = await gameInstance.current?.joinRoom(inputRoomId);
      if (response) {
        setRoomId(response.roomId || '');
        setPlayerSymbol(response.symbol || null);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to join room');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleRestartGame = async () => {
    try {
      if(!gameInstance.current) return;
      console.log("button clicked",gameInstance.current.restartGame);
      await gameInstance.current?.restartGame();
      console.log("after",gameInstance.current)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to restart game');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setErrorMessage('Room ID copied to clipboard!');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  return <div className="bg-transparent">

      <div>
        {!roomId ? (
          <GameControls
            connected={connected}
            inputRoomId={inputRoomId}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onInputChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
          />
        ) : (
          <div>
            <GameStatus
              roomId={roomId}
              playerSymbol={playerSymbol}
              status={{
                connected,
                waitingForOpponent,
                gameOver,
                isDraw,
                opponentLeft,
                winner,
                gameStarted,
                isMyTurn,
              }}
              onCopyRoomId={copyRoomIdToClipboard}
            />

            <Board
              board={board}
              winningLine={winningLine}
              lastMove={lastMove}
              fadeIndex={fadeIndex}
              onCellClick={handleCellClick}
            />

            {gameOver && (
              <button
                onClick={handleRestartGame}
                className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Play Again
              </button>
            )}
          </div>
        )}

        <ErrorMessage message={errorMessage} />
      </div>
    </div>
}
