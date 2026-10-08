import { useEffect, useRef } from 'react'
import { scrollTo, subscribe } from '../lib/scroll'
import { name } from '../data/content'

// Name pinned to the centre of the screen while the hero tiles drift past it.
export default function Wordmark({ heroRef, maskRef, ready }) {
  const button = useRef(null)

  useEffect(() => {
    let hidden = null
    return subscribe((y) => {
      const hero = heroRef.current
      const el = button.current
      if (!hero || !el) return
      const next = y > hero.offsetHeight - window.innerHeight * 0.55
      if (next === hidden) return
      hidden = next
      el.style.opacity = next ? '0' : '1'
      el.style.pointerEvents = next ? 'none' : 'auto'
      el.tabIndex = next ? -1 : 0
    })
  }, [heroRef])

  return (
    <button
      ref={button}
      type="button"
      aria-label={`${name}, back to top`}
      onClick={() => scrollTo(0)}
      className="fixed top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 transition-opacity duration-[400ms] ease-[var(--ease-out-quint)]"
      style={{ zIndex: ready ? 41 : 10001 }}
    >
      <span className="relative block">
        <span className="block font-sans text-[clamp(26px,2.4vw,36px)] leading-none font-semibold tracking-[-0.025em] whitespace-nowrap text-[var(--ink)]">
          {name}
        </span>
        <span
          ref={maskRef}
          aria-hidden="true"
          className="absolute -inset-x-1 -inset-y-1 origin-right bg-[var(--bg)] opacity-80"
          style={{ transform: 'scaleX(1)' }}
        />
      </span>
    </button>
  )
}
