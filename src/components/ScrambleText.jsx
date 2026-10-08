import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { prefersReducedMotion } from '../lib/scroll'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const STEP = 32 // ms between glyph swaps
const SETTLE = 45 // extra ms per letter before it resolves, left to right

/**
 * Letters enter one by one (CSS, driven by `.is-ready`) and scramble through
 * random glyphs on hover before resolving back, left to right.
 */
const ScrambleText = forwardRef(function ScrambleText({ text, delay = 0 }, ref) {
  const ghosts = useRef([])
  const overlays = useRef([])
  const timer = useRef(0)

  const reset = useCallback(() => {
    clearInterval(timer.current)
    ghosts.current.forEach((el) => el && (el.style.visibility = ''))
    overlays.current.forEach((el) => el && (el.textContent = ''))
  }, [])

  const scramble = useCallback(() => {
    if (prefersReducedMotion()) return
    reset()
    const start = performance.now()
    timer.current = setInterval(() => {
      const elapsed = performance.now() - start
      let done = true
      ;[...text].forEach((char, i) => {
        const ghost = ghosts.current[i]
        const overlay = overlays.current[i]
        if (!ghost || !overlay || char === ' ') return
        if (elapsed < 120 + i * SETTLE) {
          done = false
          ghost.style.visibility = 'hidden'
          overlay.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        } else {
          ghost.style.visibility = ''
          overlay.textContent = ''
        }
      })
      if (done) reset()
    }, STEP)
  }, [reset, text])

  useImperativeHandle(ref, () => ({ scramble }), [scramble])
  useEffect(() => reset, [reset])

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {[...text].map((char, i) => (
          <span key={i} className="nav-letter relative inline-block" style={{ '--i': i, '--delay': `${delay}s` }}>
            <span ref={(el) => (ghosts.current[i] = el)}>{char === ' ' ? ' ' : char}</span>
            <span ref={(el) => (overlays.current[i] = el)} className="absolute inset-0 flex items-center justify-center" />
          </span>
        ))}
      </span>
    </span>
  )
})

export default ScrambleText
