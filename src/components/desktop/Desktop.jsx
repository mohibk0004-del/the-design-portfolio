import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { FolderIcon, Glass, MacSwitch } from '../ui'
import { useAppearance } from '../../lib/theme'
import { openBooking } from '../BookingWindow'
import { openAbout, openSpotlight } from '../../lib/events'
import { AppIcon, apps } from '../icons'
import { CalendarWidget, ClockWidget, GitHubWidget, MusicWidget, PhotoWidget, WeatherWidget, useCityTime } from './Widgets'
import { city, owner, projects } from '../../data/site'

function MenuItem({ children, shortcut, onSelect, checked }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-[3px] text-left text-[13px] text-black/85 hover:bg-[#0a64d8] hover:text-[#fff] focus-visible:bg-[#0a64d8] focus-visible:text-[#fff] focus-visible:outline-none"
    >
      <span className="w-3 text-[11px]">{checked ? '✓' : ''}</span>
      <span className="flex-1">{children}</span>
      {shortcut && <span className="text-[12px] opacity-50">{shortcut}</span>}
    </button>
  )
}

// The "MK" menu, styled like the macOS Apple menu.
function AppleMenu({ dark, toggle }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  useEffect(() => {
    if (!open) return
    const close = (event) => !root.current?.contains(event.target) && setOpen(false)
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])
  const pick = (fn) => () => {
    setOpen(false)
    fn()
  }
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`-mx-1.5 rounded px-1.5 py-0.5 font-semibold text-black/70 ${open ? 'bg-black/10' : 'hover:bg-black/5'}`}
      >
        MK
      </button>
      {open && (
        <div role="menu" className="absolute left-[-6px] top-[calc(100%+4px)] w-[230px] rounded-[9px] border border-black/10 bg-white/80 p-[5px] shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150">
          <MenuItem onSelect={pick(openAbout)}>About This Mac</MenuItem>
          <div className="mx-2.5 my-[5px] h-px bg-black/10" />
          <MenuItem shortcut={mac ? '⌘K' : 'Ctrl K'} onSelect={pick(openSpotlight)}>Spotlight Search…</MenuItem>
          <MenuItem onSelect={pick(openBooking)}>Book a Meeting…</MenuItem>
          <MenuItem onSelect={pick(() => { window.location.href = `mailto:${owner.email}` })}>Email Mohib</MenuItem>
          <div className="mx-2.5 my-[5px] h-px bg-black/10" />
          <MenuItem onSelect={pick(() => { window.location.href = '/playground' })}>Playground</MenuItem>
          <MenuItem onSelect={pick(() => window.open(owner.github, '_blank', 'noopener'))}>GitHub</MenuItem>
          <div className="mx-2.5 my-[5px] h-px bg-black/10" />
          <MenuItem checked={dark} onSelect={pick(toggle)}>Dark Mode</MenuItem>
        </div>
      )}
    </div>
  )
}

function MenuBar() {
  const { now } = useCityTime()
  const { dark, toggle } = useAppearance()
  const label = now.toLocaleString('en-US', { timeZone: city.timeZone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/,(?=[^,]*$)/, '')
  return (
    <div className="absolute inset-x-0 top-0 z-[95] flex h-7 items-center justify-between border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <AppleMenu dark={dark} toggle={toggle} />
        <span className="hidden sm:inline">{owner.name}</span>
        <span className="hidden text-black/35 sm:inline">{owner.role}</span>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={openSpotlight} aria-label="Spotlight search" className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/5">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8" /></svg>
        </button>
        <label className="flex cursor-pointer items-center gap-2">
          <span>Dark Mode</span>
          <MacSwitch on={dark} onToggle={toggle} label="Dark mode" />
        </label>
        <span className="min-w-[124px] text-right tabular-nums">{label}</span>
      </div>
    </div>
  )
}

const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, filter: 'none' } }

