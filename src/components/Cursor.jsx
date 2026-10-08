import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { subscribe } from '../lib/scroll'

// A blurred dot that blooms into an arrow disc over links marked data-cursor="arrow".
// Everywhere else the native cursor stays.
export default function Cursor() {
  const root = useRef(null)
  const disc = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const pos = { x: -100, y: -100, tx: -100, ty: -100 }
    let active = false
    let seen = false

    const setActive = (next) => {
      if (next === active) return
      active = next
      disc.current?.toggleAttribute('data-active', next)
    }
    const move = (e) => {
      pos.tx = e.clientX
      pos.ty = e.clientY
      if (!seen) {
        seen = true
        pos.x = pos.tx
        pos.y = pos.ty
      }
      setActive(Boolean(e.target.closest?.('[data-cursor="arrow"]')))
    }
    const leave = () => setActive(false)

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    const unsubscribe = subscribe(() => {
      pos.x += (pos.tx - pos.x) * 0.22
      pos.y += (pos.ty - pos.y) * 0.22
      if (root.current) root.current.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
    })
    // Elements move under a still pointer while scrolling, so re-check what is beneath it.
    const recheck = () => {
      if (!seen) return
      const el = document.elementFromPoint(pos.tx, pos.ty)
      setActive(Boolean(el?.closest('[data-cursor="arrow"]')))
    }
    window.addEventListener('scroll', recheck, { passive: true })

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', recheck)
      unsubscribe()
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] h-0 w-0">
      <div
        ref={disc}
        className="absolute top-0 left-0 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-500 ease-[var(--ease-out-expo)] [transform:translate3d(-50%,-50%,0)_scale(0.13)] data-[active]:opacity-100 data-[active]:blur-0 data-[active]:[transform:translate3d(-50%,-50%,0)_scale(1)] motion-reduce:transition-none"
      >
        <ArrowUpRight size={22} strokeWidth={1.5} />
      </div>
    </div>
  )
}
