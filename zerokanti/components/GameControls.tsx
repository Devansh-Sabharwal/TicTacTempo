"use client"

import React, { useState } from 'react';
import { Gamepad2, Users, Sword, Zap, Ghost, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [activeTab, setActiveTab] = useState<'online' | 'local'>('online');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  
  const canStartGame = player1Name.trim() !== '' && player2Name.trim() !== '';
  const router = useRouter();

  // Decorative icons with different animations
  const decorativeIcons = [
    { icon: <Sword className="w-6 h-6 text-emerald-400" />, position: 'top-10 left-10', animation: 'animate-float' },
    { icon: <Zap className="w-5 h-5 text-green-300" />, position: 'bottom-20 right-12', animation: 'animate-pulse' },
    { icon: <Ghost className="w-7 h-7 text-emerald-200" />, position: 'top-1/3 right-16', animation: 'animate-bounce' },
    { icon: <Sparkles className="w-4 h-4 text-green-400" />, position: 'bottom-1/4 left-20', animation: 'animate-ping' },
    { icon: <Gamepad2 className="w-5 h-5 text-emerald-300" />, position: 'top-1/4 left-1/4', animation: 'animate-spin-slow' },
  ];

  return (
    <div className="relative flex min-h-screen min-w-screen justify-center items-center overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {decorativeIcons.map((item, index) => (
          <div 
            key={index}
            className={`absolute ${item.position} ${item.animation} opacity-40`}
            style={{ animationDuration: `${3 + index}s` }}
          >
            {item.icon}
          </div>
        ))}
        
        
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
          {Array.from({ length: 144 }).map((_, i) => (
            <div 
              key={i}
              className="w-1 h-1 rounded-full bg-emerald-900 opacity-20"
               style={{
                  animation: `pulse ${2 + (i % 3)}s infinite`,
                  animationDelay: `${(i % 2)}s`
                }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col justify-center gap-4 w-sm md:w-lg border border-emerald-800/50 rounded-xl p-6 bg-gradient-to-br from-emerald-950/70 to-green-950/70 backdrop-blur-lg z-10 shadow-2xl">
        {/* Tab buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300
              ${activeTab === 'online'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800/70'}
            `}
          >
            Online Game
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-300
              ${activeTab === 'local'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800/70'}
            `}
          >
            Local Game
          </button>
        </div>

        {/* Online Game Tab */}
        {activeTab === 'online' && (
          <>
            <button
              onClick={onCreateRoom}
              disabled={!connected || isLoading}
              className={`w-full py-4 px-6 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-3 font-semibold text-lg relative overflow-hidden
                ${connected && !isLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02]'
                  : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-emerald-300 border-t-transparent rounded-full" />
                  <span>Creating Room...</span>
                </div>
              ) : (
                <>
                  <Gamepad2 className="w-5 h-5" />
                  <span>Create New Game</span>
                </>
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gradient-to-r from-emerald-900 to-emerald-700"></div>
              <span className="px-4 text-emerald-400 font-bold text-sm">OR</span>
              <div className="flex-grow h-px bg-gradient-to-r from-emerald-700 to-emerald-900"></div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl blur-xl" />
              <div className="relative bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-6">
                <h3 className="text-emerald-200 font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>Join Existing Game</span>
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={onInputChange}
                    placeholder="Enter Room ID"
                    disabled={!connected || isLoading}
                    className={`w-full bg-emerald-950/50 border rounded-lg px-4 py-3 text-white placeholder-emerald-500 focus:outline-none
                      ${!connected || isLoading
                        ? 'border-emerald-900/50 cursor-not-allowed'
                        : 'border-emerald-700/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}
                      transition-all duration-200`}
                    aria-label="Room ID input"
                  />
                  <button
                    onClick={onJoinRoom}
                    disabled={!connected || !inputRoomId || isLoading}
                    className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300 relative overflow-hidden
                      ${connected && inputRoomId && !isLoading
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/20'
                        : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
                    `}
                  >
                    <Users className="w-5 h-5" />
                    <span>Join Game</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Local Game Tab */}
        {activeTab === 'local' && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-xl" />
            <div className="relative bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="player1Name" className="block text-green-200 text-sm font-medium mb-2">
                    Player 1 Name
                  </label>
                  <input
                    id="player1Name"
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    placeholder="Enter Player 1 Name"
                    className="w-full bg-emerald-950/50 border border-emerald-800/50 rounded-lg px-4 py-3 text-white placeholder-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                    aria-label="Player 1 Name"
                  />
                </div>
                <div>
                  <label htmlFor="player2Name" className="block text-green-200 text-sm font-medium mb-2">
                    Player 2 Name
                  </label>
                  <input
                    id="player2Name"
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    placeholder="Enter Player 2 Name"
                    className="w-full bg-emerald-950/50 border border-emerald-800/50 rounded-lg px-4 py-3 text-white placeholder-emerald-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                    aria-label="Player 2 Name"
                  />
                </div>

                <button
                  onClick={() => {
                    router.push(`/local?player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                  }}
                  disabled={!canStartGame}
                  className={`w-full py-4 px-6 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-3 font-semibold text-lg mt-6 relative overflow-hidden
                    ${canStartGame
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 shadow-lg hover:to-emerald-700 hover:scale-[1.02] cursor-pointer hover:shadow-emerald-500/20 text-white'
                      : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
                  `}
                >
                  {canStartGame && (
                    <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-ping" />
                  )}
                  Start Game
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add these styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default GameControls;