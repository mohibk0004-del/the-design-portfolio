import { useEffect, useRef, useState } from 'react'
import Dock from './Dock'
import Window from './Window'
import { owner, projects, song, studioImg } from '../data/site'
import asciiImg from '../assets/ascii-terminal.jpg'
import platformerImg from '../assets/3dplatformer.png'
import easyresImg from '../assets/easyres.jpg'
import livePulseImg from '../assets/livepulse.png'

// Your own photographs dropped into src/assets/photos join the board automatically.
const extraPhotos = Object.values(import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' }))

const photoSlots = [
  { x: -560, y: 330, r: 5 },
  { x: 560, y: 360, r: -4 },
  { x: -980, y: 120, r: -3 },
  { x: 980, y: 80, r: 4 },
  { x: -140, y: 560, r: 3 },
  { x: 260, y: -560, r: -5 },
]

function Polaroid({ src, caption, rotate }) {
  return (
    <figure className="w-[210px] bg-[#fff] p-2.5 pb-3 shadow-[0_14px_30px_rgba(0,0,0,0.18)]" style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}>
      <img src={src} alt={caption || 'Photograph by Mohib'} draggable="false" className="aspect-square w-full object-cover" />
      {caption && <figcaption className="mt-2 text-center text-[11px] font-medium text-[rgba(0,0,0,0.6)]">{caption}</figcaption>}
    </figure>
  )
}

function WorkCard({ src, title, note, href, rotate, width = 300 }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-board-link
      className="block overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_24px_50px_rgba(0,0,0,0.2)]"
      style={{ width, transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
    >
      <span className="relative flex items-center gap-1.5 border-b border-black/10 bg-titlebar px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="absolute left-1/2 -translate-x-1/2 text-[10px] font-medium text-black/55">{title}</span>
      </span>
      <img src={src} alt="" draggable="false" className="block aspect-[4/3] w-full object-cover object-top" />
      <span className="block px-3 py-2 text-[11px] font-medium text-black/55">{note}</span>
    </a>
  )
}

const help = [
  'Commands:',
  '  about       who I am',
  '  projects    things I have built',
  '  open NAME   open a project (zero-in, sideline, easyres, platformer)',
  '  socials     where to find me',
  '  contact     how to reach me',
  '  song        what is on repeat',
  '  clear       clear the screen',
]

function run(input) {
  const [cmd, ...rest] = input.trim().split(/\s+/)
  const arg = rest.join(' ').toLowerCase()
  switch ((cmd || '').toLowerCase()) {
    case '': return []
    case 'help': return help
    case 'about':
    case 'whoami': return [`${owner.name}. Computer science student in Islamabad.`, 'I build web apps, Windows tools and game prototypes, and take photographs.']
    case 'projects': return projects.map((p) => `  ${p.id.padEnd(11)} ${p.title}`)
    case 'open': {
      const project = projects.find((p) => p.id === arg || p.folder.toLowerCase() === arg)
      if (!project) return [`open: no project called "${arg}". Try: ${projects.map((p) => p.id).join(', ')}`]
      window.open(project.href, '_blank', 'noopener')
      return [`Opening ${project.folder}…`]
    }
    case 'socials': return [`  github     ${owner.github}`, `  instagram  ${owner.instagram}`]
    case 'contact':
    case 'email': return [`  ${owner.email}`]
    case 'song': return [`  ${song.title}, ${song.artist}`, `  ${song.href}`]
    case 'sudo': return ['Nice try.']
    case 'ls': return ['photos/  projects/  notes.txt']
    default: return [`zsh: command not found: ${cmd}. Type \`help\`.`]
  }
}

function Terminal({ open, onClose }) {
  const [lines, setLines] = useState(['Last login: just now on ttys001', '', 'mohib shell. Type `help` to see what you can do.'])
  const [value, setValue] = useState('')
  const input = useRef(null)
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [lines])

  const submit = (event) => {
    event.preventDefault()
    const out = value.trim().toLowerCase() === 'clear' ? null : run(value)
    setLines((list) => (out === null ? [] : [...list, `visitor@mohib ~ % ${value}`, ...out]))
    setValue('')
  }

  return (
    <Window open={open} title="visitor@mohib — zsh — 80×24" onClose={onClose} width={520} placement="md:justify-end md:pr-[7%]">
      <div data-lenis-prevent className="h-[340px] overflow-y-auto bg-[#1d1e26] p-4 font-mono text-[12px] leading-relaxed text-[#e6e6e6]" onClick={() => input.current?.focus()}>
        {lines.map((line, i) => (
          <p key={i} className={`whitespace-pre-wrap ${line.startsWith('visitor@') ? 'text-[#4FDE73]' : i < 1 ? 'text-[#8b8d98]' : ''}`}>{line || ' '}</p>
        ))}
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="shell" className="shrink-0 text-[#4FDE73]">visitor@mohib ~ %</label>
          <input id="shell" ref={input} value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck="false" autoFocus className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#e6e6e6] caret-[#4FDE73] outline-none" />
        </form>
        <span ref={end} />
      </div>
    </Window>
  )
}

