import { useRef } from 'react'
import { useScroll, useTransform, motion, useVelocity, useSpring } from 'framer-motion'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import asciiTerminalImg from '../assets/ascii terminal.jpg'
import platformerImg from '../assets/3dplatformer.png'

const techIconMap = {
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'React Native': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  'Framer Motion': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg',
  'Nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'Node JS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
  'Rest API': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
  'AWS EC2': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  'AWS Cognito': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  'Typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  'Unity': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg',
  'Blender': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
}

function TechPill({ tech }) {
  const iconUrl = techIconMap[tech]
  const needsInvert = tech === 'Express' || tech === 'Unity' || tech.includes('AWS')
  return (
    <span className="bg-white/5 text-white px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 border border-white/30 backdrop-blur-sm pointer-events-auto hover:bg-white/20 hover:text-white hover:border-white/60 transition-all cursor-pointer shadow-sm">
      {iconUrl ? (
        <img src={iconUrl} alt={tech} className={`w-3.5 h-3.5 object-contain ${needsInvert ? 'dark:invert' : ''}`} />
      ) : (
        <span className="text-sm leading-none opacity-80">✦</span>
      )}
      {tech}
    </span>
  )
}

function BendingCard({ children, className }) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 200, damping: 25 }) // Emil's spring physics
  
  // Noticeable vertical bending
  const rotateX = useTransform(smoothVelocity, [-800, 800], [25, -25])
  
  return (
    <motion.div 
      className={className}
      style={{ rotateX, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  )
}

export default function Works() {
  return (
    <section id="work" className="relative w-full py-48 z-20 pointer-events-none text-white overflow-hidden">
      
      {/* Dense Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-24 px-4 lg:px-14 min-h-screen grid-flow-dense max-w-[1600px] mx-auto">
        
        {/* Project 1: Sideline (Massive Feature) */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 group items-center">
          <BendingCard className="pointer-events-auto w-full relative rounded-[2.5rem] overflow-hidden bg-[var(--text-primary)]/5 border border-[var(--text-primary)]/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <a href="https://github.com/amna0x/sideline" className="block w-full h-full relative cursor-none md:cursor-pointer">
               <img 
                 src={sidelineImg} 
                 className="w-full h-auto block transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]" 
                 alt="Sideline Interface" 
               />
               <div className="absolute inset-0 bg-transparent group-hover:bg-[var(--text-primary)]/5 transition-colors duration-500"></div>
            </a>
          </BendingCard>
          
          {/* Details (Right Side) */}
          <div className="flex flex-col gap-4 md:gap-6 pointer-events-auto px-2 lg:px-0">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-baseline justify-between w-full pb-1">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">Sideline</h3>
                <span className="text-xs md:text-sm font-mono text-white/90 tracking-widest">2026</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {['React', 'Vite', 'Tailwind CSS', 'Nodejs', 'AWS EC2'].map((tech, i) => (
                  <TechPill key={tech} tech={tech} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-white/70 font-medium mt-2 max-w-lg">
                Sideline is a mobile-first progressive web app (PWA) that brings live Bundesliga matches to a second-screen experience: match events, realtime predictions, collectible vault items, squad chat, and leaderboards.
              </p>
            </div>
          </div>
        </div>

        {/* Live Pulse (Part of Sideline) */}
        <div className="hidden md:flex col-span-1 md:col-span-4 flex-col justify-end group pb-[88px]">
          <BendingCard className="pointer-events-auto w-full h-64 relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--text-primary)]/10">
            <div className="w-full h-full relative">
               <img 
                 src={livePulseImg} 
                 className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]" 
                 alt="Live Pulse" 
               />
               <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
                  <div className="text-center font-mono text-[10px] uppercase text-white/90 tracking-[0.2em] leading-relaxed">
                    Live Pulse <br/> Prediction Engine <br/> WebSockets
                  </div>
               </div>
            </div>
          </BendingCard>
        </div>

        {/* Project 2: ASCII Terminal (Tall Portrait) */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-6 group md:mt-24">
          <BendingCard className="pointer-events-auto w-full relative rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-[#333] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <a href="https://mohib.wiki" className="block w-full h-full relative cursor-none md:cursor-pointer flex flex-col">
              <div className="h-12 bg-[#1a1a1a] flex items-center px-6 gap-2 border-b border-[#333] shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-4 font-mono text-[10px] text-gray-500 tracking-widest">mohib.wiki — bash</span>
              </div>
              <div className="relative flex-1 overflow-hidden bg-black">
                <img 
                  src={asciiTerminalImg} 
                  className="w-full h-auto block opacity-60 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]" 
                  alt="ASCII Terminal" 
                />
              </div>
            </a>
          </BendingCard>
          
          <div className="flex flex-col gap-3 px-2 pointer-events-auto w-full">
            <div className="flex items-baseline justify-between w-full pb-1">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">Terminal Portfolio</h3>
              <span className="text-xs md:text-sm font-mono text-white/90 tracking-widest">2025</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['React Native', 'Typescript', 'Tailwind CSS'].map((tech, i) => (
                <TechPill key={tech} tech={tech} />
              ))}
            </div>
          </div>
        </div>

        {/* Project 3: 3D Platformer (Wide Footer) */}
        <div className="col-span-1 md:col-span-7 flex flex-col gap-6 group md:-mt-8">
          <BendingCard className="pointer-events-auto w-full relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[var(--text-primary)]/10">
            <a href="#" className="block w-full h-full relative cursor-none md:cursor-pointer bg-[#000]">
               <img 
                 src={platformerImg} 
                 className="w-full h-auto block opacity-80 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]" 
                 alt="3D Platformer" 
               />
            </a>
          </BendingCard>
          
          <div className="flex flex-col gap-3 px-2 pointer-events-auto w-full">
            <div className="flex items-baseline justify-between w-full pb-1">
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">3D Platformer</h3>
              <span className="text-xs md:text-sm font-mono text-white/90 tracking-widest">2024</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {['Unity', 'Blender', 'C#'].map((tech, i) => (
                <TechPill key={tech} tech={tech} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
