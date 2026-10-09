// Tiny app-wide commands, so menus, Spotlight and the dock can open things without prop drilling.
const fire = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }))

export const openSpotlight = () => fire('open-spotlight')
export const openAbout = () => fire('open-about')
export const openProjectWindow = (id) => fire('open-project', id)

export function goTo(hash) {
  if (window.location.pathname.replace(/\/$/, '') === '/playground') {
    window.location.href = `/${hash}`
    return
  }
  const el = document.querySelector(hash)
  if (!el) return
  if (window.lenis) window.lenis.scrollTo(el, { offset: -16 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
