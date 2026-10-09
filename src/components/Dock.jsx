import { useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Contact, Folder, Heart, Sparkles } from 'lucide-react'
import { MohibMark } from './ui'

// Magnification values from the reference: 40px at rest, 60px under the cursor, falling off over 100px.
const REST = 40
const PEAK = 60
const RANGE = 100

const tile = 'flex h-full w-full items-center justify-center rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[filter,background-color] hover:brightness-105'

const items = [
  { id: 'home', label: 'Home', href: '', className: `${tile} border border-black/10 bg-white text-black hover:bg-hover`, glyph: <MohibMark className="h-[58%] w-[58%]" />, divider: true },
  { id: 'work', label: 'Work', href: '#pillar-stack', className: `${tile} bg-gradient-to-b from-[#5FB0FF] to-[#2E7CF6] text-[#fff]`, glyph: <Folder size="45%" fill="currentColor" strokeWidth={0} /> },
  { id: 'achievements', label: 'Achievements', href: '#achievements', className: `${tile} bg-gradient-to-b from-[#C489FB] to-[#8231E8] text-[#fff]`, glyph: <Sparkles size="48%" fill="currentColor" strokeWidth={1.5} /> },
  { id: 'about', label: 'About', href: '#about', className: `${tile} bg-gradient-to-b from-[#FF7A93] to-[#F92D50] text-[#fff]`, glyph: <Heart size="48%" fill="currentColor" strokeWidth={0} /> },
  { id: 'calendar', label: 'Book a meeting', calendar: true },
  { id: 'contact', label: 'Contact', href: '#contact', className: `${tile} bg-gradient-to-b from-[#4FDE73] to-[#1FB84A] text-[#fff]`, glyph: <Contact size="50%" strokeWidth={2} /> },
]

// Today's date, scaled with the tile as it magnifies.
function DockCalendar() {
  const now = new Date()
  return (
    <span className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24%] border border-black/10 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] [container-type:inline-size]">
      <span className="text-[17cqw] font-bold leading-none text-[#ff3b30]">{now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
      <span className="text-[46cqw] font-medium leading-[1.05] text-black">{now.getDate()}</span>
    </span>
  )
}

function DockItem({ mouseX, item, onCalendar, base }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [below, setBelow] = useState(true)
  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect()
    return rect ? x - (rect.left + rect.width / 2) : Infinity
  })
  const target = useTransform(distance, [-RANGE, 0, RANGE], [REST, PEAK, REST])
  const width = useSpring(target, { mass: 0.1, stiffness: 180, damping: 13 })

  return (
    <motion.div
      ref={ref}
      style={{ width: reduce ? REST : width }}
      className="relative aspect-square"
      onMouseEnter={() => {
        const rect = ref.current?.getBoundingClientRect()
        setBelow(Boolean(rect) && rect.top < window.innerHeight / 2)
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[rgba(0,0,0,0.75)] px-2.5 py-1 text-[11px] font-medium text-[#fff] shadow-md backdrop-blur-md ${below ? '-bottom-9' : '-top-9'}`}>
          {item.label}
        </div>
      )}
      {item.calendar ? (
        <button type="button" aria-label={item.label} onClick={onCalendar} className="block h-full w-full border-0 bg-transparent p-0">
          <DockCalendar />
        </button>
      ) : (
        <a aria-label={item.label} href={item.id === 'home' ? (base || '#top') : `${base}${item.href}`} className={item.className}>{item.glyph}</a>
      )}
    </motion.div>
  )
}

export default function Dock({ onCalendar, base = '', className = 'pointer-events-none sticky top-4 z-[60] flex justify-center px-4 py-3 desk:-mt-32 desk:h-32 desk:items-start desk:py-0' }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <div className={className}>
      <nav
        aria-label="Dock"
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-white/45 bg-white/30 px-3 pb-2 pt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150"
      >
        {items.map((entry) => (
          <div key={entry.id} className="flex items-start gap-2.5">
            <DockItem mouseX={mouseX} item={entry} onCalendar={onCalendar} base={base} />
            {entry.divider && <div className="mt-0.5 h-8 w-px self-start bg-black/15" />}
          </div>
        ))}
      </nav>
    </div>
  )
}
