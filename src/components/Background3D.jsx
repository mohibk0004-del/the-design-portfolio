import { useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Text3D, Float, Environment, Lightformer, shaderMaterial, useTexture, Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useTheme } from '../context/ThemeContext'

// Import 3D Icons
import batteryIcon from '../assets/3dicons/3dicons-battery-dynamic-color.png'
import blenderIcon from '../assets/3dicons/3dicons-blender-dynamic-color.png'
import chatIcon from '../assets/3dicons/3dicons-chat-bubble-dynamic-color.png'
import figmaIcon from '../assets/3dicons/3dicons-figma-dynamic-color.png'
import lockIcon from '../assets/3dicons/3dicons-lock-dynamic-color.png'
import minecraftIcon from '../assets/3dicons/3dicons-minecraft-dynamic-color.png'
import pictureIcon from '../assets/3dicons/3dicons-picture-dynamic-color.png'
import scissorIcon from '../assets/3dicons/3dicons-scissor-dynamic-color.png'

const iconPaths = [
  batteryIcon, blenderIcon, chatIcon, figmaIcon,
  lockIcon, minecraftIcon, pictureIcon, scissorIcon,
]

const GooeyMaterial = shaderMaterial(
  { time: 0, uMouse: new THREE.Vector2(0, 0), uResolution: new THREE.Vector2(1, 1), colorStart: new THREE.Color('#0a192f'), colorEnd: new THREE.Color('#305f87'), colorHighlight: new THREE.Color('#8ab4d4'), scrollFade: 0, fadeColor: new THREE.Color('#000000') },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform vec3 colorStart;
    uniform vec3 colorEnd;
    uniform vec3 colorHighlight;
    uniform float scrollFade;
    uniform vec3 fadeColor;
    varying vec2 vUv;

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p = turn * p * 2.02 + vec2(4.7, 1.3);
        amplitude *= 0.38;
      }
      return value;
    }

    void main() {
      // Screen-space coordinates keep the texture consistent on every viewport.
      vec2 uv = gl_FragCoord.xy / uResolution;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 st = (uv - 0.5) * aspect * 2.2;
      float t = time * 0.12;
      vec2 mouseDelta = (uv - (uMouse * 0.5 + 0.5)) * aspect;
      st += mouseDelta * exp(-dot(mouseDelta, mouseDelta) * 5.0) * 0.16;

      // Layered, slowly warped currents create soft folds rather than stripes.
      vec2 flow = vec2(fbm(st + vec2(t, -t * 0.6)), fbm(st + vec2(5.2, 1.3) - t * 0.7));
      vec2 folds = vec2(fbm(st + flow * 1.8 + vec2(1.7, 9.2) + t * 0.4), fbm(st + flow * 1.6 + vec2(8.3, 2.8) - t * 0.5));
      float cloud = fbm(st + folds * 2.3);
      float body = smoothstep(0.16, 0.68, cloud);
      float wisps = pow(1.0 - abs(cloud * 2.0 - 1.0), 6.0);
      vec3 fluidColor = mix(colorStart, colorEnd, 0.25 + body * 0.75);
      fluidColor = mix(fluidColor, colorHighlight, wisps * body * 0.14);
      float grain = (random(gl_FragCoord.xy) - 0.5) * 0.018;
      fluidColor += vec3(grain);
      vec3 finalColor = mix(fluidColor, fadeColor, scrollFade);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)
extend({ GooeyMaterial })

// Parsed color caches avoid converting hex values on every frame.
const parsedColorMaps = {
  dark: {
    start: new THREE.Color('#0a192f'),
    end: new THREE.Color('#305f87'),
    highlight: new THREE.Color('#8ab4d4'),
    fadeColor: new THREE.Color('#000000'),
  },
  light: {
    start: new THREE.Color('#66D9FF'),
    end: new THREE.Color('#EAF7FF'),
    highlight: new THREE.Color('#00BFFF'),
    fadeColor: new THREE.Color('#EAF7FF'),
  },
}

