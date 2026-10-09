import { useEffect, useState } from 'react'
import Window from './Window'
import { openBooking } from './BookingWindow'
import { city, owner } from '../data/site'

const specs = [
  ['Role', 'Computer science student'],
  ['Location', city.name],
  ['Builds', 'Web apps, Windows tools, game prototypes'],
  ['Stack', 'React, Next.js, TypeScript, Python, C#, Unity'],
  ['Also', 'Photography, @clicksbymohib'],
]

// "About This Mac", but about Mohib.
export default function AboutMac() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('open-about', show)
    return () => window.removeEventListener('open-about', show)
  }, [])

  return (
    <Window open={open} title="" onClose={() => setOpen(false)} width={360}>
      <div className="flex flex-col items-center px-8 pb-8 pt-6 text-center">
        <img src={owner.portrait} alt="Mohib Khan" className="h-28 w-28 rounded-full object-cover object-[52%_36%] shadow-[0_8px_24px_rgba(0,0,0,0.18)]" />
        <h2 className="mt-5 text-2xl font-bold">{owner.name}</h2>
        <p className="text-[12px] text-black/45">Version 2026 · Islamabad</p>
        <dl className="mt-5 w-full space-y-1.5 text-left text-[12px]">
          {specs.map(([term, value]) => (
            <div key={term} className="grid grid-cols-[72px_1fr] gap-3">
              <dt className="text-right font-semibold text-black/80">{term}</dt>
              <dd className="text-black/55">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex gap-2">
          <button type="button" onClick={() => { setOpen(false); openBooking() }} className="rounded-md border border-black/10 bg-white px-3 py-1 text-[12px] font-medium text-black/80 shadow-sm hover:bg-hover">Book a meeting…</button>
          <a href={owner.github} target="_blank" rel="noopener noreferrer" className="rounded-md border border-black/10 bg-white px-3 py-1 text-[12px] font-medium text-black/80 shadow-sm hover:bg-hover">More Info…</a>
        </div>
        <p className="mt-6 text-[10px] text-black/35">™ and © 2026 Mohib Khan. All rights reserved.</p>
      </div>
    </Window>
  )
}
