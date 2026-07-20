import { useRef, Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Text3D, Center, Float, Environment, shaderMaterial, Cloud, Clouds, useTexture } from '@react-three/drei'
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
      
      // Interactive mouse distortion
      vec2 mouseDist = st - (uMouse * 1.5 + 1.5);
      float dist = length(mouseDist);
      vec2 distortion = normalize(mouseDist) * exp(-dist * 2.0) * 0.5;
      st += distortion;

      vec2 q = vec2(0.);
      q.x = noise(st + time * 0.1);
      q.y = noise(st + vec2(1.0));
      vec2 r = vec2(0.);
      r.x = noise(st + 1.0*q + vec2(1.7,9.2)+ 0.15*time);
      r.y = noise(st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);
      float f = noise(st+r);
      
      vec3 fluidColor = mix(colorStart, colorEnd, f * 1.5);
      
      // Diagonal streaks
      float streak = sin(st.x * 2.0 + st.y * 2.0 + time * 0.5) * 0.5 + 0.5;
      fluidColor = mix(fluidColor, colorHighlight, pow(streak, 3.0) * f * 0.8);
      
      // Fade to fadeColor on scroll
      vec3 finalColor = mix(fluidColor, fadeColor, scrollFade);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)
extend({ GooeyMaterial })

function GooeyBackground({ themeColors }) {
  const materialRef = useRef()

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.time += 0.005
      
      // Target colors based on theme
      const targetStart = new THREE.Color(themeColors.start)
      const targetEnd = new THREE.Color(themeColors.end)
      const targetHighlight = new THREE.Color(themeColors.highlight)
      const targetFadeColor = new THREE.Color(themeColors.fadeColor)
      materialRef.current.colorStart.lerp(targetStart, 0.05)
      materialRef.current.colorEnd.lerp(targetEnd, 0.05)
      materialRef.current.colorHighlight.lerp(targetHighlight, 0.05)
      materialRef.current.fadeColor.lerp(targetFadeColor, 0.05)
      
      // Mouse uniform
      if (window.mouseCoords) {
        materialRef.current.uMouse.lerp(new THREE.Vector2(window.mouseCoords.x, window.mouseCoords.y), 0.05)
      }
      
      // Scroll fade
      const fade = Math.min(window.scrollY / window.innerHeight, 1.0)
      materialRef.current.scrollFade = THREE.MathUtils.lerp(materialRef.current.scrollFade, fade, 0.1)
    }
  })

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[100, 100]} />
      <gooeyMaterial ref={materialRef} />
    </mesh>
  )
}

function GlassHelloText() {
  const groupRef = useRef()
  const { theme } = useTheme()

  useFrame(() => {
    if (groupRef.current) {
      if (window.mouseCoords) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (window.mouseCoords.y * Math.PI) / 6, 0.05)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (window.mouseCoords.x * Math.PI) / 6, 0.05)
      }
      const scrollOffset = (window.scrollY / window.innerHeight) * 15
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollOffset, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json"
            size={4}
            height={1.5}
            curveSegments={32}
            bevelEnabled
            bevelSize={0.15}
            bevelThickness={0.5}
            bevelSegments={16}
          >
            hello
            <meshPhysicalMaterial
              color={theme === 'dark' ? '#b6e0ff' : '#d0e8ff'}
              transmission={1}
              opacity={1}
              metalness={0.1}
              roughness={0.02}
              ior={1.15}
              thickness={1.5}
              specularIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  )
}

function TearableCloud({ position, ...props }) {
  const chunksRef = useRef([])
  
  // Arrange sub-clouds in a cluster
  const initialPos = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0.5, 0),
    new THREE.Vector3(-1, -0.5, 0),
    new THREE.Vector3(0.5, -1, 0),
    new THREE.Vector3(-0.5, 1, 0)
  ], [])

  useFrame(() => {
    // Map mouseCoords [-1, 1] to roughly the camera frustum coordinates at z=0
    const mx = window.mouseCoords?.x * 12 || 0
    const my = window.mouseCoords?.y * 8 || 0
    
    // Group's world position
    const gx = position[0]
    const gy = position[1]

    chunksRef.current.forEach((chunk, i) => {
      if (chunk) {
         // Sub-cloud's absolute world position
         const cx = gx + initialPos[i].x
         const cy = gy + initialPos[i].y
         
         const dx = cx - mx
         const dy = cy - my
         const dist = Math.sqrt(dx*dx + dy*dy)
         
         // Interaction radius of 4 units
         if (dist < 4 && (mx !== 0 || my !== 0)) {
           // Repulsive push force
           const force = (4 - dist) * 0.8
           const angle = Math.atan2(dy, dx)
           const targetX = initialPos[i].x + Math.cos(angle) * force
           const targetY = initialPos[i].y + Math.sin(angle) * force
           chunk.position.x = THREE.MathUtils.lerp(chunk.position.x, targetX, 0.1)
           chunk.position.y = THREE.MathUtils.lerp(chunk.position.y, targetY, 0.1)
         } else {
           // Organically return to original cluster formation
           chunk.position.x = THREE.MathUtils.lerp(chunk.position.x, initialPos[i].x, 0.05)
           chunk.position.y = THREE.MathUtils.lerp(chunk.position.y, initialPos[i].y, 0.05)
         }
      }
    })
  })

  return (
    <group position={position} {...props}>
      {initialPos.map((pos, i) => (
        <group key={i} ref={el => chunksRef.current[i] = el} position={pos}>
          <Cloud segments={20} bounds={[1, 1, 1]} volume={2} color="#ffffff" opacity={0.85} speed={0.2} />
        </group>
      ))}
    </group>
  )
}

