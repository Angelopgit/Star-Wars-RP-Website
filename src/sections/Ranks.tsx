import { useState } from 'react'
import { COMMUNITY, HOW_TO_PLAY, MEDIA, MEDIA_CATEGORIES, NEWS, PHILOSOPHY, ROADMAP, type MediaCategory } from '../content/content'
import { DISCLAIMER_FULL, NAV, SITE } from '../content/site'
import { Emblem } from '../components/Icons'
import { ActHeader, Data, DiscordButton, Frame, Panel, PlayButton, TextLink } from '../components/ui'
import { Backdrop } from '../components/Backdrop'

export function Ranks() {
  const [cat, setCat] = useState<MediaCategory>('All')
  const media = cat === 'All' ? MEDIA : MEDIA.filter((m) => m.category === cat)
  const [lead, ...rest] = NEWS
  return (
    <section id="community" className="act pt-32 md:pt-48">
      <div className="pointer-events-none absolute inset-0 scrim-r hidden md:block" />
      <div className="container-x relative">
        <ActHeader number="06" label="Join the ranks" title="Not a server. A community." lede="Meet the players. Follow development. Apply for factions. Everything runs through the Squad Gaming Community Discord." />

        {/* How to play */}
        <div id="how-to-play" className="mt-14 grid gap-12 scroll-mt-20 lg:grid-cols-12">
          <ol className="lg:col-span-7" data-reveal>
            {HOW_TO_PLAY.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-5 last:border-b md:grid-cols-[4rem_1fr_1.2fr] md:items-baseline">
                <span className="label label-blue">{String(i + 1).padStart(2, '0')}</span>
                <span className="display text-2xl text-ink">{s.title}</span>
                <span className="body-copy col-start-2 md:col-start-3">{s.body}</span>
              </li>
            ))}
          </ol>
          <Panel tick className="flex flex-col justify-between p-7 lg:col-span-4 lg:col-start-9">
            <div>
              <Data k="Enlistment" v="Open" />
              <p className="display mt-5 text-3xl text-ink">Report for your first briefing.</p>
              <p className="body-copy mt-3">The Discord carries applications, events, development updates, and the people behind the project.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <DiscordButton label="Join Discord" />
              <PlayButton />
              <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className="label text-center text-[0.58rem] text-steel hover:text-ink">
                Server not live yet? Launch news arrives on Discord first.
              </a>
            </div>
          </Panel>
        </div>

        {/* Community + standing orders */}
        <div id="orders" className="mt-28 grid gap-12 scroll-mt-20 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="label">Inside the community</p>
            <ul className="mt-4 divide-y divide-line">
              {COMMUNITY.filter((c) => c.icon !== 'discord').map((c) => (
                <li key={c.title} className="py-3">
                  <span className="display text-xl text-ink">{c.title}</span>
                  <p className="body-copy mt-0.5 text-[0.9rem]">{c.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <p className="label">Standing orders</p>
            <p className="display mt-4 text-2xl text-ink">The kind of community you are joining.</p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <Data k="We value" v="" />
                <ul className="mt-2 divide-y divide-line">
                  {PHILOSOPHY.value.map((v) => (
                    <li key={v} className="py-2 text-[0.95rem] text-ink/85">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Data k="We do not tolerate" v="" />
                <ul className="mt-2 divide-y divide-line">
                  {PHILOSOPHY.discourage.map((v) => (
                    <li key={v} className="py-2 text-[0.95rem] text-steel">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="label mt-6 text-[0.58rem]">Full server rules are posted on Discord before you join.</p>
          </div>
        </div>

        {/* Development: roadmap */}
        <div id="roadmap" className="mt-32 scroll-mt-20 md:mt-44">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <p className="label">Development</p>
              <h3 className="display title-glow mt-5 text-[clamp(2rem,4.2vw,3.4rem)] text-ink">The campaign ahead.</h3>
            </div>
            <p className="body-copy max-w-sm">Where the project stands today and where it goes next. Phases expand as development moves.</p>
          </div>
          <div className="relative mt-12">
            <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line md:block" />
            <span className="roadmap-progress absolute left-0 top-[5px] hidden h-px w-1/3 bg-blue md:block" />
            <div className="grid gap-10 md:grid-cols-3">
              {ROADMAP.map((r, i) => (
                <div key={r.phase} className="relative md:pt-8" data-reveal>
                  <span className={`absolute left-0 top-0 hidden h-[11px] w-[11px] md:block ${r.status === 'In Progress' ? 'bg-blue' : r.status === 'Next' ? 'bg-ink' : 'bg-steel/50'}`} />
                  <Data k={r.phase} v={r.status} />
                  <p className="display mt-3 text-3xl text-ink">{r.title}</p>
                  <ul className="mt-5 divide-y divide-line border-t border-line">
                    {r.items.map((it) => (
                      <li key={it} className="py-2 text-[0.95rem] text-ink/80">
                        {it}
                      </li>
                    ))}
                  </ul>
                  <span className="act-number absolute -right-2 -top-6 text-[5rem] md:top-0" aria-hidden>
                    {['I', 'II', 'III'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispatches */}
        <div id="news" className="mt-32 grid gap-10 scroll-mt-20 md:mt-44 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <p className="label">Dispatches</p>
            <Frame label="Clone armor system" caption="Dev update" hue={210} className="mt-5 aspect-[4/3]" />
            <Data k={lead.tag} v={lead.date} className="mt-5" />
            <p className="display mt-2 text-3xl text-ink">{lead.title}</p>
            <p className="body-copy mt-2">{lead.excerpt}</p>
            <div className="mt-4">
              <TextLink href="#news">Read the update</TextLink>
            </div>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7 lg:pt-10" data-reveal>
            {rest.map((n) => (
              <li key={n.title} className="grid gap-1 border-t border-line py-4 last:border-b sm:grid-cols-[9rem_1fr] sm:gap-6">
                <Data k={n.tag} v={n.date} />
                <div>
                  <p className="display text-xl text-ink">{n.title}</p>
                  <p className="body-copy mt-0.5 text-[0.9rem]">{n.excerpt}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Captures */}
        <div id="media" className="mt-32 scroll-mt-20 md:mt-44">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <p className="label">Captures</p>
              <h3 className="display title-glow mt-5 text-[clamp(2rem,4.2vw,3.4rem)] text-ink">From the front lines.</h3>
            </div>
            <div className="no-scrollbar -mx-5 flex gap-x-5 overflow-x-auto px-5 md:mx-0 md:px-0" role="tablist" aria-label="Capture categories">
              {MEDIA_CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={c === cat}
                  onClick={() => setCat(c)}
                  className={`label shrink-0 border-b pb-1 transition ${c === cat ? 'border-blue text-ink' : 'border-transparent text-steel hover:text-ink'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((m, i) => (
              <Frame
                key={m.title}
                label={m.title}
                caption={m.category}
                hue={m.hue}
                video={m.video}
                src={m.src}
                className={i === 0 && cat === 'All' ? 'sm:col-span-2 sm:row-span-2' : ''}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="act mt-32 overflow-hidden md:mt-48">
      <Backdrop name="wide" position="50% 30%" opacity={0.55} />
      <div className="pointer-events-none absolute inset-0 scrim-b" />
      <div className="container-x relative pb-28 pt-24 sm:pb-12">
        <div className="max-w-3xl" data-reveal>
          <p className="label">
            <span className="label-blue">Transmission ends</span> // Your squad is waiting
          </p>
          <p className="display title-glow mt-6 text-[clamp(2.8rem,7vw,6.4rem)] text-ink">The Republic needs you.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DiscordButton label="Join Discord" />
            <PlayButton />
          </div>
        </div>

        <div className="mt-24 grid gap-12 border-t border-line pt-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Emblem className="text-ink" />
              <span className="display text-[0.95rem] tracking-[0.18em] text-ink">Squad Gaming</span>
            </div>
            <p className="body-copy mt-4 max-w-xs text-[0.9rem]">
              Star Wars Roleplay for S&amp;box, created and operated by {SITE.community}. Built and designed by and for the community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:col-start-6 lg:grid-cols-5">
            {NAV.filter((g) => g.items).map((g) => (
              <div key={g.label}>
                <p className="label">{g.label}</p>
                <ul className="mt-3 space-y-2">
                  {g.items!.map((it) => (
                    <li key={it.label}>
                      <a href={it.href} className="text-[0.9rem] text-steel hover:text-ink">
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Panel solid className="mt-12 p-6">
          <p className="label">Unofficial fan project // Non-profit // Made for fun and entertainment</p>
          <p className="mt-3 text-xs leading-relaxed text-steel">{DISCLAIMER_FULL}</p>
        </Panel>
        <p className="label mt-6 text-[0.56rem] text-steel/60">
          © {new Date().getFullYear()} {SITE.community} // Fan website // Not an official Star Wars, Lucasfilm, Disney, or Facepunch product
        </p>
      </div>
    </footer>
  )
}
