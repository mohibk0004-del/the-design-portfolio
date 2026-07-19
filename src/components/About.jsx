import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aboutImg from '../assets/aboutme.png'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef(null)
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Handwriting/typing effect
      gsap.fromTo(".signature", 
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          },
          duration: 2,
          ease: "power2.inOut"
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col justify-center py-24 z-20 pointer-events-none text-white mix-blend-difference">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 lg:px-14 w-full">
        
        {/* Left Column: Portrait & Signature */}
        <div className="col-span-1 lg:col-span-4 relative flex justify-center lg:justify-start items-center">
          <div className="relative w-full max-w-[350px] aspect-square overflow-hidden bg-white/10 pointer-events-auto">
            <img 
              src={aboutImg} 
              alt="Mohib" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
          {/* Neon Signature Overlay */}
          <div className="signature absolute top-1/4 -left-4 lg:-left-12 rotate-[-15deg] pointer-events-none">
            <span className="font-sans italic text-7xl md:text-9xl text-[#C0FE04]" style={{ fontFamily: "'Brush Script MT', cursive" }}>
              Mohib
            </span>
          </div>
        </div>

        {/* Right Column: Bio */}
        <div className="col-span-1 lg:col-span-8 flex flex-col justify-center pl-0 lg:pl-12 mt-12 lg:mt-0">
          <h2 className="text-[6vw] md:text-[3.5vw] font-medium leading-[1.1] tracking-tight">
            I'm a Computer Science student with a strong passion for Artificial Intelligence, Cybersecurity, and Game Development.
          </h2>
          <p className="mt-8 text-xl md:text-2xl font-light opacity-80 max-w-3xl leading-relaxed">
            When I'm not writing code or building 3D environments, I'm a photographer capturing moments with my Nikon D3500.
          </p>
          
          <div className="mt-12 text-3xl md:text-5xl font-light leading-tight text-gray-400">
            I'm building <span className="inline-block relative">
              <a href="https://github.com/amna0x/sideline" className="pointer-events-auto text-white border-b-4 border-[#1e1e1e] hover:border-white transition-colors duration-300">Sideline</a>
            </span>, and previously worked on <span className="inline-block relative">
              <a href="https://mohib.app" className="pointer-events-auto text-white border-b-4 border-[#1e1e1e] hover:border-white transition-colors duration-300">Terminal Portfolio</a>
            </span> and <span className="inline-block relative">
              <span className="text-white border-b-4 border-[#1e1e1e]">3D Platformer</span>
            </span>.
          </div>
        </div>

      </div>
    </section>
  )
}
