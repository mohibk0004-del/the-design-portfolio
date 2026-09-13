import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TechStack from './TechStack'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const expertise = [
  { title: 'Web', tools: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS'], outcome: 'Interfaces and full-stack web apps' },
  { title: 'Desktop', tools: ['Python', 'PyQt6', 'Win32 API', 'PowerShell'], outcome: 'Native Windows utilities' },
  { title: '3D and games', tools: ['Unity', 'C#', 'Three.js', 'WebGL', 'Blender', 'ShaderLab', 'HLSL'], outcome: 'Games and interactive graphics' },
  { title: 'Data and runtime', tools: ['Node.js', 'PostgreSQL', 'PL/pgSQL'], outcome: 'Application logic and persistence' },
]

export default function Capabilities() {
  const root = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.expertise-intro span', {
        opacity: 0.15,
        stagger: 0.1,
        scrollTrigger: { trigger: '.expertise-intro', start: 'top 86%', end: 'bottom 55%', scrub: true },
      })
      gsap.from('.expertise-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.expertise-list', start: 'top 82%' },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <section ref={root} className="portfolio-craft" aria-labelledby="craft-title">
      <div className="portfolio-container section-rule" />
      <div className="expertise-layout portfolio-container">
        <h2 className="expertise-intro" id="craft-title">
          <span>Tech stack</span>
        </h2>
        <div className="expertise-list">
          {expertise.map((item) => (
            <article className="expertise-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.outcome}</p>
              <TechStack items={item.tools} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
