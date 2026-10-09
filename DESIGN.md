# Design System

**Typography:**
- Sans-serif: "Geist", "Inter", "Roboto"
- Monospace: "Geist Mono", "Fira Code"

**Color Strategy:**
- Restrained, monochromatic with stark contrasts.
- Deep Dark Mode (`#0a192f` background with `#8ab4d4` highlights)
- Crisp Light Mode (`#e0f2fe` background with `#93c5fd` highlights)
- Terminal Mode (`#0a0a0a` with `#33ff00` neon accents)
- Selection/Accent color: `#C0FE04` (Neon Green/Yellow)

**Motion:**
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` for snappy UI entrances.
- Interactions: Scale to 0.97 on press. Micro-blur on transitions.
- Scrolling: Heavy use of Lenis smooth scroll combined with Framer Motion spring physics.
- The scroll behavior maps physical concepts (mass, damping, stiffness) onto visual properties.

**Shadows & Depth:**
- Glassmorphism on interactive pills (`bg-white/5` with `backdrop-blur`).
- Use deep, colored glow or stark drop shadows (e.g. `drop-shadow-[0_0_15px_rgba(192,254,4,0.5)]`).
- Elements shouldn't feel flat, but shouldn't use cheap/generic SaaS box-shadows.
