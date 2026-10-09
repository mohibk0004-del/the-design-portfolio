import Window from './Window'

export default function ProjectWindow({ project, onClose }) {
  return (
    <Window open={Boolean(project)} title={project ? `${project.folder}` : ''} onClose={onClose} width={860}>
      {project && (
        <div>
          <div className="flex gap-3 bg-[#f4f5f7] p-5">
            {project.images.map((image) => (
              <img key={image.src} src={image.src} alt={image.alt} className="max-h-[340px] min-w-0 flex-1 rounded-lg object-cover object-top shadow-[0_8px_24px_rgba(0,0,0,0.12)]" />
            ))}
          </div>
          <div className="grid gap-8 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div>
              <h2 className="text-2xl font-bold leading-tight">{project.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{project.summary}</p>
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#3E8FE4]">
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
