import { useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Text3D, Float, Environment, shaderMaterial, useTexture, Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

// Import 3D Icons
import batteryIcon from '../assets/3dicons/3dicons-battery-dynamic-color.png'
import blenderIcon from '../assets/3dicons/3dicons-blender-dynamic-color.png'
import chatIcon from '../assets/3dicons/3dicons-chat-bubble-dynamic-color.png'
import chessIcon from '../assets/3dicons/3dicons-chess-dynamic-color.png'
import cardIcon from '../assets/3dicons/3dicons-credit-card-dynamic-color.png'
import dollarIcon from '../assets/3dicons/3dicons-dollar-dynamic-color.png'
import figmaIcon from '../assets/3dicons/3dicons-figma-dynamic-color.png'
import folderIcon from '../assets/3dicons/3dicons-folder-dynamic-color.png'
import folderNewIcon from '../assets/3dicons/3dicons-folder-new-dynamic-color.png'
import lockIcon from '../assets/3dicons/3dicons-lock-dynamic-color.png'
import pinIcon from '../assets/3dicons/3dicons-map-pin-dynamic-color.png'
import medalIcon from '../assets/3dicons/3dicons-medal-dynamic-color.png'
import minecraftIcon from '../assets/3dicons/3dicons-minecraft-dynamic-color.png'
import mobileIcon from '../assets/3dicons/3dicons-mobile-dynamic-color.png'
import notebookIcon from '../assets/3dicons/3dicons-notebook-dynamic-color.png'
import pencilIcon from '../assets/3dicons/3dicons-pencil-dynamic-color.png'
import pictureIcon from '../assets/3dicons/3dicons-picture-dynamic-color.png'
import scissorIcon from '../assets/3dicons/3dicons-scissor-dynamic-color.png'
import targetIcon from '../assets/3dicons/3dicons-target-dynamic-color.png'
import textIcon from '../assets/3dicons/3dicons-text-dynamic-color.png'
import thumbIcon from '../assets/3dicons/3dicons-thumb-up-dynamic-color.png'
import tickIcon from '../assets/3dicons/3dicons-tick-dynamic-color.png'

const iconPaths = [
  batteryIcon, blenderIcon, chatIcon, chessIcon, cardIcon, dollarIcon, figmaIcon,
  folderIcon, folderNewIcon, lockIcon, pinIcon, medalIcon, minecraftIcon,
  mobileIcon, notebookIcon, pencilIcon, pictureIcon, scissorIcon, targetIcon,
  textIcon, thumbIcon, tickIcon
]

const GooeyMaterial = shaderMaterial(
  { time: 0, uMouse: new THREE.Vector2(0, 0), colorStart: new THREE.Color('#020617'), colorEnd: new THREE.Color('#1e3a8a'), colorHighlight: new THREE.Color('#3b82f6'), scrollFade: 0, fadeColor: new THREE.Color('#000000') },
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

    void main() {
      vec2 st = vUv * 3.0;
      
      // Map uMouse [-1, 1] to st coordinates [0, 3]
      vec2 mousePos = (uMouse * 0.5 + 0.5) * 3.0;
      vec2 mouseDist = st - mousePos;
      float dist = length(mouseDist);
      
      // True liquid viscous fluid displacement and swirl from cursor (no light!)
      vec2 dir = normalize(mouseDist + vec2(0.0001));
      float push = exp(-dist * 1.3) * 1.5;
      vec2 swirl = vec2(-dir.y, dir.x) * sin(dist * 4.5 - time * 2.5) * exp(-dist * 1.6) * 1.0;
      st += dir * push + swirl;

      vec2 q = vec2(0.);
      q.x = noise(st + time * 0.12);
      q.y = noise(st + vec2(1.0));
      vec2 r = vec2(0.);
      r.x = noise(st + 1.0*q + vec2(1.7,9.2)+ 0.15*time);
      r.y = noise(st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);
      float f = noise(st+r);
      
      vec3 fluidColor = mix(colorStart, colorEnd, f * 1.5);
      
      // Diagonal streaks (bright caustics)
      float streak = sin(st.x * 2.2 + st.y * 2.2 + time * 0.6) * 0.5 + 0.5;
      fluidColor = mix(fluidColor, colorHighlight, pow(streak, 2.5) * f * 0.95);
      
      // Fade to fadeColor on scroll
      vec3 finalColor = mix(fluidColor, fadeColor, scrollFade);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)
extend({ GooeyMaterial })

function GooeyBackground({ themeColors }) {
  const materialRef = useRef()

  const targetStart = useMemo(() => new THREE.Color(), [])
  const targetEnd = useMemo(() => new THREE.Color(), [])
  const targetHighlight = useMemo(() => new THREE.Color(), [])
  const targetFadeColor = useMemo(() => new THREE.Color(), [])
  const targetMouse = useMemo(() => new THREE.Vector2(), [])

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.time += 0.005
      
      // Target colors based on theme
      targetStart.set(themeColors.start)
      targetEnd.set(themeColors.end)
      targetHighlight.set(themeColors.highlight)
      targetFadeColor.set(themeColors.fadeColor || '#000000')
      
      materialRef.current.colorStart.lerp(targetStart, 0.05)
      materialRef.current.colorEnd.lerp(targetEnd, 0.05)
      materialRef.current.colorHighlight.lerp(targetHighlight, 0.05)
      materialRef.current.fadeColor.lerp(targetFadeColor, 0.05)
      
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
      const fade = Math.min(window.scrollY / window.innerHeight, 1.0)
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

function InteractiveLetter({ char, offset, theme }) {
  const meshRef = useRef()

  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const defaultScale = useMemo(() => new THREE.Vector3(1, 1, 1), [])

  const materialProps = useMemo(() => {
    if (theme === 'light') {
      return {
        color: '#009DFF',
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.0,
        thickness: 0.0,
        transparent: false,
      }
    }
    if (theme === 'dark') {
      return {
        color: '#457ab8',
        roughness: 0.05,
        metalness: 0.6,
        transmission: 0.0,
      }
    }
    return {
      color: '#ffffff',
      roughness: 0.05,
      metalness: 0.6,
      transmission: 0.0,
    }
  }, [theme])

  useFrame((state) => {
    if (!meshRef.current) return

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
      curveSegments={24}
      bevelEnabled
      bevelSize={0.4}
      bevelThickness={0.8}
      bevelSegments={12}
    >
      {char}
      <meshPhysicalMaterial
        {...materialProps}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={3.0}
      />
    </Text3D>
  )
}

function GlassHelloText() {
  const groupRef = useRef()
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

function FloatingStickers({ theme }) {
  const textures = useTexture(iconPaths)
  const groupRef = useRef()
  
  // Shared high-performance plane geometry (eliminates square side-wall border around transparent PNG corners)
  const sharedGeometry = useMemo(() => new THREE.PlaneGeometry(2.4, 2.4), [])
  
  // Front and Back materials with rich HDRI environment mapping, clearcoat, metalness, and dynamic lighting
  const iconMaterials = useMemo(() => {
    return textures.map((tex) => new THREE.MeshPhysicalMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      roughness: 0.15,
      metalness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 3.5,
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
  const opacityRef = useRef(theme === 'light' ? 0.95 : 0.0)
  const yOffsetRef = useRef(theme === 'light' ? 0 : -15)

  // Arrange sub-clouds in a cluster
  const initialPos = useMemo(() => [
    [0, 0, 0],
    [1.5, 0.5, 0],
    [-1.5, -0.3, 0],
    [0.5, -0.8, 0.5],
    [-0.5, 0.8, -0.5]
  ], [])

  useFrame(() => {
    // 1. Smoothly animate clouds on theme switch AND scroll entrance/exit (matching 3D text behavior)
    const exitProgress = Math.max(0, Math.min(1.0, (window.scrollY - window.innerHeight * 0.5) / (window.innerHeight * 0.4)))
    
    const baseOpacity = theme === 'light' ? 0.95 : 0.0
    const targetOpacity = baseOpacity * (1.0 - exitProgress)
    
    const baseYOffset = theme === 'light' ? 0 : -15
    const targetYOffset = baseYOffset + (exitProgress * 22.0)
    
    const baseScale = theme === 'light' ? 1.0 : 0.1
    const targetScale = baseScale * (1.0 - exitProgress * 0.8)

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.05)
    yOffsetRef.current = THREE.MathUtils.lerp(yOffsetRef.current, targetYOffset, 0.05)

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + yOffsetRef.current
      const currentScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
      groupRef.current.scale.set(currentScale, currentScale, currentScale)
      groupRef.current.traverse((child) => {
        if (child.material) {
          child.material.transparent = true
          child.material.opacity = opacityRef.current
          child.material.visible = opacityRef.current > 0.01
        }
      })
    }

    // 2. Interactive mouse repulsion / fog physics for clouds!
    if (window.mouseCoords && chunksRef.current && opacityRef.current > 0.02) {
      const mx = window.mouseCoords.x * 10
      const my = window.mouseCoords.y * 6
      
      chunksRef.current.forEach((chunk, i) => {
        if (!chunk || !initialPos[i]) return
        const dx = chunk.position.x + position[0] - mx
        const dy = chunk.position.y + position[1] + yOffsetRef.current - my
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
            <Cloud segments={10} bounds={[1, 1, 1]} volume={2} color={theme === 'light' ? "#F0F6FF" : "#ffffff"} opacity={0.95} speed={0.2} />
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

export default function Background3D() {
  const { theme } = useTheme()
  
  // Theme color maps matching live screenshot versions exactly
  const colorMaps = {
    dark: { start: '#0a192f', end: '#305f87', highlight: '#8ab4d4', fadeColor: '#000000' },
    light: { start: '#66D9FF', end: '#EAF7FF', highlight: '#00BFFF', fadeColor: '#EAF7FF' }
  }
  const themeColors = colorMaps[theme] || colorMaps.dark

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
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]}>
        {/* Removed solid background color and fog to allow GooeyBackground to show */}
        <ambientLight intensity={theme === 'light' ? 1.5 : 0.5} />
        <directionalLight position={[10, 10, 10]} intensity={theme === 'light' ? 4 : 2} />
        {theme === 'light' && <pointLight position={[-5, -5, 5]} intensity={3} color="#ffffff" />}
        
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>

        <GooeyBackground themeColors={themeColors} />

        <Suspense fallback={null}>
          <HeroClouds theme={theme} />
        </Suspense>

        <Suspense fallback={null}>
          <GlassHelloText />
        </Suspense>
        
        <Suspense fallback={null}>
          <FloatingStickers theme={theme} />
        </Suspense>
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
