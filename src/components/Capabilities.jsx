import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const toolkit = [
  { title: 'Web', outcome: 'Interfaces and full-stack web apps', tools: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML and CSS'] },
  { title: 'Desktop', outcome: 'Native Windows utilities', tools: ['Python', 'PyQt6', 'Win32 API', 'PowerShell'] },
  { title: '3D and games', outcome: 'Games and interactive graphics', tools: ['Unity', 'C#', 'Three.js', 'WebGL', 'Blender', 'ShaderLab, HLSL'] },
  { title: 'Data', outcome: 'Application logic and storage', tools: ['Node.js', 'PostgreSQL', 'PL/pgSQL'] },
]

export default function Capabilities() {
  const root = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ed-tools-head', {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-tools-head', start: 'top 85%' },
      })
      gsap.from('.ed-tools-col', {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-tools-grid', start: 'top 85%' },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <section ref={root} className="ed-tools" aria-labelledby="tools-title">
      <div className="ed-container">
        <div className="ed-tools-head">
          <h2 id="tools-title" className="ed-h2">Tools I reach for</h2>
        </div>
        <div className="ed-tools-grid">
          {toolkit.map((group) => (
            <article className="ed-tools-col" key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.outcome}</p>
              <ul>
                {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
