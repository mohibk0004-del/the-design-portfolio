import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

// Full-screen photo viewer, Photos.app style: arrows or swipe to move, Esc or click outside to close.
export default function Photos({ photos, index, onIndex, onClose }) {
  const reduce = useReducedMotion()
  const touch = useRef(null)
  const open = index !== null
  const go = (step) => onIndex((index + step + photos.length) % photos.length)

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${photos.length}`}
          data-no-pan
          className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(10,10,12,0.88)] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.target === event.currentTarget && onClose()}
          onTouchStart={(event) => { touch.current = event.touches[0].clientX }}
          onTouchEnd={(event) => {
            const dx = event.changedTouches[0].clientX - (touch.current ?? 0)
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={photos[index]}
              src={photos[index]}
              alt={`Photograph by Mohib, ${index + 1} of ${photos.length}`}
              draggable="false"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className="max-h-[86vh] max-w-[90vw] rounded-lg object-contain shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            />
          </AnimatePresence>
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[#fff] hover:bg-[rgba(255,255,255,0.2)]">
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          {photos.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[#fff] hover:bg-[rgba(255,255,255,0.2)]">‹</button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[#fff] hover:bg-[rgba(255,255,255,0.2)]">›</button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] font-medium tabular-nums text-[rgba(255,255,255,0.6)]">{index + 1} / {photos.length}</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
