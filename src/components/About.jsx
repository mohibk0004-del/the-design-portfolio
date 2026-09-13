import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CrosshairGrid from './CrosshairGrid'
import aboutImg from '../assets/aboutme.png'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const containerRef = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo('.about-copy > *', { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-copy', start: 'top 82%' },
      })
    }, containerRef)
    return () => context.revert()
  }, [])

  return (
    <section id="about" ref={containerRef} className="about-section relative w-full py-32 md:py-48 z-20 text-[var(--text-primary)]">
      <CrosshairGrid opacity={0.35} style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)' }} />
      <div className="about-layout portfolio-container relative z-10">
        <figure className="about-portrait">
          <img src={aboutImg} alt="Mohib" loading="lazy" decoding="async" />
        </figure>
        <div className="about-copy">
          <h2>I'm a Computer Science student building web apps, Windows tools, and game prototypes.</h2>
          <p>My GitHub moves between JavaScript and TypeScript projects, Python utilities, and C# games with graphics and shader work.</p>
          <p className="about-links">
            See <a href="https://mohib.wiki" target="_blank" rel="noreferrer">Zero-in</a>, <a href="https://github.com/mohibk0004-del/easyres" target="_blank" rel="noreferrer">Easyres</a>, and the rest of my work on <a href="https://github.com/mohibk0004-del" target="_blank" rel="noreferrer">GitHub</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
