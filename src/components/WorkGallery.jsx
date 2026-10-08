import { useRef } from 'react'
import { clamp, easeInOutCubic, easeOutCubic, lerp, range, useReducedMotion, useScrollFrame } from '../lib/progress'
import { projects } from '../data/content'

const DEG = 180 / Math.PI
// Resting poses for cards once they have been passed (radians, ported from the reference).
const POSES = [
  { x: -8.2, y: -0.4, rx: -0.2, ry: 0.55, rz: -0.18 },
  { x: 8, y: 0.45, rx: 0.16, ry: -0.56, rz: 0.16 },
  { x: -7.5, y: 1.1, rx: 0.24, ry: 0.42, rz: -0.24 },
  { x: 7.2, y: -1, rx: -0.18, ry: -0.5, rz: 0.2 },
  { x: -8.5, y: -1, rx: 0.35, ry: 0.2, rz: -0.08 },
  { x: 8.6, y: 0.55, rx: 0.14, ry: 0.6, rz: -0.2 },
  { x: -8.7, y: -0.2, rx: -0.2, ry: -0.6, rz: 0.18 },
]
const TITLE_GAP = 216
const titleSize = 'text-[clamp(180px,20.5vw,390px)] max-[900px]:text-[clamp(112px,34vw,190px)]'

function CardImages({ project, eager }) {
  return project.images.map((image) => (
    <img
      key={image.src}
      src={image.src}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="h-full min-w-0 flex-1 object-cover"
      style={{ objectPosition: image.position }}
    />
  ))
}

// Where card i sits when the gallery has advanced to position c.
function cardPose(d, i, vw, vh) {
  const pose = POSES[i % POSES.length]
  const side = Math.sign(pose.x)
  const restX = side * vw * 0.3 * (Math.abs(pose.x) / 8.2)
  const restY = pose.y * vh * 0.05
  if (d <= -1 || d >= 2) return null
  if (d < 0) {
    const t = d + 1
    return { x: 0, y: (1 - t) * vh * 0.95, rx: (1 - t) * 16, ry: 0, rz: (1 - t) * side * -5, s: 1, o: 1 }
  }
  if (d <= 1) {
    return {
      x: restX * d,
      y: restY * d,
      rx: pose.rx * DEG * 0.6 * d,
      ry: pose.ry * DEG * d,
      rz: pose.rz * DEG * d,
      s: lerp(1, 0.56, d),
      o: 1,
    }
  }
  const t = d - 1
  return {
    x: restX * lerp(1, 1.12, t),
    y: restY,
    rx: pose.rx * DEG * 0.6,
    ry: pose.ry * DEG,
    rz: pose.rz * DEG,
    s: lerp(0.56, 0.5, t),
    o: 1 - easeOutCubic(t),
  }
}

