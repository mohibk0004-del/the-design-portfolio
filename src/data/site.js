import zeroInImg from '../assets/zero-in.jpg'
import sidelineImg from '../assets/sideline.png'
import livePulseImg from '../assets/livepulse.png'
import easyresImg from '../assets/easyres.jpg'
import platformerImg from '../assets/3dplatformer.png'
import asciiImg from '../assets/ascii-terminal.jpg'
import portraitImg from '../assets/portrait-garden.jpg'
import studioImg from '../assets/aboutme.png'
import zeroInMark from '../assets/zero-in-mark.png'

export { zeroInMark, studioImg }

export const owner = {
  initial: 'M',
  name: 'Mohib Khan',
  role: 'CS Student',
  email: 'mohibk0004@gmail.com',
  github: 'https://github.com/mohibk0004-del',
  instagram: 'https://instagram.com/clicksbymohib',
  portrait: portraitImg,
}

export const city = { name: 'Islamabad', timeZone: 'Asia/Karachi', latitude: 33.6844, longitude: 73.0479 }

export const song = {
  title: 'The Adults Are Talking',
  artist: 'The Strokes',
  album: 'The New Abnormal',
  cover: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e3f1ba3de4659708c25d0f39',
  href: 'https://open.spotify.com/track/5ruzrDWcT0vuJIOMW7gMnW',
}

const askPrompt = encodeURIComponent(
  'Tell me about Mohib Khan, a computer science student who builds web apps, Windows tools and game prototypes. He built Zero-in, an AI study workspace, shipped Sideline for Amazon\'s Bundesliga league, and placed 2nd at an AWS university hackathon with Ghostranger. Summarize his work and what makes him stand out: https://github.com/mohibk0004-del',
)
export const askClaude = `https://claude.ai/new?q=${askPrompt}`
export const askChatGPT = `https://chatgpt.com/?q=${askPrompt}`

// The four desktop folders, the stacked folder sections and the project windows all read from here.
export const projects = [
  {
    id: 'zero-in',
    folder: 'Zero-in',
    tab: 'Zero-in',
    title: 'An AI study workspace that turns notes into practice.',
    summary: 'Drop in your notes, a PDF, or a topic. Zero-in turns it into material you can actually study, from quizzes to flashcards.',
    href: 'https://mohib.wiki',
    cta: 'Open Zero-in',
    images: [{ src: zeroInImg, alt: 'Zero-in study workspace landing page' }],
    stack: ['Next.js', 'TypeScript', 'GSAP', 'PostgreSQL', 'Gemini'],
    notes: [
      { title: 'Notes in, practice out', detail: 'paste notes, upload a PDF, or just name a topic' },
      { title: 'Built on Gemini', detail: 'generation runs through the Gemini API' },
      { title: 'Live at mohib.wiki', detail: 'Next.js and TypeScript, data in PostgreSQL' },
    ],
  },
  {
    id: 'sideline',
    folder: 'Sideline',
    tab: 'Sideline',
    title: 'Shipped Sideline for Amazon’s Bundesliga league.',
    summary: 'Sideline and LivePulse are two parts of the same experiment: a match companion with live chat and telemetry while the game is on.',
    href: 'https://github.com/amna0x/sideline',
    cta: 'View source',
    images: [
      { src: sidelineImg, alt: 'Sideline web app interface' },
      { src: livePulseImg, alt: 'LivePulse chat and telemetry interface' },
    ],
    stack: ['React', 'TypeScript', 'WebGL', 'WebSockets', 'GLSL'],
    notes: [
      { title: 'Shipped for the Bundesliga', detail: 'built for Amazon’s Bundesliga league' },
      { title: 'Live chat and predictions', detail: 'fans react to the match as it happens' },
      { title: 'Real-time over WebSockets', detail: 'telemetry rendered with WebGL and GLSL' },
    ],
  },
  {
    id: 'easyres',
    folder: 'Easyres',
    tab: 'Easyres',
    title: 'Native display controls, in one small Windows app.',
    summary: 'A Windows utility that puts resolution, refresh rate and display settings in one place, talking to the Win32 API directly.',
    href: 'https://github.com/mohibk0004-del/easyres/',
    cta: 'View source',
    images: [{ src: easyresImg, alt: 'Easyres desktop utility and its display controls' }],
    stack: ['Python', 'PyQt6', 'ctypes', 'Win32 API'],
    notes: [
      { title: 'One window for every display', detail: 'resolution, refresh rate and custom modes' },
      { title: 'Straight to Win32', detail: 'ctypes calls, no extra drivers' },
      { title: 'Open source', detail: 'Python and PyQt6, on GitHub' },
    ],
  },
  {
    id: 'platformer',
    folder: '3D Platformer',
    tab: 'Games',
    title: 'A platformer built around 3D movement and physics.',
    summary: 'A Unity game where the fun is in the movement: jumps, momentum and physics, with the levels modelled in Blender.',
    href: 'https://github.com/mohibk0004-del/unity-game',
    cta: 'View source',
    images: [{ src: platformerImg, alt: 'Three-dimensional platformer game environment' }],
    stack: ['Unity', 'C#', 'Blender', 'ShaderLab'],
    notes: [
      { title: 'Movement first', detail: 'jumps and momentum tuned before the levels' },
      { title: 'Modelled in Blender', detail: 'environments and props made by hand' },
      { title: 'Custom shaders', detail: 'written in ShaderLab' },
    ],
  },
]

export const achievements = [
  { title: '2nd place, AWS hackathon', detail: 'University AWS hackathon with Ghostranger', icon: 'trophy', from: '#FFD056', to: '#F5A623' },
  { title: 'Shipped Sideline', detail: 'Built for Amazon’s Bundesliga league', icon: 'amazon', href: 'https://github.com/amna0x/sideline' },
  { title: 'Launched Zero-in', detail: 'AI study workspace, live at mohib.wiki', image: zeroInMark, href: 'https://mohib.wiki' },
]

export const otherProjects = [
  { name: 'Ghostranger', detail: 'Our AWS university hackathon project. Took 2nd place.' },
  { name: 'Ours', detail: 'A productivity app for partners: connect with a code and see each other’s day, from habits to calories.' },
  { name: 'Spotify Album Finder', detail: 'Search any artist and browse their albums through the Spotify API.' },
  { name: 'Terminal portfolio', detail: 'An earlier portfolio, built as an ASCII terminal you type into.', image: asciiImg },
]

export const about = {
  then: 'Learning to code by building whatever I needed next: web pages first, then Windows tools in Python and games in Unity and C#.',
  now: 'Computer science student with an interest in machine learning and AI. Shipping Zero-in and Sideline, and taking photographs in between.',
  future: 'Ship something people open every single day, and finally finish the hamster game.',
}
