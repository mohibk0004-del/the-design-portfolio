import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aboutImg from '../assets/aboutme.png'
import { useTheme } from '../context/ThemeContext'

gsap.registerPlugin(ScrollTrigger)

const aboutText = "I'm a Computer Science student with a strong passion for Artificial Intelligence, Cybersecurity, and Game Development.".split(" ")

export default function About() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const { theme } = useTheme()
  
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
            end: "center center",
            scrub: true,
          },
          duration: 2,
          ease: "power2.inOut"
        }
      )

      // Text reveal effect
      gsap.fromTo(textRef.current.children, 
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "center 50%",
            scrub: true,
          }
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col justify-center py-24 z-20 pointer-events-none text-[var(--text-primary)]">
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
          <h2 ref={textRef} className="text-[6vw] md:text-[3.5vw] font-medium leading-[1.1] tracking-tight">
            {aboutText.map((word, i) => (
              <span key={i} className="opacity-20 inline-block mr-[0.25em]">{word}</span>
            ))}
          </h2>
          <p className="mt-8 text-xl md:text-2xl font-light opacity-80 max-w-3xl leading-relaxed">
            When I'm not writing code or building 3D environments, I'm a photographer capturing moments with my Nikon D3500.
          </p>
          
          <div className="mt-12 text-3xl md:text-5xl font-light leading-tight text-[var(--text-primary)]">
            <span>I'm building </span>
            <span className="inline-block relative">
              <a 
                href="https://github.com/amna0x/sideline" 
                className={`pointer-events-auto border-b-4 transition-colors duration-300 hover:border-current ${
                  theme === 'light' ? 'text-[#ea580c] border-[#ea580c]' : 'text-[#a855f7] border-[#a855f7]'
                }`}
              >
                Sideline
              </a>
            </span>
            <span>, and previously worked on </span>
            <span className="inline-block relative">
              <a 
                href="https://mohib.wiki" 
                className={`pointer-events-auto border-b-4 transition-colors duration-300 ${
                  theme === 'light' ? 'text-[var(--text-primary)] border-[var(--text-primary)]' : 'text-[#C0FE04] border-[#C0FE04]'
                }`}
              >
                Terminal Portfolio
              </a>
            </span>
            <span> and </span>
            <span className="inline-block relative">
              <span 
                className={`border-b-4 ${
                  theme === 'light' ? 'text-[var(--text-primary)] border-[var(--text-primary)]' : 'text-[#ec4899] border-[#ec4899]'
                }`}
              >
                3D Platformer
              </span>
            </span>.
          </div>
        </div>

      </div>
    </section>
  )
}
