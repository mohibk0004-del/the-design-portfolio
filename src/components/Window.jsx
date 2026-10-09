import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useReducedMotion } from 'framer-motion'
import { minimize, release } from '../lib/windows'

const spring = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }

// A macOS window: traffic lights, centred title, dragged by its title bar.
// Red closes, yellow minimises into the dock, green toggles full screen.
function WindowFrame({ title, onClose, children, width, placement = '' }) {
  const id = useId()
  const controls = useDragControls()
  const panel = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const opacity = useMotionValue(1)
  const [hidden, setHidden] = useState(false)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const previous = document.activeElement
    panel.current?.focus()
    const onKey = (event) => event.key === 'Escape' && !hidden && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey) || previous?.focus?.()
  }, [onClose, hidden])

  useEffect(() => () => release(id), [id])

  const toDock = () => {
    const box = panel.current?.getBoundingClientRect()
    const dock = document.querySelector('[data-dock]')?.getBoundingClientRect()
    if (!box) return { dx: 0, dy: window.innerHeight / 2 }
    const target = dock ? { x: dock.left + dock.width / 2, y: dock.top + dock.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight - 40 }
    return { dx: target.x - (box.left + box.width / 2), dy: target.y - (box.top + box.height / 2) }
  }

  const onMinimize = () => {
    const { dx, dy } = toDock()
    const opts = reduce ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 0.2, 1] }
    animate(x, x.get() + dx, opts)
    animate(y, y.get() + dy, opts)
    animate(scale, 0.08, opts)
    animate(opacity, 0, { ...opts, duration: reduce ? 0 : 0.38 }).then(() => setHidden(true))
    minimize(id, title, () => {
      setHidden(false)
      animate(x, 0, spring)
      animate(y, 0, spring)
      animate(scale, 1, spring)
      animate(opacity, 1, { duration: 0.2 })
    })
  }

  const onFull = () => {
    animate(x, 0, spring)
    animate(y, 0, spring)
    setFull((value) => !value)
  }

  return (
    <div className={`pointer-events-none fixed inset-0 z-[200] flex items-center justify-center ${full ? 'p-3' : `p-4 ${placement}`}`}>
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        aria-hidden={hidden || undefined}
        tabIndex={-1}
        drag={!full}
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.12}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: 'spring', duration: 0.38, bounce: 0.12 }}
        className={`flex w-full flex-col overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22)] outline-none ${hidden ? 'pointer-events-none invisible' : 'pointer-events-auto'} ${full ? 'h-full' : 'max-h-[min(86vh,760px)]'}`}
        style={{ maxWidth: full ? 'none' : width, x, y, scale, opacity }}
      >
        <div
          onPointerDown={(event) => !full && controls.start(event)}
          onDoubleClick={(event) => !event.target.closest('button') && onFull()}
          className={`relative flex shrink-0 touch-none items-center gap-2 border-b border-black/10 bg-titlebar px-4 py-2.5 ${full ? '' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div className="group/lights flex items-center gap-2">
            <button type="button" onClick={onClose} aria-label="Close window" className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]">
              <svg viewBox="0 0 8 8" className="h-[7px] w-[7px] opacity-0 transition-opacity group-hover/lights:opacity-100" aria-hidden="true"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
            <button type="button" onClick={onMinimize} aria-label="Minimise window" className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e]">
              <svg viewBox="0 0 8 8" className="h-[7px] w-[7px] opacity-0 transition-opacity group-hover/lights:opacity-100" aria-hidden="true"><path d="M1.5 4h5" stroke="#5a3c00" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
            <button type="button" onClick={onFull} aria-label={full ? 'Exit full screen' : 'Enter full screen'} className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]">
              <svg viewBox="0 0 8 8" className="h-[7px] w-[7px] opacity-0 transition-opacity group-hover/lights:opacity-100" aria-hidden="true">
                {full ? <path d="M3.4 0.8v2.6H0.8M4.6 7.2V4.6h2.6" fill="none" stroke="#00420c" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M1.2 4.8V1.2h3.6zM6.8 3.2v3.6H3.2z" fill="#00420c" />}
              </svg>
            </button>
          </div>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">{title}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>{children}</div>
      </motion.div>
    </div>
  )
}

export default function Window({ open, ...props }) {
  return <AnimatePresence>{open && <WindowFrame key={props.title} {...props} />}</AnimatePresence>
}
