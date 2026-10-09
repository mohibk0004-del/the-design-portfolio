import {
  SiBlender,
  SiGooglegemini,
  SiGreensock,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiQt,
  SiReact,
  SiSharp,
  SiThreedotjs,
  SiTypescript,
  SiUnity,
  SiWebgl,
} from 'react-icons/si'
import { Braces, Database, MonitorCog, Radio, TerminalSquare } from 'lucide-react'

const techIcons = {
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  GSAP: SiGreensock,
  PostgreSQL: SiPostgresql,
  Gemini: SiGooglegemini,
  React: SiReact,
  JavaScript: SiJavascript,
  'Three.js': SiThreedotjs,
  WebGL: SiWebgl,
  WebSockets: Radio,
  GLSL: Braces,
  Python: SiPython,
  PyQt6: SiQt,
  ctypes: Braces,
  'Win32 API': MonitorCog,
  Unity: SiUnity,
  Blender: SiBlender,
  'C#': SiSharp,
  ShaderLab: Braces,
  HLSL: Braces,
  HTML: SiHtml5,
  CSS: Braces,
  PowerShell: TerminalSquare,
  'Node.js': SiNodedotjs,
  'PL/pgSQL': Database,
}

export default function TechStack({ items, className = '' }) {
  return (
    <ul className={`tech-stack ${className}`.trim()} aria-label="Technology stack">
      {items.map((item) => {
        const Icon = techIcons[item] || Braces
        return (
          <li key={item}>
            <Icon aria-hidden="true" focusable="false" />
            <span>{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
