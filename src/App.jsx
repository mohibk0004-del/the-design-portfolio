import { useEffect } from 'react'
import Lenis from 'lenis'
import HUD from './components/HUD'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Footer from './components/Footer'
import Background3D from './components/Background3D'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import Preloader from './components/Preloader'
import ScrollIndicator from './components/ScrollIndicator'

function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    lenis.scrollTo(0, { immediate: true })

    const forceTop = () => {
      window.scrollTo(0, 0)
      lenis.scrollTo(0, { immediate: true })
    }
    window.addEventListener('load', forceTop)
    const topTimer = setTimeout(forceTop, 50)

    let frameId
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      clearTimeout(topTimer)
      window.removeEventListener('load', forceTop)
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <LoadingProvider>
        <div className="relative w-full min-h-screen text-[var(--text-primary)] font-sans overflow-x-hidden">
          <Preloader />
          <Background3D />
        <HUD />
        <ScrollIndicator />
        
        <main className="relative z-10 w-full flex flex-col items-center justify-start">
          <Hero />
          
          <div className="relative w-full min-h-screen">
            <div className="relative z-10 w-full">
              <About />
              <Works />
              <Footer />
            </div>
          </div>
        </main>
      </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
