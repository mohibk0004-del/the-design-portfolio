import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { contact, email, name, socials } from '../data/content'
import { scrollTo } from '../lib/scroll'

const micro = 'm-0 font-tight text-xs leading-4 font-normal tracking-[0.72px] uppercase text-[var(--footer-muted)]'
const label = 'm-0 font-tight text-xs leading-4 font-semibold tracking-[1.2px] uppercase text-white'
const field =
  'm-0 w-full resize-none border-0 bg-transparent p-0 font-tight text-xs leading-4 font-normal tracking-[0.72px] text-white uppercase outline-none placeholder:text-[var(--footer-muted)]'

// Blocks rise 30px into place the first time the footer comes into view.
function Reveal({ as: Tag = 'div', index = 0, className = '', children, ...props }) {
  return (
    <Tag
      data-reveal=""
      className={`translate-y-[30px] opacity-0 transition-[opacity,transform] duration-[800ms] ease-[var(--ease-out-quint)] motion-reduce:translate-y-0 motion-reduce:opacity-100 [.is-visible_&]:translate-y-0 [.is-visible_&]:opacity-100 ${className}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default function Contact() {
  const footer = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = footer.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -15% 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = `Hello from ${data.get('name')}`
    const body = `${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <footer ref={footer} id="contact" className={`relative z-[42] flex min-h-[1065px] w-full flex-col items-center overflow-hidden bg-[var(--footer)] text-white max-[980px]:min-h-0 ${visible ? 'is-visible' : ''}`}>
      <h2 className="sr-only">Contact</h2>
      <div className="flex w-[min(638px,calc(100%-48px))] translate-x-9 flex-col max-[980px]:w-[min(589px,calc(100%-32px))] max-[980px]:translate-x-0">
        <div className="grid grid-cols-[repeat(2,minmax(0,267px))] gap-x-[104px] gap-y-8 pt-[166px] max-[980px]:grid-cols-1 max-[980px]:gap-y-9 max-[980px]:pt-[104px]">
          {contact.map((group, i) => (
            <Reveal as="article" key={group.title} index={i}>
              <h3 className="m-0 font-tight text-[22px] leading-7 font-normal text-white">{group.title}</h3>
              <div className="mt-5 flex flex-col items-start gap-1">
                {group.lines.map((line) =>
                  line.href ? (
                    <a key={line.label} href={line.href} target={line.external ? '_blank' : undefined} rel={line.external ? 'noreferrer' : undefined} className={`${micro} inline-flex items-center gap-1 transition-colors duration-200 hover:text-white`}>
                      {line.label}
                      {line.external && <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" />}
                    </a>
                  ) : (
                    <p key={line.label} className={micro}>{line.label}</p>
                  ),
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal index={4} className="mt-[101px] max-[980px]:mt-16">
          <div className="grid w-[min(589px,100%)] grid-cols-2 gap-[2px]">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-[32px] bg-[var(--footer-panel)] px-6 py-3 text-center font-tight text-xs leading-4 font-semibold tracking-[1.2px] text-white uppercase transition-colors duration-200 ease-linear hover:bg-[var(--footer-panel-hover)]">
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>

        <form onSubmit={handleSubmit} className="mt-24 flex justify-start max-[980px]:mt-[84px] max-[980px]:pb-[72px]">
          <div className="flex w-[min(589px,100%)] flex-col">
            <Reveal as="p" index={5} className={label}>Send a message</Reveal>
            <Reveal index={6} className="mt-5">
              <div className="grid grid-cols-2 gap-4 max-[980px]:grid-cols-1 max-[980px]:gap-0">
                <label className="block border-b-[0.5px] border-[var(--footer-line)] py-3">
                  <span className="sr-only">Name</span>
                  <input className={field} placeholder="Name" type="text" name="name" autoComplete="name" required />
                </label>
                <label className="block border-b-[0.5px] border-[var(--footer-line)] py-3">
                  <span className="sr-only">Email</span>
                  <input className={field} placeholder="Email" type="email" name="email" autoComplete="email" required />
                </label>
              </div>
              <label className="mt-4 block border-b-[0.5px] border-[var(--footer-line)] py-3 max-[980px]:mt-0">
                <span className="sr-only">Message</span>
                <textarea className={field} placeholder="Message" rows="1" name="message" required />
              </label>
            </Reveal>
            <Reveal as="div" index={7} className="mt-[18px] ml-auto">
              <button type="submit" className={`${label} inline-flex cursor-pointer items-center gap-[2px] border-0 bg-transparent p-0`}>
                Send <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </Reveal>
          </div>
        </form>
      </div>

      <Reveal index={8} className="mt-auto grid min-h-10 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-x-6 px-4 py-3 max-[980px]:grid-cols-1 max-[980px]:justify-items-center max-[980px]:gap-3 max-[980px]:pt-[18px] max-[980px]:pb-[22px]">
        <p className="m-0 font-tight text-[10px] leading-4 font-medium tracking-[0.8px] text-[var(--footer-muted)] uppercase">© {new Date().getFullYear()} {name}</p>
        <a href="#top" onClick={(event) => { event.preventDefault(); scrollTo(0) }} className="font-tight text-[10px] leading-4 font-medium tracking-[0.8px] text-[#90909b] uppercase transition-colors duration-200 hover:text-white">
          Back to top
        </a>
        <p className="m-0 text-right font-tight text-[10px] leading-4 font-medium tracking-[0.8px] text-[var(--footer-muted)] uppercase max-[980px]:text-center">
          Made in code and <span className="border-b border-white leading-none text-white">behind a camera</span>
        </p>
      </Reveal>
    </footer>
  )
}
