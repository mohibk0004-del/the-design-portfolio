import { useTheme } from '../context/ThemeContext'

export default function HUD() {
  const { theme, toggleTheme } = useTheme()

  const handleScroll = (event, target) => {
    event.preventDefault()
    if (window.portfolioScroll) {
      window.portfolioScroll(target)
      return
    }
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed inset-x-0 top-0 pointer-events-none z-50 font-mono text-[10px] sm:text-xs text-[var(--text-primary)] transition-colors duration-300">
      <div className="flex justify-between items-center px-4 lg:px-14 py-4 lg:py-7 pointer-events-auto">
        <a href="#top" onClick={(event) => handleScroll(event, '#top')} className="font-bold uppercase tracking-widest hover:text-[var(--hover-accent)] focus-visible:text-[var(--hover-accent)] transition-colors duration-200 active:scale-[0.97]">
          MOHIB™2026
        </a>
        <nav aria-label="Primary navigation" className="flex gap-4 sm:gap-8 md:gap-14 uppercase items-center">
          <a href="#work" onClick={(event) => handleScroll(event, '#work')} className="hover:text-[var(--hover-accent)] focus-visible:text-[var(--hover-accent)] transition-colors duration-200 active:scale-[0.97]">Work</a>
          <a href="#contact" onClick={(event) => handleScroll(event, '#contact')} className="hover:text-[var(--hover-accent)] focus-visible:text-[var(--hover-accent)] transition-colors duration-200 active:scale-[0.97]">Contact</a>
          <button type="button" aria-label="Toggle color theme" onClick={toggleTheme} className="hover:text-[var(--hover-accent)] focus-visible:text-[var(--hover-accent)] transition-colors duration-200 active:scale-[0.97] cursor-pointer">
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
