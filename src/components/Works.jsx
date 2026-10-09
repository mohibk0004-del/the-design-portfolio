import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import zeroInImg from '../assets/zero-in.jpg'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import easyresImg from '../assets/easyres.jpg'
import platformerImg from '../assets/3dplatformer.png'
import TechStack from './TechStack'
import './Portfolio.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function BendingCard({ children, className }) {
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 45, stiffness: 350 })
  const skewY = useTransform(velocity, [-1200, 1200], [3, -3])
  const reducedMotion = useReducedMotion()
  return <motion.div className={className} style={reducedMotion ? undefined : { skewY }}>{children}</motion.div>
}

const projects = [
  {
    name: 'Zero-in', category: 'AI study workspace',
    description: 'Drop in your notes, a PDF, or a topic. Zero-in turns it into material you can actually study.',
    tech: ['Next.js', 'TypeScript', 'GSAP', 'PostgreSQL', 'Gemini'],
    href: 'https://mohib.wiki', link: 'Open Zero-in', kind: 'zero-in',
    images: [{ src: zeroInImg, alt: 'Zero-in study workspace landing page' }],
  },
  {
    name: 'Sideline', companion: '& LivePulse', category: 'Real-time web experiences',
    description: 'Sideline and LivePulse are two parts of the same experiment: a web app with live chat and telemetry.',
    tech: ['React', 'TypeScript', 'WebGL', 'WebSockets', 'GLSL'],
    href: 'https://www.mohib.app', link: 'Explore project', kind: 'sideline',
    images: [{ src: sidelineImg, alt: 'Sideline web app interface' }, { src: livePulseImg, alt: 'LivePulse chat and telemetry interface' }],
  },
  {
    name: 'Easyres', category: 'Desktop utility',
    description: 'A small Windows app that puts native display controls in one place.',
    tech: ['Python', 'PyQt6', 'ctypes', 'Win32 API'],
    href: 'https://github.com/mohibk0004-del/easyres/', link: 'View source', kind: 'easyres',
    images: [{ src: easyresImg, alt: 'Easyres desktop utility and its display controls' }],
  },
  {
    name: '3D', companion: 'Platformer', category: 'Game development',
    description: 'A platformer built around 3D movement and physics.',
    tech: ['Unity', 'Blender', 'C#', 'ShaderLab'],
    href: 'https://github.com/mohibk0004-del/unity-game', link: 'View source', kind: 'platformer',
    images: [{ src: platformerImg, alt: 'Three-dimensional platformer game environment' }],
  },
]

export default function Works() {
  const root = useRef(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.work-heading .line-inner', {
        yPercent: 110,
        rotation: 3,
        stagger: 0.09,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-heading', start: 'top 88%' },
      })
      gsap.utils.toArray('.project-chapter').forEach((chapter) => {
        const stage = chapter.querySelector('.project-stage')
        gsap.fromTo(stage, { y: 60, scale: 0.88, opacity: 0.4 }, {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top 96%', end: 'top 38%', scrub: 0.45 },
        })
        gsap.from(chapter.querySelectorAll('.project-copy > *'), {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: chapter, start: 'top 80%' },
        })
      })
    })
    media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.project-image').forEach((image) => {
        gsap.fromTo(image, { y: 22 }, {
          y: -22,
          ease: 'none',
          scrollTrigger: { trigger: image.closest('.project-stage'), start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <section id="work" ref={root} className="portfolio-work" aria-labelledby="work-title">
      <div className="work-intro portfolio-container">
        <div className="section-eyebrow"><span>Projects</span><span>01 to 04</span></div>
        <div className="work-heading">
          <h2 id="work-title"><span className="line-mask"><span className="line-inner">Selected</span></span><span className="line-mask"><span className="line-inner work-heading-last">w<span className="expressive-o">o</span>rk<span className="type-period">.</span></span></span></h2>
          <div className="work-intro-aside">
            <p>Some solve a problem.<br />Others were simply fun to build.</p>
            <span className="work-count">Four selected projects <ArrowDown size={17} aria-hidden="true" /></span>
          </div>
        </div>
      </div>

      <div className="project-chapters portfolio-container">
        {projects.map((project, index) => (
          <article id={`project-${project.kind}`} className={`project-chapter project-chapter--${project.kind}`} data-index={index} key={project.kind}>
            <div className="project-copy">
              <div className="project-kicker"><span className="project-number">0{index + 1}</span><span>{project.category}</span></div>
              <h3>{project.name}{project.companion && <><br /><span>{project.companion}</span></>}</h3>
              <p className="project-description">{project.description}</p>
              <TechStack items={project.tech} className="project-tech" />
              <a className="portfolio-link" href={project.href} target="_blank" rel="noreferrer">{project.link}<ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <a className={`project-stage stage--${project.kind}`} href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.link}: ${project.name} ${project.companion || ''} (opens in a new tab)`}>
              <div className="project-images">
                {project.images.map((image) => <div className="project-image" key={image.src}><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /></div>)}
              </div>
              <span className="stage-bottom" aria-hidden="true"><span className="stage-arrow"><ArrowUpRight size={24} /></span></span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
