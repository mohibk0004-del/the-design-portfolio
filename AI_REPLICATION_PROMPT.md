# Advanced AI Design Engineering Prompt

**Purpose:** Provide this file to any LLM or AI Agent to instruct them on how to recreate the exact aesthetic, performance standards, and animation architecture of "The Design Portfolio". 

---

## 1. Tech Stack & Libraries
- **Core Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Vanilla CSS for custom utility variables like `var(--selection)`).
- **3D Graphics:** `@react-three/fiber`, `@react-three/drei`, `three`
- **Continuous Physics / Scroll:** `framer-motion` (specifically for `useVelocity`, `useTransform`, and `useSpring`).
- **Timelines & Reveals:** `gsap` (Core & `ScrollTrigger`).
- **Typography:** Geist / Inter for standard text, Geist Mono / Fira Code for accents and technical labels.

---

## 2. Global Design System
Instruct the AI to adhere strictly to these rules. No generic "SaaS" aesthetics.

### Colors & Materials
- **Backgrounds:** Deep dark mode base (`#0a192f` or pure `#000000`).
- **Accents:** High-contrast neon green (`#C0FE04`) for selections, hover states, and key highlights.
- **Glassmorphism:** Do not use heavy borders or flat grays. Use `bg-white/5`, `border-white/30`, and `backdrop-blur-sm` to create deep, translucent glass materials that let the 3D background bleed through.
- **Shadows:** No generic gray shadows. Use tight, crisp drop-shadows or deeply saturated glow shadows (`drop-shadow-[0_0_15px_rgba(192,254,4,0.5)]`).

### Typography
- **Headings:** Massive, tight line-height (`0.85`), slightly negative tracking. 
- **Utility Text:** Heavy use of uppercase Monospace text at very small sizes (`10px` to `12px`) with wide tracking (`tracking-widest`) for dates, badges, and interface labels.

---

## 3. Motion & Animation Rules
Do not use CSS `transition: all` for layout changes. Use strict motion physics.

### "Black Hole" Physical Bending (Framer Motion)
To create scrolling elements that physically bend under the velocity of the user's scroll, use Framer Motion's velocity mapping:
```javascript
const { scrollY } = useScroll()
const scrollVelocity = useVelocity(scrollY)
const smoothVelocity = useSpring(scrollVelocity, { stiffness: 400, damping: 50 }) 

const rotateX = useTransform(smoothVelocity, [-800, 800], [12, -12])
const scale = useTransform(smoothVelocity, [-800, 0, 800], [0.97, 1, 0.97])
const z = useTransform(smoothVelocity, [-800, 0, 800], [-20, 0, -20])

// Apply to <motion.div style={{ rotateX, scale, z, transformPerspective: 1200 }}>
```

### Apple-Design Compositor Reveals (GSAP)
When components enter the viewport, do NOT animate expensive properties like `blur` or `scale` if they conflict with physics. 
- Use GSAP `ScrollTrigger.batch` for performant staggers.
- Animate only `opacity: 0 -> 1` and `y: 40 -> 0`.
- Use fast durations (`0.6s`) and asymmetric easing (`power3.out` or `cubic-bezier(0.23, 1, 0.32, 1)`).

### Micro-Interactions
- Any clickable element (buttons, pills, links) must have an instant hardware-accelerated tap feedback: `active:scale-[0.95] will-change-transform`.
- Hover states should scale slightly (`1.03`) and trigger an origin-aware transition.

---

## 4. WebGL & React Three Fiber Strict Performance
The 3D background is the heaviest part of the site. Instruct the AI to NEVER violate these rules:

1. **No Instantiation in Render Loops:** Inside a `useFrame((state, delta) => {})`, you must never write `new THREE.Vector3()`. All vectors, colors, and math objects must be instantiated outside the loop using `useMemo` and updated via `.set()` or `.lerp()`.
2. **Context Cleanup:** Any raw `window.addEventListener` or `gsap.context()` MUST return a cleanup function (`removeEventListener` or `ctx.revert()`). Memory leaks in a WebGL context will crash mobile devices instantly.
3. **Fixed Z-Index Canvas:** The Canvas should live at the absolute bottom layer (`fixed inset-0 -z-10 pointer-events-none`). All foreground UI must have `pointer-events-auto` only where clickable.

---

## 5. UI Components Checklist
To perfectly clone the site's structure, you need:
1. **The HUD:** A fixed `<header>` overlay with `mix-blend-difference` containing minimal navigation and the theme toggle.
2. **The Hero:** A massive viewport-height section with interactive 3D elements floating behind typography.
3. **The About Segment:** Section-specific grids using `mask-image: linear-gradient()` to softly fade borders into the background.
4. **The Bento Grid Works:** An asymmetric CSS grid (`col-span-8` next to `col-span-4`) containing the `BendingCard` wrappers.
5. **The Interactive Footer:** A massive typographic CTA that features a GSAP-animated Toast portal that enters from `scale: 0.95` to `scale: 1` upon clicking.
