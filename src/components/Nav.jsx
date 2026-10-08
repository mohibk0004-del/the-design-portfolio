import { useRef } from 'react'
import ScrambleText from './ScrambleText'
import { scrollTo } from '../lib/scroll'
import { useTheme } from '../context/ThemeContext'

const itemClass =
  'nav-item cursor-pointer border-0 bg-transparent p-0 font-sans text-[10px] leading-[160%] font-semibold tracking-[0.8px] text-inherit uppercase'

function NavLink({ href, label, delay }) {
  const text = useRef(null)
  return (
    <a
      href={href}
      className={itemClass}
      onMouseEnter={() => text.current?.scramble()}
      onFocus={() => text.current?.scramble()}
      onClick={(event) => {
        event.preventDefault()
        scrollTo(href)
      }}
    >
      <ScrambleText ref={text} text={label} delay={delay} />
    </a>
  )
}

export default function Nav() {
  const { theme, toggleTheme } = useTheme()
  const toggle = useRef(null)

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-40 text-white mix-blend-difference">
      <div className="flex w-full items-center justify-between px-4 py-3">
        <NavLink href="#work" label="Work" delay={0.7} />
        <div className="flex items-center gap-6">
          <button
            type="button"
            className={itemClass}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onMouseEnter={() => toggle.current?.scramble()}
            onClick={() => {
              toggleTheme()
              toggle.current?.scramble()
            }}
          >
            <ScrambleText ref={toggle} text={theme === 'dark' ? 'Light' : 'Dark'} delay={1} />
          </button>
          <NavLink href="#contact" label="Contact" delay={1.3} />
        </div>
      </div>
    </nav>
  )
}
