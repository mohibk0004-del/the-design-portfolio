import { useRef, useEffect } from 'react'

export default function ScrollIndicator() {
  const progressRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    let frameId
    let dirty = false

    const handleScroll = () => {
      if (!dirty) {
        dirty = true
        frameId = requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0
          const pct = Math.round(progress * 100)

          if (progressRef.current) {
            progressRef.current.style.transform = `scaleY(${progress})`
          }
          if (textRef.current) {
            textRef.current.textContent = `${String(pct).padStart(2, '0')}%`
          }
          dirty = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="fixed right-3 sm:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-2 sm:gap-3 select-none transition-colors duration-500">
      {/* Top Technical Crosshair Tick */}
      <span className="font-mono text-[9px] sm:text-[10px] text-[var(--text-primary)]/40 leading-none">+</span>
      
      {/* Vertical Track & GPU Progress Bar */}
      <div className="relative w-[2px] sm:w-[3px] h-[140px] sm:h-[180px] lg:h-[220px] bg-[var(--text-primary)]/15 rounded-full overflow-hidden">
        {/* Glow Fill Track using GPU scaleY for 0% CPU render thrashing */}
        <div 
          ref={progressRef}
          className="absolute top-0 left-0 w-full h-full bg-[var(--selection)] rounded-full origin-top [will-change:transform]"
          style={{ transform: 'scaleY(0)', boxShadow: '0 0 12px var(--selection)' }}
        />
      </div>

      {/* Bottom Technical Crosshair Tick */}
      <span className="font-mono text-[9px] sm:text-[10px] text-[var(--text-primary)]/40 leading-none">+</span>

      {/* Vertical Technical Percentage Readout */}
      <div 
        ref={textRef} 
        className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[var(--text-primary)]/80 font-bold uppercase mt-1 [writing-mode:vertical-rl] rotate-180 sm:rotate-0 sm:[writing-mode:horizontal-tb]"
      >
        00%
      </div>
    </div>
  )
}
