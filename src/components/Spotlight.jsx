import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FolderIcon } from './ui'
import { openBooking } from './BookingWindow'
import { goTo, openAbout, openProjectWindow } from '../lib/events'
import { togglePlay } from '../lib/player'
import { askChatGPT, askClaude, owner, projects, song } from '../data/site'

const external = (href) => () => window.open(href, '_blank', 'noopener')

function useItems(toggleAppearance) {
  return useMemo(() => [
    ...projects.map((p) => ({ group: 'Projects', title: p.folder, hint: p.title, icon: 'folder', keywords: p.stack.join(' '), run: () => openProjectWindow(p.id) })),
    { group: 'Sections', title: 'Achievements', hint: 'Sideline, Zero-in', icon: 'section', run: () => goTo('#achievements') },
    { group: 'Sections', title: 'Work', hint: 'Project folders', icon: 'section', run: () => goTo('#pillar-stack') },
    { group: 'Sections', title: 'Other projects', hint: 'Ghostranger, Ours, Spotify Album Finder', icon: 'section', run: () => goTo('#highlights') },
    { group: 'Sections', title: 'About me', hint: 'about-me.txt', icon: 'section', run: () => goTo('#about') },
    { group: 'Sections', title: 'Playground', hint: 'Photos and old work', icon: 'section', run: () => { window.location.href = '/playground' } },
    { group: 'Actions', title: 'Book a meeting', hint: '30 minutes on Calendly', icon: 'calendar', run: openBooking },
    { group: 'Actions', title: 'About This Mac', hint: `${owner.name}, ${owner.role}`, icon: 'about', run: openAbout },
    { group: 'Actions', title: 'Toggle dark mode', hint: 'Appearance', icon: 'moon', run: toggleAppearance },
    { group: 'Actions', title: `Play ${song.title}`, hint: song.artist, icon: 'music', keywords: 'song music spotify', run: togglePlay },
    { group: 'Links', title: 'Email', hint: owner.email, icon: 'link', run: () => { window.location.href = `mailto:${owner.email}` } },
    { group: 'Links', title: 'GitHub', hint: 'github.com/mohibk0004-del', icon: 'link', run: external(owner.github) },
    { group: 'Links', title: 'Instagram', hint: '@clicksbymohib', icon: 'link', run: external(owner.instagram) },
    { group: 'Links', title: 'Ask Claude about me', hint: 'claude.ai', icon: 'link', run: external(askClaude) },
    { group: 'Links', title: 'Ask ChatGPT about me', hint: 'chatgpt.com', icon: 'link', run: external(askChatGPT) },
  ], [toggleAppearance])
}

const glyphs = {
  section: <path d="M5 6h14M5 12h14M5 18h9" />,
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  about: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8v.4" /></>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />,
  music: <><path d="M9 17.5V6l10-2v11.5" /><circle cx="6.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="15.5" r="2.5" /></>,
  link: <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66l1-1" />,
}

function Icon({ name }) {
  if (name === 'folder') return <FolderIcon className="h-7 w-7" />
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/[0.06] text-black/60">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>
    </span>
  )
}

// macOS Spotlight: ⌘K / Ctrl+K anywhere, type to filter, arrows + Enter to run.
export default function Spotlight({ toggleAppearance }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef(null)
  const list = useRef(null)
  const reduce = useReducedMotion()
  const items = useItems(toggleAppearance)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => `${item.title} ${item.hint} ${item.group} ${item.keywords ?? ''}`.toLowerCase().includes(q))
  }, [items, query])

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    const show = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-spotlight', show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-spotlight', show)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => input.current?.focus())
    }
  }, [open])

  useEffect(() => {
    list.current?.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (item) => {
    if (!item) return
    setOpen(false)
    setTimeout(item.run, 60)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (event.key === 'Enter') { event.preventDefault(); run(results[active]) }
    else if (event.key === 'Escape') setOpen(false)
  }

  let lastGroup = ''
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center px-4 pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Spotlight search"
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -4 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/45 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl backdrop-saturate-150"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-black/45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.8-4.8" /></svg>
              <input
                ref={input}
                value={query}
                onChange={(event) => { setQuery(event.target.value); setActive(0) }}
                onKeyDown={onKeyDown}
                placeholder="Spotlight Search"
                aria-label="Search"
                aria-controls="spotlight-results"
                aria-activedescendant={results[active] ? `spot-${active}` : undefined}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[22px] font-medium text-black/85 outline-none placeholder:text-black/35"
              />
              <kbd className="hidden rounded-md border border-black/10 px-1.5 py-0.5 text-[11px] font-medium text-black/40 sm:block">esc</kbd>
            </div>
            <ul id="spotlight-results" ref={list} role="listbox" className="max-h-[52vh] overflow-y-auto border-t border-black/10 p-2" data-lenis-prevent>
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-black/45">No results for “{query}”</li>}
              {results.map((item, i) => {
                const header = item.group !== lastGroup
                lastGroup = item.group
                return (
                  <li key={`${item.group}-${item.title}`}>
                    {header && <p className="px-3 pb-1 pt-2 text-[11px] font-semibold text-black/40">{item.group}</p>}
                    <button
                      type="button"
                      id={`spot-${i}`}
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active ? '' : undefined}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(item)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${i === active ? 'bg-[#0a64d8] text-[#fff]' : 'text-black/85'}`}
                    >
                      <Icon name={item.icon} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{item.title}</span>
                        <span className={`block truncate text-[12px] ${i === active ? 'text-[rgba(255,255,255,0.75)]' : 'text-black/45'}`}>{item.hint}</span>
                      </span>
                      {i === active && <span className="text-[11px] font-medium text-[rgba(255,255,255,0.75)]">↵</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