function GooeyBackground({ themeColors, motion }) {
  const materialRef = useRef()
  const { size } = useThree()
  const targetMouse = useMemo(() => new THREE.Vector2(), [])

  useFrame((state, delta) => {
    if (materialRef.current) {
      if (!motion.current.reduced && motion.current.scroll < 1) materialRef.current.time += Math.min(delta, .05)
      materialRef.current.uResolution.set(size.width, size.height)

      // Determine which pre-parsed color set matches current themeColors
      // (themeColors identity only changes on theme switch thanks to useMemo)
      const targets = themeColors === colorMaps.light ? parsedColorMaps.light : parsedColorMaps.dark

      materialRef.current.colorStart.lerp(targets.start, 0.05)
      materialRef.current.colorEnd.lerp(targets.end, 0.05)
      materialRef.current.colorHighlight.lerp(targets.highlight, 0.05)
      materialRef.current.fadeColor.lerp(targets.fadeColor, 0.05)

      if (materialRef.current.uniforms) {
        materialRef.current.uniforms.colorStart.value.copy(materialRef.current.colorStart)
        materialRef.current.uniforms.colorEnd.value.copy(materialRef.current.colorEnd)
        materialRef.current.uniforms.colorHighlight.value.copy(materialRef.current.colorHighlight)
        materialRef.current.uniforms.fadeColor.value.copy(materialRef.current.fadeColor)
      }

      // Mouse uniform
      if (window.mouseCoords) {
        targetMouse.set(window.mouseCoords.x, window.mouseCoords.y)
        materialRef.current.uMouse.lerp(targetMouse, 0.05)
        if (materialRef.current.uniforms && materialRef.current.uniforms.uMouse) {
          materialRef.current.uniforms.uMouse.value.copy(materialRef.current.uMouse)
        }
      }

      // Scroll fade
      const fade = THREE.MathUtils.smoothstep(motion.current.scroll, .05, .95)
      materialRef.current.scrollFade = THREE.MathUtils.lerp(materialRef.current.scrollFade, fade, 0.1)
      if (materialRef.current.uniforms && materialRef.current.uniforms.scrollFade) {
        materialRef.current.uniforms.scrollFade.value = materialRef.current.scrollFade
      }
    }
  })

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[100, 100]} />
      <gooeyMaterial ref={materialRef} />
    </mesh>
  )
}


// Theme material targets stay outside the component to avoid repeated allocation.
const letterThemeConfigs = {
  light: { color: new THREE.Color('#009DFF'), roughness: 0.1, metalness: 0.2 },
  dark:  { color: new THREE.Color('#457ab8'), roughness: 0.05, metalness: 0.6 },
}

function InteractiveLetter({ char, offset, theme }) {
  const meshRef = useRef()
  const matRef = useRef()

  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const defaultScale = useMemo(() => new THREE.Vector3(1, 1, 1), [])
  // Keep theme in a ref so useFrame always sees the latest without triggering re-render
  const themeRef = useRef(theme)
  themeRef.current = theme

  useFrame(() => {
    if (!meshRef.current) return

    // Imperatively lerp material properties toward current theme target
    if (matRef.current) {
      const target = letterThemeConfigs[themeRef.current] || letterThemeConfigs.dark
      matRef.current.color.lerp(target.color, 0.06)
      matRef.current.roughness = THREE.MathUtils.lerp(matRef.current.roughness, target.roughness, 0.06)
      matRef.current.metalness = THREE.MathUtils.lerp(matRef.current.metalness, target.metalness, 0.06)
    }

    const targetX = offset
    const targetY = 0
    const targetZ = 0
    
    if (window.mouseCoords) {
      // Map mouse coordinates to rough 3D space
      const mouse3DX = window.mouseCoords.x * 12
      const mouse3DY = window.mouseCoords.y * 8
      
      meshRef.current.getWorldPosition(worldPos)
      
      const dx = mouse3DX - worldPos.x
      const dy = mouse3DY - worldPos.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Repulsive slime interaction
      if (distance < 3.0) {
        const force = (3.0 - distance) / 3.0 // 0 to 1
        
        // Push backwards and sideways based on cursor
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ - force * 1.5, 0.1)
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX - (dx * force * 0.3), 0.1)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY - (dy * force * 0.3), 0.1)
        
        // Liquid Wobble
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, dy * force * 0.15, 0.1)
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -dx * force * 0.15, 0.1)
        
        // Slime Squish
        const scale = 1 - force * 0.05
        meshRef.current.scale.set(scale, scale, 1 + force * 0.2)
      } else {
        // Snap back to normal
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08)
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08)
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08)
        
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.08)
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.08)
        
        meshRef.current.scale.lerp(defaultScale, 0.08)
      }
    }
  })

  return (
    <Text3D
      ref={meshRef}
      position={[offset, 0, 0]}
      font="https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json"
      size={4}
      height={0.5}
      curveSegments={12}
      bevelEnabled
      bevelSize={0.4}
      bevelThickness={0.8}
      bevelSegments={5}
    >
      {char}
      <meshPhysicalMaterial
        ref={matRef}
        color="#457ab8"
        roughness={0.05}
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={3.0}
      />
    </Text3D>
  )
}

