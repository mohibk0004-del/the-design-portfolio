import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderIcon, Glass, MacSwitch } from '../ui'
import { useAppearance } from '../../lib/theme'
import { openBooking } from '../BookingWindow'
import { AppIcon, apps } from '../icons'
import { CalendarWidget, ClockWidget, MusicWidget, PhotoWidget, WeatherWidget, useCityTime } from './Widgets'
import { city, owner, projects } from '../../data/site'

function MenuBar() {
  const { now } = useCityTime()
  const { dark, toggle } = useAppearance()
  const label = now.toLocaleString('en-US', { timeZone: city.timeZone, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(/,(?=[^,]*$)/, '')
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-between border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="font-semibold text-black/70">MK</span>
        <span className="hidden sm:inline">{owner.name}</span>
        <span className="hidden text-black/35 sm:inline">{owner.role}</span>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <span>Dark Mode</span>
          <MacSwitch on={dark} onToggle={toggle} label="Dark mode" />
        </label>
        <span className="min-w-[124px] text-right tabular-nums">{label}</span>
      </div>
    </div>
  )
}

const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

// Anything on the desktop can be picked up and moved; a drag never counts as a click.
function DesktopItem({ board, style, z, onFront, children }) {
  const dragged = useRef(false)
  return (
    <motion.div
      drag
      dragConstraints={board}
      dragElastic={0.12}
      dragMomentum={false}
      whileDrag={{ scale: 1.04 }}
      variants={item}
      onPointerDown={onFront}
      onDragStart={() => { dragged.current = true }}
      onDragEnd={() => setTimeout(() => { dragged.current = false }, 0)}
      onClickCapture={(event) => {
        if (dragged.current) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      className="absolute cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ ...style, zIndex: z }}
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
    <Glass className="flex items-center justify-between !px-5 !py-3.5">
      <span className="text-[13px] font-semibold text-black/80">Dark Mode</span>
      <MacSwitch on={dark} onToggle={toggle} label="Dark mode" size="md" />
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
        <Item><CalendarWidget className="flex h-28 flex-col justify-center !p-4 sm:hidden" onOpen={onOpenContact} compact /><CalendarWidget className="hidden aspect-square h-auto w-full !p-4 sm:flex sm:flex-col" onOpen={onOpenContact} cta /></Item>
        <Item><PhotoWidget className="h-28 w-full sm:aspect-square sm:h-auto" /></Item>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Item><MusicWidget className="h-full w-full !p-4" /></Item>
        <Item><WeatherWidget className="h-full w-full !p-4" /></Item>
      </div>
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
    {
      id: 'calendar',
      style: { top: 90, left: 194 },
      node: (
        <div className="relative">
          <span className="pointer-events-none absolute -top-[22px] left-1 flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-black/45">
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="1.5" y="2.5" width="9" height="8" rx="1.6" /><path d="M1.5 5h9M4 1.2v2.2M8 1.2v2.2" strokeLinecap="round" /></svg>
            Book a meeting
          </span>
          <CalendarWidget onOpen={onOpenContact} />
        </div>
      ),
    },
    { id: 'music', style: { top: 90, left: 364 }, node: <MusicWidget /> },
    { id: 'weather', style: { top: 264, left: 24 }, node: <WeatherWidget /> },
    { id: 'photo', style: { top: 404, left: 24 }, node: <PhotoWidget /> },
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
              <DesktopItem key={w.id} board={board} style={w.style} z={z(w.id)} onFront={front(w.id)}>
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
