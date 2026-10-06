import { ABOUT_POINTS, FEATURES, WHY_US } from '../content/content'
import { SITE } from '../content/site'
import { ActHeader, Data, Frame, TextLink } from '../components/ui'

const DEPLOYMENT = [
  'Muster aboard a Republic Venator.',
  'Receive the deployment briefing.',
  'Land planetside with your squad.',
  'Hold the line against the Separatist advance.',
  'Return. Progress. Carry the story into the next campaign.',
]

export function Project() {
  return (
    <section id="about" className="act pt-28 md:pt-44">
      <div className="pointer-events-none absolute inset-0 scrim-r hidden md:block" />
      <div className="container-x relative">
        {/* Priority broadcast */}
        <div className="max-w-4xl" data-reveal>
          <p className="label">
            <span className="label-blue">Priority broadcast</span> // Republic High Command
          </p>
          <p className="display title-glow mt-6 text-[clamp(2.8rem,7vw,6.4rem)] text-ink">The Republic needs you.</p>
        </div>

        {/* 01 — editorial */}
        <div className="mt-28 grid gap-14 md:mt-44 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ActHeader
              number="01"
              label="The Project"
              title="The roleplay you remember. Rebuilt for a new engine."
              lede={
                <>
                  A persistent Clone Wars roleplay server for S&amp;box, created and operated by {SITE.community}. It takes the foundation players loved from
                  Garry&rsquo;s Mod Star Wars RP and evolves it on a modern platform.
                </>
              }
            />
            <div className="mt-10 space-y-6 border-l border-line pl-6" data-reveal>
              {ABOUT_POINTS.map((p) => (
                <div key={p.title}>
                  <p className="label">{p.title}</p>
                  <p className="body-copy mt-1.5">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-32">
            <Frame label="Republic fleet, high orbit" caption="Concept frame" hue={212} className="aspect-[4/3]" />
            <div className="mt-8 border-t border-line pt-6" data-reveal>
              <p className="label">Deployment sequence</p>
              <ol className="mt-4 space-y-3">
                {DEPLOYMENT.map((d, i) => (
                  <li key={d} className="flex gap-5">
                    <span className="label label-blue w-6 shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display-light text-[1.05rem] text-ink/85">{d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Features — editorial columns, not cards */}
        <div id="features" className="mt-32 scroll-mt-20 md:mt-48">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
            <h3 className="display title-glow text-[clamp(2rem,4.2vw,3.4rem)] text-ink">Built for a living galaxy.</h3>
            <p className="body-copy max-w-sm">Combat with weight, roleplay systems that stay out of the way, and an engine underneath that can carry both.</p>
          </div>
          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {FEATURES.map((g, gi) => (
              <div key={g.id} className="bg-space/80 p-7 backdrop-blur md:p-9" data-reveal>
                <Data k={`0${gi + 1}`} v={g.title} />
                <p className="display mt-4 text-2xl text-ink">{g.kicker}</p>
                <ul className="mt-6 space-y-3">
                  {g.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                      <span className="text-[0.95rem] text-ink/90">{it.name}</span>
                      <span className="label hidden text-right text-[0.56rem] normal-case tracking-normal text-steel sm:block">{it.blurb}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <Frame label="Blaster engagement, Christophsis" caption="Gameplay capture" hue={14} video className="aspect-video" />
            <Frame label="Temple training hall" caption="Gameplay capture" hue={205} className="aspect-video md:aspect-auto" />
          </div>
        </div>

        {/* Why us — a manifesto list */}
        <div className="mt-32 grid gap-12 md:mt-48 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="label">Why here</p>
            <h3 className="display title-glow mt-5 text-[clamp(2rem,4.2vw,3.4rem)] text-ink">Why this server, not another.</h3>
            <div className="mt-8">
              <TextLink href="#how-to-play">Report for duty</TextLink>
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6" data-reveal>
            {WHY_US.map((w, i) => (
              <li key={w.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6 last:border-b md:grid-cols-[4rem_1fr_1.4fr] md:items-baseline">
                <span className="label label-blue">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-2xl text-ink">{w.title}</span>
                <span className="body-copy col-start-2 md:col-start-3">{w.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
