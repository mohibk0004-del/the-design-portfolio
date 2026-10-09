import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const linkClass = 'relative bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px] cursor-pointer'

export default function HUD() {
  const { theme, toggleTheme } = useTheme()
  const [onPaper, setOnPaper] = useState(false)

  // Over the hero the header keeps its hero colour; on the paper sections it switches to ink.
  useEffect(() => {
    const update = () => {
      const about = document.getElementById('about')
      if (about) setOnPaper(about.getBoundingClientRect().top <= 40)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const handleScroll = (event, target) => {
    event.preventDefault()
    if (window.portfolioScroll) {
      window.portfolioScroll(target)
      return
    }
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="fixed inset-x-0 top-0 pointer-events-none z-50 font-sans text-[13px] transition-[color,background-color,box-shadow] duration-300"
      style={{
        color: onPaper ? '#161512' : 'var(--text-primary)',
        backgroundColor: onPaper ? '#f3f0e8' : 'transparent',
        boxShadow: onPaper ? '0 1px 0 rgb(22 21 18 / 0.08)' : 'none',
      }}
    >
      <div className="flex justify-between items-center px-4 lg:px-14 py-4 lg:py-6 pointer-events-auto">
        <a href="#top" onClick={(event) => handleScroll(event, '#top')} className={`${linkClass} font-medium`}>
          Mohib Khan
        </a>
        <nav aria-label="Primary navigation" className="flex gap-5 sm:gap-8 items-center">
          <a href="#work" onClick={(event) => handleScroll(event, '#work')} className={linkClass}>Work</a>
          <a href="#contact" onClick={(event) => handleScroll(event, '#contact')} className={linkClass}>Contact</a>
          <button type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={toggleTheme} className={linkClass}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  )
}
