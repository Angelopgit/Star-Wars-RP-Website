import { SITE } from '../content/site'
import { Data, DiscordButton, PlayButton } from '../components/ui'
import { HeroMedia } from '../components/Backdrop'

export function Hero({ reduced }: { reduced: boolean }) {
  return (
    <section id="top" className="act flex min-h-[100svh] flex-col justify-end overflow-hidden pb-24 pt-[calc(var(--nav-h)+2rem)] sm:justify-center sm:pb-0">
      <HeroMedia reduced={reduced} />
      <div className="pointer-events-none absolute inset-0 scrim-l hidden md:block" />
      <div className="container-x relative">
        <div className="max-w-xl">
          <p className="hero-in label">
            <span className="label-blue">Transmission</span> // Squad Gaming Network
          </p>
          <h1 className="hero-in mt-7">
            <span className="display-light block text-[clamp(1rem,1.6vw,1.25rem)] text-ink/70">Enter the</span>
            <span className="display title-glow mt-2 block text-[clamp(2.9rem,6.4vw,5.6rem)] text-ink">Galactic Republic</span>
          </h1>
          <p className="hero-in lede mt-6 max-w-md">A new generation of Star Wars Roleplay, built in S&amp;box.</p>
          <p className="hero-in display-light mt-6 text-[0.8rem] leading-[1.9] text-steel">
            Choose your allegiance.
            <br />
            Forge your story.
            <br />
            Fight for the galaxy.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row">
            <DiscordButton />
            <PlayButton />
          </div>
        </div>

        <div className="hero-in mt-14 hidden gap-x-10 gap-y-2 border-t border-line pt-5 md:flex md:flex-wrap">
          <Data k="Status" v={<span className="inline-flex items-center gap-2 text-blue"><span className="status-dot" /> Active development</span>} />
          <Data k="Sector" v="Outer Rim" />
          <Data k="Operator" v={SITE.community} />
          <Data k="Platform" v="S&box" />
        </div>
      </div>
      <p className="label absolute bottom-6 left-0 right-0 hidden text-center text-[0.58rem] text-steel/50 md:block">Scroll</p>
    </section>
  )
}
