import { useEffect, useState } from 'react'
import { Glass } from '../ui'
import { city, owner, song } from '../../data/site'
import { formatTime, setVolume, skip, togglePlay, usePlayer } from '../../lib/player'

// Time in the owner's city, refreshed every second.
export function useCityTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: city.timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
      .formatToParts(now).map((p) => [p.type, Number(p.value)]),
  )
  return { now, hours: parts.hour % 24, minutes: parts.minute, seconds: parts.second }
}

export function ClockWidget({ className = 'h-[150px] w-[150px]' }) {
  const { hours, minutes, seconds } = useCityTime()
  const minuteAngle = (minutes + seconds / 60) * 6
  const hourAngle = ((hours % 12) + minutes / 60) * 30
  const secondAngle = seconds * 6
  return (
    <Glass className={`flex items-center justify-center !p-3 ${className}`}>
      <div className="relative h-full w-full">
        <svg viewBox="0 0 120 120" className="h-full w-full text-black" role="img" aria-label={`${city.name} time ${hours}:${String(minutes).padStart(2, '0')}`}>
          {Array.from({ length: 12 }, (_, i) => {
            const major = i % 3 === 0
            return (
              <line key={i} x1="60" y1={major ? 6 : 8} x2="60" y2={major ? 13 : 12} stroke="currentColor" strokeOpacity={major ? 0.55 : 0.3} strokeWidth={major ? 2 : 1.4} strokeLinecap="round" transform={`rotate(${i * 30} 60 60)`} />
            )
          })}
          <text x="60" y="38" textAnchor="middle" fontSize="8" fontWeight="600" letterSpacing=".6" fill="currentColor" fillOpacity=".45">{city.name.toUpperCase()}</text>
          <line x1="60" y1="60" x2="60" y2="33" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" transform={`rotate(${hourAngle} 60 60)`} />
          <line x1="60" y1="60" x2="60" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${minuteAngle} 60 60)`} />
          <g transform={`rotate(${secondAngle} 60 60)`}>
            <line x1="60" y1="70" x2="60" y2="14" stroke="#ff3700" strokeWidth="1" strokeLinecap="round" />
          </g>
          <circle cx="60" cy="60" r="2.6" fill="currentColor" />
          <circle cx="60" cy="60" r="1.1" fill="#ff3700" />
        </svg>
      </div>
    </Glass>
  )
}

export function CalendarWidget({ className = 'h-[150px] w-[150px] !p-3.5', onOpen, compact = false }) {
  const { now } = useCityTime()
  const date = new Date(now.toLocaleString('en-US', { timeZone: city.timeZone }))
  const year = date.getFullYear()
  const month = date.getMonth()
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <Glass className={`cursor-pointer ${className}`} title="Book a meeting" role="button" onClick={onOpen}>
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#ff3b30]">{date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
      <p className="text-[22px] font-bold leading-none">{date.getDate()}</p>
      {compact && <p className="mt-2 text-[11px] font-semibold text-black/50">Book a meeting →</p>}
      <div hidden={compact} className="mt-2 grid grid-cols-7 gap-y-[2px] text-center text-[7px] font-medium text-black/55">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="font-semibold text-black/40">{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={`mx-auto flex h-[11px] w-[11px] items-center justify-center rounded-full ${d === date.getDate() ? 'bg-black font-bold text-white' : ''}`}>{d}</span>
        ))}
      </div>
    </Glass>
  )
}

// macOS Control Center style volume: speaker glyph, thin track, white knob.
function VolumeSlider({ value }) {
  return (
    <label className="ml-auto flex min-w-0 items-center gap-1.5 text-black/45" onPointerDown={(event) => event.stopPropagation()}>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
        {value > 0 && <path d="M10.2 5.6a3.4 3.4 0 0 1 0 4.8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
        {value > 0.5 && <path d="M12 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
      </svg>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-label="Volume"
        className="mac-range w-[64px]"
        style={{ '--fill': `${value * 100}%` }}
      />
    </label>
  )
}

export function MusicWidget({ className = 'h-[150px] w-[320px] !p-4' }) {
  const { playing, current, duration, progress, volume } = usePlayer()
  return (
    <Glass className={className}>
      <div className="flex gap-3.5">
        <a href={song.href} target="_blank" rel="noopener noreferrer" className="shrink-0" title="Open in Spotify">
          <img src={song.cover} alt={`${song.album} album cover`} draggable="false" className="h-[72px] w-[72px] rounded-lg object-cover shadow-inner" />
        </a>
        <div className="min-w-0 flex-1 pt-1">
          <p className="truncate text-[13px] font-semibold text-black/85">{song.title}</p>
          <p className="truncate text-[11px] text-black/45">{song.artist} — {song.album}</p>
          <div className="mt-2.5 flex items-center gap-5 text-black/70">
            <button type="button" aria-label="Back 10 seconds" onClick={() => skip(-10)} className="hover:text-black">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M3 3h1.6v10H3zM14 3v10L6 8z" /></svg>
            </button>
            <button type="button" aria-label={playing ? 'Pause' : `Play ${song.title}`} onClick={togglePlay} className="hover:text-black">
              {playing ? (
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M5.5 3.5h3v13h-3zM11.5 3.5h3v13h-3z" /></svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M5 3.5v13L16.5 10z" /></svg>
              )}
            </button>
            <button type="button" aria-label="Forward 10 seconds" onClick={() => skip(10)} className="hover:text-black">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M11.4 3H13v10h-1.6zM2 3l8 5-8 5z" /></svg>
            </button>
            <VolumeSlider value={volume} />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-[3px] w-full rounded-full bg-black/10"><div className="h-[3px] rounded-full bg-black/55" style={{ width: `${progress * 100}%` }} /></div>
        <div className="mt-1 flex justify-between text-[9px] tabular-nums text-black/35"><span>{formatTime(current)}</span><span>-{formatTime(Math.max(0, duration - current))}</span></div>
      </div>
    </Glass>
  )
}

const SUNNY = new Set([0, 1])
function WeatherIcon({ code }) {
  if (SUNNY.has(code)) {
    return (
      <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" aria-hidden="true">
        <circle cx="8" cy="8" r="3.2" fill="#FFC531" />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1="8" y1="1.3" x2="8" y2="3" stroke="#FFC531" strokeWidth="1.3" strokeLinecap="round" transform={`rotate(${i * 45} 8 8)`} />)}
      </svg>
    )
  }
  const rain = code >= 51
  return (
    <svg viewBox="0 0 16 16" className="h-[14px] w-[14px]" aria-hidden="true">
      <path d="M4.6 12.2h7a2.6 2.6 0 0 0 .3-5.2A3.6 3.6 0 0 0 5 7.4a2.4 2.4 0 0 0-.4 4.8Z" fill="#A9AEB8" />
      {rain && <path d="M6 13.4l-.6 1.4M9 13.4l-.6 1.4" stroke="#5DA9F5" strokeWidth="1.2" strokeLinecap="round" />}
    </svg>
  )
}

// Seven-day forecast for the owner's city from Open-Meteo (free, no key).
export function WeatherWidget({ className = 'w-[320px] !p-4' }) {
  const [days, setDays] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,temperature_2m_max&timezone=${encodeURIComponent(city.timeZone)}&forecast_days=7`
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => setDays(data.daily.time.map((t, i) => ({
        label: new Date(`${t}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        code: data.daily.weather_code[i],
        temp: Math.round(data.daily.temperature_2m_max[i]),
      }))))
      .catch(() => {})
    return () => controller.abort()
  }, [])
  const list = days ?? Array.from({ length: 7 }, (_, i) => ({ label: '··', code: i % 3 ? 0 : 3, temp: null }))
  return (
    <Glass className={className}>
      <p className="text-[10px] font-semibold text-black/55">{city.name}</p>
      <div className="mt-2.5 grid grid-cols-7 gap-1 text-center">
        {list.map((day, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 transition-opacity duration-500 ${days ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-[8px] font-semibold text-black/40">{day.label}</span>
            <WeatherIcon code={day.code} />
            <span className="text-[9px] font-medium tabular-nums text-black/55">{day.temp === null ? '–' : `${day.temp}°`}</span>
          </div>
        ))}
      </div>
    </Glass>
  )
}

export function PhotoWidget({ className = 'h-[150px] w-[150px]' }) {
  return (
    <img
      src={owner.portrait}
      alt="Mohib under the trees"
      draggable="false"
      className={`rounded-2xl border border-white/45 object-cover object-[52%_36%] shadow-[0_8px_32px_rgba(0,0,0,0.12)] ${className}`}
    />
  )
}
