import { BATTALIONS } from '../content/factions'
import { DISCLAIMER_SHORT, SITE } from '../content/site'
import { Arrow, Down } from '../components/Icons'
import { DiscordButton, PlayButton } from '../components/ui'

export function Hero() {
  return (
    <section id="top" data-shot="hero" className="relative z-[1] flex min-h-[100svh] flex-col justify-between pb-24 pt-[calc(var(--nav-h)+2rem)] sm:pb-10">
      <div className="container-x flex flex-1 flex-col justify-start pt-[6vh] md:justify-center md:pt-0">
        <div className="max-w-3xl text-center md:text-left">
          <p className="hero-in hud flex items-center justify-center gap-3 text-holo md:justify-start">
            <span className="pulse-dot text-sep" />
            Incoming transmission · {SITE.community}
          </p>
          <h1 className="display mt-5 font-extrabold">
            <span className="hero-in block text-[clamp(1.1rem,2.6vw,1.6rem)] tracking-[0.5em] text-steel">Enter the</span>
            <span className="hero-in metal-text text-glow block text-[clamp(2.9rem,9.5vw,7.6rem)]">Galactic</span>
            <span className="hero-in metal-text text-glow block text-[clamp(2.9rem,9.5vw,7.6rem)]">Republic</span>
          </h1>
          <p className="hero-in mx-auto mt-6 max-w-xl text-lg text-ink/90 md:mx-0 md:text-xl">
            A new generation of Star Wars Roleplay, built in S&amp;box.
          </p>
          <p className="hero-in hud mt-3 text-[0.72rem] text-steel md:text-xs">Choose your allegiance. Forge your story. Fight for the galaxy.</p>

          <div className="hero-in mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
            <DiscordButton />
            <PlayButton label="Play Now / Connect" />
            <a href="#about" className="btn btn-ghost">
              Learn More <Arrow width={16} height={16} />
            </a>
          </div>
          <p className="hero-in mt-6 text-[0.7rem] text-steel/80">{DISCLAIMER_SHORT}</p>
        </div>
      </div>

      <div className="container-x relative hidden items-end justify-between gap-6 md:flex">
        <div className="hero-in holo scanlines hud flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-[0.62rem] text-steel">
          <span className="text-holo">Battalions deployed</span>
          {BATTALIONS.map((b) => (
            <span key={b.name} className="flex items-center gap-2">
              <span className="h-2 w-2" style={{ background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
              {b.name}
            </span>
          ))}
        </div>
        <a href="#about" className="hud scroll-cue flex flex-col items-center gap-1 text-[0.6rem] text-steel" aria-label="Scroll to begin">
          Scroll to deploy
          <Down />
        </a>
      </div>
    </section>
  )
}
