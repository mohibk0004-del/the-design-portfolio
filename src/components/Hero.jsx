export default function Hero() {
  return (
    <section id="hero" className="portfolio-hero relative w-full flex flex-col z-20 pointer-events-none" aria-labelledby="hero-title">
      <div className="hero-meta hero-scroll-copy grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 px-4 lg:px-14 w-full text-white hero-text">
        <p className="md:col-span-4 text-xl md:text-3xl font-medium leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          CS Student with<br />interests in ML/AI
        </p>
        <p className="md:col-start-9 md:col-span-4 font-mono text-xs md:text-sm leading-relaxed max-w-md [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
          I'm Mohib. I write software, make small 3D worlds, and shoot photos.
        </p>
      </div>

      <div className="px-4 lg:px-14 mt-auto hero-text hero-scroll-copy">
        <h1 id="hero-title" className="max-w-[13ch] text-[10vw] md:text-[8vw] font-bold uppercase leading-[0.85] tracking-tight text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.3)]">
          <span className="line-mask"><span className="hero-title-line">I care how</span></span>
          <span className="line-mask"><span className="hero-title-line">digital work</span></span>
          <span className="line-mask"><span className="hero-title-line">feels</span></span>
        </h1>
      </div>
    </section>
  )
}
