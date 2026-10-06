import { HOW_TO_PLAY, WHY_US } from '../content/content'
import { DISCLAIMER_FULL, NAV, SITE } from '../content/site'
import { Emblem } from '../components/Icons'
import { DiscordButton, Panel, PlayButton, SectionHeader } from '../components/ui'

export function HowToPlay() {
  return (
    <section id="how-to-play" data-shot="how-to-play" className="section">
      <div className="container-x">
        <SectionHeader align="center" kicker="How to play" title="Six steps to the front line" sub="Joining takes minutes. Your story starts with your first briefing." />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_TO_PLAY.map((s, i) => (
            <li key={s.title} data-reveal>
              <Panel className="flex h-full items-start gap-4 p-5">
                <span className="display text-4xl font-extrabold text-holo/80">{i + 1}</span>
                <div>
                  <h3 className="font-ui text-base font-semibold uppercase tracking-[0.14em]">{s.title}</h3>
                  <p className="mt-1 text-sm text-steel">{s.body}</p>
                </div>
              </Panel>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col items-center gap-4" data-reveal>
          <PlayButton className="btn-xl" />
          <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="hud text-[0.66rem] text-steel underline-offset-4 hover:text-holo hover:underline">
            Server not live yet? Join Discord for launch news
          </a>
        </div>
      </div>
    </section>
  )
}

export function WhyUs() {
  return (
    <section id="why" data-shot="why" className="section">
      <div className="container-x">
        <SectionHeader kicker="Why us?" title="Why play here?" sub="There are other Star Wars RP servers. Here is why this one is different." />
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w, i) => (
            <div key={w.title} className="group relative bg-space/80 p-7 backdrop-blur transition hover:bg-deep/90 md:p-9" data-reveal>
              <span className="hud text-[0.6rem] text-holo">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display mt-3 text-2xl font-extrabold md:text-3xl">{w.title}</h3>
              <p className="mt-2 text-steel">{w.body}</p>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-holo transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer data-shot="footer" className="relative z-[1] pt-24 pb-28 sm:pb-10">
      <div className="container-x">
        <div className="text-center" data-reveal>
          <p className="kicker">Your squad is waiting</p>
          <p className="display metal-text text-glow mt-4 text-[clamp(2.6rem,8vw,6.5rem)] font-extrabold">The Republic needs you.</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <DiscordButton label="Join Discord" />
            <PlayButton />
          </div>
        </div>

        <div className="divider-line mt-20" />
      </div>
      <div className="container-x bg-gradient-to-b from-space/0 via-space/90 to-space">
        <div className="grid gap-10 py-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Emblem className="text-holo" />
              <span className="font-display font-bold tracking-[0.2em]">SQUAD GAMING</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-steel">
              Star Wars Roleplay for S&amp;box, created and operated by {SITE.community}. Built and designed by and for the community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {NAV.filter((g) => g.items).map((g) => (
              <div key={g.label}>
                <p className="hud text-[0.62rem] text-holo">{g.label}</p>
                <ul className="mt-3 space-y-2">
                  {g.items!.map((it) => (
                    <li key={it.label}>
                      <a href={it.href} className="text-sm text-steel hover:text-ink">
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Panel className="p-5 md:p-6" accent="#ffc457">
          <p className="hud text-[0.64rem] text-gold">Unofficial fan project · Non-profit · For fun &amp; entertainment</p>
          <p className="mt-2 text-xs leading-relaxed text-steel">{DISCLAIMER_FULL}</p>
        </Panel>
        <p className="hud mt-6 text-center text-[0.58rem] text-steel/60">
          © {new Date().getFullYear()} {SITE.community} · Fan website · Not an official Star Wars, Lucasfilm, Disney, or Facepunch product
        </p>
      </div>
    </footer>
  )
}
