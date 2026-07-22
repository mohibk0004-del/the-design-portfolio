import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'

export default function Footer() {
  const [showToast, setShowToast] = useState(false)
  const toastRef = useRef(null)
  const checkmarkRef = useRef(null)
  const email = "mohibk0004@gmail.com"

  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText(email)
    setShowToast(true)
  }

  // Animation logic
  useEffect(() => {
    if (!showToast) return

    let ctx = gsap.context(() => {
      // 1. Toast Entrance (Scale 0.95 -> 1)
      gsap.fromTo(toastRef.current,
        { scale: 0.95, opacity: 0, y: 10, filter: "blur(4px)" },
        { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 0.25, ease: "power3.out" }
      )
      
      // 2. Checkmark Draw SVG
      if (checkmarkRef.current) {
        const pathLength = checkmarkRef.current.getTotalLength()
        gsap.set(checkmarkRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
        gsap.to(checkmarkRef.current, {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.1
        })
      }

      // 3. Auto dismiss after 2.5 seconds
      gsap.to(toastRef.current, {
        scale: 0.98,
        opacity: 0,
        filter: "blur(2px)",
        duration: 0.15,
        ease: "power2.inOut",
        delay: 2.5,
        onComplete: () => setShowToast(false)
      })
    })

    return () => ctx.revert()
  }, [showToast])

  return (
    <footer id="contact" className="relative z-10 w-full min-h-screen flex flex-col justify-end px-4 lg:px-14 py-32 md:py-48 bg-[var(--bg-primary)] overflow-hidden">
      <div className="max-w-6xl w-full relative z-10">
        <h2 
          onClick={handleCopy}
          className="footer-text font-bold uppercase text-[10vw] leading-[0.85] tracking-tight cursor-pointer hover:text-[var(--selection)] transition-colors duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-[var(--text-primary)]"
        >
          Let's Create<br />
          Something<br />
          Extraordinary
        </h2>
      </div>
      <div className="mt-32 flex flex-col md:flex-row justify-between items-start md:items-end font-mono text-sm gap-8 z-20 pointer-events-auto text-[var(--text-primary)]">
        <a 
          href={`mailto:${email}`} 
          onClick={handleCopy}
          className="uppercase hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block transform-origin-left"
        >
          {email}
        </a>
        <div className="flex gap-8 uppercase">
          <a href="https://instagram.com/clicksbymohib" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">Insta</a>
          <a href="#" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">Figma</a>
          <a href="https://github.com/mohibk0004-del" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">GitHub</a>
        </div>
      </div>

      {/* Toast Notification Portal */}
      {showToast && createPortal(
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex justify-center">
          <div 
            ref={toastRef}
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl px-4 py-2.5 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-[var(--text-primary)]"
            style={{ willChange: 'transform, opacity, filter', transformOrigin: 'center bottom' }}
          >
            <div className="w-5 h-5 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center relative">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[var(--text-primary)]">
                <path 
                  ref={checkmarkRef}
                  d="M20 6L9 17l-5-5" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
            Copied to clipboard
          </div>
        </div>,
        document.body
      )}
    </footer>
  )
}
