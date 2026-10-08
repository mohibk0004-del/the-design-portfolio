import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { clamp, lerp, useScrollFrame } from '../lib/progress'
import { prefersReducedMotion } from '../lib/scroll'
import { pickImages } from '../data/content'

// Grid slots: row/column in an 8-column grid of 10vh rows, offset by a % of the
// tile's own size, plus a parallax depth (below 0.84 drifts up, above drifts down).
const SLOTS = [
  { r: 2, c: 4, x: -12, y: -34, w: 88, depth: 0.56, m: { r: 2, c: 6, x: 15, y: 8 } },
  { r: 4, c: 1, x: 22, y: 2, w: 86, depth: 0.88, m: { r: 4, c: 2, x: 6, y: -30 } },
  { r: 3, c: 6, x: -8, y: -10, w: 84, depth: 0.72, z: 2, m: { r: 8, c: 6, x: 15, y: -22 } },
  { r: 3, c: 8, x: -28, y: 0, w: 80, depth: 1, m: { r: 10, c: 2, x: 10, y: -25 } },
  { r: 6, c: 3, x: 10, y: 34, w: 84, depth: 0.62, z: 2, m: { r: 12, c: 6, x: 10, y: -28 } },
  { r: 9, c: 2, x: 18, y: -2, w: 82, depth: 0.94, m: { r: 14, c: 2, x: 6, y: -31 } },
  { r: 9, c: 6, x: 8, y: -6, w: 84, depth: 0.78, z: 2, m: { r: 15, c: 6, x: 15, y: 18 } },
  { r: 9, c: 8, x: -30, y: -2, w: 80, depth: 1.08, m: { r: 16, c: 2, x: 17, y: 67 } },
  { r: 12, c: 4, x: -6, y: -22, w: 90, depth: 0.66, z: 2 },
  { r: 13, c: 1, x: 20, y: 20, w: 84, depth: 0.98 },
  { r: 14, c: 8, x: -28, y: -18, w: 82, depth: 0.84 },
  { r: 17, c: 5, x: -8, y: 16, w: 88, depth: 0.7 },
  { r: 20, c: 2, x: 12, y: -18, w: 84, depth: 1.04 },
  { r: 21, c: 6, x: 6, y: 18, w: 88, depth: 0.8 },
  { r: 22, c: 8, x: -26, y: -16, w: 82, depth: 0.92 },
]

const INTRO_ROWS = 9
const GATHER = { duration: 1300, stagger: 70 }
const HOLD = 250
const SCATTER = { duration: 1500, stagger: 80 }

const images = pickImages(SLOTS.length)

