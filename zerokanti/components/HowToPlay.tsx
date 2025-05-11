"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Copy, Gamepad2, Users } from 'lucide-react';

const HowToPlay = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  const steps = [
    {
      title: "Create a Game Room",
      description: "Start by creating a new game room. You'll get a unique room ID that you can share with your opponent.",
      icon: <Gamepad2 className="h-6 w-6" />
    },
    {
      title: "Invite a Friend",
      description: "Share your room ID with a friend so they can join your game. Copy the code with a single click.",
      icon: <Copy className="h-6 w-6" />
    },
    {
      title: "Play Together",
      description: "Take alternate turns to make moves until a player wins. Older moves will gradually disappear, increasing the game's difficulty. Restart the game with a single click.",
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="how-to-play" 
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300">
              How to Play
            </span>
          </h2>
          <p className={`text-sm sm:text-lg text-emerald-200 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Get started in just a few simple steps and enjoy playing with friends around the world
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Step indicators */}
          <div className="flex justify-center mb-6 sm:mb-10">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full mx-2 transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-emerald-500 scale-125' 
                    : 'bg-emerald-900 hover:bg-emerald-800'
                }`}
                aria-label={`Step ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Step content */}
          <div className="relative h-[300px] sm:h-[250px]">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                  activeStep === index
                    ? 'opacity-100 translate-y-0 z-10'
                    : 'opacity-0 translate-y-8 -z-10'
                }`}
              >
                <div className="bg-emerald-900/30 backdrop-blur-md border border-emerald-800/50 rounded-xl p-8 shadow-xl">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 text-white">
                    {step.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-sm sm:text-lg text-emerald-200">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-emerald-900 rounded-full mt-10 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
              style={{ width: `${(activeStep + 1) * (100 / steps.length)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToPlay;