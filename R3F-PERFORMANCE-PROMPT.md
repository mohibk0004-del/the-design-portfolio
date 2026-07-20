# React Three Fiber Performance Prompt

*Copy and paste the prompt below to any AI assistant when building a new WebGL/React Three Fiber project to ensure it is highly optimized from the start.*

***

**Prompt:**

> I am building a 3D website using React Three Fiber (R3F) and Three.js. I need you to strictly adhere to the following performance and memory optimization guidelines for all code you generate, to ensure the application runs at a buttery-smooth 60 FPS on both low-end mobile devices and high-end retina displays:
> 
> 1. **Cap Device Pixel Ratio (DPR):** Never use the default unlimited DPR on the `<Canvas>`. Always hard-cap the DPR to prevent GPU choking on Retina displays (e.g., MacBooks and modern iPhones). Use `<Canvas dpr={[1, 1.5]}>` as a strict rule.
> 2. **Prevent Garbage Collection (GC) Thrashing:** Inside ANY `useFrame` loop, absolutely do **not** instantiate new objects like `new THREE.Vector3()`, `new THREE.Color()`, or `new THREE.Vector2()`. This creates severe memory leaks and blocks the main thread. Instead, pre-allocate these objects outside the loop using `useMemo(() => new THREE.Vector3(), [])` and mutate them inside the loop using `.set()`, `.lerp()`, or passing them to methods like `.getWorldPosition(targetVector)`.
> 3. **Decimate Geometry:** Do not use high `curveSegments` or `bevelSegments` on `<Text3D>` or other geometries unless absolutely mathematically necessary. Refractive/glass materials look perfectly fine with heavily decimated geometry (e.g., `curveSegments={12}`, `bevelSegments={4}`).
> 4. **Volumetric Shaders:** When using volumetric components like `<Cloud>` from `@react-three/drei`, keep the `segments` count as low as possible (e.g., `10` instead of `20`) to save fill-rate on mobile devices.
> 
> Keep these constraints active for the entirety of our project.

***
