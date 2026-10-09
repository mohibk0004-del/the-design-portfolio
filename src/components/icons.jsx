import { siClaude, siGithub, siGmail, siInstagram, siOpenai, siSpotify } from 'simple-icons'
import { AppTile } from './ui'
import { askChatGPT, askClaude, owner, projects, song } from '../data/site'

const today = () => new Date()

export function CalendarTile({ size = 44 }) {
  const now = today()
  const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return (
    <span
      className="flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-[22%] border border-black/10 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Calendar, ${now.toDateString()}`}
    >
      <span className="font-bold text-[#ff3b30]" style={{ fontSize: size * 0.17, lineHeight: 1 }}>{day}</span>
      <span className="font-medium text-black" style={{ fontSize: size * 0.46, lineHeight: 1.05 }}>{now.getDate()}</span>
    </span>
  )
}

// Desktop app grid: real links only.
export const apps = [
  { label: 'GitHub', href: owner.github, tile: { background: '#181717', path: siGithub.path } },
  { label: 'Instagram', href: owner.instagram, tile: { background: 'linear-gradient(45deg,#FED373 0%,#F15245 35%,#D92E7F 62%,#9B36B7 85%,#515ECF 100%)', path: siInstagram.path } },
  { label: 'Gmail', href: `mailto:${owner.email}`, tile: { background: '#fff', color: '#EA4335', path: siGmail.path, bordered: true } },
  { label: 'Spotify', href: song.href, tile: { background: '#121212', color: '#1ED760', path: siSpotify.path } },
  { label: 'Calendar', calendar: true },
  { label: 'Ask Claude about me', href: askClaude, tile: { background: '#D97757', path: siClaude.path } },
  { label: 'Ask ChatGPT about me', href: askChatGPT, tile: { background: '#fff', color: '#000', path: siOpenai.path, bordered: true } },
  { label: 'Zero-in', href: projects[0].href, tile: { background: 'linear-gradient(#1f6b4f,#123f30)', glyph: <span className="text-[17px] font-extrabold">Z</span> } },
  { label: 'Sideline', href: projects[1].href, tile: { background: 'linear-gradient(#5b3fd6,#2b1a7a)', glyph: <span className="text-[17px] font-extrabold">S</span> } },
  { label: 'Easyres', href: projects[2].href, tile: { background: 'linear-gradient(#2a2f3a,#0d1017)', glyph: <span className="text-[15px] font-extrabold">Ea</span> } },
]

export function AppIcon({ app, size = 44 }) {
  if (app.calendar) return <CalendarTile size={size} />
  return <AppTile size={size} label={app.label} {...app.tile} />
}
