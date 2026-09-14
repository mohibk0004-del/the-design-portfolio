import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function PortfolioMotion({ page, ready, motion }) {
  const curtain = useRef()

  useGSAP(() => {
    if (!ready) return
    const media = gsap.matchMedia()
    media.add({ animated: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const reduced = context.conditions.reduced
      let cleanupIntro = () => {}
      motion.current.reduced = reduced
      const skip = reduced || Boolean(window.location.hash) || window.scrollY > 30
      if (skip) {
        motion.current.entrance = 1
        gsap.set(curtain.current, { autoAlpha: 0 })
      } else {
        const intro = gsap.timeline()
        intro.to('.startup-bar', { scaleX: 1, duration: .25, ease: 'power2.out' })
          .to(curtain.current, { autoAlpha: 0, duration: .65, ease: 'power2.inOut' }, .2)
          .to(motion.current, { entrance: 1, duration: 1.65, ease: 'power3.out' }, .25)
          .from('.hero-meta > p', { opacity: 0, y: 18, duration: .65, stagger: .1 }, .6)
          .from('.hero-title-line', { yPercent: 115, rotation: 3, duration: .85, stagger: .09, ease: 'power3.out' }, .85)
        // Scrolling always takes priority over the introduction.
        const finish = () => intro.progress(1)
        window.addEventListener('wheel', finish, { once: true, passive: true })
        window.addEventListener('touchstart', finish, { once: true, passive: true })
        cleanupIntro = () => {
          window.removeEventListener('wheel', finish)
          window.removeEventListener('touchstart', finish)
        }
      }

      gsap.to(motion.current, {
        scroll: 1, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: reduced ? true : .6, invalidateOnRefresh: true },
      })
      if (!reduced) {
        gsap.to('.hero-scroll-copy', {
          y: -85, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 25%', scrub: .5 },
        })
        gsap.fromTo('.about-portrait', { y: 65, rotation: -3, scale: .92 }, {
          y: 0, rotation: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '#about', start: 'top 95%', end: 'top 25%', scrub: .6 },
        })
        gsap.utils.toArray('.section-rule').forEach(rule => {
          gsap.from(rule, { scaleX: 0, transformOrigin: 'left', ease: 'none',
            scrollTrigger: { trigger: rule, start: 'top 94%', end: 'top 65%', scrub: .4 },
          })
        })
        gsap.from('.contact-details', { y: 40, opacity: 0, duration: .8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-details', start: 'top 92%' },
        })
      }
      ScrollTrigger.refresh()
      return cleanupIntro
    })
    return () => media.revert()
  }, { scope: page, dependencies: [ready], revertOnUpdate: true })

  return (
    <div ref={curtain} className="startup-curtain" aria-hidden="true">
      <div className="startup-track"><span className="startup-bar" /></div>
    </div>
  )
}
