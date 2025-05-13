import Link from "next/link";

export default function Navbar() {
    return (
      <div className="fixed top-2 z-50 w-full bg-emerland-950 backdrop-blur-md text-white">
        <div className="mx-2 sm:mx-auto sm:max-w-4/5 flex justify-between items-center py-2 sm:py-4">
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-1 sm:gap-4 items-center">
                    <span className="rounded-full text-base sm:text-lg bg-green-900 font-bold px-2 py-1 sm:px-3 sm:py-2">T³</span>
                    <span className="text-base sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-300">
                    Tic Tac Tempo
                    </span>
                </div>
                <div className="flex gap-2 sm:gap-8 items-center">
                    <span className="text-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-green-200 text-xs sm:text-xl">
                      <Link href={"#how-to-play"}>How to Play</Link></span>
                    <span className="text-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-green-200 text-xs sm:text-xl">
                      <Link href={"#rules"}>Rules</Link></span>
                      <Link href={"/game"}>
                    <span className="text-semibold text-xs sm:text-lg bg-gradient-to-r from-emerald-500 to-green-600 cursor-pointer hover:bg-green-900 rounded-lg px-2 py-1 sm:px-4 sm:py-2">
                      Play Now</span>
                      </Link>
                </div>
            </div>
        </div>
      </div>
    )
  }
  