function GlassHelloText({ onReady }) {
  const groupRef = useRef()
  useEffect(() => { onReady() }, [onReady])
  const { theme } = useTheme()
  const { viewport } = useThree()
  const responsiveScale = Math.min(1, viewport.width / 14)
  
  const letters = [
    { char: 'h', offset: -6.5 },
    { char: 'e', offset: -3.1 },
    { char: 'l', offset: -0.2 },
    { char: 'l', offset: 1.5 },
    { char: 'o', offset: 3.2 }
  ]

  useFrame(() => {
    if (groupRef.current) {
      // Phase 1: As user scrolls the hero section, scale down and rotate back in 3D perspective
      const heroProgress = Math.min(1.0, window.scrollY / (window.innerHeight * 0.6))
      
      // Phase 2: As user scrolls past hero into About/Work, smoothly glide UP above the viewport so it never stays on inner pages
      const exitProgress = Math.max(0, Math.min(1.0, (window.scrollY - window.innerHeight * 0.6) / (window.innerHeight * 0.45)))
      
      const targetY = THREE.MathUtils.lerp(0, -1.5, heroProgress) + (exitProgress * 18.0)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08)
      
      const targetScale = THREE.MathUtils.lerp(responsiveScale, responsiveScale * 0.52, heroProgress)
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08))
      
      const mouseRotX = window.mouseCoords ? (window.mouseCoords.y * Math.PI) / 12 : 0
      const mouseRotY = window.mouseCoords ? (window.mouseCoords.x * Math.PI) / 12 : 0
      
      const targetRotX = THREE.MathUtils.lerp(mouseRotX, mouseRotX - 0.75, heroProgress)
      const targetRotY = THREE.MathUtils.lerp(mouseRotY, mouseRotY + 0.35, heroProgress)
      const targetRotZ = THREE.MathUtils.lerp(0, -0.18, heroProgress)
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08)
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08)
    }
  })

  return (
    <group ref={groupRef} scale={responsiveScale}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[0, -2 - (1 - responsiveScale) * 4, 0]}>
          {letters.map((l, i) => (
            <InteractiveLetter key={i} char={l.char} offset={l.offset} theme={theme} />
          ))}
        </group>
      </Float>
    </group>
  )
}

