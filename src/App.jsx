import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import HUD from './components/HUD'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Footer from './components/Footer'
import Capabilities from './components/Capabilities'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Background3D from './components/Background3D'
import { ThemeProvider } from './context/ThemeContext'
import ScrollIndicator from './components/ScrollIndicator'
import PortfolioMotion from './components/PortfolioMotion'

function App() {
  const page = useRef(null)
  const motion = useRef({ entrance: 0, scroll: 0, reduced: false })
  const [sceneReady, setSceneReady] = useState(false)
  const handleSceneReady = useCallback(() => setSceneReady(true), [])
  useEffect(() => {
    // A slow or unavailable GPU must never block the portfolio.
    const timeout = setTimeout(handleSceneReady, 4000)
    return () => clearTimeout(timeout)
  }, [handleSceneReady])
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    if (!window.location.hash) window.scrollTo(0, 0)

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !motionPreference.matches,
      anchors: { immediate: motionPreference.matches },
    })

    window.portfolioScroll = (target) => lenis.scrollTo(target, {
      offset: target === '#top' ? 0 : -72,
      immediate: motionPreference.matches,
    })

    let hashFrame
    const scrollToHash = () => {
      cancelAnimationFrame(hashFrame)
      hashFrame = requestAnimationFrame(() => {
        const target = document.getElementById(window.location.hash.slice(1))
        if (target) lenis.scrollTo(target, { offset: target.id === 'top' ? 0 : -72, immediate: true })
        ScrollTrigger.update()
      })
    }
    window.addEventListener('hashchange', scrollToHash)
    if (window.location.hash) {
      scrollToHash()
    } else {
      lenis.scrollTo(0, { immediate: true })
    }
    lenis.on('scroll', ScrollTrigger.update)
    const updateMotion = () => {
      lenis.options.smoothWheel = !motionPreference.matches
      lenis.options.anchors = { immediate: motionPreference.matches }
    }
    motionPreference.addEventListener('change', updateMotion)

    let frameId
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      delete window.portfolioScroll
      cancelAnimationFrame(hashFrame)
      window.removeEventListener('hashchange', scrollToHash)
      motionPreference.removeEventListener('change', updateMotion)
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <div ref={page} id="top" className="relative isolate w-full min-h-screen text-[var(--text-primary)] font-sans overflow-x-clip">
        <Background3D motion={motion} onReady={handleSceneReady} />
        <PortfolioMotion page={page} ready={sceneReady} motion={motion} />
        <HUD />
        <ScrollIndicator />
        
        <main className="relative z-10 w-full flex flex-col items-center justify-start">
          <Hero />
          
          <div className="relative w-full min-h-screen">
            <div className="relative z-10 w-full flex flex-col">
              <About />
              <Works />
              <Capabilities />
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
