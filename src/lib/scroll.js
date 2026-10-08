import Lenis from 'lenis'

// One Lenis instance and one rAF loop drive every scroll-linked section.
const subscribers = new Set()
let lenis = null
let frame = 0
let scrollY = 0

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function startScroll() {
  if (lenis) return stopScroll
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  lenis = new Lenis({ lerp: 0.1, smoothWheel: !prefersReducedMotion() })
  scrollY = window.scrollY

  const loop = (time) => {
    lenis.raf(time)
    scrollY = lenis.scroll
    subscribers.forEach((fn) => fn(scrollY, time))
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)
  return stopScroll
}

function stopScroll() {
  cancelAnimationFrame(frame)
  lenis?.destroy()
  lenis = null
}

export function subscribe(fn) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export const getScroll = () => scrollY

export function scrollTo(target, options = {}) {
  const immediate = prefersReducedMotion()
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), immediate, ...options })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : null
  if (el) el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  else window.scrollTo({ top: typeof target === 'number' ? target : 0, behavior: immediate ? 'auto' : 'smooth' })
}

export const lockScroll = () => lenis?.stop()
export const unlockScroll = () => lenis?.start()
