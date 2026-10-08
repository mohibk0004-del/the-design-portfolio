import { useMemo, useRef } from 'react'
import { clamp01, easeInOutCubic, easeOutQuart, lerp, useReducedMotion, useScrollFrame } from '../lib/progress'
import { about, portrait } from '../data/content'

// Words rise in as the section scrolls into view and drift out as it leaves,
// staggered left to right across the whole text.
export default function About() {
  const section = useRef(null)
  const image = useRef(null)
  const words = useRef([])
  const last = useRef(-1)
  const reduced = useReducedMotion()

  const paragraphs = useMemo(() => {
    let index = 0
    return about.map((text) => text.split(' ').map((word) => ({ word, index: index++ })))
  }, [])
  const count = paragraphs.reduce((sum, p) => sum + p.length, 0)

  useScrollFrame(section, (y, m) => {
    if (reduced) return
    const progress = clamp01((m.vh - (m.top - y)) / (m.vh + m.height))
    const key = Math.round(progress * 2000) + m.version * 1e4
    if (key === last.current) return
    last.current = key

    const enter = easeOutQuart(clamp01(progress / 0.18))
    const exit = easeInOutCubic(clamp01((progress - 0.82) / 0.16))
    if (image.current) {
      image.current.style.opacity = String(enter * (1 - exit))
      image.current.style.transform = `translate3d(0, ${(lerp(28, 0, enter) - lerp(0, 34, exit)).toFixed(2)}px, 0) scale(${lerp(0.96, 1, enter).toFixed(4)})`
    }
    words.current.forEach((el, i) => {
      if (!el) return
      const r = count > 1 ? i / (count - 1) : 0
      const wordIn = easeOutQuart(clamp01((progress - (0.06 + 0.14 * r)) / 0.28))
      const wordOut = easeInOutCubic(clamp01((progress - (0.58 + 0.12 * r)) / 0.16))
      el.style.opacity = (wordIn * (1 - wordOut)).toFixed(3)
      el.style.transform = `translate3d(0, ${(lerp(22, 0, wordIn) - lerp(0, 28, wordOut)).toFixed(2)}px, 0)`
    })
  })

  const hidden = reduced ? undefined : { opacity: 0 }

  return (
    <section ref={section} id="about" aria-label="About" className="relative w-full bg-[var(--bg)]">
      <div className="relative z-10 mx-auto flex min-h-screen w-[min(980px,48vw)] flex-col items-center justify-center py-[14vh] text-center max-[1200px]:w-[min(920px,62vw)] max-[900px]:w-[88vw]">
        <div ref={image} className="scrub relative mb-10 aspect-[4/5] w-[min(14vw,220px)] min-w-[140px] overflow-hidden bg-[var(--card)] max-[900px]:mb-8 max-[900px]:w-[38vw]" style={hidden}>
          <img src={portrait.src} alt={portrait.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: portrait.position }} />
        </div>
        {paragraphs.map((list, p) => (
          <p key={p} className="font-sans text-[29px] leading-[1.2414] tracking-normal text-[var(--body)] max-[900px]:text-[22px]" style={{ marginTop: p ? '0.95em' : 0 }}>
            {list.map(({ word, index }, i) => (
              <span key={index}>
                <span ref={(el) => (words.current[index] = el)} className="inline-block" style={hidden}>{word}</span>
                {i < list.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  )
}
