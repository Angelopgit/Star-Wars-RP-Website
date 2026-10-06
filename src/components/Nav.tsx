import { useEffect, useState } from 'react'
import { DISCLAIMER_SHORT, NAV, SITE } from '../content/site'
import { Cross, Discord, Down, Emblem, Menu, Play } from './Icons'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'border-b border-white/10 bg-space/75 backdrop-blur-xl' : 'bg-gradient-to-b from-space/80 to-transparent'
        }`}
        style={{ height: 'var(--nav-h)' }}
        aria-label="Main"
      >
        <div className="container-x flex h-full items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3 text-ink" aria-label="Home">
            <Emblem className="text-holo" />
            <span className="leading-none whitespace-nowrap">
              <span className="block font-display text-sm font-bold tracking-[0.2em]">SQUAD GAMING</span>
              <span className="hud block text-[0.58rem] text-steel">Star Wars RP · S&amp;box</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((g) => (
              <li key={g.label} className="group relative">
                <a href={g.href} className="hud flex items-center gap-1 px-3 py-2 text-[0.72rem] text-ink/80 transition hover:text-holo">
                  {g.label}
                  {g.items && <Down width={12} height={12} />}
                </a>
                {g.items && (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="holo min-w-48 p-2">
                      {g.items.map((it) => (
                        <li key={it.label}>
                          <a href={it.href} className="hud block px-3 py-2 text-[0.68rem] text-ink/80 hover:bg-holo/10 hover:text-holo">
                            {it.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              <Discord width={16} height={16} /> Join Discord
            </a>
            <a href={SITE.playUrl} className="btn btn-red btn-sm hidden sm:inline-flex">
              <Play width={14} height={14} /> Play Now
            </a>
            <button
              className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-space/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-28 pt-5">
          <div className="flex items-center justify-between">
            <span className="kicker">Navigation</span>
            <button className="grid h-10 w-10 place-items-center border border-white/15" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Cross />
            </button>
          </div>
          <ul className="mt-6 space-y-5">
            {NAV.map((g) => (
              <li key={g.label}>
                <a href={g.href} onClick={() => setOpen(false)} className="display block text-3xl font-bold text-ink">
                  {g.label}
                </a>
                {g.items && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <a
                        key={it.label}
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className="hud border border-white/10 px-3 py-2 text-[0.66rem] text-steel"
                      >
                        {it.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-steel/70">{DISCLAIMER_SHORT}</p>
        </div>
      </div>
    </>
  )
}

/** Always-visible Join Discord / Play Now bar on phones. */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-space/85 p-2 backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
        <Discord width={16} height={16} /> Join Discord
      </a>
      <a href={SITE.playUrl} className="btn btn-red btn-sm">
        <Play width={14} height={14} /> Play Now
      </a>
    </div>
  )
}
