// components/GameControls.tsx
import React from 'react';

interface GameControlsProps {
  connected: boolean;
  inputRoomId: string;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  connected,
  inputRoomId,
  onCreateRoom,
  onJoinRoom,
  onInputChange,
  isLoading = false
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <button
        onClick={onCreateRoom}
        disabled={!connected || isLoading}
        className={`
          w-full py-3 px-4 rounded-lg 
          transition-all duration-200
          ${connected && !isLoading 
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          flex items-center justify-center
        `}
      >
        {isLoading ? (
          <span className="animate-pulse">Creating Room...</span>
        ) : (
          'Create New Game'
        )}
      </button>

      <div className="flex space-x-2">
        <input
          type="text"
          value={inputRoomId}
          onChange={onInputChange}
          placeholder="Enter Room ID"
          disabled={!connected || isLoading}
          className={`
            flex-1 border rounded-lg px-4 py-2
            ${!connected || isLoading 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'focus:ring-2 focus:ring-blue-300'}
            transition-all duration-200
          `}
          aria-label="Room ID input"
        />
        <button
          onClick={onJoinRoom}
          disabled={!connected || !inputRoomId || isLoading}
          className={`
            py-2 px-6 rounded-lg
            transition-all duration-200
            ${connected && inputRoomId && !isLoading
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default GameControls;