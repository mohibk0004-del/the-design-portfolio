import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLoading } from '../context/LoadingContext'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const pRef = useRef(null)

  const containerRef = useRef(null)
  const { isLoaded } = useLoading()

  // Hero text animation removed; text is instantly revealed when the preloader slides up.

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col pt-32 pb-24 z-20 pointer-events-none">
      
      {/* Middle Grid Row - Moved Higher */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 lg:px-14 w-full text-sm font-mono mt-0 md:-mt-12 hero-text text-white mix-blend-difference">
        <div className="col-span-1 md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-sans font-medium leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
            Video editing &<br/>Software engineering
          </h2>
        </div>
        <div className="col-span-1 md:col-span-4">
          <p className="leading-relaxed opacity-90 max-w-xs [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
            Bridging the gap between robust software
          </p>
        </div>
        <div className="col-span-1 md:col-span-4">
          <p className="leading-relaxed opacity-90 [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
            Hi, I’m Mohib! A Computer Science student with a passion for building interactive systems from web apps to game prototypes.
          </p>
        </div>
      </div>

      {/* Massive Typography Row */}
      <div className="px-4 lg:px-14 mt-[45vh] lg:mt-[50vh] mb-16 md:mb-32 hero-text pointer-events-none mix-blend-difference">
        <h1 className="text-[10vw] md:text-[8vw] font-bold uppercase leading-[0.85] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.2)]">
          I BRING<br />
          CRAFT & TASTE<br />
          TO DIGITAL WORK
        </h1>
      </div>

    </section>
  )
}
