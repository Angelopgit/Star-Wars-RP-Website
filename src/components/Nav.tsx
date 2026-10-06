import { useEffect, useState } from 'react'
import { DISCLAIMER_SHORT, NAV, SITE } from '../content/site'
import { Cross, Down, Emblem, Menu } from './Icons'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled ? 'border-line bg-space/70 backdrop-blur-xl' : 'border-transparent'
        }`}
        style={{ height: 'var(--nav-h)' }}
        aria-label="Main"
      >
        <div className="container-x flex h-full items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3 text-ink" aria-label="Home">
            <Emblem className="text-ink" width={28} height={28} />
            <span className="leading-none whitespace-nowrap">
              <span className="display block text-[0.95rem] tracking-[0.18em]">Squad Gaming</span>
              <span className="label mt-1 block text-[0.56rem] tracking-[0.22em]">Star Wars RP • S&amp;box</span>
            </span>
          </a>

          <ul className="hidden items-center lg:flex">
            {NAV.map((g) => (
              <li key={g.label} className="group relative">
                <a href={g.href} className="label flex items-center gap-1 px-3.5 py-2 text-[0.64rem] text-ink/70 transition hover:text-ink">
                  {g.label}
                  {g.items && <Down width={11} height={11} className="opacity-50" />}
                </a>
                {g.items && (
                  <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="panel panel-solid min-w-44 py-1.5">
                      {g.items.map((it) => (
                        <li key={it.label}>
                          <a href={it.href} className="label block px-4 py-2 text-[0.62rem] text-ink/70 hover:bg-ink/5 hover:text-ink">
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
            <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm hidden sm:inline-flex">
              Join Discord
            </a>
            <a href={SITE.playUrl} className="btn btn-red btn-sm hidden sm:inline-flex">
              Play Now
            </a>
            <button
              className="grid h-9 w-9 place-items-center border border-line text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-space/96 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-28 pt-4">
          <div className="flex items-center justify-between">
            <span className="label">Navigation</span>
            <button className="grid h-9 w-9 place-items-center border border-line" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Cross />
            </button>
          </div>
          <ul className="mt-8 space-y-6">
            {NAV.map((g, i) => (
              <li key={g.label} className="border-b border-line pb-5">
                <a href={g.href} onClick={() => setOpen(false)} className="display flex items-baseline gap-4 text-3xl text-ink">
                  <span className="label label-blue text-[0.6rem]">{String(i + 1).padStart(2, '0')}</span>
                  {g.label}
                </a>
                {g.items && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 pl-9">
                    {g.items.map((it) => (
                      <a key={it.label} href={it.href} onClick={() => setOpen(false)} className="label text-[0.62rem] text-steel">
                        {it.label}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="label mt-10 text-[0.58rem] normal-case tracking-normal text-steel/70">{DISCLAIMER_SHORT}</p>
        </div>
      </div>
    </>
  )
}

/** Persistent Join Discord / Play Now bar on phones. */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px border-t border-line bg-space/90 backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="btn btn-sm h-12 border-0 bg-transparent text-ink">
        Join Discord
      </a>
      <a href={SITE.playUrl} className="btn btn-sm h-12 border-0 bg-red text-white">
        Play Now
      </a>
    </div>
  )
}
