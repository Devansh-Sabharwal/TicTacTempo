// components/GameStatus.tsx
import React from 'react';

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
      if (status.isDraw) return 'text-yellow-600 bg-yellow-50';
      if (status.winner === playerSymbol) return 'text-green-600 bg-green-50';
      return 'text-red-600 bg-red-50';
    }
    return status.isMyTurn ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-50';
  };

  const getStatusMessage = () => {
    if (!status.connected) return 'Connecting to server...';
    if (status.waitingForOpponent) return 'Waiting for opponent to join...';
    if (status.gameOver) {
      if (status.isDraw) return "Game ended in a draw!";
      if (status.opponentLeft) return 'Opponent left the game';
      if (status.winner === playerSymbol) return 'You won! 🎉';
      return 'You lost!';
    }
    if (status.gameStarted) return status.isMyTurn ? 'Your turn' : "Opponent's turn";
    return 'Start or join a game';
  };

  return (
    <div className="space-y-3 mb-4">
      {roomId && (
        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
          <span className="font-medium truncate">Room: {roomId}</span>
          <button
            onClick={onCopyRoomId}
            className="text-sm bg-white hover:bg-gray-200 px-3 py-1 rounded-md transition-colors shadow-sm"
            aria-label="Copy room ID"
          >
            Copy
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="font-medium">
          You are: <span className="font-bold">{playerSymbol || '--'}</span>
        </div>
        <div className={`text-sm px-3 py-1 rounded-full ${getStatusColor()}`}>
          {status.isMyTurn ? 'Your turn' : status.gameStarted ? 'Opponent\'s turn' : 'Waiting'}
        </div>
      </div>

      <div className={`p-3 rounded-lg text-center font-medium ${getStatusColor()}`}>
        {getStatusMessage()}
      </div>
    </div>
  );
};

export default GameStatus;