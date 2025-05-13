"use client"

import React, { useState } from 'react';
import { Gamepad2, Users } from 'lucide-react';
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

  return (
    <div className='flex min-h-screen min-w-screen justify-center items-center'>
      <div className="flex flex-col justify-center gap-4 w-sm md:w-lg border border-emerald-800/50 rounded-xl p-6">

        {/* Tab buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-2 rounded-lg font-semibold transition 
              ${activeTab === 'online'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-800'}
            `}
          >
            Online Game
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 rounded-lg font-semibold transition 
              ${activeTab === 'local'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-800'}
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
              className={`w-full py-4 px-6 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-3 font-semibold text-lg
              ${connected && !isLoading
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/20 hover:scale-102'
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
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-emerald-700"></div>
              <span className="px-4 text-emerald-500 font-bold text-sm">OR</span>
              <div className="flex-grow h-px bg-emerald-700"></div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl blur-xl" />
              <div className="relative bg-emerald-900/30 backdrop-blur-sm border border-emerald-800/50 rounded-xl p-6">
                <h3 className="text-emerald-200 font-medium mb-4">Join Existing Game</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={onInputChange}
                    placeholder="Enter Room ID"
                    disabled={!connected || isLoading}
                    className={`w-full bg-emerald-950/50 border rounded-lg px-4 py-3 text-white placeholder-emerald-500
                      ${!connected || isLoading
                        ? 'border-emerald-900/50 cursor-not-allowed'
                        : 'border-emerald-700/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}
                      transition-all duration-200`}
                    aria-label="Room ID input"
                  />
                  <button
                    onClick={onJoinRoom}
                    disabled={!connected || !inputRoomId || isLoading}
                    className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300
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
          </>
        )}

        {/* Local Game Tab */}
        {activeTab === 'local' && (
          <>
            { (
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
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        placeholder="Enter Player 1 Name"
                        className="w-full bg-emerald-950/50 border rounded-lg px-4 py-3 text-white placeholder-emerald-500 transition-all duration-200"
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
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        placeholder="Enter Player 2 Name"
                        className="w-full bg-emerald-950/50 border rounded-lg px-4 py-3 text-white placeholder-emerald-500 transition-all duration-200"
                        aria-label="Player 2 Name"
                      />
                    </div>

                    <button
                      onClick={() => {
                        router.push(`/local?player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`);
                      }}
                      disabled={!canStartGame}
                      className={`w-full py-4 px-6 rounded-xl transition-all duration-300 transform flex items-center justify-center gap-3 font-semibold text-lg mt-6
                        ${canStartGame
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 shadow-lg hover:to-emerald-700 hover:scale-105 cursor-pointer hover:shadow-emerald-500/20 text-white'
                          : 'bg-emerald-900/50 text-emerald-300 cursor-not-allowed'}
                      `}
                    >
                      Start Game
                    </button>
                  </div>
                </div>
              </div>
            ) }
          </>
        )}
      </div>
    </div>
  );
};

export default GameControls;
