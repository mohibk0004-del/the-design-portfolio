import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getScroll, prefersReducedMotion, subscribe } from './scroll'

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
export const clamp01 = (v) => clamp(v, 0, 1)
export const lerp = (a, b, t) => a + (b - a) * t
// Progress of v through the window [start, start + length].
export const range = (v, start, length) => clamp01((v - start) / length)

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
export const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)
export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function seededRandom(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Calls onFrame(scrollY, metrics, time) every frame with cached section metrics,
 * so sections write styles directly instead of re-rendering React.
 */
export function useScrollFrame(ref, onFrame) {
  const callback = useRef(onFrame)
  useLayoutEffect(() => {
    callback.current = onFrame
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const metrics = { top: 0, height: 0, vh: window.innerHeight, vw: window.innerWidth, version: 0 }
    const measure = () => {
      const rect = el.getBoundingClientRect()
      metrics.top = rect.top + window.scrollY
      metrics.height = rect.height
      metrics.vh = window.innerHeight
      metrics.vw = window.innerWidth
      metrics.version += 1
    }
    measure()
    document.fonts?.ready.then(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    const unsubscribe = subscribe((y, time) => callback.current(y, metrics, time))
    callback.current(getScroll(), metrics, performance.now())
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      unsubscribe()
    }
  }, [ref])
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])
  return matches
}
