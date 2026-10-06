import { EVENT_FEATURED, FEATURES } from '../content/content'
import { MediaSlot, Panel, SectionHeader } from '../components/ui'

const HUES: Record<string, number> = { combat: 8, roleplay: 205, technology: 255 }

export function Features() {
  return (
    <section id="features" data-shot="features" className="section">
      <div className="container-x">
        <SectionHeader
          kicker="Gameplay"
          title="Built for the fight. Made for the story."
          sub="Combat that feels good, roleplay systems that get out of the way, and a modern engine underneath it all."
        />
        <div className="space-y-10 md:space-y-16">
          {FEATURES.map((g, gi) => (
            <div key={g.id} className={`grid items-center gap-6 lg:grid-cols-2 lg:gap-12`} data-reveal>
              <div className={`relative aspect-video overflow-hidden border border-white/10 ${gi % 2 ? 'lg:order-2' : ''}`}>
                <MediaSlot hue={HUES[g.id]} label={`${g.title} gameplay`} video />
                <div className="absolute right-3 top-3 hud text-[0.6rem]" style={{ color: g.color }}>
                  {g.kicker}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1" style={{ background: g.color, boxShadow: `0 0 14px ${g.color}` }} />
                  <h3 className="display text-4xl font-extrabold md:text-5xl">{g.title}</h3>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <Panel key={it.name} className="p-4" accent={g.color}>
                      <h4 className="font-ui text-sm font-semibold uppercase tracking-[0.14em]">{it.name}</h4>
                      <p className="mt-1 text-sm text-steel">{it.blurb}</p>
                    </Panel>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Events() {
  const e = EVENT_FEATURED
  return (
    <section id="events" data-shot="events" className="section">
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center" data-reveal>
          <p className="kicker">Events & dynamic storytelling</p>
          <p className="mt-6 font-ui text-lg uppercase tracking-[0.2em] text-steel line-through decoration-sep/80 decoration-2 md:text-2xl">
            Join → get a rank → patrol → repeat
          </p>
          <h2 className="display metal-text text-glow mt-4 text-[clamp(2.4rem,7vw,5.6rem)] font-extrabold">The galaxy is constantly changing.</h2>
        </div>

        <Panel className="mx-auto mt-14 max-w-5xl overflow-hidden" accent="#ff5a4f">
          <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-sep/30 via-sep/10 to-transparent px-5 py-3 md:px-8">
            <span className="hud flex items-center gap-2 text-[0.64rem] text-sep">
              <span className="pulse-dot" /> {e.label} · Live
            </span>
            <span className="hud text-[0.6rem] text-steel">Priority transmission</span>
          </div>
          <div className="grid gap-8 p-5 md:grid-cols-[1.2fr_1fr] md:p-8">
            <div>
              <h3 className="display text-4xl font-extrabold md:text-6xl">{e.name}</h3>
              <p className="mt-4 border-l-2 border-sep pl-4 text-lg italic text-ink/90">&ldquo;{e.transmission}&rdquo;</p>
              <h4 className="hud mt-7 text-[0.6rem] text-steel">Objective</h4>
              <p className="mt-1 text-ink/85">{e.objective}</p>
              <h4 className="hud mt-6 text-[0.6rem] text-steel">Player involvement</h4>
              <p className="mt-1 text-sm text-ink/80">{e.involvement}</p>
              <h4 className="hud mt-6 text-[0.6rem] text-steel">Rewards</h4>
              <p className="mt-1 text-sm text-ink/80">{e.rewards}</p>
            </div>
            <div>
              <h4 className="hud text-[0.6rem] text-steel">Faction situation</h4>
              <div className="mt-3 flex h-3 overflow-hidden">
                {e.situation.map((s) => (
                  <div key={s.side} style={{ width: `${s.strength}%`, background: s.color, boxShadow: `0 0 16px ${s.color}` }} />
                ))}
              </div>
              <div className="mt-2 flex justify-between">
                {e.situation.map((s) => (
                  <span key={s.side} className="hud text-[0.6rem]" style={{ color: s.color }}>
                    {s.side} {s.strength}%
                  </span>
                ))}
              </div>
              <h4 className="hud mt-8 text-[0.6rem] text-steel">Outcome</h4>
              <div className="mt-3 space-y-3">
                {e.outcomes.map((o, i) => (
                  <div key={o.if} className="border border-white/10 bg-black/25 p-4" style={{ borderLeft: `2px solid ${i ? '#5cc8ff' : '#ff5a4f'}` }}>
                    <p className="font-ui text-sm font-semibold uppercase tracking-[0.12em]">{o.if}</p>
                    <p className="mt-1 text-sm text-steel">{o.then}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <p className="display text-glow mx-auto mt-14 max-w-4xl text-center text-[clamp(1.8rem,4.5vw,3.4rem)] font-extrabold text-gold" data-reveal>
          The outcome is decided by the players.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-center text-steel" data-reveal>
          If the Republic loses, the galaxy changes. If the Republic wins, the story changes.
        </p>
      </div>
    </section>
  )
}