function FloatingStickers() {
  const textures = useTexture(iconPaths)
  const groupRef = useRef()
  
  // Shared high-performance plane geometry (eliminates square side-wall border around transparent PNG corners)
  const sharedGeometry = useMemo(() => new THREE.PlaneGeometry(2.4, 2.4), [])
  
  // Front and Back materials with rich HDRI environment mapping, clearcoat, metalness, and dynamic lighting
  // MeshStandardMaterial avoids the extra shader pass used by MeshPhysicalMaterial.
  // sprites is imperceptible but costs a full extra shader pass per draw call
  const iconMaterials = useMemo(() => {
    return textures.map((tex) => new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      roughness: 0.2,
      metalness: 0.3,
      envMapIntensity: 2.5,
      side: THREE.DoubleSide,
      toneMapped: true,
    }))
  }, [textures])

  // Prevent memory leaks by cleaning up geometries and materials on unmount/re-render
  useEffect(() => {
    return () => {
      sharedGeometry.dispose()
      iconMaterials.forEach((mat) => mat.dispose())
    }
  }, [sharedGeometry, iconMaterials])

  const initialItems = useMemo(() => {
    return Array(10).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 24, 
        (Math.random() - 0.5) * 40 + 10,
        (Math.random() - 0.5) * 2 - 8 
      ],
      rotation: [
        (Math.random() - 0.5) * 0.4, 
        (Math.random() - 0.5) * 0.4, 
        (Math.random() - 0.5) * Math.PI
      ],
      vy: Math.random() * 0.5,
      mass: Math.random() * 0.5 + 0.5,
      wobbleSpeed: Math.random() * 1.5 + 0.5,
      wobbleAmount: Math.random() * 0.05 + 0.02,
      timeOffset: Math.random() * 100,
      rotSpeedX: (Math.random() - 0.5) * 0.15,
      rotSpeedY: (Math.random() - 0.5) * 0.15,
      rotSpeedZ: (Math.random() - 0.5) * 0.3,
      textureIndex: Math.floor(Math.random() * textures.length),
      scale: Math.random() * 0.25 + 0.45 
    }))
  }, [textures])

  const itemsRef = useRef(initialItems)

  useFrame((state, delta) => {
    if (groupRef.current) {
      const scrollOffset = (window.scrollY / window.innerHeight) * 15
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollOffset, 0.1)
    }

    itemsRef.current.forEach((item) => {
      if (item.ref) {
        item.ref.visible = true
        item.ref.scale.setScalar(item.scale)

        const gravity = 5.0 * item.mass
        item.vy += gravity * delta
        item.vy *= Math.pow(0.8, delta)
        item.ref.position.y -= item.vy * delta
        item.ref.position.x += Math.sin(state.clock.elapsedTime * item.wobbleSpeed + item.timeOffset) * item.wobbleAmount

        // Subtle 3D tilt and tumble in space catching HDRI highlights across clearcoat surface
        item.ref.rotation.x += item.rotSpeedX * delta
        item.ref.rotation.y += item.rotSpeedY * delta
        item.ref.rotation.z += item.rotSpeedZ * delta

        if (window.mouseCoords) {
          const mx = window.mouseCoords.x * 12
          const my = window.mouseCoords.y * 8
          const dx = item.ref.position.x - mx
          const dy = item.ref.position.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 4.0) {
            const force = (4.0 - dist) / 4.0
            item.ref.position.x += dx * force * 0.08
            item.ref.position.y += dy * force * 0.08
            item.ref.rotation.x += dy * force * 0.1
            item.ref.rotation.y += -dx * force * 0.1
            item.ref.rotation.z += (dx > 0 ? 1 : -1) * force * 0.05
          }
        }

        if (item.ref.position.y < -15) {
          if (window.scrollY < window.innerHeight * 0.5) {
            item.ref.position.y = 15 + Math.random() * 20
            item.ref.position.x = (Math.random() - 0.5) * 24 
            item.vy = Math.random() * 2
          }
        }
      }
    })
  })

  return (
    <group ref={groupRef}>
      {itemsRef.current.map((item, i) => {
        const mat = iconMaterials[item.textureIndex]
        return (
          <mesh 
            key={i} 
            ref={(el) => (item.ref = el)} 
            position={item.position}
            rotation={item.rotation}
            scale={item.scale}
            geometry={sharedGeometry}
            material={mat}
          />
        )
      })}
    </group>
  )
}