// Anything on the desktop can be picked up and moved; a drag never counts as a click.
function DesktopItem({ board, style, z, onFront, resettable = false, className = '', children }) {
  const dragged = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Double-click a widget to send it home. Its own controls (play, volume, links) are left alone.
  const reset = (event) => {
    if (!resettable || event.target.closest('a, button, input, [role="button"]')) return
    const spring = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }
    animate(x, 0, spring)
    animate(y, 0, spring)
  }
  return (
    <motion.div
      drag
      dragConstraints={board}
      dragElastic={0.12}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, filter: 'drop-shadow(0 22px 28px rgba(0,0,0,0.22))' }}
      variants={item}
      onPointerDown={onFront}
      onDoubleClick={reset}
      onDragStart={() => {
        dragged.current = true
        document.documentElement.style.cursor = 'grabbing'
      }}
      onDragEnd={() => {
        document.documentElement.style.cursor = ''
        setTimeout(() => { dragged.current = false }, 0)
      }}
      onClickCapture={(event) => {
        if (dragged.current) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      className={`absolute cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
      style={{ ...style, x, y, zIndex: z }}
    >
      {children}
    </motion.div>
  )
}

function Folder({ project, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(project.id)} className="group flex w-20 flex-col items-center gap-1 border-0 bg-transparent p-0 text-inherit">
      <FolderIcon className="h-14 w-14 transition-transform group-hover:scale-105" />
      <span className="rounded-[5px] bg-white/70 px-1.5 py-0.5 text-center text-[12px] font-medium leading-tight text-black/80 backdrop-blur-sm group-hover:bg-[#0069d9] group-hover:text-[#fff]">{project.folder}</span>
    </button>
  )
}

function AppLink({ app, size }) {
  if (app.calendar) {
    return (
      <button type="button" onClick={openBooking} title="Book a meeting" aria-label="Book a meeting" className="flex items-center justify-center border-0 bg-transparent p-0 transition-transform hover:-translate-y-0.5">
        <AppIcon app={app} size={size} />
      </button>
    )
  }
  return (
    <a href={app.href} target={app.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" title={app.label} className="flex items-center justify-center transition-transform hover:-translate-y-0.5">
      <AppIcon app={app} size={size} />
    </a>
  )
}

function Headline({ mobile = false }) {
  return (
    <>
      <h1 className={mobile ? 'text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl' : 'text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl 2xl:text-6xl'}>
        <span className="hero-line hero-line-1">I&apos;m Mohib.</span>
        <br />
        <span className="hero-line hero-line-2">
          I build for{' '}
          <a href="#pillar-stack" className="pointer-events-auto underline decoration-black/20 decoration-[3px] underline-offset-[6px] transition-colors hover:decoration-black/60">the web</a>.
        </span>
      </h1>
      <p className={mobile ? 'hero-line hero-line-3 mt-3 text-sm leading-relaxed text-black/55 sm:text-base' : 'hero-line hero-line-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-black/50'}>
        CS student building web apps, Windows tools and game prototypes, with an interest in machine learning and AI.
      </p>
    </>
  )
}

function MobileAppearance() {
  const { dark, toggle } = useAppearance()
  return (
    <Glass className="flex items-center justify-between gap-4 !px-5 !py-3.5">
      <button type="button" onClick={openSpotlight} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-black/[0.05] px-3 py-1.5 text-left text-[13px] text-black/45">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8" /></svg>
        Search
      </button>
      <span className="flex items-center gap-2.5 text-[13px] font-semibold text-black/80">
        Dark
        <MacSwitch on={dark} onToggle={toggle} label="Dark mode" size="md" />
      </span>
    </Glass>
  )
}

// Phones and tablets: the same widgets stacked in a grid, entering with the desktop's stagger.
function Item({ className = '', children }) {
  return <motion.div variants={item} className={className}>{children}</motion.div>
}

function Stacked({ onOpenProject, onOpenContact }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.05, delayChildren: 0.08 }}
      className="mx-auto flex min-h-full w-full max-w-[760px] flex-col gap-4 px-5 pb-10 pt-10 sm:px-8 sm:pt-14 desk:hidden"
    >
      <Item><Glass className="!p-5 sm:!p-8"><Headline mobile /></Glass></Item>
      <Item><MobileAppearance /></Item>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Item className="hidden sm:block"><ClockWidget className="aspect-square h-auto w-full" /></Item>
        <Item><CalendarWidget className="flex h-28 flex-col justify-center !p-4 sm:hidden" onOpen={onOpenContact} compact /><CalendarWidget className="hidden aspect-square h-auto w-full !p-4 sm:block" onOpen={onOpenContact} /></Item>
        <Item><PhotoWidget className="h-28 w-full sm:aspect-square sm:h-auto" /></Item>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Item><MusicWidget className="h-full w-full !p-4" /></Item>
        <Item><WeatherWidget className="h-full w-full !p-4" /></Item>
      </div>
      <Item><GitHubWidget className="w-full !p-4" weeks={18} /></Item>
      <div className="mt-2 grid grid-cols-4 gap-x-2 gap-y-5">
        {projects.map((project) => (
          <Item key={project.id}>
            <button type="button" onClick={() => onOpenProject(project.id)} className="flex w-full flex-col items-center gap-1 border-0 bg-transparent p-0">
              <FolderIcon className="h-14 w-14 sm:h-16 sm:w-16" />
              <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight text-black/70 sm:text-[12px]">{project.folder}</span>
            </button>
          </Item>
        ))}
      </div>
      <Item>
        <Glass className="mt-2 !p-3 sm:!p-4">
          <div className="grid grid-cols-5 justify-items-center gap-2">{apps.map((app) => <AppLink key={app.label} app={app} size={44} />)}</div>
        </Glass>
      </Item>
    </motion.div>
  )
}

export default function Desktop({ onOpenProject, onOpenContact }) {
  const board = useRef(null)
  const [order, setOrder] = useState([])
  const front = (id) => () => setOrder((list) => [...list.filter((x) => x !== id), id])
  const z = (id) => 20 + Math.max(0, order.indexOf(id) + 1)

  const widgets = [
    { id: 'clock', style: { top: 90, left: 24 }, node: <ClockWidget /> },
    { id: 'calendar', style: { top: 90, left: 194 }, node: <CalendarWidget onOpen={onOpenContact} /> },
    { id: 'music', style: { top: 90, left: 364 }, node: <MusicWidget /> },
    { id: 'weather', style: { top: 264, left: 24 }, node: <WeatherWidget /> },
    { id: 'photo', style: { top: 404, left: 24 }, node: <PhotoWidget /> },
    { id: 'github', style: { top: 572, left: 24 }, node: <GitHubWidget />, roomy: true },
    {
      id: 'apps',
      style: { bottom: 120, right: 48 },
      node: (
        <Glass className="!p-3">
          <div className="grid grid-cols-5 gap-1">{apps.map((app) => <AppLink key={app.label} app={app} size={44} />)}</div>
        </Glass>
      ),
    },
  ]

  return (
    <div className="z-0 min-h-[100svh] w-full bg-white desk:sticky desk:top-0 desk:h-[100dvh] desk:min-h-0 desk:overflow-hidden">
      <div ref={board} className="relative h-full w-full overflow-hidden bg-desk">
        <div className="hidden h-full desk:block">
          <MenuBar />
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.05, delayChildren: 0.08 }}>
            {projects.map((project, i) => (
              <DesktopItem key={project.id} board={board} style={{ top: 90 + i * 108, right: '2.5%' }} z={z(project.id)} onFront={front(project.id)}>
                <Folder project={project} onOpen={onOpenProject} />
              </DesktopItem>
            ))}
            {widgets.map((w) => (
              <DesktopItem key={w.id} board={board} style={w.style} z={z(w.id)} onFront={front(w.id)} resettable className={w.roomy ? 'hidden [@media(min-width:1280px)_and_(min-height:820px)]:block' : ''}>
                {w.node}
              </DesktopItem>
            ))}
          </motion.div>
          <div className="pointer-events-none flex h-full items-center justify-center px-6">
            <div className="max-w-3xl text-center"><Headline /></div>
          </div>
        </div>

        <Stacked onOpenProject={onOpenProject} onOpenContact={onOpenContact} />
      </div>
    </div>
  )
}
