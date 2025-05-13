import Hero from "@/components/Hero";
import HowToPlay from "@/components/HowToPlay";
import Navbar from "@/components/Navbar";
import PlayCTA from "@/components/PlayCTA";
import Rules from "@/components/Rules";

export default function Home() {
  return (
    <div className="overflow-hidden min-h-screen min-w-screen bg-gradient-to-b from-emerald-950 via-green-1000 to-emerald-950">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[250px] h-[250px] rounded-full bg-teal-500/10 blur-[80px]"></div>
        <div className="absolute top-[60%] right-[15%] w-[200px] h-[200px] rounded-full bg-green-500/10 blur-[60px]"></div>
      </div>
      <Navbar />
      <Hero />
      <HowToPlay/>
      <Rules/>
      <PlayCTA/>
      {/* <TicTacToeGame /> */}
    </div>
  );
}
