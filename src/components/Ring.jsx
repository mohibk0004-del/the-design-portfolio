import { useMemo, useRef } from 'react'
import { clamp01, easeInOutCubic, easeOutCubic, lerp, range, seededRandom, useReducedMotion, useScrollFrame } from '../lib/progress'
import { pickImages, ringText } from '../data/content'

// Scene values ported from the reference (world units, camera at z = 50).
const CONFIG = {
  sectionVh: 420,
  cards: 8,
  cameraZ: 50,
  fov: { desktop: 42, mobile: 50 },
  radius: { desktop: 18.5, mobile: 13.5 },
  expand: { desktop: 2.45, mobile: 1.95 },
  depthAmplitude: 2.3,
  cardMin: 3.1,
  cardMax: 4.8,
  introEnd: 0.3,
  introStagger: 0.24,
  stackRadius: { desktop: 0.08, mobile: 0.05 },
  stackZ: { desktop: -9, mobile: -6 },
  fanLift: { desktop: 1.6, mobile: 0.9 },
  scaleMin: 0.24,
  scaleMax: 0.36,
  turns: 1.25,
  smoothing: 0.11,
  expandStart: 0.42,
}
const START_ANGLE = -Math.PI / 2
// [in, out] windows for each paragraph, as section progress.
const TEXT_WINDOWS = [
  { in: [0.17, 0.1], out: [0.4, 0.12] },
  { in: [0.46, 0.15], out: [0.61, 0.12] },
  { in: [0.67, 0.15], out: [0.85, 0.08] },
]
const TRAVEL = 112

const images = pickImages(CONFIG.cards, 4)

function buildCards(mobile) {
  const random = seededRandom(mobile ? 29 : 17)
  const key = mobile ? 'mobile' : 'desktop'
  const n = CONFIG.cards
  return images.map((image, i) => {
    const height = lerp(CONFIG.cardMin, CONFIG.cardMax, random()) * (mobile ? 1.16 : 1)
    const spin = random() * Math.PI * 2
    const spread = CONFIG.stackRadius[key] * Math.pow(random(), 1.8)
    return {
      image,
      width: height,
      height: height / 0.75,
      angle: START_ANGLE + (i / n) * Math.PI * 2,
      introX: Math.cos(spin) * spread,
      introY: Math.sin(spin) * spread,
      introZ: CONFIG.stackZ[key] - 0.08 * i,
      introRx: lerp(-0.18, 0.18, random()),
      introRy: lerp(-0.14, 0.14, random()),
      introRz: lerp(-0.26, 0.26, random()),
      introScale: lerp(CONFIG.scaleMin, CONFIG.scaleMax, random()),
      delay: (i / Math.max(1, n - 1)) * CONFIG.introStagger,
    }
  })
}

function splitLetters(text) {
  return text.split(' ').map((word) => [...word])
}

