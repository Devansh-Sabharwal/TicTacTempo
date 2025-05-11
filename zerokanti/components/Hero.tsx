import { Play, Users } from "lucide-react"
import GamePreview from "./GamePreview"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="pt-32 mx-4 lg:max-w-7xl md:mx-auto flex flex-col gap-10
    items-center lg:flex-row justify-between ">
      <Heading/>
      <GamePreview/>
    </div>
  )
}
function Heading(){
    return <div className="">
        <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-3xl sm:text-5xl md:text-6xl leading-tight font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300">Play Tic Tac Toe with a twist</span>
            <span className="text-sm sm:text-xl md:text-2xl font-medium text-green-200">Experience the classic game reimagined with beautiful animations, multiplayer capabilities, and a modern twist. Challenge your friends or play against strangers in real-time.</span>
            <div className="flex flex-wrap gap-4">
              <button 
                className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg text-white font-semibold shadow-lg hover:shadow-emerald-500/20 hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                <Play size={20} className="mr-2" />
                <Link href={"/mode"}>Play Now</Link>
              </button>
              
            </div>
        </div>
    </div>
}
