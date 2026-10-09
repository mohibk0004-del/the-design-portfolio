import { useEffect, useState } from 'react'
import { MohibMark } from './ui'

const KEY = 'booted'
const DURATION = 1500

function shouldBoot() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return !localStorage.getItem(KEY)
  } catch {
    return false
  }
}

// A one-time macOS-style startup: mark, progress bar, then the desktop.
// The page mounts when the bar fills, so its own entrance plays as the screen fades.
export default function Boot({ children }) {
  const [phase, setPhase] = useState(() => (shouldBoot() ? 'booting' : 'done'))

  useEffect(() => {
    if (phase !== 'booting') return
    const finish = () => setPhase('fading')
    const timer = setTimeout(finish, DURATION)
    window.addEventListener('keydown', finish, { once: true })
    window.addEventListener('pointerdown', finish, { once: true })
    try { localStorage.setItem(KEY, '1') } catch { /* still boots, just again next time */ }
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [phase])

  return (
    <>
      {phase !== 'booting' && children}
      {phase !== 'done' && (
        <div
          aria-hidden="true"
          onTransitionEnd={() => phase === 'fading' && setPhase('done')}
          className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#000] transition-opacity duration-500 ease-out ${phase === 'fading' ? 'opacity-0' : 'opacity-100'}`}
        >
          <MohibMark className="h-16 w-16 text-[#fff]" />
          <div className="mt-12 h-[5px] w-[180px] overflow-hidden rounded-full bg-[rgba(255,255,255,0.22)]">
            <div className="boot-bar h-full rounded-full bg-[#fff]" style={{ animationDuration: `${DURATION}ms` }} />
          </div>
        </div>
      )}
    </>
  )
}