function AnimatedRing() {
  const section = useRef(null)
  const stage = useRef(null)
  const backdrop = useRef(null)
  const cardEls = useRef([])
  const letters = useRef(ringText.map(() => []))
  const sim = useRef({ value: 0, last: 0, time: 0, version: -1, mobile: null, cards: null, text: ringText.map(() => '') })
  const words = useMemo(() => ringText.map(splitLetters), [])

  useScrollFrame(section, (y, m, time) => {
    const s = sim.current
    const target = clamp01((y - m.top) / Math.max(1, m.height - m.vh))
    const dt = s.time ? Math.min(64, time - s.time) : 16
    s.time = time
    s.value += (target - s.value) * (1 - Math.pow(1 - CONFIG.smoothing, dt / 16.67))
    if (Math.abs(target - s.value) < 0.00005) s.value = target
    if (y < m.top - m.vh * 1.5 || y > m.top + m.height + m.vh) return
    if (s.value === s.last && m.version === s.version) return
    s.last = s.value

    const mobile = m.vw < 900
    const key = mobile ? 'mobile' : 'desktop'
    if (mobile !== s.mobile || m.version !== s.version) {
      s.mobile = mobile
      s.version = m.version
      s.cards = buildCards(mobile)
      s.unit = m.vh / (2 * CONFIG.cameraZ * Math.tan(((CONFIG.fov[key] / 2) * Math.PI) / 180))
      stage.current.style.perspective = `${(CONFIG.cameraZ * s.unit).toFixed(1)}px`
      s.cards.forEach((card, i) => {
        const el = cardEls.current[i]
        if (!el) return
        el.style.width = `${(card.width * s.unit).toFixed(1)}px`
        el.style.height = `${(card.height * s.unit).toFixed(1)}px`
      })
    }

    const p = s.value
    const u = s.unit
    stage.current.style.opacity = range(p, 0, 0.03).toFixed(3)
    backdrop.current.style.opacity = range(p, 0.02, 0.08).toFixed(3)

    const intro = range(p, 0, CONFIG.introEnd)
    const expand = easeInOutCubic(range(p, CONFIG.expandStart, 1 - CONFIG.expandStart))
    const radius = CONFIG.radius[key] * lerp(1, CONFIG.expand[key], expand)
    const rotation = p * CONFIG.turns * Math.PI * 2
    const cardsVisible = range(p, 0.02, 0.06)

    s.cards.forEach((card, i) => {
      const el = cardEls.current[i]
      if (!el) return
      const k = easeInOutCubic(range(intro, card.delay, 1 - CONFIG.introStagger))
      const theta = card.angle + rotation
      const lift = Math.sin(k * Math.PI) * CONFIG.fanLift[key]
      const x = lerp(card.introX, Math.cos(theta) * radius, k)
      const yPos = lerp(card.introY, Math.sin(theta) * radius, k) - lift
      const z = lerp(card.introZ, Math.sin(theta) * CONFIG.depthAmplitude, k)
      const rx = lerp(card.introRx, 0, k)
      const ry = lerp(card.introRy, 0, k)
      const rz = lerp(card.introRz, theta - START_ANGLE, k)
      const scale = lerp(card.introScale, 1, k)
      el.style.opacity = cardsVisible.toFixed(3)
      el.style.transform = `translate(-50%, -50%) translate3d(${(x * u).toFixed(1)}px, ${(yPos * u).toFixed(1)}px, ${(z * u).toFixed(1)}px) rotateX(${rx.toFixed(3)}rad) rotateY(${ry.toFixed(3)}rad) rotateZ(${rz.toFixed(3)}rad) scale(${scale.toFixed(4)})`
    })

    TEXT_WINDOWS.forEach((w, j) => {
      const tIn = range(p, w.in[0], w.in[1])
      const tOut = range(p, w.out[0], w.out[1])
      const stateKey = `${tIn.toFixed(3)}|${tOut.toFixed(3)}`
      if (stateKey === s.text[j]) return
      s.text[j] = stateKey
      const list = letters.current[j]
      const total = list.length
      list.forEach((el, n) => {
        if (!el) return
        const offset = (n / Math.max(1, total - 1)) * 0.6
        const eIn = easeOutCubic(clamp01((tIn - offset) / 0.4))
        const eOut = easeOutCubic(clamp01((tOut - offset) / 0.4))
        const shift = tOut > 0 ? -eOut * TRAVEL : (1 - eIn) * TRAVEL
        el.style.opacity = (tOut > 0 ? 1 - eOut : eIn).toFixed(3)
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}%, 0)`
      })
    })
  })

  let letterIndex = 0
  return (
    <section ref={section} aria-label="Background" className="relative z-[34] -mt-[100vh] w-full overflow-clip" style={{ height: `${CONFIG.sectionVh}vh` }}>
      <div ref={stage} className="sticky top-0 h-screen w-full overflow-hidden" style={{ opacity: 0 }}>
        <div ref={backdrop} className="pointer-events-none absolute inset-0 bg-[var(--ring-bg)]" style={{ opacity: 0 }} />
        {images.map((image, i) => (
          <div key={i} ref={(el) => (cardEls.current[i] = el)} className="scrub absolute top-1/2 left-1/2 overflow-hidden bg-[var(--card)]" style={{ opacity: 0 }}>
            <img src={image.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: image.position }} />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[414px] w-[620px] overflow-hidden max-[900px]:h-[58vh] max-[900px]:w-[88vw]">
            {words.map((paragraph, j) => {
              letterIndex = 0
              return (
                <div key={j} className="absolute inset-0 flex w-full flex-col justify-center px-2 font-sans text-[29px] leading-[1.2414] tracking-[-0.29px] text-[var(--ring-ink)] mix-blend-multiply max-[900px]:px-1 max-[900px]:text-[22px] dark:mix-blend-normal">
                  <p className="sr-only">{ringText[j]}</p>
                  <p aria-hidden="true">
                    {paragraph.map((word, w) => (
                      <span key={w}>
                        <span className="inline-block whitespace-nowrap">
                          {word.map((char) => {
                            const n = letterIndex++
                            return (
                              <span key={n} ref={(el) => (letters.current[j][n] = el)} className="inline-block" style={{ opacity: 0 }}>
                                {char}
                              </span>
                            )
                          })}
                        </span>
                        {w < paragraph.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function StaticRing() {
  return (
    <section aria-label="Background" className="relative w-full bg-[var(--ring-bg)] px-[clamp(16px,2.2vw,44px)] py-[14vh]">
      <div className="mx-auto grid w-[min(980px,100%)] grid-cols-4 gap-3 max-[900px]:grid-cols-2">
        {images.map((image, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden bg-[var(--card)]">
            <img src={image.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: image.position }} />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-[10vh] flex w-[min(620px,100%)] flex-col gap-[0.6em] font-sans text-[29px] leading-[1.2414] text-[var(--ring-ink)] max-[900px]:text-[22px]">
        {ringText.map((text) => <p key={text}>{text}</p>)}
      </div>
    </section>
  )
}

export default function Ring() {
  return useReducedMotion() ? <StaticRing /> : <AnimatedRing />
}
