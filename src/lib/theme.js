import { useCallback, useEffect, useState } from 'react'

const read = () => document.documentElement.classList.contains('dark')

// Light/dark appearance, remembered per visitor. The switch crossfades like macOS when the
// browser supports view transitions.
export function useAppearance() {
  const [dark, setDark] = useState(read)

  useEffect(() => {
    const sync = () => setDark(read())
    window.addEventListener('appearancechange', sync)
    return () => window.removeEventListener('appearancechange', sync)
  }, [])

  const toggle = useCallback(() => {
    const next = !read()
    const apply = () => {
      document.documentElement.classList.toggle('dark', next)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#161618' : '#fafafa')
      try {
        localStorage.setItem('appearance', next ? 'dark' : 'light')
      } catch {
        // Private windows can block storage; the switch still works for this visit.
      }
      window.dispatchEvent(new Event('appearancechange'))
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (document.startViewTransition && !reduce) document.startViewTransition(apply)
    else apply()
  }, [])

  return { dark, toggle }
}
