import { useEffect, useState } from 'react'
import Window from './Window'
import { useAppearance } from '../lib/theme'
import { owner } from '../data/site'

const OPEN = 'open-booking'

// Any calendar icon on the site calls this; the single BookingWindow listens for it.
export const openBooking = () => window.dispatchEvent(new Event(OPEN))

function calendlyUrl(dark) {
  const params = new URLSearchParams({
    embed_domain: window.location.hostname,
    embed_type: 'Inline',
    hide_gdpr_banner: '1',
    primary_color: '57a4f0',
    background_color: dark ? '1c1c1e' : 'ffffff',
    text_color: dark ? 'f5f5f7' : '1a1a1a',
  })
  return `${owner.calendly}?${params}`
}

// Calendly inside a macOS window, like the reference's "Book a meeting".
export default function BookingWindow() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { dark } = useAppearance()

  useEffect(() => {
    const show = () => {
      setLoaded(false)
      setOpen(true)
    }
    window.addEventListener(OPEN, show)
    return () => window.removeEventListener(OPEN, show)
  }, [])

  return (
    <Window open={open} title={`Book a meeting — ${owner.name}`} onClose={() => setOpen(false)} width={560}>
      <div className="relative h-[min(680px,calc(86vh-40px))] bg-white">
        {!loaded && (
          <div className="absolute inset-0 flex items-start justify-center pt-6" aria-hidden="true">
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2.5 w-2.5 animate-pulse rounded-full bg-black/25" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </span>
          </div>
        )}
        <iframe
          key={dark ? 'dark' : 'light'}
          title="Book a 30 minute meeting with Mohib on Calendly"
          src={calendlyUrl(dark)}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </Window>
  )
}
