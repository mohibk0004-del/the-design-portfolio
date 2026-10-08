import aboutImg from '../assets/aboutme.png'
import zeroInImg from '../assets/zero-in.jpg'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import easyresImg from '../assets/easyres.jpg'
import platformerImg from '../assets/3dplatformer.png'
import asciiImg from '../assets/ascii-terminal.jpg'
import layersImg from '../assets/layers.png'

export const name = 'Mohib Khan'
export const email = 'mohibk0004@gmail.com'

export const portrait = { src: aboutImg, alt: 'Portrait of Mohib', position: '34% 30%' }

export const about = [
  "Hi! I'm Mohib. I'm a computer science student who writes software, makes small 3D worlds and takes photographs.",
  'I build web apps, Windows tools and game prototypes, and I care about how each of them feels to use, right down to the last bit of motion.',
]

export const ringText = [
  "I study computer science, with a growing interest in machine learning and AI, and a habit of building whatever I need next.",
  'My GitHub moves between JavaScript and TypeScript projects, Python utilities for Windows, and C# games with graphics and shader work.',
  "When I'm not writing code I'm behind a camera. Both come down to the same thing for me: caring how the finished work feels.",
]

export const projects = [
  {
    title: 'Zero-in',
    caption: 'Zero-in, AI study workspace ´26',
    href: 'https://mohib.wiki',
    images: [{ src: zeroInImg, alt: 'Zero-in study workspace landing page', position: '24% 50%' }],
  },
  {
    title: 'Sideline',
    caption: 'Sideline & LivePulse, real-time web ´26',
    href: 'https://www.mohib.app',
    images: [
      { src: sidelineImg, alt: 'Sideline web app interface', position: '50% 0%' },
      { src: livePulseImg, alt: 'LivePulse chat and telemetry interface', position: '50% 0%' },
    ],
  },
  {
    title: 'Easyres',
    caption: 'Easyres, Windows display utility ´26',
    href: 'https://github.com/mohibk0004-del/easyres/',
    images: [{ src: easyresImg, alt: 'Easyres desktop utility and its display controls', position: '50% 20%' }],
  },
  {
    title: 'Platformer',
    caption: '3D platformer, Unity game ´26',
    href: 'https://github.com/mohibk0004-del/unity-game',
    images: [{ src: platformerImg, alt: 'Three-dimensional platformer game environment', position: '50% 50%' }],
  },
]

export const contact = [
  { title: 'About', lines: [{ label: 'Mohib Khan' }, { label: 'Computer science student' }] },
  { title: 'Email', lines: [{ label: email, href: `mailto:${email}` }] },
  { title: 'Code', lines: [{ label: 'github.com/mohibk0004-del', href: 'https://github.com/mohibk0004-del', external: true }] },
  { title: 'Photography', lines: [{ label: '@clicksbymohib', href: 'https://instagram.com/clicksbymohib', external: true }] },
]

export const socials = [
  { label: 'Instagram', href: 'https://instagram.com/clicksbymohib' },
  { label: 'GitHub', href: 'https://github.com/mohibk0004-del' },
]

// Your own photographs (src/assets/photos) come first, project imagery fills the rest.
const photos = Object.entries(import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => ({ src, alt: 'Photograph by Mohib', position: '50% 50%' }))

const work = [
  portrait,
  { src: zeroInImg, alt: 'Zero-in landing page', position: '22% 50%' },
  { src: sidelineImg, alt: 'Sideline interface', position: '50% 0%' },
  { src: platformerImg, alt: '3D platformer scene', position: '62% 50%' },
  { src: asciiImg, alt: 'ASCII terminal portfolio', position: '40% 50%' },
  { src: livePulseImg, alt: 'LivePulse interface', position: '50% 0%' },
  { src: easyresImg, alt: 'Easyres utility', position: '30% 30%' },
  { src: layersImg, alt: 'Layered 3D render', position: '50% 50%' },
]

export const imagePool = [...photos, ...work]

// Spreads repeats apart so the same image never sits next to itself.
export function pickImages(count, offset = 0) {
  const pool = imagePool
  const stride = pool.length % 3 === 0 ? 1 : 3
  return Array.from({ length: count }, (_, i) => pool[(offset + i * stride) % pool.length])
}
