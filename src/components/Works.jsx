import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import zeroInImg from '../assets/zero-in.jpg'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import easyresImg from '../assets/easyres.jpg'
import platformerImg from '../assets/3dplatformer.png'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const projects = [
  {
    name: 'Zero-in', category: 'AI study workspace', year: '2026',
    description: 'Drop in your notes, a PDF, or a topic. Zero-in turns it into material you can actually study.',
    tech: ['Next.js', 'TypeScript', 'GSAP', 'PostgreSQL', 'Gemini'],
    href: 'https://mohib.wiki',
    images: [{ src: zeroInImg, alt: 'Zero-in study workspace landing page' }],
  },
  {
    name: 'Sideline', companion: '& LivePulse', category: 'Real-time web', year: '2026',
    description: 'Two parts of the same experiment: a web app with live chat and telemetry.',
    tech: ['React', 'TypeScript', 'WebGL', 'WebSockets', 'GLSL'],
    href: 'https://www.mohib.app',
    images: [{ src: sidelineImg, alt: 'Sideline web app interface' }, { src: livePulseImg, alt: 'LivePulse chat and telemetry interface' }],
  },
  {
    name: 'Easyres', category: 'Desktop utility', year: '2026',
    description: 'A small Windows app that puts native display controls in one place.',
    tech: ['Python', 'PyQt6', 'ctypes', 'Win32 API'],
    href: 'https://github.com/mohibk0004-del/easyres/',
    images: [{ src: easyresImg, alt: 'Easyres desktop utility and its display controls' }],
  },
  {
    name: '3D Platformer', category: 'Game', year: '2026',
    description: 'A platformer built around 3D movement and physics.',
    tech: ['Unity', 'Blender', 'C#', 'ShaderLab'],
    href: 'https://github.com/mohibk0004-del/unity-game',
    images: [{ src: platformerImg, alt: 'Three-dimensional platformer game environment' }],
  },
]

// One preview for the whole list: it trails the cursor and tilts a little with horizontal speed.
function Preview({ active }) {
  const root = useRef(null)
  const visible = active !== null

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pos = { x: 0, y: 0, tx: 0, ty: 0, tilt: 0, seen: false }
    let frame = 0
    let width = root.current?.offsetWidth ?? 0
    const resize = () => { width = root.current?.offsetWidth ?? 0 }
    const move = (event) => {
      pos.tx = event.clientX
      pos.ty = event.clientY
      if (!pos.seen) {
        pos.seen = true
        pos.x = pos.tx
        pos.y = pos.ty
      }
    }
    const tick = () => {
      const ease = reduced ? 1 : 0.15
      const dx = (pos.tx - pos.x) * ease
      pos.x += dx
      pos.y += (pos.ty - pos.y) * ease
      pos.tilt += ((reduced ? 0 : Math.max(-6, Math.min(6, dx * 0.4))) - pos.tilt) * 0.12
      if (root.current) {
        // Flip to the left of the cursor near the right edge so the preview never leaves the screen.
        const left = pos.x + 28 + width > window.innerWidth - 16 ? pos.x - 28 - width : pos.x + 28
        root.current.style.transform = `translate3d(${left.toFixed(1)}px, ${(pos.y - width * 0.375).toFixed(1)}px, 0) rotate(${pos.tilt.toFixed(2)}deg)`
      }
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', move, { passive: true })
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', move)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={root} className="ed-preview" data-visible={visible ? '' : undefined} aria-hidden="true">
      <div className="ed-preview-inner">
        {projects.map((project, i) => (
          <div key={project.name} className="ed-preview-item" data-active={active === i ? '' : undefined}>
            {project.images.map((image) => <img key={image.src} src={image.src} alt="" decoding="async" />)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Works() {
  const root = useRef(null)
  const [active, setActive] = useState(null)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ed-work-head > *', {
        opacity: 0,
        y: 16,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-work-head', start: 'top 85%' },
      })
      // Each rule draws itself left to right, then the row's columns follow.
      gsap.utils.toArray('.ed-row').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 90%' } })
        tl.from(row.querySelector('.ed-rule'), { scaleX: 0, duration: 1, ease: 'power3.inOut' })
          .from(row.querySelectorAll('.ed-row-link > :not(.ed-thumb)'), { opacity: 0, y: 10, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0.25)
      })
      gsap.from('.ed-index > .ed-rule', {
        scaleX: 0,
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ed-index > .ed-rule', start: 'top 95%' },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <section id="work" ref={root} className="ed-work" aria-labelledby="work-title">
      <div className="ed-container">
        <header className="ed-work-head">
          <h2 id="work-title" className="ed-h2">Selected work<span className="ed-count">({projects.length})</span></h2>
          <p>Some solve a problem. Others were simply fun to build.</p>
        </header>
        <ol className="ed-index" onMouseLeave={() => setActive(null)}>
          {projects.map((project, index) => (
            <li className="ed-row" key={project.name}>
              <span className="ed-rule" aria-hidden="true" />
              <a
                className="ed-row-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              >
                <span className="ed-thumb" aria-hidden="true">
                  {project.images.map((image) => <img key={image.src} src={image.src} alt="" loading="lazy" decoding="async" />)}
                </span>
                <span className="ed-num">{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="ed-name">
                    {project.name}
                    {project.companion && <em> {project.companion}</em>}
                  </span>
                  <span className="ed-kind">{project.category}, {project.year}</span>
                </span>
                <span className="ed-desc">{project.description}</span>
                <span className="ed-stack">{project.tech.join(', ')}</span>
                <span className="ed-arrow" aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li className="ed-rule" aria-hidden="true" />
        </ol>
      </div>
      <Preview active={active} />
    </section>
  )
}
