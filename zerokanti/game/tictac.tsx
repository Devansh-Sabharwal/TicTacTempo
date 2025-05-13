// components/TicTacToeGame.tsx
'use client';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import Game from './game';
import Board from '@/components/Board';
import GameControls from '@/components/GameControls';
import GameStatus from '@/components/GameStatus';

export default function TicTacToeGame() {
  const [game, setGame] = useState<Game | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
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
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isLoading, setIsLoading] = useState({
    connecting: false,
    creatingRoom: false,
    joiningRoom: false,
    makingMove: false,
    restarting: false
  });
  
  const gameInstance = useRef<Game | null>(null);

  useEffect(() => {
    gameInstance.current = new Game();
    setGame(gameInstance.current);

    const initGame = async () => {
      setIsLoading(prev => ({...prev, connecting: true}));
      try {
        await gameInstance.current?.connect();
        setConnected(true);
        setupGameEventHandlers(gameInstance.current);
        toast.success('Connected to game server');
      } catch (error) {
        console.error('Failed to connect:', error);
        toast.error('Failed to connect to server. Please try again.');
      } finally {
        setIsLoading(prev => ({...prev, connecting: false}));
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
      setIsLoading(prev => ({...prev, makingMove: false}));
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
      setIsLoading(prev => ({
        ...prev, 
        creatingRoom: false,
        joiningRoom: false
      }));
    };

    gameObj.onGameOver = (data) => {
      setBoard(data.board);
      setGameOver(true);
      setWinner(data.winner);
      setWinningLine(data.winningLine);
      setIsDraw(data.draw);
      setOpponentLeft(data.opponentLeft);
      
      if (data.draw) {
        toast.info('Game ended in a draw!');
      } else if (data.winner) {
        toast.success(`${data.winner} wins!`);
      } else if (data.opponentLeft) {
        toast.warning('Opponent left the game');
      }
    };

    gameObj.onPlayerJoin = () => {
      setWaitingForOpponent(false);
      toast.success('Opponent joined the game!');
    };

    gameObj.onPlayerLeave = () => {
      setOpponentLeft(true);
      setGameOver(true);
      toast.warning('Opponent left the game');
    };

    gameObj.onError = (message) => {
      toast.error(message);
      setIsLoading({
        connecting: false,
        creatingRoom: false,
        joiningRoom: false,
        makingMove: false,
        restarting: false
      });
    };
  };

  const handleCellClick = async (index: number) => {
    if (!gameStarted || gameOver || !isMyTurn || board[index] !== null) {
      if (board[index] !== null) {
        toast.warning('This cell is already taken');
      }
      return;
    }

    setIsLoading(prev => ({...prev, makingMove: true}));
    try {
      await gameInstance.current?.makeMove(index);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
      setIsLoading(prev => ({...prev, makingMove: false}));
    }
  };

  const handleCreateRoom = async () => {
    setIsLoading(prev => ({...prev, creatingRoom: true}));
    try {
      const response:any = await gameInstance.current?.createRoom();
      if (response) {
        setRoomId(response.roomId || '');
        setPlayerSymbol(response.symbol || null);
        setWaitingForOpponent(true);
        toast.success(`Room created! ID: ${response.roomId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create room');
    } finally {
      setIsLoading(prev => ({...prev, creatingRoom: false}));
    }
  };

  const handleJoinRoom = async () => {
    if (!inputRoomId) {
      toast.warning('Please enter a room ID');
      return;
    }

    setIsLoading(prev => ({...prev, joiningRoom: true}));
    try {
      const response:any = await gameInstance.current?.joinRoom(inputRoomId);
      if (response) {
        setRoomId(response.roomId || '');
        setPlayerSymbol(response.symbol || null);
        toast.success(`Joined room ${response.roomId}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setIsLoading(prev => ({...prev, joiningRoom: false}));
    }
  };

  const handleRestartGame = async () => {
    setIsLoading(prev => ({...prev, restarting: true}));
    try {
      if(!gameInstance.current) return;
      await gameInstance.current?.restartGame();
      toast.info('Game restarted!');
      setShowOverlay(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to restart game');
    } finally {
      setIsLoading(prev => ({...prev, restarting: false}));
    }
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard!');
  };

  return (
    <div className="bg-transparent relative">
      {/* Global Loading Overlay */}
      {(isLoading.connecting || isLoading.creatingRoom || isLoading.joiningRoom || isLoading.restarting) && (
        <div className=" bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <ClipLoader color="#10b981" size={30} className='m-3'/>
            Connecting to server...
        </div>
      )}
      {(isLoading.creatingRoom || isLoading.joiningRoom) && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <ClipLoader color="#10b981" size={30} />
        </div>
      )}

      

      <div>
        {!roomId ? (
          <GameControls
            connected={connected}
            inputRoomId={inputRoomId}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onInputChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
            isLoading={isLoading.creatingRoom || isLoading.joiningRoom}
          />
        ) : (
          <div className='p-4'>
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
              disabled={isLoading.makingMove}
            />
          </div>
        )}

        {gameOver && showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xs z-50">
            <div className="relative bg-transparent p-6 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setShowOverlay(false)}
                className="absolute top-2 right-2 text-white hover:text-green-50 transition-colors text-xl font-bold"
                aria-label="Close"
              >
                ✖
              </button>

              <button
                onClick={handleRestartGame}
                disabled={isLoading.restarting}
                className="px-8 py-4 rounded-2xl 
                  bg-gradient-to-r from-emerald-500 to-green-600 
                  text-white text-lg font-semibold shadow-lg 
                  hover:from-emerald-400 hover:to-green-500
                  hover:shadow-emerald-500/20 hover:scale-105
                  active:scale-95
                  transition-all duration-300
                  disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading.restarting ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  'Play Again'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}