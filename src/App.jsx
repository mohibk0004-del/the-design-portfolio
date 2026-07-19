import { useEffect } from 'react'
import Lenis from 'lenis'
import HUD from './components/HUD'
import Hero from './components/Hero'
import About from './components/About'
import Works from './components/Works'
import Footer from './components/Footer'
import Background3D from './components/Background3D'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <div className="bg-transparent min-h-screen text-[var(--text-primary)] font-sans selection:bg-[var(--selection)] selection:text-[var(--bg-color)] transition-colors duration-500">
        <Background3D />
        <HUD />
        <main className="overflow-x-hidden w-full max-w-full relative z-10">
          <Hero />
          <About />
          <Works />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
