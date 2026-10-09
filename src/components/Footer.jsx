import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react'

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
      gsap.from('.contact-heading .line-inner', {
        yPercent: 105,
        rotation: 2,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-heading', start: 'top 88%' },
      })
      gsap.from('.footer-wordmark-layer', {
        yPercent: 22,
        scrollTrigger: { trigger: '.footer-wordmark', start: 'top bottom', end: 'bottom bottom', scrub: 0.45 },
      })
    })
    return () => media.revert()
  }, { scope: root })

  return (
    <footer ref={root} id="contact" className="portfolio-footer">
      <div className="portfolio-container section-rule" />
      <div className="portfolio-container">
        <div className="contact-top">
          <h2 className="contact-heading"><span className="line-mask"><span className="line-inner">Got something</span></span><span className="line-mask"><span className="line-inner contact-outline">in mind?</span></span></h2>
        </div>
        <div className="contact-details">
          <p>Send me the rough version. We can figure out the rest from there.</p>
          <div className="contact-email-group">
            <a className="contact-email" href={`mailto:${email}`}>{email}</a>
            <button type="button" className="copy-email" onClick={handleCopy} aria-label="Copy email address">{copyState === 'copied' ? <Check size={19} /> : <Copy size={19} />}</button>
            <span className="copy-status" role="status" aria-live="polite">{copyState === 'copied' ? 'Email copied.' : copyState === 'error' ? "Couldn't copy it. Use the email link." : ''}</span>
          </div>
        </div>
        <div className="footer-meta">
          <nav aria-label="Social links"><a href="https://instagram.com/clicksbymohib" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={15} aria-hidden="true" /></a><a href="https://github.com/mohibk0004-del" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a></nav>
          <a href="#top" className="back-to-top" onClick={handleTop}>Back to top <ArrowUp size={15} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true"><span className="footer-wordmark-layer">MOHIB</span><span className="footer-wordmark-front">MOHIB<span>™</span></span></div>
      <div className="footer-bottom portfolio-container"><span>© {new Date().getFullYear()} Mohib</span><span>Made in code and behind a camera.</span></div>
    </footer>
  )
}
