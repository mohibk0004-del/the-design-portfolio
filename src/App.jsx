import { useCallback, useEffect, useState } from 'react'
import { startSmoothScroll } from './lib/smooth'
import Desktop from './components/desktop/Desktop'
import Dock from './components/Dock'
import BookingWindow, { openBooking } from './components/BookingWindow'
import ProjectWindow from './components/ProjectWindow'
import { AboutWindow, Achievements, Footer, OtherProjects, Playground, ProjectStack } from './components/Sections'
import { projects } from './data/site'
import Spotlight from './components/Spotlight'
import AboutMac from './components/AboutMac'
import { useAppearance } from './lib/theme'

export default function App() {
  useEffect(() => startSmoothScroll(), [])
  const [projectId, setProjectId] = useState(null)
  const openProject = useCallback((id) => setProjectId(id), [])
  const closeProject = useCallback(() => setProjectId(null), [])
  const { toggle } = useAppearance()
  useEffect(() => {
    const open = (event) => setProjectId(event.detail)
    window.addEventListener('open-project', open)
    return () => window.removeEventListener('open-project', open)
  }, [])

  return (
    <main id="top">
      <div className="min-h-screen bg-white text-black">
        <div className="relative">
          <Desktop onOpenProject={openProject} onOpenContact={openBooking} />
          <Dock onCalendar={openBooking} />
          <Achievements />
          <ProjectStack onOpenProject={openProject} />
          <OtherProjects />
          <Playground />
          <div className="relative z-50 bg-white"><AboutWindow /></div>
          <Footer onOpenContact={openBooking} />
        </div>
      </div>
      <ProjectWindow project={projects.find((p) => p.id === projectId)} onClose={closeProject} />
      <BookingWindow />
      <AboutMac />
      <Spotlight toggleAppearance={toggle} />
    </main>
  )
}
