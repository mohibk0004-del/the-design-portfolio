# 3D "Hello" Text - Context & Implementation Details

*Copy and paste this document to any AI assistant when you want to modify, debug, or extend the 3D text on this website.*

---

## 1. Stack & Architecture
- **Location:** `src/components/Background3D.jsx`
- **Libraries:** `@react-three/fiber` (R3F) and `@react-three/drei`.
- **Structure:** The text is split into two main components:
  1. `GlassHelloText`: The parent group that holds the letters, handles responsive scaling, scroll-based Y-offset, and overall subtle rotation based on mouse position.
  2. `InteractiveLetter`: Renders a single `<Text3D>` geometry. It handles the real-time, per-letter "liquid/slime" physics interaction.

## 2. Geometry & Material (The Glass Look)
- **Geometry:** Uses `<Text3D>` from `@react-three/drei`. 
  - **Font:** `optimer_bold.typeface.json`
  - **Performance Optimization:** We specifically lowered the mesh density (`curveSegments={12}`, `bevelSegments={4}`) to save GPU and CPU resources on mobile, while keeping the glass looking perfect.
- **Material:** Uses `<meshPhysicalMaterial>` to create a high-end refractive glass shader.
  - **Key Properties:** `transmission={1}` (glassy), `roughness={0.02}` (smooth), `ior={1.15}` (index of refraction), `thickness={1.5}` (light bending depth), `clearcoat={1}`.
  - **Theming:** The glass tint changes dynamically based on the global light/dark theme.

## 3. Responsive Scaling & Positioning
- The text size and position adapt to screen width natively inside WebGL without CSS media queries.
- **Scale:** Calculates a `responsiveScale = Math.min(1, viewport.width / 14)`.
- **Mobile Overlap Fix:** On narrow screens (phones), the text dynamically shifts further down the Y-axis to prevent overlapping with the DOM HTML text in `Hero.jsx`. 
  - *Formula used:* `position.y = -2 - (1 - responsiveScale) * 4`

## 4. The "Slime / Liquid" Physics Engine
- **Per-Letter Physics:** Instead of moving the whole word, each `InteractiveLetter` runs its own physics loop 60 times a second inside `useFrame`.
- **Mouse Tracking:** We map `window.mouseCoords` (normalized -1 to 1) into the 3D space (`x * 12`, `y * 8`).
- **Distance Check:** We calculate the distance between the mouse and the specific letter using `meshRef.current.getWorldPosition(worldPos)`.
- **Repulsive Force:** If the mouse is within a radius of `3.0` units:
  - The letter is pushed backward on the Z-axis.
  - The letter is pushed slightly sideways on the X and Y axes away from the cursor.
  - The letter mathematically "squishes" (scale shrinks slightly on X/Y, expands on Z).
  - The letter wobbles (rotates based on the X/Y push direction).
- **Lerping (Smoothing):** All movements, both reacting to the mouse and springing back to their original position, use `THREE.MathUtils.lerp(current, target, alpha)` to create a buttery smooth, spring-like easing.

## 5. Critical Performance Rule (GC Thrashing)
- Inside the `useFrame` physics loop, **NO new objects are instantiated**. 
- To prevent Memory Leaks and blocked main threads (stuttering), the `THREE.Vector3` object used for `getWorldPosition` and scaling is **pre-allocated** outside the loop using `const worldPos = useMemo(() => new THREE.Vector3(), [])`. 
- **DO NOT** let an AI change this to `getWorldPosition(new THREE.Vector3())`.
