import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLoading } from '../context/LoadingContext'

gsap.registerPlugin(useGSAP)

export default function Preloader() {
  const container = useRef(null)
  const blobContainer = useRef(null)
  const { setIsLoaded } = useLoading()

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true)
      }
    })

    const blobs = gsap.utils.toArray('.liquid-blob')
    
    // Set initial positions
    gsap.set(blobs, { xPercent: -50, yPercent: -50, scale: 0 })
    
    // Pop them in
    tl.to(blobs, {
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    })

    // Orbit animation (overlapping with pop in)
    tl.to(blobs[0], { x: 50, y: -30, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0)
    tl.to(blobs[1], { x: -40, y: 40, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.2)
    tl.to(blobs[2], { x: 30, y: 50, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.1)

    // Merge them into one tiny point
    tl.to(blobs, {
      x: 0,
      y: 0,
      scale: 0,
      duration: 0.6,
      ease: 'power3.in',
      stagger: 0.05
    }, "-=0.2")

    // Slide up the whole preloader
    tl.to(container.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, "+=0.1")

  }, { scope: container })

  return (
    <div ref={container} className="fixed inset-0 z-[100] flex justify-center items-center bg-[#050505]">
      {/* SVG Goo Filter */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            
            {/* 3D Specular Lighting */}
            <feSpecularLighting in="goo" surfaceScale="5" specularConstant="1" specularExponent="30" lightingColor="#ffffff" result="specOut">
              <fePointLight x="-20" y="-30" z="50" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="goo" operator="atop" result="specOut" />
            <feBlend in="specOut" in2="goo" mode="screen" />
          </filter>
        </defs>
      </svg>
      
      {/* Liquid Blobs Container */}
      <div 
        ref={blobContainer} 
        className="relative w-48 h-48 flex justify-center items-center"
        style={{ filter: 'url(#goo)' }}
      >
        <div className="liquid-blob absolute top-1/2 left-1/2 w-20 h-20 bg-[#69b0ff] rounded-full"></div>
        <div className="liquid-blob absolute top-1/2 left-1/2 w-14 h-14 bg-[#b6e0ff] rounded-full"></div>
        <div className="liquid-blob absolute top-1/2 left-1/2 w-16 h-16 bg-[#a1d1ff] rounded-full"></div>
      </div>
    </div>
  )
}
