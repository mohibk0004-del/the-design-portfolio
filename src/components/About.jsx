import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aboutImg from '../assets/aboutme.png'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const statement = [
  { text: "I'm a computer science student building web apps, Windows tools and" },
  { text: 'game prototypes.', em: true },
]

export default function About() {
  const root = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // The portrait is uncovered from the bottom up while the image settles.
      gsap.timeline({ scrollTrigger: { trigger: '.ed-portrait', start: 'top 92%', end: 'top 38%', scrub: 0.6 } })
        .fromTo('.ed-portrait', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
        .fromTo('.ed-portrait img', { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
      // Words brighten as they are read, rather than sliding in.
      gsap.fromTo('.ed-statement .ed-word', { opacity: 0.16 }, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: '.ed-statement', start: 'top 82%', end: 'bottom 52%', scrub: true },
      })
      gsap.from('.ed-about-body', {
        opacity: 0,
        y: 12,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-about-body', start: 'top 88%' },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <section id="about" ref={root} className="ed-about" aria-labelledby="about-title">
      <div className="ed-container ed-about-grid">
        <figure className="ed-portrait">
          <img src={aboutImg} alt="Mohib in front of a green backdrop" loading="lazy" decoding="async" />
        </figure>
        <div className="ed-about-copy">
          <p className="ed-label">About</p>
          <h2 id="about-title" className="ed-statement">
            {statement.map((part) => {
              const words = part.text.split(' ').map((word, i) => <span key={i} className="ed-word">{word} </span>)
              return part.em ? <em key={part.text}>{words}</em> : <span key={part.text}>{words}</span>
            })}
          </h2>
          <p className="ed-about-body">
            My GitHub moves between JavaScript and TypeScript projects, Python utilities, and C# games with graphics and shader work. When I'm not writing code I'm usually behind a camera.
          </p>
          <p className="ed-about-body">
            See <a className="ed-link" href="https://mohib.wiki" target="_blank" rel="noreferrer">Zero-in</a>, <a className="ed-link" href="https://github.com/mohibk0004-del/easyres" target="_blank" rel="noreferrer">Easyres</a>, and the rest on <a className="ed-link" href="https://github.com/mohibk0004-del" target="_blank" rel="noreferrer">GitHub</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
