import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const email = 'mohibk0004@gmail.com'

export default function Footer() {
  const root = useRef(null)
  const timer = useRef(null)
  const [copyState, setCopyState] = useState('idle')
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    timer.current = setTimeout(() => setCopyState('idle'), 3500)
  }

  const handleTop = (event) => {
    event.preventDefault()
    window.portfolioScroll?.('#top')
  }

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // The heading is wiped on from the left, like ink across the page.
      gsap.fromTo('.ed-contact-heading', { clipPath: 'inset(0% 100% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.ed-contact-heading', start: 'top 85%' },
      })
      gsap.from('.ed-contact-row > *', {
        opacity: 0,
        y: 14,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ed-contact-heading', start: 'top 85%' },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <footer ref={root} id="contact" className="ed-contact">
      <div className="ed-container ed-contact-inner">
        <p className="ed-label">Contact</p>
        <h2 className="ed-contact-heading">Have something <em>in mind?</em></h2>
        <div className="ed-contact-row">
          <p>Send me the rough version. We can figure out the rest from there.</p>
          <div className="ed-email-group">
            <a className="ed-email" href={`mailto:${email}`}>{email}</a>
            <button type="button" className="ed-copy" onClick={handleCopy} aria-label="Copy email address">{copyState === 'copied' ? 'Copied' : 'Copy'}</button>
            <span className="ed-copy-status" role="status" aria-live="polite">{copyState === 'error' ? "Couldn't copy it. Use the email link." : ''}</span>
          </div>
        </div>
        <div className="ed-footer-meta">
          <nav aria-label="Social links">
            <a className="ed-link" href="https://instagram.com/clicksbymohib" target="_blank" rel="noreferrer">Instagram</a>
            <a className="ed-link" href="https://github.com/mohibk0004-del" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
          <a href="#top" className="ed-link" onClick={handleTop}>Back to top</a>
        </div>
        <div className="ed-colophon">
          <span>© {new Date().getFullYear()} Mohib Khan</span>
          <span>Made in code and behind a camera.</span>
        </div>
      </div>
    </footer>
  )
}
