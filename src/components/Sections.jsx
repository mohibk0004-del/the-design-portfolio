import { useState } from 'react'
import { Radio } from 'lucide-react'
import { siGithub, siGmail, siInstagram, siSpotify } from 'simple-icons'
import { AppTile, ArrowLink, MohibMark, Reveal } from './ui'
import Window from './Window'
import { about, achievements, askChatGPT, askClaude, certificates, otherProjects, owner, photographs, projects, song } from '../data/site'
import { AppIcon, apps } from './icons'

const glyphs = { ball: Radio }

// Amazon's mark (lowercase a and the orange smile) on its navy tile.
function AmazonTile() {
  return (
    <div className="flex h-[72px] w-[72px] flex-col items-center justify-center rounded-[22%] bg-[#232F3E] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.25)]" role="img" aria-label="Amazon">
      <span className="-mb-1 text-[34px] font-bold leading-none text-[#fff]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>a</span>
      <svg viewBox="0 0 40 12" className="w-[38px]" aria-hidden="true">
        <path d="M2 3.2c9.5 6.2 24.5 6.6 33.6.8" fill="none" stroke="#FF9900" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M30.6 1.4l5.4 2.2-2.6 5.2" fill="none" stroke="#FF9900" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function Achievements() {
  return (
    <section id="achievements" className="relative z-50 scroll-mt-24 bg-white px-6 py-20">
      <div className="mx-auto grid max-w-[1060px] gap-y-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-x-5">
        <div>
        <Reveal><h2 className="mb-8 text-3xl font-extrabold tracking-tight">Achievements</h2></Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10">
          {achievements.map((entry, i) => {
            const Glyph = glyphs[entry.icon]
            const icon = entry.icon === 'amazon'
              ? <AmazonTile />
              : entry.image
              ? <img src={entry.image} alt="" className="h-[72px] w-[72px] rounded-[22%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)]" />
              : (
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22%] text-[#fff] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)]" style={{ background: `linear-gradient(to bottom, ${entry.from}, ${entry.to})` }}>
                  <Glyph size={34} strokeWidth={1.8} />
                </div>
              )
            const body = (
              <>
                <div className="mb-4 flex h-36 items-center justify-center rounded-2xl border border-black/[0.06] bg-black/[0.03]">
                  {icon}
                </div>
                <p className="text-[15px] font-bold leading-snug">{entry.title}</p>
                <p className="mt-1 text-sm leading-snug text-black/55">{entry.detail}</p>
              </>
            )
            return (
              <Reveal key={entry.title} delay={i * 80}>
                {entry.href
                  ? <a href={entry.href} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-0.5">{body}</a>
                  : <div>{body}</div>}
              </Reveal>
            )
          })}
        </div>
        </div>
        <Certificates />
      </div>
    </section>
  )
}

// Clip path of the folder tab, taken from the reference so the curve matches exactly.
const TAB = 'path("M0 80 L0 32 Q0 2 30 2 L198 2 Q226 2 240 20 C254 36 264 40 300 40 L320 40 L320 80 Z")'

export function ProjectStack({ onOpenProject }) {
  return (
    <div id="pillar-stack" className="relative bg-desk">
      {projects.map((project, i) => (
        <div key={project.id} id={project.id} className="z-10 flex h-auto w-full flex-col max-md:static max-md:mt-4 md:sticky md:top-24 md:h-[calc(100dvh_-_6rem)]" style={{ zIndex: 10 + i }}>
          <div className="relative h-20 w-full shrink-0">
            <div className="absolute inset-x-0 bottom-[-32px] h-[72px] rounded-t-[30px] bg-tab" />
            <div className="absolute left-0 top-0 h-20 w-[320px] bg-tab" style={{ clipPath: TAB }} />
            <span className="absolute left-12 top-3 flex h-9 items-center text-[13px] font-bold uppercase tracking-[0.08em] text-black/50">{project.tab}</span>
          </div>
          <div className="relative -mt-2 flex min-h-0 w-full flex-1 items-start overflow-hidden rounded-t-[28px] bg-gradient-to-b from-sheet-from via-sheet-via to-sheet-to shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),0_-4px_16px_rgba(0,0,0,0.03)] max-md:rounded-b-[28px] md:items-center">
            <div className="mx-auto w-full max-w-[1100px] px-8 py-12 md:max-h-full md:overflow-y-auto md:px-12">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">Project nº{i + 1}</p>
              <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 className="mb-4 max-w-md text-2xl font-bold leading-tight md:text-3xl">{project.title}</h2>
                  <p className="max-w-md text-sm leading-relaxed text-black/60">{project.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <a href={project.href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-[#fff] shadow-sm transition-colors hover:bg-[#3E8FE4]">{project.cta} →</a>
                    <button type="button" onClick={() => onOpenProject(project.id)} className="whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-[#fff] shadow-sm transition-colors hover:bg-[#3E8FE4]">Open folder →</button>
                  </div>
                </div>
                <div className="transition-all duration-300 hover:-translate-y-1.5 [&:hover>.note-shadow]:shadow-[0_22px_48px_rgba(0,0,0,0.24)]">
                  <div className="note-shadow rounded-[6px] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300">
                    <div className="h-7 rounded-t-[6px] border border-b-0 border-[#d9b83a]/40 bg-gradient-to-b from-[#F4DA71] via-[#EACB4E] to-[#DFBA35]" />
                    <div className="flex flex-col justify-between rounded-b-[6px] border border-t-0 border-white/60 bg-white/60 p-6 backdrop-blur-xl backdrop-saturate-150">
                      <ul className="space-y-4">
                        {project.notes.map((note) => (
                          <li key={note.title}>
                            <p className="text-[15px] font-bold leading-snug text-black/85">{note.title}</p>
                            <p className="mt-0.5 text-sm leading-snug text-black/55 max-md:hidden">{note.detail}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function OtherProjects() {
  return (
    <section id="highlights" className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Other projects</h2>
            <p className="text-sm text-black/50">More on <a href={owner.github} target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-2 hover:decoration-black/60">GitHub</a></p>
          </div>
        </Reveal>
        <div>
          {otherProjects.map((entry) => (
            <Reveal key={entry.name} className="flex flex-col gap-1 border-b border-black/10 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div className="flex items-baseline gap-3"><span className="text-[15px] font-bold leading-snug">{entry.name}</span></div>
              <p className="text-sm text-black/55 sm:max-w-md sm:text-right">{entry.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Playground() {
  return (
    <section id="playground" className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-28">
      <a href="/playground" className="group mx-auto flex w-fit flex-col items-center">
        <span className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
          <span className="text-5xl font-extrabold tracking-tight md:text-7xl">The</span>
          <span className="relative block h-[108px] w-[150px] md:h-[126px] md:w-[176px]" aria-hidden="true">
            <span className="absolute left-0 top-[8%] h-[34%] w-[42%] rounded-t-xl bg-fold-back" />
            <span className="absolute inset-x-0 bottom-0 h-[78%] rounded-2xl bg-gradient-to-b from-fold-back to-fold-back-2" />
            <span className="absolute bottom-[30%] left-1/2 block w-[44%] -translate-x-[85%] overflow-hidden rounded-lg border-[3px] border-white bg-white shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[42%] group-hover:-rotate-12">
              <img src={photographs[0].src} alt="" className="block aspect-square w-full object-cover" />
            </span>
            <span className="absolute bottom-[30%] left-1/2 block w-[44%] -translate-x-[15%] overflow-hidden rounded-lg border-[3px] border-white bg-white shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[52%] group-hover:rotate-12">
              <img src={song.cover} alt="" className="block aspect-square w-full object-cover" />
            </span>
            <span className="absolute bottom-[30%] left-1/2 flex aspect-square w-[40%] -translate-x-1/2 -rotate-1 items-center justify-center rounded-lg bg-[#FFE066] p-1 shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[68%]">
              <span className="text-center text-[7px] font-semibold leading-tight text-black/70 md:text-[8px]">@clicksbymohib</span>
            </span>
            <span className="absolute inset-x-0 bottom-0 z-10 block h-[62%] origin-bottom rounded-2xl bg-gradient-to-b from-fold-front to-fold-front-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_-2px_8px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out [transform:perspective(700px)] group-hover:[transform:perspective(700px)_rotateX(-24deg)]" />
            <span className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-90 rounded-full bg-[#F7CE46] px-5 py-2 text-sm font-semibold text-black opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">View</span>
          </span>
          <span className="text-5xl font-extrabold tracking-tight md:text-7xl">Playground</span>
        </span>
        <p className="mt-8 max-w-md text-center text-sm text-black/50">My personal gallery. Photos I&apos;ve taken, old work and things I like.</p>
      </a>
    </section>
  )
}

// Certificates as Preview documents: click one to open it full size in a window.
// Sits in the right-hand column of the Achievements section.
function Certificates() {
  const [viewing, setViewing] = useState(null)
  return (
    <div id="certificates" className="scroll-mt-24">
      <div>
        <Reveal><h2 className="mb-8 text-3xl font-extrabold tracking-tight">Certificates</h2></Reveal>
        <div className="grid gap-y-10">
          {certificates.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 80}>
              <button type="button" onClick={() => setViewing(cert)} className="group block w-full cursor-zoom-in text-left">
                <span className="mb-4 flex h-36 items-center justify-center rounded-2xl border border-black/[0.06] bg-black/[0.03] px-6">
                  <img src={cert.image} alt="" className="block max-h-[104px] w-auto rounded-[3px] bg-[#fff] shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:-rotate-1" />
                </span>
                <span className="block text-[15px] font-bold leading-snug">{cert.title}</span>
                <span className="mt-1 block text-sm leading-snug text-black/55">{cert.issuer} · {cert.instructor} · {cert.length}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Window open={Boolean(viewing)} title={viewing ? `${viewing.title}.pdf` : ''} onClose={() => setViewing(null)} width={820}>
        {viewing && (
          <div className="bg-white">
            <div className="bg-media p-4 sm:p-6">
              <img src={viewing.image} alt={`${viewing.title} certificate of completion, ${viewing.issuer}, ${viewing.date}`} className="mx-auto block max-h-[calc(min(86vh,760px)-150px)] w-auto max-w-full rounded-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.18)]" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{viewing.title}</p>
                <p className="text-xs text-black/55">{viewing.issuer} · {viewing.instructor} · {viewing.length} · {viewing.date}</p>
              </div>
              <a href={viewing.href} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#0a64d8] px-3 py-1.5 text-xs font-semibold text-[#fff] shadow-sm transition-colors hover:bg-[#0858c0]">Verify on {viewing.issuer}</a>
            </div>
          </div>
        )}
      </Window>
    </div>
  )
}

export function AboutWindow() {
  const [open, setOpen] = useState(false)
  return (
    <section id="about" className="relative z-50 mx-auto max-w-[1060px] scroll-mt-24 px-6 py-16">
      <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
        <div className="relative flex items-center gap-2 border-b border-black/10 bg-titlebar px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">about-me.txt</span>
        </div>
        <div className="grid gap-10 p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">Then</p>
            <p className="text-sm leading-relaxed text-black/60">{about.then}</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">Now</p>
            <p className="text-sm leading-relaxed text-black/60">{about.now}</p>
            <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="mt-8 flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black/70">
              The future
              <svg viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true"><path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>
            <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
              <div className="overflow-hidden"><p className="pt-3 text-sm leading-relaxed text-black/60">{about.future}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const footerIcons = [
  { label: 'GitHub', href: owner.github, background: '#181717', path: siGithub.path },
  { label: 'Instagram', href: owner.instagram, background: 'linear-gradient(45deg,#FED373 0%,#F15245 35%,#D92E7F 62%,#9B36B7 85%,#515ECF 100%)', path: siInstagram.path },
  { label: 'Gmail', href: `mailto:${owner.email}`, background: '#fff', color: '#EA4335', path: siGmail.path, bordered: true },
  { label: 'Spotify', href: song.href, background: '#121212', color: '#1ED760', path: siSpotify.path },
]

export function Footer({ onOpenContact }) {
  const askApps = apps.filter((app) => app.href === askClaude || app.href === askChatGPT)
  return (
    <footer id="contact" className="relative z-50 border-t border-black/10 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-[1060px] gap-10 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[24%] border border-black/10 bg-white shadow-md">
              <MohibMark className="h-[58%] w-[58%] text-black" />
            </div>
            <div>
              <p className="text-[15px] font-bold leading-snug">{owner.name}.</p>
              <p className="text-[15px] leading-snug text-black/55">A CS student who ships.</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            {footerIcons.map((icon) => (
              <a key={icon.label} href={icon.href} title={icon.label} aria-label={icon.label} target={icon.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="transition-transform duration-150 hover:-translate-y-1">
                <AppTile size={40} {...icon} label={undefined} />
              </a>
            ))}
            {askApps.map((app) => (
              <a key={app.label} href={app.href} title={app.label} aria-label={app.label} target="_blank" rel="noopener noreferrer" className="transition-transform duration-150 hover:-translate-y-1">
                <AppIcon app={app} size={40} />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2.5 text-sm font-medium">
          <ArrowLink href={`mailto:${owner.email}`}>Email</ArrowLink>
          <ArrowLink href={owner.github} target="_blank" rel="noopener noreferrer">GitHub</ArrowLink>
          <ArrowLink href={owner.instagram} target="_blank" rel="noopener noreferrer">Instagram</ArrowLink>
          <ArrowLink as="button" type="button" onClick={onOpenContact}>Book a meeting</ArrowLink>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-black/50">Based in Islamabad</p>
          <p className="text-sm text-black/50">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
