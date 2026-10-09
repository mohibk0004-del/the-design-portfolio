import { useEffect, useId, useRef, useState } from 'react'

// Frosted widget surface used by every desktop widget, the dock and the app grid.
export function Glass({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-white/45 bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// macOS-style folder, drawn so it stays crisp at any size.
export function FolderIcon({ className = 'h-14 w-14' }) {
  // Gradient ids must be unique per icon, or hidden copies break the visible ones.
  const id = `folder${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg viewBox="0 0 64 52" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5DB9F3" />
          <stop offset="1" stopColor="#3D9FE6" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8DD3FC" />
          <stop offset="1" stopColor="#62BCF6" />
        </linearGradient>
      </defs>
      <path d="M4 6.5C4 4.6 5.6 3 7.5 3h15.2c1 0 1.9.4 2.6 1.1l3.2 3.3c.7.7 1.6 1.1 2.6 1.1H56.5c1.9 0 3.5 1.6 3.5 3.5V44c0 1.9-1.6 3.5-3.5 3.5h-49C5.6 47.5 4 45.9 4 44V6.5Z" fill={`url(#${id}b)`} />
      <path d="M3 16.5C3 14.6 4.6 13 6.5 13h51c1.9 0 3.5 1.6 3.5 3.5v29c0 1.9-1.6 3.5-3.5 3.5h-51C4.6 49 3 47.4 3 45.5v-29Z" fill={`url(#${id}f)`} />
      <path d="M3.5 17.2c0-1.6 1.3-2.9 2.9-2.9h51.2c1.6 0 2.9 1.3 2.9 2.9" fill="none" stroke="#fff" strokeOpacity=".55" />
    </svg>
  )
}

// A squircle app tile. `glyph` is an SVG path (simple-icons) or a React node.
export function AppTile({ size = 44, background, color = '#fff', glyph, path, label, className = '', bordered = false }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[22%] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_6px_rgba(0,0,0,0.22)] ${bordered ? 'border border-black/10' : ''} ${className}`}
      style={{ width: size, height: size, background, color }}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {path ? (
        <svg viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} fill="currentColor" aria-hidden="true"><path d={path} /></svg>
      ) : glyph}
    </span>
  )
}

// Fades a block up 20px the first time it scrolls into view (700ms, ease-out), like the reference.
export function Reveal({ delay = 0, className = '', as: Tag = 'div', children, ...props }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

// Link with the reference's arrow swap and underline grow on hover.
export function ArrowLink({ children, as: Tag = 'a', ...props }) {
  return (
    <Tag className="group relative inline-flex w-fit items-center gap-1.5" {...props}>
      <span className="text-black/70 transition-colors group-hover:text-black">{children}</span>
      <span className="relative h-4 w-4 overflow-hidden text-black/70 transition-colors group-hover:text-black" aria-hidden="true">
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-[150%]">→</span>
        <span className="absolute inset-0 flex -translate-x-[150%] items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-0">→</span>
      </span>
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden="true" />
    </Tag>
  )
}
