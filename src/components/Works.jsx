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

function TechPill({ label }) {
  const getDotColor = (name) => {
    if (name.includes('React')) return 'bg-[#00D8FF]'
    if (name.includes('Vite')) return 'bg-[#646CFF]'
    if (name.includes('Tailwind')) return 'bg-[#38B2AC]'
    if (name.includes('Node')) return 'bg-[#339933]'
    if (name.includes('AWS')) return 'bg-[#FF9900]'
    if (name.includes('Typescript')) return 'bg-[#3178C6]'
    if (name.includes('Unity')) return 'bg-white'
    if (name.includes('Blender')) return 'bg-[#EA7600]'
    if (name.includes('C#')) return 'bg-[#9B4F96]'
    return 'bg-[#C0FE04]'
  }
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/40 dark:bg-black/60 font-mono text-xs text-white tracking-wide shadow-sm backdrop-blur-md">
      <span className={`w-2 h-2 rounded-full ${getDotColor(label)} shadow-sm`} />
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

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] opacity-60">
          // 02. FEATURED WORKS
        </h2>
      </div>

      {/* Live Version Layout with Velocity Bending Effect */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-32">
        
        {/* Project 1: Sideline & LivePulse (3-column asymmetric layout matching Screenshot 1) */}
        <BendingCard className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Col: Sideline Mobile PWA Screenshot */}
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center">
              <img 
                src={sidelineImg} 
                alt="Sideline PWA" 
                className="w-full h-auto max-h-[70vh] object-contain object-center rounded-[2rem] md:rounded-[2.5rem] shadow-2xl block transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

            {/* Middle Col: Title, Year, Pills, Description */}
            <div className="col-span-1 lg:col-span-4 flex flex-col justify-center py-4 px-2">
              <div className="flex items-baseline justify-between gap-4 mb-5">
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  Sideline
                </h3>
                <span className="font-mono text-sm md:text-base opacity-70 text-white/80 dark:text-[var(--text-primary)]">
                  2026
                </span>
              </div>
              
              {/* Tech Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'Vite', 'Tailwind CSS', 'Nodejs', 'AWS EC2'].map((pill) => (
                  <TechPill key={pill} label={pill} />
                ))}
              </div>

              {/* Description */}
              <p className="text-base md:text-lg font-light opacity-85 leading-relaxed text-white/90 dark:text-[var(--text-primary)]">
                Sideline is a mobile-first progressive web app (PWA) that brings live Bundesliga matches to a second-screen experience: match events, realtime predictions, collectible vault items, squad chat, and leaderboards.
              </p>
            </div>

            {/* Right Col: LivePulse Chat UI Screenshot */}
            <div className="col-span-1 lg:col-span-4 flex items-center justify-center">
              <img 
                src={livePulseImg} 
                alt="Live Pulse Telemetry Engine" 
                className="w-full h-auto max-h-[70vh] object-contain object-center rounded-[2rem] md:rounded-[2.5rem] shadow-2xl block transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>

          </div>
        </BendingCard>

        {/* Project 2 & 3: Terminal Portfolio & 3D Platformer (Side-by-side grid matching Screenshot 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          
          {/* Left Item: Terminal Portfolio (col-span-5) */}
          <BendingCard className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <a href="https://mohib.wiki" target="_blank" rel="noreferrer" className="block group">
              <img 
                src={asciiTerminalImg} 
                alt="Terminal Portfolio" 
                className="w-full h-auto object-contain rounded-[2rem] md:rounded-[2.5rem] shadow-2xl block transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </a>
            <div className="flex flex-col px-3">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  Terminal Portfolio
                </h3>
                <span className="font-mono text-sm md:text-base opacity-70 text-white/80 dark:text-[var(--text-primary)]">
                  2025
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React', 'Typescript', 'Tailwind CSS'].map((pill) => (
                  <TechPill key={pill} label={pill} />
                ))}
              </div>
            </div>
          </BendingCard>

          {/* Right Item: 3D Platformer (col-span-7) */}
          <BendingCard className="col-span-1 lg:col-span-7 flex flex-col gap-6">
            <div className="group">
              <img 
                src={platformerImg} 
                alt="3D Platformer" 
                className="w-full h-auto object-contain rounded-[2rem] md:rounded-[2.5rem] shadow-2xl block transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col px-3">
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white dark:text-[var(--text-primary)]">
                  3D Platformer
                </h3>
                <span className="font-mono text-sm md:text-base opacity-70 text-white/80 dark:text-[var(--text-primary)]">
                  2024
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Unity', 'Blender', 'C#'].map((pill) => (
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
