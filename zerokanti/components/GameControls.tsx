import React from 'react';
import { Gamepad2, Users } from 'lucide-react';

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
  return (<div>
    <div className="flex flex-col justify-center gap-4 w-xl">
      <button
        onClick={onCreateRoom}
        disabled={!connected || isLoading}
        className={`
          w-full py-4 px-6 rounded-xl
          transition-all duration-300 transform
          flex items-center justify-center gap-3
          font-semibold text-lg
          ${connected && !isLoading 
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/20 hover:scale-102' 
            : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-emerald-300 border-t-transparent rounded-full"/>
            <span>Creating Room...</span>
          </div>
        ) : (
          <>
            <Gamepad2 className="w-5 h-5" />
            <span>Create New Game</span>
          </>
        )}
        
      </button>
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-emerald-700"></div>
        <span className="px-4 text-emerald-500 font-bold text-sm">OR</span>
        <div className="flex-grow h-px bg-emerald-700"></div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl blur-xl"/>
        <div className="relative bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-6">
          <h3 className="text-emerald-200 font-medium mb-4">Join Existing Game</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={inputRoomId}
              onChange={onInputChange}
              placeholder="Enter Room ID"
              disabled={!connected || isLoading}
              className={`
                w-full bg-emerald-950/50 border rounded-lg px-4 py-3
                text-white placeholder-emerald-500
                ${!connected || isLoading 
                  ? 'border-emerald-900/50 cursor-not-allowed' 
                  : 'border-emerald-700/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}
                transition-all duration-200
              `}
              aria-label="Room ID input"
            />
            
            <button
              onClick={onJoinRoom}
              disabled={!connected || !inputRoomId || isLoading}
              className={`
                w-full py-3 px-6 rounded-lg
                flex items-center justify-center gap-2
                font-semibold transition-all duration-300
                ${connected && inputRoomId && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/20' 
                  : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
              `}
            >
              <Users className="w-5 h-5" />
              <span>Join Game</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GameControls;