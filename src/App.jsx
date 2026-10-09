import { useCallback, useState } from 'react'
import Desktop from './components/desktop/Desktop'
import Dock from './components/Dock'
import Window from './components/Window'
import ProjectWindow from './components/ProjectWindow'
import { AboutWindow, Achievements, Footer, OtherProjects, Playground, ProjectStack } from './components/Sections'
import { owner, projects } from './data/site'

function ContactWindow({ open, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(owner.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <Window open={open} title="Say hello" onClose={onClose} width={440}>
      <div className="p-8">
        <p className="text-2xl font-bold leading-tight">Want to build something together?</p>
        <p className="mt-2 text-sm leading-relaxed text-black/60">Send me an email. I usually reply within a day.</p>
        <div className="mt-6 flex items-center gap-2">
          <a href={`mailto:${owner.email}`} className="whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#3E8FE4]">Email me →</a>
          <button type="button" onClick={copy} className="whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-black/70 shadow-sm transition-colors hover:bg-[#f3f3f3]">
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>
        <p className="mt-4 text-xs text-black/40" role="status" aria-live="polite">{owner.email}</p>
      </div>
    </Window>
  )
}

export default function App() {
  const [projectId, setProjectId] = useState(null)
  const [contactOpen, setContactOpen] = useState(false)
  const openProject = useCallback((id) => setProjectId(id), [])
  const closeProject = useCallback(() => setProjectId(null), [])
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])

  return (
    <main id="top">
      <div className="min-h-screen bg-white text-black">
        <div className="relative">
          <Desktop onOpenProject={openProject} onOpenContact={openContact} />
          <Dock onCalendar={openContact} />
          <Achievements />
          <ProjectStack onOpenProject={openProject} />
          <OtherProjects />
          <Playground />
          <div className="relative z-50 bg-white"><AboutWindow /></div>
          <Footer onOpenContact={openContact} />
        </div>
      </div>
      <ProjectWindow project={projects.find((p) => p.id === projectId)} onClose={closeProject} />
      <ContactWindow open={contactOpen} onClose={closeContact} />
    </main>
  )
}
