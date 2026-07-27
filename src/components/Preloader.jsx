import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLoading } from '../context/LoadingContext'

gsap.registerPlugin(useGSAP)

export default function Preloader() {
  const container = useRef(null)
  const blobContainer = useRef(null)
  const { setIsLoaded } = useLoading()

  useEffect(() => {
    // If user tabs out of browser or if background tab pauses GSAP ticker, ensure site loads
    const timer = setTimeout(() => {
      setIsLoaded(true)
      if (container.current) {
        gsap.to(container.current, { 
          yPercent: -100, 
          duration: 0.5, 
          onComplete: () => { if (container.current) container.current.style.display = 'none' } 
        })
      }
    }, 3600)

    const handleVisibility = () => {
      if (document.hidden) {
        setIsLoaded(true)
        if (container.current) container.current.style.display = 'none'
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [setIsLoaded])

  useGSAP(() => {
    const tl = gsap.timeline()

    const blobs = gsap.utils.toArray('.liquid-blob')
    
    // Set initial positions with GPU hardware acceleration flag
    gsap.set(blobs, { xPercent: -50, yPercent: -50, scale: 0, force3D: true })
    
    // Pop them in
    tl.to(blobs, {
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      force3D: true
    })

    // Orbit animation (overlapping with pop in)
    tl.to(blobs[0], { x: 50, y: -30, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 1, force3D: true }, 0)
    tl.to(blobs[1], { x: -40, y: 40, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1, force3D: true }, 0.2)
    tl.to(blobs[2], { x: 30, y: 50, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: 1, force3D: true }, 0.1)

    // Merge them into one tiny point
    tl.to(blobs, {
      x: 0,
      y: 0,
      scale: 0,
      duration: 0.6,
      ease: 'power3.in',
      stagger: 0.05,
      force3D: true
    }, "-=0.2")

    // Slide up the whole preloader and remove from layout
    tl.to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
      force3D: true,
      onComplete: () => {
        setIsLoaded(true)
        if (container.current) container.current.style.display = 'none'
      }
    }, "+=0.1")

  }, { scope: container })

  return (
    <div ref={container} className="fixed inset-0 z-[100] flex justify-center items-center bg-[#050505] [will-change:transform]">
      {/* Lightweight GPU-friendly SVG Goo Filter (removed heavy CPU specular/composite lighting) */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          </filter>
        </defs>
      </svg>
      
      {/* Liquid Blobs Container */}
      <div 
        ref={blobContainer} 
        className="relative w-48 h-48 flex justify-center items-center [will-change:transform]"
        style={{ filter: 'url(#goo)' }}
      >
        <div className="liquid-blob absolute top-1/2 left-1/2 w-20 h-20 bg-[#69b0ff] rounded-full [will-change:transform]"></div>
        <div className="liquid-blob absolute top-1/2 left-1/2 w-14 h-14 bg-[#b6e0ff] rounded-full [will-change:transform]"></div>
        <div className="liquid-blob absolute top-1/2 left-1/2 w-16 h-16 bg-[#a1d1ff] rounded-full [will-change:transform]"></div>
      </div>
    </div>
  )
}
