import { useCallback, useRef, useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Preloader from './components/Preloader'
import Wordmark from './components/Wordmark'
import Nav from './components/Nav'
import Cursor from './components/Cursor'
import HeroTiles from './components/HeroTiles'
import About from './components/About'
import WorkGallery from './components/WorkGallery'
import Ring from './components/Ring'
import Contact from './components/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const heroRef = useRef(null)
  const maskRef = useRef(null)
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <ThemeProvider>
      <div id="top" className={ready ? 'is-ready' : undefined}>
        <Preloader maskRef={maskRef} onReady={handleReady} />
        <Cursor />
        <Nav />
        <Wordmark heroRef={heroRef} maskRef={maskRef} ready={ready} />
        <main>
          <HeroTiles ref={heroRef} ready={ready} />
          <About />
          <WorkGallery />
          <Ring />
        </main>
        <Contact />
      </div>
    </ThemeProvider>
  )
}
