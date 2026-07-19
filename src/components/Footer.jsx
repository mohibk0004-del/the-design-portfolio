export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 w-full min-h-screen flex flex-col justify-end px-4 lg:px-14 py-32 md:py-48 bg-transparent">
      <div className="max-w-6xl w-full">
        <h2 className="footer-text font-bold uppercase text-[10vw] leading-[0.85] tracking-tight hover:text-[var(--selection)] transition-colors duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer">
          Let's Create<br />
          Something<br />
          Extraordinary
        </h2>
      </div>
      <div className="mt-32 flex flex-col md:flex-row justify-between items-start md:items-end font-mono text-sm gap-8 z-20 pointer-events-auto">
        <a href="mailto:mohibk0004@gmail.com" className="uppercase hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block transform-origin-left">
          mohibk0004@gmail.com
        </a>
        <div className="flex gap-8 uppercase">
          <a href="https://instagram.com/clicksbymohib" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">Insta</a>
          <a href="#" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">Figma</a>
          <a href="https://github.com/mohibk0004-del" className="hover:text-[var(--selection)] transition-colors duration-[150ms] ease-out active:scale-[0.97] inline-block">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