const HeroTiles = forwardRef(function HeroTiles({ ready }, ref) {
  const section = useRef(null)
  const drift = useRef([])
  const intro = useRef([])
  const tiles = useRef([])
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const lastKey = useRef('')
  useImperativeHandle(ref, () => section.current)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const p = pointer.current
    const move = (e) => {
      p.tx = (e.clientX / window.innerWidth) * 2 - 1
      p.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const leave = () => { p.tx = 0; p.ty = 0 }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('blur', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', leave)
    }
  }, [])

  useScrollFrame(section, (y, m) => {
    if (y > m.top + m.height + 200) return
    const mobile = m.vw < 700
    const limit = mobile ? 22 : 90
    const strength = mobile ? 0.06 : 0.24
    const p = pointer.current
    p.x = lerp(p.x, p.tx, 0.06)
    p.y = lerp(p.y, p.ty, 0.06)
    const key = `${Math.round(y)}|${p.x.toFixed(3)}|${p.y.toFixed(3)}|${m.version}`
    if (key === lastKey.current) return
    lastKey.current = key
    SLOTS.forEach((slot, i) => {
      const el = drift.current[i]
      if (!el) return
      const offset = clamp(y * (slot.depth - 0.84) * strength, -limit, limit)
      const mx = p.x * slot.depth * -14
      const my = p.y * slot.depth * -10
      el.style.transform = `translate3d(${mx.toFixed(2)}px, ${(offset + my).toFixed(2)}px, 0)`
    })
  })

  // Above-the-fold tiles gather into a stack behind the name, then scatter to their slots.
  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion() || window.innerWidth <= 900 || window.scrollY > 10) return
    const members = SLOTS.map((slot, i) => ({ slot, i })).filter(({ slot }) => slot.r <= INTRO_ROWS)
    const total = members.length
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const animations = []
    const timers = []
    const tileEls = tiles.current

    members.forEach(({ i }, order) => {
      const el = intro.current[i]
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dx = cx - (rect.left + rect.width / 2)
      const dy = cy - (rect.top + rect.height / 2)
      const side = order % 2 === 0 ? -1 : 1
      const tilt = ((order * 37) % 9) - 4
      const stack = `translate3d(${dx}px, ${dy}px, 0) rotate(${tilt}deg) scale(0.62)`
      const from = `translate3d(${dx + side * rect.width * 0.84}px, ${dy + 36}px, 0) rotate(${tilt + side * 6}deg) scale(0.5)`
      const sequence = total - 1 - order
      tileEls[i].style.zIndex = String(10 + sequence)

      const gather = el.animate(
        [{ transform: from, opacity: 0 }, { transform: stack, opacity: 1 }],
        { duration: GATHER.duration, delay: sequence * GATHER.stagger, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' },
      )
      animations.push(gather)
      const scatterAt = (total - 1) * GATHER.stagger + GATHER.duration + HOLD
      timers.push(setTimeout(() => {
        const scatter = el.animate(
          [{ transform: stack, opacity: 1 }, { transform: 'none', opacity: 1 }],
          { duration: SCATTER.duration, delay: order * SCATTER.stagger, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
        )
        animations.push(scatter)
        gather.cancel()
        scatter.finished.then(() => { tileEls[i].style.zIndex = SLOTS[i].z ?? 1 }).catch(() => {})
      }, scatterAt))
    })

    return () => {
      timers.forEach(clearTimeout)
      animations.forEach((a) => a.cancel())
      SLOTS.forEach((slot, i) => tileEls[i] && (tileEls[i].style.zIndex = slot.z ?? 1))
    }
  }, [ready])

  return (
    <section ref={section} id="hero" aria-label="Selected images" className="relative min-h-[235vh] w-full overflow-hidden bg-[var(--bg)] max-[900px]:min-h-[180vh]">
      <div className="grid w-full auto-rows-[10vh] grid-cols-8 pt-[2vh] pb-[18vh]">
        {SLOTS.map((slot, i) => {
          const image = images[i]
          const mobile = slot.m
          return (
            <div
              key={i}
              ref={(el) => (tiles.current[i] = el)}
              className="hero-tile relative min-w-0"
              data-mobile-hidden={mobile ? undefined : ''}
              style={{
                '--r': slot.r,
                '--c': slot.c,
                '--mr': mobile?.r ?? slot.r,
                '--mc': mobile?.c ?? slot.c,
                width: `clamp(58px, ${slot.w}%, 260px)`,
                zIndex: slot.z ?? 1,
              }}
            >
              <div className="hero-offset" style={{ '--x': `${slot.x}%`, '--y': `${slot.y}%`, '--mx': `${mobile?.x ?? slot.x}%`, '--my': `${mobile?.y ?? slot.y}%` }}>
                <div ref={(el) => (drift.current[i] = el)} className="scrub">
                  <div ref={(el) => (intro.current[i] = el)} className="relative aspect-[3/4] overflow-hidden bg-[var(--card)]">
                    <img
                      src={image.src}
                      alt=""
                      data-preload={slot.r <= INTRO_ROWS ? '' : undefined}
                      loading={slot.r <= INTRO_ROWS ? 'eager' : 'lazy'}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: image.position }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
})

export default HeroTiles
