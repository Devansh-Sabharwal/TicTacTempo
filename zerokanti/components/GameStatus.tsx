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
    if (status.waitingForOpponent) return 'Waiting for opponent to join...';
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
    <div className="space-y-4 animate-fade-in">
      {roomId && (
        <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-200">Room:</span>
            <span className="font-medium text-white">{roomId}</span>
          </div>
          <button
            onClick={onCopyRoomId}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-800/30 hover:bg-emerald-700/30 rounded-lg transition-colors text-emerald-300 hover:text-emerald-200"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">Copy</span>
          </button>
        </div>
      )}

      <div className="bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-200">You are:</span>
            <span className="font-bold text-lg bg-emerald-800/50 px-3 py-1 rounded-lg text-white">
              {playerSymbol || '--'}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {status.isMyTurn ? 'Your turn' : status.gameStarted ? 'Opponent\'s turn' : 'Waiting'}
            </span>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusMessage()}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;