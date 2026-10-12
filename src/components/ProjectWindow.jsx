import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Window from './Window'

// One or two images sit side by side; more become a gallery with thumbnails.
function Gallery({ images }) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const image = images[index]
  return (
    <div className="bg-media p-5">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <AnimatePresence initial={false}>
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.alt}
            draggable="false"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </AnimatePresence>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Screenshots">
        {images.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={item.alt}
            onClick={() => setIndex(i)}
            className={`w-[88px] shrink-0 overflow-hidden rounded-md border-2 transition-[border-color,opacity] ${i === index ? 'border-[#0a64d8] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={item.src} alt="" draggable="false" className="block aspect-[3/2] w-full object-cover object-top" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ProjectWindow({ project, onClose }) {
  return (
    <Window open={Boolean(project)} title={project ? `${project.folder}` : ''} onClose={onClose} width={860}>
      {project && (
        <div>
          {project.images.length > 2 ? (
            <Gallery key={project.id} images={project.images} />
          ) : (
            <div className="flex gap-3 bg-media p-5">
              {project.images.map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} className="max-h-[340px] min-w-0 flex-1 rounded-lg object-cover object-top shadow-[0_8px_24px_rgba(0,0,0,0.12)]" />
              ))}
            </div>
          )}
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div>
              {project.logo && <img src={project.logo} alt="" className="mb-4 h-12 w-12 rounded-[22%] shadow-[0_4px_12px_rgba(0,0,0,0.2)]" />}
              <h2 className="text-2xl font-bold leading-tight">{project.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{project.summary}</p>
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-[#fff] shadow-sm transition-colors hover:bg-[#3E8FE4]">
                {project.cta} →
              </a>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">Built with</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-black/70">
                {project.stack.map((tool) => <li key={tool}>{tool}</li>)}
              </ul>
              <ul className="mt-6 space-y-3">
                {project.notes.map((note) => (
                  <li key={note.title}>
                    <p className="text-[15px] font-bold leading-snug text-black/85">{note.title}</p>
                    <p className="mt-0.5 text-sm leading-snug text-black/55">{note.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Window>
  )
}
