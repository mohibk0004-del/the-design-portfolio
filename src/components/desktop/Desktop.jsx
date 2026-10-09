import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderIcon, Glass, MacSwitch } from '../ui'
import { useAppearance } from '../../lib/theme'
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
  if (app.calendar) return <AppIcon app={app} size={size} />
  return (
    <a href={app.href} target={app.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" title={app.label} className="flex items-center justify-center transition-transform hover:-translate-y-0.5">
      <AppIcon app={app} size={size} />
    </a>
  )
}

function Headline({ mobile = false }) {
  return (
    <>
      <h1 className={mobile ? 'text-3xl font-extrabold leading-[1.08] tracking-tight' : 'text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl 2xl:text-6xl'}>
        <span className={mobile ? '' : 'hero-line hero-line-1'}>I&apos;m Mohib.</span>
        <br />
        <span className={mobile ? '' : 'hero-line hero-line-2'}>
          I build for{' '}
          <a href="#pillar-stack" className="pointer-events-auto underline decoration-black/20 decoration-[3px] underline-offset-[6px] transition-colors hover:decoration-black/60">the web</a>.
        </span>
      </h1>
      <p className={mobile ? 'mt-3 text-sm leading-relaxed text-black/55' : 'hero-line hero-line-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-black/50'}>
        CS student building web apps, Windows tools and game prototypes, with an interest in machine learning and AI.
      </p>
    </>
  )
}

function MobileAppearance() {
  const { dark, toggle } = useAppearance()
  return (
    <Glass className="mt-4 flex items-center justify-between !px-5 !py-3.5">
      <span className="text-[13px] font-semibold text-black/80">Dark Mode</span>
      <MacSwitch on={dark} onToggle={toggle} label="Dark mode" size="md" />
    </Glass>
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
    <div className="z-0 min-h-[100svh] w-full bg-white md:sticky md:top-0 md:h-[100dvh] md:min-h-0 md:overflow-hidden">
      <div ref={board} className="relative h-full w-full overflow-hidden bg-desk">
        <div className="hidden h-full md:block">
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

        <div className="flex min-h-full flex-col px-5 pb-10 pt-10 md:hidden">
          <Glass className="!p-5"><Headline mobile /></Glass>
          <MobileAppearance />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <CalendarWidget className="flex h-28 flex-col justify-center !p-4" onOpen={onOpenContact} compact />
            <PhotoWidget className="h-28 w-full" />
          </div>
          <MusicWidget className="mt-4 w-full !p-4" />
          <div className="mt-6 grid grid-cols-4 gap-x-2 gap-y-5">
            {projects.map((project) => (
              <button key={project.id} type="button" onClick={() => onOpenProject(project.id)} className="flex flex-col items-center gap-1 border-0 bg-transparent p-0">
                <FolderIcon className="h-14 w-14" />
                <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight text-black/70">{project.folder}</span>
              </button>
            ))}
          </div>
          <Glass className="mt-6 !p-3">
            <div className="grid grid-cols-5 gap-2">{apps.map((app) => <AppLink key={app.label} app={app} size={44} />)}</div>
          </Glass>
        </div>
      </div>
    </div>
  )
}
