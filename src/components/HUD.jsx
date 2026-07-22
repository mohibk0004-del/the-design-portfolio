import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function HUD() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const { theme, toggleTheme } = useTheme()

  const handleScroll = (e, target) => {
    e.preventDefault()
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handleMouseMove = (e) => setCoords({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <header className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between font-mono text-xs md:text-sm text-[var(--text-primary)] transition-colors duration-500">
      <div className="flex justify-between items-center px-4 lg:px-14 py-4 lg:py-7 pointer-events-auto">
        <a href="/" className="font-bold uppercase tracking-widest hover:text-[var(--selection)] transition-colors duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] inline-block">
          MOHIB™2026
        </a>
        <div className="flex gap-3 text-[10px] sm:gap-6 sm:text-xs md:text-sm md:gap-16 uppercase items-center">
          <a href="#work" onClick={(e) => handleScroll(e, '#work')} className="hover:text-[var(--selection)] transition-colors duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer">Work</a>
          <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="hover:text-[var(--selection)] transition-colors duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer">Contact</a>
          <button onClick={toggleTheme} className="hover:text-[var(--selection)] transition-colors duration-[200ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer w-[60px] md:w-[80px] text-left">THEME[{theme.charAt(0).toUpperCase()}]</button>
        </div>
      </div>
      <div className="grid grid-cols-3 px-4 lg:px-14 py-4 lg:py-7 opacity-70 pointer-events-none items-end text-[9px] sm:text-xs md:text-sm">
        <div className="uppercase">GMT+8 CN 21:51 26°C</div>
        <div className="text-center uppercase hidden sm:block">{String(coords.x).padStart(4, '0')} X {String(coords.y).padStart(4, '0')} Y</div>
        <div className="text-center uppercase sm:hidden">{String(coords.x).padStart(3, '0')}X {String(coords.y).padStart(3, '0')}Y</div>
        <div className="text-right">
          <svg className="inline-block w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </div>
      </div>
    </header>
  )
}
