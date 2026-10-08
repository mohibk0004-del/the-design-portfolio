import { useEffect, useRef, useState } from 'react'
import { lockScroll, prefersReducedMotion, unlockScroll } from '../lib/scroll'

const MIN_DURATION = 900
const MAX_DURATION = 4000

// White sheet over the page while the hero images load. The wordmark above it
// fills from left to right with the real load progress.
export default function Preloader({ maskRef, onReady }) {
  const [state, setState] = useState('loading')
  const overlay = useRef(null)

  useEffect(() => {
    const skip = window.innerWidth <= 900 || window.scrollY > 10
    const images = [...document.querySelectorAll('img[data-preload]')]
    let loaded = 0
    let frame = 0
    let finished = false
    const start = performance.now()
    const count = () => { loaded += 1 }

    images.forEach((img) => {
      if (img.complete) count()
      else {
        img.addEventListener('load', count, { once: true })
        img.addEventListener('error', count, { once: true })
      }
    })

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(frame)
      if (maskRef.current) maskRef.current.style.transform = 'scaleX(0)'
      unlockScroll()
      setState('leaving')
      onReady()
    }

    if (skip) {
      finish()
      return () => cancelAnimationFrame(frame)
    }

    lockScroll()
    const tick = (now) => {
      const elapsed = now - start
      const actual = images.length ? loaded / images.length : 1
      const shown = Math.min(actual, elapsed / MIN_DURATION)
      if (maskRef.current) maskRef.current.style.transform = `scaleX(${(1 - shown).toFixed(4)})`
      if ((shown >= 1 && elapsed > MIN_DURATION) || elapsed > MAX_DURATION) {
        setTimeout(finish, prefersReducedMotion() ? 0 : 150)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      images.forEach((img) => {
        img.removeEventListener('load', count)
        img.removeEventListener('error', count)
      })
      unlockScroll()
    }
  }, [maskRef, onReady])

  if (state === 'gone') return null

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      onTransitionEnd={() => setState('gone')}
      className="fixed inset-0 z-[10000] bg-[var(--bg)] transition-opacity duration-[350ms] ease-out"
      style={{ opacity: state === 'loading' ? 1 : 0, pointerEvents: state === 'loading' ? 'auto' : 'none' }}
    />
  )
}