function TearableCloud({ position, theme, ...props }) {
  const chunksRef = useRef([])
  const groupRef = useRef()
  // Use scale for entrance/exit instead of opacity fade
  const scaleRef = useRef(theme === 'light' ? 1.0 : 0.001)

  // Arrange sub-clouds in a cluster
  const initialPos = useMemo(() => [
    [0, 0, 0],
    [1.5, 0.5, 0],
    [-1.5, -0.3, 0],
    [0.5, -0.8, 0.5],
    [-0.5, 0.8, -0.5]
  ], [])

  const animState = useRef({
    scale: theme === 'light' ? 1.0 : 0.001
  })

  useEffect(() => {
    // Pure scale-in / scale-out effect
    gsap.to(animState.current, {
      scale: theme === 'light' ? 1.0 : 0.001,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    })
  }, [theme])

  useFrame(() => {
    const exitProgress = Math.max(0, Math.min(1.0, (window.scrollY - window.innerHeight * 0.5) / (window.innerHeight * 0.4)))
    
    // Scale drops to 0 on scroll out
    const targetScale = animState.current.scale * (1.0 - exitProgress)

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.15)

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + (exitProgress * 5.0)
      groupRef.current.scale.setScalar(scaleRef.current)
      
      // Cull rendering when scaled down to nothing
      groupRef.current.visible = scaleRef.current > 0.01
    }

    // 2. Interactive mouse repulsion
    if (window.mouseCoords && window.mouseCoords.x !== 0 && groupRef.current.visible) {
      const mx = window.mouseCoords.x * 25.0
      const my = window.mouseCoords.y * 15.0

      chunksRef.current.forEach((chunk, i) => {
        if (!chunk || !initialPos[i]) return
        const dx = chunk.position.x + position[0] - mx
        const dy = chunk.position.y + position[1] - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 5.0) {
          const force = (5.0 - dist) / 5.0
          chunk.position.x += dx * force * 0.05
          chunk.position.y += dy * force * 0.05
        } else {
          chunk.position.x = THREE.MathUtils.lerp(chunk.position.x, initialPos[i][0], 0.05)
          chunk.position.y = THREE.MathUtils.lerp(chunk.position.y, initialPos[i][1], 0.05)
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position} {...props}>
      <Clouds material={THREE.MeshStandardMaterial}>
        {initialPos.map((pos, i) => (
          <group key={i} ref={el => chunksRef.current[i] = el} position={pos}>
            <Cloud segments={5} bounds={[1, 1, 1]} volume={2} color="#ffffff" opacity={0.95} speed={0.2} />
          </group>
        ))}
      </Clouds>
    </group>
  )
}

function HeroClouds({ theme }) {
  const groupRef = useRef()
  return (
    <group ref={groupRef}>
      <group>
        <TearableCloud position={[5, 3, -4]} theme={theme} />
        <TearableCloud position={[-5, -3, -4]} theme={theme} />
        <TearableCloud position={[-7, 6, -5]} theme={theme} />
        <TearableCloud position={[7, -2, -3]} theme={theme} />
      </group>
    </group>
  )
}

// Stable color map references are shared across renders.
const colorMaps = {
  dark: { start: '#0a192f', end: '#305f87', highlight: '#8ab4d4', fadeColor: '#000000' },
  light: { start: '#66D9FF', end: '#EAF7FF', highlight: '#00BFFF', fadeColor: '#EAF7FF' }
}

// Inner scene component that reads theme via ref to avoid reconciling the Canvas tree
function SceneContents({ motion, onReady }) {
  const { theme } = useTheme()
  const themeRef = useRef(theme)
  themeRef.current = theme

  // The memoized color object changes only when the theme changes.
  const themeColors = useMemo(() => colorMaps[theme] || colorMaps.dark, [theme])

  // Imperatively lerp light intensities instead of swapping props (avoids re-render)
  const ambientRef = useRef()
  const dirRef = useRef()
  const pointRef = useRef()

  useFrame(() => {
    const isLight = themeRef.current === 'light'
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, isLight ? 1.5 : 0.5, 0.06)
    }
    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(dirRef.current.intensity, isLight ? 4 : 2, 0.06)
    }
    if (pointRef.current) {
      pointRef.current.intensity = THREE.MathUtils.lerp(pointRef.current.intensity, isLight ? 3 : 0, 0.06)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight ref={dirRef} position={[10, 10, 10]} intensity={2} />
      <pointLight ref={pointRef} position={[-5, -5, 5]} intensity={0} color="#ffffff" />

      <Environment resolution={128}>
        <Lightformer intensity={5} position={[0, 5, 5]} scale={[10, 2, 1]} />
        <Lightformer intensity={3} position={[-5, 1, 3]} rotation={[0, Math.PI / 3, 0]} scale={[2, 8, 1]} />
        <Lightformer intensity={2} color="#9ec8ff" position={[5, -2, 2]} scale={[4, 3, 1]} />
      </Environment>

      <GooeyBackground themeColors={themeColors} motion={motion} />

      <Suspense fallback={null}>
        <HeroClouds theme={theme} />
      </Suspense>

      <Suspense fallback={null}>
        <GlassHelloText onReady={onReady} />
      </Suspense>

      <Suspense fallback={null}>
        <FloatingStickers />
      </Suspense>
    </>
  )
}

export default function Background3D({ motion, onReady }) {
  useEffect(() => {
    // Global mouse tracking and scroll-based vignette fade
    window.mouseCoords = { x: 0, y: 0 }
    const handleMouseMove = (e) => {
      window.mouseCoords.x = (e.clientX / window.innerWidth) * 2 - 1
      window.mouseCoords.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    
    const handleScroll = () => {
      const vignette = document.getElementById('vignette-overlay')
      if (vignette) {
        const fade = Math.min(window.scrollY / window.innerHeight, 1.0)
        vignette.style.opacity = 0.7 * (1 - fade)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[var(--bg-primary,var(--bg-color))]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={1}>
        <SceneContents motion={motion} onReady={onReady} />
      </Canvas>
      {/* Subtle Gradient Overlay */}
      <div 
        id="vignette-overlay"
        className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply transition-opacity duration-100"
        style={{
          opacity: 0.3,
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  )
}
