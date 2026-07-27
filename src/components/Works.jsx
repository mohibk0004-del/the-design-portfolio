import { useRef } from 'react'
import { useScroll, useTransform, motion, useVelocity, useSpring } from 'framer-motion'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import asciiTerminalImg from '../assets/ascii terminal.jpg'
import platformerImg from '../assets/3dplatformer.png'
import CrosshairGrid from './CrosshairGrid'

export function BendingCard({ children, className }) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 45, stiffness: 350 })
  
  // Map scroll velocity to skew and scale for that tactile physical jelly/bending effect
  const skew = useTransform(smoothVelocity, [-1200, 1200], [5, -5])
  const scale = useTransform(smoothVelocity, [-1200, 0, 1200], [1.02, 1, 1.02])
  
  return (
    <motion.div 
      className={className}
      style={{ skewY: skew, scaleY: scale }}
    >
      {children}
    </motion.div>
  )
}

function getTechIcon(label) {
  const l = label.toLowerCase()
  if (l.includes('react')) {
    return (
      <svg className="w-3.5 h-3.5 text-sky-400 animate-[spin_8s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <ellipse rx="10" ry="4" cx="12" cy="12" />
        <ellipse rx="10" ry="4" cx="12" cy="12" transform="rotate(60 12 12)" />
        <ellipse rx="10" ry="4" cx="12" cy="12" transform="rotate(120 12 12)" />
      </svg>
    )
  }
  if (l.includes('typescript') || l === 'ts') {
    return (
      <span className="px-1 py-0.2 rounded bg-blue-500 text-[9px] font-bold text-white leading-none">
        TS
      </span>
    )
  }
  if (l.includes('tailwind')) {
    return (
      <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624 1.177-1.194 2.538-2.576 5.512-2.576z"/>
      </svg>
    )
  }
  if (l.includes('three') || l.includes('webgl') || l.includes('r3f')) {
    return <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
  }
  if (l.includes('shader') || l.includes('glsl')) {
    return <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
  }
  if (l.includes('websocket') || l.includes('telemetry')) {
    return <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
  }
  if (l.includes('unity')) {
    return <span className="w-2 h-2 rounded-full bg-white dark:bg-white shadow-[0_0_8px_#ffffff]" />
  }
  if (l.includes('blender')) {
    return <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
  }
  if (l.includes('c#') || l.includes('rapier') || l.includes('physics')) {
    return <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
  }
  if (l.includes('canvas') || l.includes('audio') || l.includes('node') || l.includes('aws')) {
    return <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
  }
  return <span className="w-2 h-2 rounded-full bg-[var(--selection)] shadow-sm" />
}

function TechPill({ label }) {
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/40 dark:bg-black/60 font-mono text-xs text-white tracking-wide shadow-sm backdrop-blur-md transition-transform duration-200 hover:scale-105 hover:border-white/30">
      {getTechIcon(label)}
      <span>{label}</span>
    </span>
  )
}

export default function Works() {
  return (
    <section id="work" className="relative w-full py-32 md:py-48 z-20 pointer-events-auto text-[var(--text-primary)] transition-colors duration-700 overflow-hidden">
      
      {/* Subtle CAD Background Grid */}
      <CrosshairGrid 
        opacity={0.5}
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
      />

      {/* Live Version Layout with Velocity Bending Effect */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-32">
        
        {/* Project 1: Sideline & LivePulse (3-column asymmetric layout) */}
        <BendingCard className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Col: Sideline Screenshot */}
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center">
              <a href="https://www.mohib.app" target="_blank" rel="noreferrer" className="w-full block group">
                <div className="w-full rounded-[2rem] md:rounded-[2.5rem] bg-[#070b12] p-2 sm:p-4 border border-white/15 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src={sidelineImg} 
                    alt="Sideline PWA" 
                    className="w-full h-auto max-h-[65vh] object-contain object-center mx-auto block"
                  />
                </div>
              </a>
            </div>

            {/* Middle Col: Title, Year, Tech Stack Pills (No description / telemetry text) */}
            <div className="col-span-1 lg:col-span-4 flex flex-col justify-center py-4 px-2 items-center text-center lg:items-start lg:text-left">
              <div className="flex items-baseline justify-between w-full gap-4 mb-6">
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  Sideline & LivePulse
                </h3>
                <span className="font-mono text-sm md:text-base opacity-80 px-3 py-1 rounded-full bg-black/40 border border-white/10">
                  2026
                </span>
              </div>
              
              {/* Tech Stack Pills with Colored Icons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                {['React', 'TypeScript', 'WebGL', 'Tailwind CSS', 'WebSockets', 'GLSL Shaders', 'Three.js'].map((pill) => (
                  <TechPill key={pill} label={pill} />
                ))}
              </div>
            </div>

            {/* Right Col: LivePulse Chat UI Screenshot */}
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center">
              <a href="https://www.mohib.app" target="_blank" rel="noreferrer" className="w-full block group">
                <div className="w-full rounded-[2rem] md:rounded-[2.5rem] bg-[#070b12] p-2 sm:p-4 border border-white/15 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src={livePulseImg} 
                    alt="Live Pulse Telemetry Engine" 
                    className="w-full h-auto max-h-[65vh] object-contain object-center mx-auto block"
                  />
                </div>
              </a>
            </div>

          </div>
        </BendingCard>

        {/* Project 2 & 3: Terminal Portfolio & 3D Platformer (Side-by-side grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          
          {/* Left Item: Terminal Portfolio (col-span-5) */}
          <BendingCard className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <a href="https://mohib.wiki" target="_blank" rel="noreferrer" className="block group">
              <div className="w-full rounded-[2rem] md:rounded-[2.5rem] bg-[#070b12] p-2 sm:p-4 border border-white/15 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src={asciiTerminalImg} 
                  alt="Terminal Portfolio" 
                  className="w-full h-auto object-contain mx-auto block rounded-2xl"
                />
              </div>
            </a>
            <div className="flex flex-col px-3">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  Terminal Portfolio
                </h3>
                <span className="font-mono text-sm md:text-base opacity-80 px-3 py-1 rounded-full bg-black/40 border border-white/10">
                  2026
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Canvas API', 'Audio Engine'].map((pill) => (
                  <TechPill key={pill} label={pill} />
                ))}
              </div>
            </div>
          </BendingCard>

          {/* Right Item: 3D Platformer (col-span-7) */}
          <BendingCard className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <a href="https://www.mohib.app" target="_blank" rel="noreferrer" className="block group">
              <div className="w-full rounded-[2rem] md:rounded-[2.5rem] bg-[#070b12] p-2 sm:p-4 border border-white/15 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src={platformerImg} 
                  alt="3D Platformer" 
                  className="w-full h-auto object-contain mx-auto block rounded-2xl"
                />
              </div>
            </a>
            <div className="flex flex-col px-3">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  3D Platformer
                </h3>
                <span className="font-mono text-sm md:text-base opacity-80 px-3 py-1 rounded-full bg-black/40 border border-white/10">
                  2026
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Unity', 'Blender', 'C#', 'Rapier Physics', 'R3F'].map((pill) => (
                  <TechPill key={pill} label={pill} />
                ))}
              </div>
            </div>
          </BendingCard>

        </div>

      </div>

    </section>
  )
}
