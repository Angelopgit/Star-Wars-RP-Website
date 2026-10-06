import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MobileActionBar, Nav } from './components/Nav'
import { useIsMobile, useReducedMotion } from './lib/hooks'
import { measureAnchors } from './lib/scroll'
import { About } from './sections/About'
import { Character, Progression } from './sections/Character'
import { Community, Philosophy } from './sections/Community'
import { Media, News, Roadmap } from './sections/Development'
import { Factions } from './sections/Factions'
import { Events, Features } from './sections/Features'
import { Galaxy } from './sections/Galaxy'
import { Hero } from './sections/Hero'
import { Footer, HowToPlay, WhyUs } from './sections/Play'
import { StaticBackdrop } from './components/StaticBackdrop'

gsap.registerPlugin(ScrollTrigger)
const Experience = lazy(() => import('./scene/Experience'))

function useCinematicScroll(reduced: boolean) {
  useEffect(() => {
    measureAnchors()
    const ro = new ResizeObserver(() => {
      measureAnchors()
      ScrollTrigger.refresh()
    })
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

    // In-page links glide through the scene instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')!
      const target = hash === '#top' ? document.body : document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: hash === '#top' ? 0 : -60, duration: 1.8 })
      else (target as HTMLElement).scrollIntoView()
      history.replaceState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.from('.hero-in', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.09, delay: 0.3 })
      gsap.set('[data-reveal]', { opacity: 0 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      })
      gsap.fromTo(
        '.roadmap-progress',
        { scaleX: 0, scaleY: 0, transformOrigin: 'left top' },
        { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#roadmap', start: 'top 70%', end: 'center center', scrub: true } },
      )
      // Hero content drifts away as the camera pulls out.
      gsap.to('#top .container-x', { yPercent: -25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } })
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
  const mobile = useIsMobile()
  useCinematicScroll(reduced)

  return (
    <>
      <Suspense fallback={<div className="scene-layer"><StaticBackdrop /></div>}>
        <Experience mobile={mobile} reduced={reduced} />
      </Suspense>
      <Nav />
      <main>
        <Hero />
        <About />
        <Factions />
        <Character />
        <Progression />
        <Galaxy />
        <Features />
        <Events />
        <Philosophy />
        <Community />
        <Roadmap />
        <Media />
        <News />
        <HowToPlay />
        <WhyUs />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
