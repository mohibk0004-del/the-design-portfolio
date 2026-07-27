# Mohib's Design Portfolio — Project Context & Architecture

This document serves as a comprehensive briefing and state checkpoint for AI coding assistants continuing work on Mohib's high-end digital design and software engineering portfolio.

---

## 1. Project Overview & Tech Stack
* **Framework**: React 18 + Vite (`npm run dev` to develop, `npm run build` to compile).
* **Styling**: Tailwind CSS v4 + Vanilla CSS custom properties (`src/index.css`).
* **3D & WebGL**: Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, custom GLSL vertex/fragment shaders.
* **Animation & Motion**: GSAP (`gsap`, `@gsap/react`, `ScrollTrigger`), custom GPU-accelerated micro-animations.
* **Smooth Scrolling**: Lenis (`lenis`) with custom RAF loop integration and scroll restoration management.
* **Design Aesthetic**: High-end industrial telemetry HUD mixed with Apple-style fluid physical motion, vibrant glassmorphism, and editorial typography.

---

## 2. Core Architecture & Key Components

### `src/components/Background3D.jsx`
* **`GooeyBackground` & Shaders**: Runs a custom GLSL fluid shader (`GooeyMaterial`) that morphs between deep dark navy/cobalt in dark mode and production-exact bright sky blue (`#66D9FF` -> `#EAF7FF`) in light mode.
* **`FloatingStickers` (3D WebGL Icons)**:
  * Uses all 22 PNG textures from `src/assets/3dicons/`.
  * Built on high-performance shared `PlaneGeometry(2.4, 2.4)` with `MeshPhysicalMaterial` (`clearcoat: 1.0`, `clearcoatRoughness: 0.05`, `metalness: 0.35`, `envMapIntensity: 3.5`, `toneMapped: true`).
  * Features 3D multi-axis rotation (`rotSpeedX`, `rotSpeedY`, `rotSpeedZ`), interactive cursor repulsion, and zero square side-wall borders around transparent PNG corners.
  * Enforces strict `.dispose()` cleanup in `useEffect` for geometries and materials to prevent WebGL GPU memory leaks.
* **`GlassHelloText` & `HeroClouds`**: Interactive 3D typography with clearcoat glass materials and tearable cloud clusters that respond dynamically to scroll position and theme toggling.

### `src/components/ScrollIndicator.jsx`
* **Custom Sci-Fi Telemetry Scrollbar**: Fixed to the right viewport edge (`fixed right-3 sm:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-50`).
* Features technical crosshair ticks (`+`), a neon glowing fill bar matching `--selection`, and a vertical numerical percentage readout (`00%` to `100%`).
* Optimized with passive `requestAnimationFrame` DOM transforms (`scaleY`), causing **0% CPU render thrashing** and zero React virtual DOM re-renders during scroll.

### `src/components/HUD.jsx`
* Fixed sci-fi header and footer overlay displaying time, temperature, and live mouse coordinates (`0000 X 0000 Y`).
* Uses DOM references and throttled `requestAnimationFrame` with passive listeners instead of React state updates to eliminate component re-render thrashing on mouse move.

### `src/components/Preloader.jsx`
* Liquid blob animation running on a lightweight GPU-friendly SVG filter (`#goo` using `feGaussianBlur` + `feColorMatrix`). Heavy CPU specular/composite lighting nodes were removed to guarantee buttery smooth 60/144 FPS loading while Three.js compiles shaders in the background.
* Includes a `visibilitychange` listener and fallback timeout (3.6s) so if a user tabs out during loading, the preloader completes in the background and unmounts from the layout (`display: none`).

### Portfolio Sections (`Hero.jsx`, `About.jsx`, `Works.jsx`, `ProjectsGrid.jsx`, `Footer.jsx`)
* **`Works.jsx` / `ProjectsGrid.jsx`**: Displays featured projects (Note: Sideline and LivePulse are the same project; LivePulse is a featured part of Sideline). Project card borders have been removed, with clean 2.5rem rounded edges and deep shadows applied directly to previews.
* **`About.jsx` / `CrosshairGrid.jsx`**: Features interactive grid overlays, handwriting signature reveals, and responsive bento layouts.

---

## 3. Theme System & Color Tokens (`src/index.css` & `ThemeContext.jsx`)
* **Dark Mode**: `--bg-color: #000000`, `--text-primary: #e2e8f0`, `--selection: #C0FE04`, `--card-bg: #0a0a0a`.
* **Light Mode**: Strictly synchronized with live production values from `www.mohib.app`:
  * `--bg-color: #ffffff`, `--bg-primary: #eaf7ff`, `--text-primary: #0077FF`, `--selection: #00BFFF`, `--card-bg: #66D9FF`.
  * WebGL shader color map in `Background3D.jsx`: `{ start: '#66D9FF', end: '#EAF7FF', highlight: '#00BFFF', fadeColor: '#EAF7FF' }`.

---

## 4. Performance & Scroll Restoration Safeguards Enforced
1. **Always Start from Top (0, 0)**: In `src/main.jsx` and `src/App.jsx`, `history.scrollRestoration = 'manual'` is set before React mounts. `window.scrollTo(0, 0)` and `lenis.scrollTo(0, { immediate: true })` are executed on startup and window load.
2. **Native Scrollbars Hidden Globally**: In `src/index.css`, native webkit and firefox/IE scrollbars are completely disabled (`*::-webkit-scrollbar { display: none !important; }`), leaving `ScrollIndicator.jsx` as the sole visual scrollbar while Lenis handles mouse wheel and touch scrolling.
3. **Lenis RAF Cleanup**: In `src/App.jsx`, `frameId` from `requestAnimationFrame` is tracked and cancelled upon unmount to prevent orphaned scrolling loops in memory.
4. **GPU Hardware Acceleration**: Animated DOM elements utilize `will-change: transform` and GSAP's `force3D: true` flag to prevent layout thrashing and CPU rasterization spikes.

---

## 5. Repository & Git Status
* All latest 3D icon upgrades, performance optimizations, custom scroll indicators, and bug fixes have been committed and pushed to `origin/master` (Latest Commit: `d3e1b6e`).
* Working tree is clean and ready for new feature development or design iterations.
