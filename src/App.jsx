import { useEffect } from 'react'
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

function App() {
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

    if (window.location.hash) {
      requestAnimationFrame(() => window.portfolioScroll(window.location.hash))
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
      motionPreference.removeEventListener('change', updateMotion)
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <div id="top" className="relative w-full min-h-screen text-[var(--text-primary)] font-sans overflow-x-clip">
        <Background3D />
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
