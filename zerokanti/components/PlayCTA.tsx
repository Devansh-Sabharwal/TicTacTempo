"use client"
import { Gamepad2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function PlayCTA() {
  return (
    <div>
      <div className="max-w-5xl mx-auto text-center mt-32">
          <div className={`transition-all duration-1000`}>
            <h2 className="text-2xl sm:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300">
                Ready to Challenge Your Strategy?
              </span>
            </h2>
            <p className="text-sm sm:text-xl text-emerald-200 mb-8">
              Experience the thrill of Tic Tac Tempo – where every move counts and strategy evolves with time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={"/game"}>
              <button 
                onClick={() => {}}
                className="group relative px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:scale-105 sm:w-auto"
              >
                
                <span className="flex items-center justify-center">
                  <Gamepad2 size={24} className="mr-2" />
                  Play Now
                  <Sparkles size={20} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                
              </button>
              </Link>
              </div>
              </div>
              </div>
    </div>
  )
}
