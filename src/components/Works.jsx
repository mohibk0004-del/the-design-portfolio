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
    <span className="bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm border border-[var(--text-primary)]/10 pointer-events-auto hover:-translate-y-1 transition-transform cursor-pointer">
      {iconUrl ? (
        <img src={iconUrl} alt={tech} className={`w-5 h-5 object-contain ${needsInvert ? 'dark:invert' : ''}`} />
      ) : (
        <span className="text-lg leading-none opacity-80">✦</span>
      )}
      {tech}
    </span>
  )
}

function BendingCard({ children, className }) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  
  // Map scroll velocity to rotateX for a vertical bending/page curl effect
  const rotateX = useTransform(smoothVelocity, [-1000, 1000], [15, -15])
  const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [0.95, 1, 0.95])
  
  return (
    <motion.div 
      className={className}
      style={{ rotateX, scaleY: scale, transformPerspective: 1200 }}
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
        <div className="col-span-10 md:col-span-8 lg:col-span-5 col-start-2 lg:col-start-2 flex flex-col gap-6">
          <BendingCard className="pointer-events-auto h-96 relative group cursor-pointer overflow-hidden rounded-[40px] shadow-2xl drop-shadow-xl transition-shadow duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <a href="https://github.com/amna0x/sideline" className="block w-full h-full relative">
               <img src={sidelineImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Sideline" />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
               <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-6xl text-white tracking-tighter drop-shadow-lg">
                  Sideline
               </div>
               <div className="absolute top-8 right-12 text-xs font-mono uppercase bg-[#C0FE04] text-black px-3 py-1 font-bold shadow-lg z-10">Featured Project</div>
            </a>
          </BendingCard>
          <div className="flex flex-wrap gap-3 pointer-events-auto">
            {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Nodejs', 'Express', 'Rest API', 'AWS EC2', 'AWS Cognito'].map((tech, i) => (
              <TechPill key={tech} tech={tech} index={i} />
            ))}
          </div>
        </div>

        {/* Decorator Block */}
        <BendingCard className="hidden lg:block col-span-3 col-start-9 mt-24 pointer-events-auto h-48 rounded-3xl overflow-hidden group shadow-xl drop-shadow-lg">
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
        <div className="col-span-12 md:col-span-10 lg:col-span-7 col-start-1 lg:col-start-4 mt-48 flex flex-col gap-6">
          <BendingCard className="pointer-events-auto h-[500px]">
            <a href="https://mohib.wiki" className="block w-full h-full bg-[#0a0a0a] border border-[#333] rounded-xl flex flex-col overflow-hidden shadow-2xl drop-shadow-2xl transition-shadow duration-500 group cursor-pointer hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
              {/* Terminal Header */}
              <div className="h-10 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-[#333]">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 font-mono text-xs text-gray-500">mohib.wiki — -bash — 80x24</span>
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
          <div className="flex flex-wrap gap-3 pointer-events-auto">
            {['React Native', 'Typescript', 'Vite', 'Tailwind CSS', 'Node JS'].map((tech, i) => (
              <TechPill key={tech} tech={tech} index={i} />
            ))}
          </div>
        </div>

        {/* Project 3: 3D Platformer */}
        <div className="col-span-10 md:col-span-7 lg:col-span-6 col-start-2 lg:col-start-7 mt-32 flex flex-col gap-6">
          <BendingCard className="pointer-events-auto h-80 rounded-[40px] overflow-hidden group shadow-2xl drop-shadow-xl transition-shadow duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <a href="#" className="block w-full h-full relative">
               <img src={platformerImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="3D Platformer" />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
               <div className="absolute inset-0 flex items-center justify-center text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase z-10 drop-shadow-xl">
                 3D Platformer
               </div>
            </a>
          </BendingCard>
          <div className="flex flex-wrap gap-3 pointer-events-auto">
            {['Unity', 'Blender', 'C#'].map((tech, i) => (
              <TechPill key={tech} tech={tech} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
