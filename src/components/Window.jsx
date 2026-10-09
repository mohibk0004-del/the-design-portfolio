import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion'

// A macOS window: traffic lights, centred title, dragged by its title bar.
function WindowFrame({ title, onClose, children, width }) {
  const controls = useDragControls()
  const panel = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const previous = document.activeElement
    panel.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [onClose])

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="false"
        aria-label={title}
        tabIndex={-1}
        drag
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.12}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
        transition={{ type: 'spring', duration: 0.38, bounce: 0.12 }}
        className="pointer-events-auto flex max-h-[min(86vh,760px)] w-full flex-col overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.22)] outline-none"
        style={{ maxWidth: width }}
      >
        <div
          onPointerDown={(event) => controls.start(event)}
          className="relative flex shrink-0 cursor-grab touch-none items-center gap-2 border-b border-black/10 bg-[#f5f5f5] px-4 py-2.5 active:cursor-grabbing"
        >
          <button type="button" onClick={onClose} aria-label="Close window" className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]">
            <svg viewBox="0 0 8 8" className="h-[7px] w-[7px] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">{title}</span>
        </div>
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  )
}

export default function Window({ open, ...props }) {
  return <AnimatePresence>{open && <WindowFrame key={props.title} {...props} />}</AnimatePresence>
}