function HeroClouds({ theme }) {
  const groupRef = useRef()
  const isLightMode = theme === 'light'
  const scaleRef = useRef(isLightMode ? 1 : 0)

  useFrame(() => {
    // Smooth transition scale
    const targetScale = isLightMode ? 1 : 0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1)
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current)
      // Scroll offset
      const scrollOffset = (window.scrollY / window.innerHeight) * 15
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollOffset, 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      <group>
        <TearableCloud position={[5, 3, -4]} />
        <TearableCloud position={[-5, -3, -4]} />
        <TearableCloud position={[-7, 6, -5]} />
        <TearableCloud position={[7, -2, -3]} />
      </group>
    </group>
  )
}

function FloatingStickers() {
  const textures = useTexture(iconPaths)
  const groupRef = useRef()
  
  const initialItems = useMemo(() => {
    return Array(10).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 24, 
        (Math.random() - 0.5) * 30, 
        (Math.random() - 0.5) * 2 - 8 
      ],
      rotation: [0, 0, (Math.random() - 0.5) * Math.PI], // Random 2D tilt
      vy: Math.random() * 0.5, // Initial vertical velocity
      mass: Math.random() * 0.5 + 0.5, // Determines gravity effect
      wobbleSpeed: Math.random() * 1.5 + 0.5,
      wobbleAmount: Math.random() * 0.05 + 0.02,
      timeOffset: Math.random() * 100,
      rotSpeed: (Math.random() - 0.5) * 0.3, // Gentle 2D spin
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
        // Low gravity physics
        const gravity = 1.2 * item.mass
        item.vy += gravity * delta
        
        // Air resistance (terminal velocity limit)
        item.vy *= 0.98
        
        item.ref.position.y -= item.vy * delta
        
        // Wobble effect in X (drifting side to side)
        item.ref.position.x += Math.sin(state.clock.elapsedTime * item.wobbleSpeed + item.timeOffset) * item.wobbleAmount

        // Slow 2D tumble (Z-axis only, keeping 2D plane flat to camera)
        item.ref.rotation.z += item.rotSpeed * delta
        
        // Reset when passing the lower viewport boundary
        if (item.ref.position.y < -15) {
          item.ref.position.y = 15
          item.ref.position.x = (Math.random() - 0.5) * 24 
          item.vy = 0 // Reset velocity for new fall
        }
      }
    })
  })

  return (
    <group ref={groupRef}>
      {itemsRef.current.map((item, i) => (
        <mesh 
          key={i} 
          ref={(el) => (item.ref = el)} 
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <planeGeometry args={[2.2, 2.2]} />
          <meshStandardMaterial 
            map={textures[item.textureIndex]} 
            transparent={true} 
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Background3D() {
  const { theme } = useTheme()
  
  // Theme color maps with Highlight color for streaks and fade color
  const colorMaps = {
    dark: { start: '#0a192f', end: '#305f87', highlight: '#8ab4d4', fadeColor: '#000000' },
    light: { start: '#e0f2fe', end: '#93c5fd', highlight: '#fbcfe8', fadeColor: '#e0f2fe' },
    terminal: { start: '#000000', end: '#064e3b', highlight: '#34d399', fadeColor: '#000000' }
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
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={theme === 'light' ? 1.5 : 0.5} />
        <directionalLight position={[10, 10, 10]} intensity={theme === 'light' ? 4 : 2} />
        {theme === 'light' && <pointLight position={[-5, -5, 5]} intensity={3} color="#ffffff" />}
        <Suspense fallback={null}>
          <Environment preset={theme === 'light' ? "sunset" : "city"} />
          <GooeyBackground themeColors={themeColors} />
          
          <HeroClouds theme={theme} />

          <GlassHelloText />
          <Suspense fallback={null}>
            <FloatingStickers />
          </Suspense>
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
