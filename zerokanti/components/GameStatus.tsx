import React from 'react';
import { Copy, Crown, Clock, AlertCircle } from 'lucide-react';

interface GameStatusProps {
  roomId: string;
  playerSymbol: string | null;
  status: {
    connected: boolean;
    waitingForOpponent: boolean;
    gameOver: boolean;
    isDraw: boolean;
    opponentLeft: boolean;
    winner: string | null;
    gameStarted: boolean;
    isMyTurn: boolean;
  };
  onCopyRoomId: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  roomId,
  playerSymbol,
  status,
  onCopyRoomId
}) => {
  const getStatusColor = () => {
    if (status.gameOver) {
      if (status.isDraw) return 'bg-yellow-500/10 text-yellow-300';
      if (status.winner === playerSymbol) return 'bg-emerald-500/10 text-emerald-300';
      return 'bg-red-500/10 text-red-300';
    }
    return status.isMyTurn ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-900/50 text-emerald-200';
  };

  const getStatusMessage = () => {
    if (!status.connected) return 'Connecting to server...';
    if (status.gameOver) {
      if (status.opponentLeft) return 'Opponent left the game';
      if (status.winner === playerSymbol) return 'Victory! 🎉';
      return 'Better luck next time!';
    }
    if (status.gameStarted) return status.isMyTurn ? 'Your turn' : "Opponent's turn";
    return 'Ready to play';
  };

  const getStatusIcon = () => {
    if (status.gameOver) {
      if (status.isDraw) return <AlertCircle className="w-5 h-5" />;
      if (status.winner === playerSymbol) return <Crown className="w-5 h-5" />;
      return <AlertCircle className="w-5 h-5" />;
    }
    return <Clock className="w-5 h-5" />;
  };

  return (
    <div
      className={`
       
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
      `}
    >
      {roomId && (
        <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-3 w-full flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-200 text-sm">Room:</span>
            <span className="font-medium text-white text-sm">{roomId}</span>
          </div>
          <button
            onClick={onCopyRoomId}
            className="flex items-center gap-2 px-2 py-1 bg-emerald-800/30 hover:bg-emerald-700/30 rounded-lg transition-colors text-emerald-300 hover:text-emerald-200 text-sm"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
      )}

      <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-4 w-full">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-200 text-sm">You are:</span>
            <span className="font-bold text-lg bg-emerald-800/50 px-3 py-1 rounded-lg mr-3 text-white">
              {playerSymbol || '--'}
            </span>
          </div>
          {/* <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {status.isMyTurn ? 'Your turn' : status.gameStarted ? 'Opponent\'s turn' : 'Waiting'}
            </span>
          </div> */}
        </div>

        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium text-sm">{getStatusMessage()}</span>
        </div>

        {status.waitingForOpponent && (
          <div className="mt-3 text-center text-yellow-400 text-sm bg-yellow-500/10 px-3 py-2 rounded-lg">
            Waiting for opponent to join...
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStatus;
