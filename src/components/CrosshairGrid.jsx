import React from 'react'

export default function CrosshairGrid({ opacity = 0.5, className = "", style = {} }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`} style={{ opacity, ...style }}>
      {/* 1. Base 40px Line Grid */}
      <div className="absolute inset-0 bg-grid"></div>
      
      {/* 2. Major Structural Grid with '+' Crosshair Intersections */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="relative border-r border-b border-[var(--text-primary)]/15 h-[200px] md:h-[240px]">
            {/* '+' Crosshair marker at the bottom-right intersection of each cell */}
            <span className="absolute -bottom-2 -right-2 font-mono text-sm font-light leading-none text-[var(--text-primary)]/60 select-none z-10">
              +
            </span>
          </div>
        ))}
      </div>
      
      {/* 3. Halftone Dot Grid Clusters (Circular dot matrix badges) */}
      <div 
        className="absolute top-12 left-[15%] w-56 h-56 rounded-full pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-primary) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px'
        }}
      />
      <div 
        className="absolute bottom-24 right-[10%] w-72 h-72 rounded-full pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-primary) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px'
        }}
      />
      <div 
        className="absolute top-[55%] left-[5%] w-48 h-48 rounded-full pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-primary) 1.5px, transparent 1.5px)',
          backgroundSize: '10px 10px'
        }}
      />
    </div>
  )
}
