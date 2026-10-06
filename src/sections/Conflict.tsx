import { EVENT_FEATURED } from '../content/content'
import { ActHeader, Data, Frame, Panel } from '../components/ui'
import { Backdrop } from '../components/Backdrop'

export function Conflict() {
  const e = EVENT_FEATURED
  return (
    <section id="events" className="act overflow-hidden pt-32 md:pt-48">
      <Backdrop name="fleet" position="50% 40%" opacity={0.6} />
      <div className="pointer-events-none absolute inset-0 scrim-l hidden md:block" />
      <div className="container-x relative">
        <ActHeader
          number="05"
          label="Galactic conflict"
          title="The galaxy is constantly changing."
          lede={
            <>
              Not <span className="text-steel line-through decoration-red/70">join, get a rank, patrol, repeat</span>. Campaigns with objectives, consequences, and
              outcomes decided by the players.
            </>
          }
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <Panel tick className="p-7 md:p-10 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="label flex items-center gap-2 text-red">
                <span className="status-dot" /> {e.label} // Live
              </p>
              <Data k="Priority" v="Flash" />
            </div>
            <h3 className="display title-glow mt-6 text-[clamp(2.4rem,5vw,4.4rem)] text-ink">{e.name}</h3>
            <p className="display-light mt-5 border-l border-red pl-5 text-[1rem] leading-relaxed text-ink/85">&ldquo;{e.transmission}&rdquo;</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-t border-line pt-3">
                <p className="label">Objective</p>
                <p className="body-copy mt-2">{e.objective}</p>
              </div>
              <div className="border-t border-line pt-3">
                <p className="label">Player involvement</p>
                <p className="body-copy mt-2">{e.involvement}</p>
              </div>
              <div className="border-t border-line pt-3 sm:col-span-2">
                <p className="label">Rewards</p>
                <p className="body-copy mt-2">{e.rewards}</p>
              </div>
            </div>
          </Panel>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Panel className="p-7">
              <p className="label">Faction situation</p>
              <div className="mt-4 flex h-1">
                {e.situation.map((s) => (
                  <div key={s.side} style={{ width: `${s.strength}%`, background: s.color === '#5cc8ff' ? '#4ba9d8' : '#c9363e' }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between">
                {e.situation.map((s) => (
                  <Data key={s.side} k={s.side} v={`${s.strength}%`} />
                ))}
              </div>
              <p className="label mt-8">Outcome</p>
              <div className="mt-3 divide-y divide-line">
                {e.outcomes.map((o) => (
                  <div key={o.if} className="py-4">
                    <p className="display text-lg text-ink">{o.if}</p>
                    <p className="body-copy mt-1">{o.then}</p>
                  </div>
                ))}
              </div>
            </Panel>
            <Frame label="Siege of Crystal City" caption="Event capture" hue={225} video className="aspect-video flex-1" />
          </div>
        </div>

        <p className="display title-glow mt-24 max-w-4xl text-[clamp(2rem,4.6vw,3.8rem)] text-ink" data-reveal>
          The outcome is decided by the players. <span className="text-steel">If the Republic loses, the galaxy changes. If it wins, the story does.</span>
        </p>
      </div>
    </section>
  )
}
