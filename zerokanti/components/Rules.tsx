"use client"
import React, { useState } from 'react';
import {  ChevronLeft, ChevronRight, Clock, Target, Trophy } from 'lucide-react';

const Rules = () => {
  
  const [activeExample, setActiveExample] = useState(0);
  

  const examples = [
    {
      title: "Fading Moves",
      description: "Once both players have made 3 moves, the oldest move of your opponent will fade, indicating it will be removed on the next turn.",
      image: "/example1.png",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Strategic Placement",
      description: "You cannot place your mark on a faded cell. Plan your moves carefully!",
      image: "/example2.png",
      icon: <Target className="h-6 w-6" />
    },
    {
      title: "Winning the Game",
      description: "Get three of your marks in a row, column, or diagonal to win!",
      image: "/example3.png",
      icon: <Trophy className="h-6 w-6" />
    }
  ];

  return (<div>
    <section 
      id="rules" 
      className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-700`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300">
              Game Rules
            </span>
          </h2>
          <p className={`text-sm sm:text-lg text-emerald-200 max-w-2xl mx-auto transition-all duration-700 delay-200`}>
            Experience Tic Tac Toe with a twist! Each move affects the board in unique ways.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Examples showcase */}
          <div className="relative h-[500px] sm:h-[400px]">
            {examples.map((example, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                  activeExample === index
                    ? 'opacity-100 translate-y-0 z-10'
                    : 'opacity-0 translate-y-8 -z-10'
                }`}
              >
                <div className="bg-emerald-900/30 backdrop-blur-md border border-emerald-800/50 rounded-xl p-4 sm:p-8 shadow-xl">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white">
                        {example.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">{example.title}</h3>
                      <p className="text-base sm:text-lg text-emerald-200">{example.description}</p>
                    </div>
                    <div className="relative aspect-square max-w-[300px] mx-auto">
                      <img
                        src={example.image}
                        alt={example.title}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block w-full h-1 bg-emerald-900 rounded-full mt-10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
              style={{ width: `${(activeExample + 1) * (100 / examples.length)}%` }}
            />
        </div>
          
        
        </div>
      </div>
    </section>
    {/* Progress bar */}
    
        <div className="mt-20 sm:mt-0 flex justify-center items-center space-x-6">
            <button
                onClick={() => setActiveExample((prev) => (prev - 1 + examples.length) % examples.length)}
                className="cursor-pointer text-emerald-300 hover:text-emerald-100 transition-colors text-2xl"
                aria-label="Previous example"
            >
                <ChevronLeft size={40}/>
            </button>
            <button
                onClick={() => setActiveExample((prev) => (prev + 1) % examples.length)}
                className="cursor-pointer text-emerald-300 hover:text-emerald-100 transition-colors text-2xl"
                aria-label="Next example"
            >
                <ChevronRight size={40}/>
            </button>
        </div>
    </div>
  );
};

export default Rules;