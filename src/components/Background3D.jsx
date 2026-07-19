import { useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Text3D, Text, Center, Float, Environment, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext'

const GooeyMaterial = shaderMaterial(
  { time: 0, uMouse: new THREE.Vector2(0, 0), colorStart: new THREE.Color('#020617'), colorEnd: new THREE.Color('#1e3a8a'), colorHighlight: new THREE.Color('#3b82f6'), scrollFade: 0 },
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
      
      // Fade to black on scroll
      vec3 finalColor = mix(fluidColor, vec3(0.0), scrollFade);
      
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
      materialRef.current.colorStart.lerp(targetStart, 0.05)
      materialRef.current.colorEnd.lerp(targetEnd, 0.05)
      materialRef.current.colorHighlight.lerp(targetHighlight, 0.05)
      
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
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[100, 100]} />
      <gooeyMaterial ref={materialRef} />
    </mesh>
  )
}

function GlassHelloText() {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      // Rotation based on global mouse
      if (window.mouseCoords) {
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (window.mouseCoords.y * Math.PI) / 6, 0.05)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (window.mouseCoords.x * Math.PI) / 6, 0.05)
      }
      
      // Scroll offset logic (moves up as you scroll down)
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
              color="#ffffff"
              transmission={1}
              opacity={1}
              metalness={0.1}
              roughness={0}
              ior={1.5}
              thickness={2.5}
              specularIntensity={1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text3D>
        </Center>
      </Float>
    </group>
  )
}

function FloatingStickers({ theme }) {
  const emojis = ['🌟', '💻', '❤️', '🎧', '🚀', '💡', '🎨', '✨', '🌍', '🔥']
  const positions = useMemo(() => emojis.map(() => [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5]), [])
  
  if (theme !== 'light') return null // Only show abundantly in light theme

  return (
    <group>
      {emojis.map((emoji, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={positions[i]}>
          <Text fontSize={3}>
            {emoji}
          </Text>
        </Float>
      ))}
    </group>
  )
}

export default function Background3D() {
  const { theme } = useTheme()
  
  // Theme color maps with Highlight color for streaks
  const colorMaps = {
    dark: { start: '#020617', end: '#1e3a8a', highlight: '#3b82f6' },
    light: { start: '#e0f2fe', end: '#93c5fd', highlight: '#fbcfe8' },
    terminal: { start: '#000000', end: '#064e3b', highlight: '#34d399' }
  }
  const themeColors = colorMaps[theme] || colorMaps.dark

  useEffect(() => {
    // Global mouse tracking
    window.mouseCoords = { x: 0, y: 0 }
    const handleMouseMove = (e) => {
      window.mouseCoords.x = (e.clientX / window.innerWidth) * 2 - 1
      window.mouseCoords.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <GooeyBackground themeColors={themeColors} />
          <GlassHelloText />
          <FloatingStickers theme={theme} />
        </Suspense>
      </Canvas>
      {/* Subtle Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply opacity-70"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </div>
  )
}
