import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BendingCard } from './Works'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { title: 'Reunimos™', span: 'col-span-12 md:col-span-8 row-span-2', img: 'https://picsum.photos/seed/reunimos/800/600', year: '2024-2026' },
  { title: 'Inspire Mono', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/inspire/400/300', year: '2025' },
  { title: 'Wasm design utils', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/wasm/400/300', year: '2025' },
  { title: 'VectorSymbols', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/vector/400/300', year: '2023' },
  { title: 'DarkSide', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/darkside/400/300', year: '2021' },
  { title: 'aDrive', span: 'col-span-12 md:col-span-4 row-span-2', img: 'https://picsum.photos/seed/adrive/400/600', year: '2020-2022' },
  { title: 'Shore Icon', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/shore/400/300', year: '2022' },
  { title: 'Teambition', span: 'col-span-12 md:col-span-4 row-span-1', img: 'https://picsum.photos/seed/teambition/400/300', year: '2018-2020' }
]

export default function ProjectsGrid() {
  const gridRef = useRef(null)

  useEffect(() => {
    // ScrollTrigger Image Scale & Fade Scroll avoiding scale(0) as per review-animations
    const cards = gridRef.current.querySelectorAll('.project-card')
    cards.forEach((card, index) => {
      gsap.fromTo(card, 
        { scale: 0.95, opacity: 0, y: 40 },
        { 
          scale: 1, 
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out", 
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )
    })
  }, [])

  return (
    <section className="py-12 w-full">
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 grid-flow-dense gap-6 md:gap-8 w-full bg-transparent">
        {projects.map((p, i) => (
          <BendingCard key={i} className={`project-card relative overflow-hidden group rounded-[2rem] border border-[var(--glass-border)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-[var(--card-bg)]/10 ${p.span}`}>
            <a href="#" className="block w-full h-full aspect-square md:aspect-auto min-h-[320px]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.05] opacity-70 group-hover:opacity-100 mix-blend-luminosity grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${p.img})` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <h3 className="text-xl md:text-2xl font-bold uppercase z-10 tracking-tight">{p.title}</h3>
                <span className="font-mono text-xs z-10 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">{p.year}</span>
              </div>
            </a>
          </BendingCard>
        ))}
      </div>
    </section>
  )
}
