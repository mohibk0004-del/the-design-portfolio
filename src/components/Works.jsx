import { useRef } from 'react'
import { useScroll, useTransform, motion, useVelocity, useSpring } from 'framer-motion'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import asciiTerminalImg from '../assets/ascii terminal.jpg'
import platformerImg from '../assets/3dplatformer.png'

function BendingCard({ children, className }) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  
  // Map scroll velocity to skew and scale for that jelly/bending effect
  const skew = useTransform(smoothVelocity, [-1000, 1000], [5, -5])
  const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [1.05, 1, 1.05])
  
  return (
    <motion.div 
      className={className}
      style={{ skewY: skew, scaleY: scale }}
    >
      {children}
    </motion.div>
  )
}

export default function Works() {
  return (
    <section id="work" className="relative w-full py-48 z-20 pointer-events-none text-[#1e1e1e] dark:text-[#f8f8f8] mix-blend-difference overflow-hidden">
      
      {/* Scattered Grid */}
      <div className="grid grid-cols-12 gap-8 px-4 lg:px-14 min-h-[200vh]">
        
        {/* Project 1: Sideline */}
        <BendingCard className="col-span-10 md:col-span-8 lg:col-span-5 col-start-2 lg:col-start-2 pointer-events-auto h-96 relative group cursor-pointer overflow-hidden rounded-[40px] shadow-2xl">
          <a href="https://github.com/amna0x/sideline" className="block w-full h-full relative">
             <img src={sidelineImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sideline" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
             <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-6xl text-white tracking-tighter drop-shadow-lg">
                Sideline
             </div>
             <div className="absolute top-8 right-12 text-xs font-mono uppercase bg-[#C0FE04] text-black px-3 py-1 font-bold shadow-lg z-10">Featured Project</div>
          </a>
        </BendingCard>

        {/* Decorator Block */}
        <BendingCard className="hidden lg:block col-span-3 col-start-9 mt-24 pointer-events-auto h-48 rounded-3xl overflow-hidden group shadow-xl">
          <div className="w-full h-full relative">
             <img src={livePulseImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Live Pulse" />
             <div className="absolute inset-0 bg-black/20 flex justify-center items-center">
                <div className="text-center font-mono text-xs uppercase text-white font-bold tracking-widest">
                  Live Pulse <br/> Prediction Engine <br/> WebSockets
                </div>
             </div>
          </div>
        </BendingCard>

        {/* Project 2: ASCII Terminal Portfolio */}
        <BendingCard className="col-span-12 md:col-span-10 lg:col-span-7 col-start-1 lg:col-start-4 mt-48 pointer-events-auto h-[500px]">
          <a href="https://mohib.app" className="block w-full h-full bg-[#0a0a0a] border border-[#333] rounded-xl flex flex-col overflow-hidden shadow-2xl group cursor-pointer">
            {/* Terminal Header */}
            <div className="h-10 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-[#333]">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 font-mono text-xs text-gray-500">mohib.app — -bash — 80x24</span>
            </div>
            {/* Terminal Body */}
            <div className="relative flex-1 overflow-hidden bg-black">
               <img src={asciiTerminalImg} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" alt="ASCII Terminal" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8 font-mono text-[#00FF00]">
                 <div className="text-4xl font-bold mb-4 z-10 text-white shadow-black drop-shadow-md">ASCII Terminal Portfolio</div>
                 <div className="text-sm opacity-90 max-w-lg z-10 leading-relaxed shadow-black drop-shadow-md">
                   <span className="text-white font-bold">~ $</span> Highly interactive, visually striking portfolio website built with a custom terminal aesthetic.<br/>
                 </div>
               </div>
            </div>
          </a>
        </BendingCard>

        {/* Project 3: 3D Platformer */}
        <BendingCard className="col-span-10 md:col-span-7 lg:col-span-6 col-start-2 lg:col-start-7 mt-32 pointer-events-auto h-80 rounded-[40px] overflow-hidden group shadow-2xl">
          <a href="#" className="block w-full h-full relative">
             <img src={platformerImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="3D Platformer" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
             <div className="absolute inset-0 flex items-center justify-center text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase z-10 drop-shadow-xl">
               3D Platformer
             </div>
             <div className="absolute bottom-6 left-8 flex gap-2 z-10">
                <span className="font-mono text-xs bg-black/80 text-white px-2 py-1 rounded backdrop-blur">Unity</span>
                <span className="font-mono text-xs bg-black/80 text-white px-2 py-1 rounded backdrop-blur">Blender</span>
             </div>
          </a>
        </BendingCard>

      </div>
    </section>
  )
}