function AnimatedGallery() {
  const section = useRef(null)
  const cards = useRef([])
  const track = useRef(null)
  const current = useRef(null)
  const next = useRef(null)
  const caption = useRef(null)
  const titleWrap = useRef(null)
  const state = useRef({ key: '', seg: -1, width: 0, captionIndex: -1 })
  const count = projects.length

  useScrollFrame(section, (y, m) => {
    const s = state.current
    if (y < m.top - m.vh * 1.2 || y > m.top + m.height + m.vh) return
    const key = `${Math.round(y)}|${m.version}`
    if (key === s.key) return
    s.key = key

    const g = clamp((y - m.top) / m.vh, 0, count)
    const seg = Math.min(Math.floor(g), count - 1)
    const tr = seg < count - 1 ? easeInOutCubic(range(g - seg, 0.3, 0.7)) : 0
    const c = seg + tr

    // Title intro as the stage arrives, then the track slides to the next title.
    const arrive = easeOutCubic(range(y, m.top - m.vh * 0.6, m.vh * 0.6))
    if (titleWrap.current) {
      titleWrap.current.style.opacity = arrive.toFixed(3)
      titleWrap.current.style.transform = `translate3d(0, ${((1 - arrive) * 24).toFixed(2)}px, 0)`
    }
    if (seg !== s.seg || m.version !== s.version) {
      s.seg = seg
      s.version = m.version
      current.current.textContent = projects[seg].title
      next.current.textContent = projects[seg + 1]?.title ?? ''
      s.width = current.current.offsetWidth
      s.left = titleWrap.current.offsetLeft
    }
    // The last title has no successor to slide to, so drift it far enough to read in full.
    const overflow = seg === count - 1 ? Math.max(0, s.width - (m.vw - s.left * 2)) : 0
    const drift = overflow * easeInOutCubic(range(g - seg, 0.05, 0.6))
    track.current.style.transform = `translate3d(${(-tr * (s.width + TITLE_GAP) - drift).toFixed(2)}px, 0, 0)`

    const captionIndex = tr < 0.5 ? seg : seg + 1
    if (caption.current) {
      if (captionIndex !== s.captionIndex) {
        s.captionIndex = captionIndex
        caption.current.textContent = projects[captionIndex].caption
      }
      caption.current.style.opacity = Math.abs(1 - 2 * tr).toFixed(3)
    }

    cards.current.forEach((el, i) => {
      if (!el) return
      const pose = cardPose(c - i, i, m.vw, m.vh)
      if (!pose) {
        el.style.visibility = 'hidden'
        return
      }
      const d = c - i
      el.style.visibility = 'visible'
      el.style.opacity = pose.o.toFixed(3)
      el.style.zIndex = String(50 - Math.round(Math.abs(d) * 10))
      el.style.pointerEvents = Math.abs(d) < 0.15 ? 'auto' : 'none'
      el.tabIndex = Math.abs(d) < 0.5 ? 0 : -1
      el.style.transform = `translate(-50%, -50%) translate3d(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px, 0) rotateX(${pose.rx.toFixed(2)}deg) rotateY(${pose.ry.toFixed(2)}deg) rotateZ(${pose.rz.toFixed(2)}deg) scale(${pose.s.toFixed(4)})`
    })
  })

  return (
    <section ref={section} id="work" aria-labelledby="work-heading" className="relative z-[1] w-full" style={{ height: `${(count + 1) * 100}vh` }}>
      <h2 id="work-heading" className="sr-only">Selected work</h2>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={titleWrap} aria-hidden="true" className={`scrub pointer-events-none absolute bottom-0 left-[clamp(16px,2.2vw,44px)] z-0 h-[0.82em] w-screen font-sans leading-[0.78] font-normal tracking-[-0.02em] whitespace-nowrap text-[var(--ink)] uppercase max-[900px]:top-[calc(50%+min(78vw,480px)*0.375-0.18em)] max-[900px]:bottom-auto ${titleSize}`} style={{ opacity: 0 }}>
          <div ref={track} className="scrub relative flex h-full w-max min-w-[100vw] items-end" style={{ paddingRight: TITLE_GAP }}>
            <div ref={current} className="relative w-max shrink-0">{projects[0].title}</div>
            <div ref={next} className="absolute bottom-0 left-full w-max">{projects[1]?.title}</div>
          </div>
        </div>

        <span ref={caption} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-[clamp(16px,2.2vw,44px)] z-0 hidden max-w-[24vw] -translate-y-1/2 font-sans text-[clamp(11px,0.78vw,15px)] leading-[1.12] tracking-[0.08em] whitespace-nowrap text-[var(--ink)] uppercase min-[1101px]:block">
          {projects[0].caption}
        </span>

        <div className="absolute inset-0 z-10 [perspective:1600px]">
          {projects.map((project, i) => (
            <a
              key={project.title}
              ref={(el) => (cards.current[i] = el)}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="arrow"
              aria-label={`Open ${project.title} (opens in a new tab)`}
              className="scrub absolute top-[46%] left-1/2 flex aspect-[4/3] w-[clamp(280px,40vw,680px)] gap-[2px] overflow-hidden bg-[var(--card)] max-[900px]:top-1/2 max-[900px]:w-[min(78vw,480px)]"
              style={{ transform: 'translate(-50%, -50%)', visibility: i === 0 ? 'visible' : 'hidden' }}
            >
              <CardImages project={project} eager={i === 0} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function StaticGallery() {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative w-full px-[clamp(16px,2.2vw,44px)] py-[14vh]">
      <h2 id="work-heading" className="sr-only">Selected work</h2>
      <ul className="flex flex-col gap-[14vh]">
        {projects.map((project) => (
          <li key={project.title}>
            <a href={project.href} target="_blank" rel="noreferrer" className="group block">
              <span className="mx-auto flex aspect-[4/3] w-[min(78vw,680px)] gap-[2px] overflow-hidden bg-[var(--card)]">
                <CardImages project={project} />
              </span>
              <span className={`mt-6 block font-sans leading-[0.78] font-normal tracking-[-0.02em] text-[var(--ink)] uppercase text-[clamp(56px,12vw,220px)]`}>{project.title}</span>
              <span className="mt-4 block font-sans text-xs tracking-[0.08em] text-[var(--ink)] uppercase">{project.caption}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function WorkGallery() {
  return useReducedMotion() ? <StaticGallery /> : <AnimatedGallery />
}