export default function PlaygroundPage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dockShown, setDockShown] = useState(false)
  const [terminal, setTerminal] = useState(true)
  const drag = useRef(null)
  const [grabbing, setGrabbing] = useState(false)

  useEffect(() => {
    document.title = 'Playground, Mohib Khan'
    const id = requestAnimationFrame(() => setDockShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('[data-no-pan]')) return
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
    setGrabbing(true)
  }
  const onPointerMove = (event) => {
    const d = drag.current
    if (!d) return
    const dx = event.clientX - d.x
    const dy = event.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
    setOffset({ x: d.ox + dx, y: d.oy + dy })
  }
  const onPointerUp = () => {
    setGrabbing(false)
    setTimeout(() => { drag.current = null }, 0)
  }
  const onClickCapture = (event) => {
    if (drag.current?.moved && event.target.closest('[data-board-link]')) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  const onWheel = (event) => setOffset((o) => ({ x: o.x - event.deltaX, y: o.y - event.deltaY }))

  const photos = [owner.portrait, studioImg, ...extraPhotos]

  return (
    <main>
      <div
        className="fixed inset-0 touch-none select-none overflow-hidden bg-white text-black"
        style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onWheel={onWheel}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(color-mix(in oklab, var(--color-black) 12%, transparent) 1px, transparent 1px)', backgroundSize: '22px 22px', backgroundPosition: `${offset.x}px ${offset.y}px` }}
        />
        <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
          <div className="absolute top-0" style={{ left: -90 }}>
            <div className="w-[280px] -translate-x-1/2 -translate-y-1/2 -rotate-2 bg-[#FFE066] p-6 shadow-[0_14px_30px_rgba(0,0,0,0.18)]">
              <p className="text-[15px] font-semibold leading-relaxed text-[rgba(0,0,0,0.8)]">When I&apos;m not writing code I&apos;m taking photos. If photography is your thing too, we are already friends.</p>
              <p className="mt-4 text-[11px] font-medium text-[rgba(0,0,0,0.7)]">Mohib</p>
            </div>
          </div>
          {photos.map((src, i) => {
            const slot = photoSlots[i % photoSlots.length]
            const ring = Math.floor(i / photoSlots.length)
            return (
              <div key={src} className="absolute" style={{ left: slot.x * (1 + ring * 0.6), top: slot.y * (1 + ring * 0.6) }}>
                <Polaroid src={src} rotate={slot.r} caption="" />
              </div>
            )
          })}
          <div className="absolute" style={{ left: -760, top: -150 }}>
            <a href={song.href} target="_blank" rel="noopener noreferrer" data-board-link className="block w-[230px] rounded-2xl border border-black/10 bg-white p-3 shadow-[0_14px_30px_rgba(0,0,0,0.14)]" style={{ transform: 'translate(-50%, -50%) rotate(-4deg)' }}>
              <img src={song.cover} alt="" draggable="false" className="aspect-square w-full rounded-lg object-cover" />
              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">On repeat</span>
              <span className="block truncate text-[13px] font-semibold text-black/85">{song.title}</span>
              <span className="block truncate text-[11px] text-black/45">{song.artist}</span>
            </a>
          </div>
          <div className="absolute" style={{ left: 820, top: -330 }}><WorkCard src={asciiImg} title="old-portfolio" note="My old portfolio, built as an ASCII terminal." href="https://github.com/mohibk0004-del/portfolio" rotate={3} /></div>
          <div className="absolute" style={{ left: -380, top: -420 }}><WorkCard src={livePulseImg} title="livepulse" note="LivePulse, the chat half of Sideline." href={projects[1].href} rotate={-3} width={220} /></div>
          <div className="absolute" style={{ left: 120, top: 380 }}><WorkCard src={platformerImg} title="unity-game" note="The 3D platformer, built in Unity." href={projects[3].href} rotate={-2} /></div>
          <div className="absolute" style={{ left: -1200, top: -420 }}><WorkCard src={easyresImg} title="easyres" note="Easyres, a Windows display utility." href={projects[2].href} rotate={2} width={240} /></div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto max-w-[1060px] px-6 pt-32 text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">Playground</p>
          <h1 className="text-3xl font-bold md:text-4xl">Old work, side projects &amp; photos.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/50">My personal gallery. Photos I&apos;ve taken, things I&apos;ve built and things I like. My little corner of the internet.</p>
        </div>

        <div data-no-pan>
          <Dock base="/" onCalendar={() => { window.location.href = `mailto:${owner.email}` }} className={`pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4 transition-opacity duration-300 ${dockShown ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        <button
          type="button"
          data-no-pan
          aria-label="Open the mohib terminal"
          onClick={() => setTerminal(true)}
          className="absolute bottom-6 right-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1d1e26] font-mono text-[15px] font-bold text-[#4FDE73] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-0.5"
        >
          &gt;_
        </button>
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium text-black/55">Drag to pan. More coming to this board soon.</p>
      </div>
      <div data-no-pan>
        <Terminal open={terminal} onClose={() => setTerminal(false)} />
      </div>
    </main>
  )
}
