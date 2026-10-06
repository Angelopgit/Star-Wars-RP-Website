import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MobileActionBar, Nav } from './components/Nav'
import { useReducedMotion } from './lib/hooks'
import { Hero } from './sections/Hero'
import { Project } from './sections/Project'
import { Allegiance } from './sections/Allegiance'
import { Galaxy } from './sections/Galaxy'
import { Story } from './sections/Story'
import { Conflict } from './sections/Conflict'
import { Footer, Ranks } from './sections/Ranks'

gsap.registerPlugin(ScrollTrigger)

function useCinematicScroll(reduced: boolean) {
  useEffect(() => {
    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(document.body)

    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t: number) => lenis!.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // In-page links glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')!
      const target = hash === '#top' ? document.body : document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: hash === '#top' ? 0 : -60, duration: 1.6 })
      else (target as HTMLElement).scrollIntoView()
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.from('.hero-in', { y: 24, opacity: 0, duration: 1.4, ease: 'power3.out', stagger: 0.1, delay: 0.4 })
      gsap.set('[data-reveal]', { opacity: 0 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      })
      gsap.fromTo(
        '.roadmap-progress',
        { scaleX: 0, scaleY: 0, transformOrigin: 'left top' },
        { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#roadmap', start: 'top 70%', end: 'center center', scrub: true } },
      )
      // The hero copy lifts away and the footage settles as the page takes over.
      gsap.to('#top .container-x', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('#top .hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } })
      // Section stills drift slower than the page, like plates in a camera move.
      gsap.utils.toArray<HTMLElement>('.backdrop img[data-parallax]').forEach((img) => {
        gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    })

    return () => {
      ro.disconnect()
      document.removeEventListener('click', onClick)
      ctx.revert()
      if (tick) gsap.ticker.remove(tick)
      lenis?.destroy()
    }
  }, [reduced])
}

export default function App() {
  const reduced = useReducedMotion()
  useCinematicScroll(reduced)

  return (
    <>
      <Nav />
      <main>
        <Hero reduced={reduced} />
        <Project />
        <Allegiance />
        <Galaxy />
        <Story />
        <Conflict />
        <Ranks />
      </main>
      <Footer />
      <MobileActionBar />
      <div className="film-grain" aria-hidden />
    </>
  )
}
