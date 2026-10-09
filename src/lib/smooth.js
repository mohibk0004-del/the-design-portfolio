import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

// Smooth wheel scrolling, ticked by GSAP so ScrollTrigger and Lenis share one clock.
// Lenis keeps native scrolling underneath, so position: sticky (desktop, dock, folders) still works.
export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: -16 },
  })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  window.lenis = lenis
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    delete window.lenis
  }
}
