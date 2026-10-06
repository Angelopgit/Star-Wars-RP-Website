import { useState } from 'react'
import { MEDIA, MEDIA_CATEGORIES, NEWS, ROADMAP, type MediaCategory } from '../content/content'
import { Arrow } from '../components/Icons'
import { MediaSlot, Panel, SectionHeader } from '../components/ui'

const STATUS: Record<string, string> = { 'In Progress': '#5cc8ff', Next: '#ffc457', Planned: '#a9b6c8' }

export function Roadmap() {
  return (
    <section id="roadmap" data-shot="roadmap" className="section">
      <div className="container-x">
        <SectionHeader
          kicker="Development roadmap"
          title="The campaign ahead"
          sub="Where the project is today and where it is going. Phases will grow as development moves forward."
        />
        <div className="relative">
          {/* timeline spine */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-0 md:top-[34px] md:h-px md:w-full" />
          <div className="roadmap-progress absolute left-4 top-0 h-1/3 w-px bg-holo shadow-[0_0_12px_#5cc8ff] md:left-0 md:top-[34px] md:h-px md:w-1/3" />
          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {ROADMAP.map((r, i) => {
              const c = STATUS[r.status]
              return (
                <div key={r.phase} className="relative pl-12 md:pl-0 md:pt-16" data-reveal>
                  <span
                    className="absolute left-[9px] top-2 h-3 w-3 rotate-45 md:left-0 md:top-[29px]"
                    style={{ background: c, boxShadow: `0 0 14px ${c}` }}
                  />
                  <Panel className="p-6" accent={c}>
                    <div className="flex items-center justify-between">
                      <span className="hud text-[0.62rem]" style={{ color: c }}>
                        {r.phase}
                      </span>
                      <span className="hud flex items-center gap-2 text-[0.58rem]" style={{ color: c }}>
                        {r.status === 'In Progress' && <span className="pulse-dot" />}
                        {r.status}
                      </span>
                    </div>
                    <h3 className="display mt-2 text-3xl font-extrabold">{r.title}</h3>
                    <span className="display pointer-events-none absolute bottom-2 right-4 text-7xl font-extrabold text-white/[0.04]">
                      {['I', 'II', 'III'][i]}
                    </span>
                    <ul className="mt-5 space-y-2">
                      {r.items.map((it) => (
                        <li key={it} className="flex items-center gap-3 text-sm text-ink/85">
                          <span className="h-px w-4" style={{ background: c }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Media() {
  const [cat, setCat] = useState<MediaCategory>('All')
  const items = cat === 'All' ? MEDIA : MEDIA.filter((m) => m.category === cat)
  return (
    <section id="media" data-shot="media" className="section">
      <div className="container-x">
        <SectionHeader kicker="Media" title="From the front lines" sub="Screenshots, clips, and concept art from development. Real footage drops here as the build comes together." />
        <div className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Media categories">
          {MEDIA_CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={c === cat}
              onClick={() => setCat(c)}
              className={`hud shrink-0 border px-4 py-2 text-[0.64rem] transition ${
                c === cat ? 'border-holo bg-holo/15 text-holo' : 'border-white/10 bg-space/50 text-steel hover:border-white/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid auto-rows-[200px] grid-cols-1 gap-3 sm:grid-cols-2 md:auto-rows-[220px] lg:grid-cols-3">
          {items.map((m, i) => (
            <div
              key={m.title}
              className={`group relative overflow-hidden border border-white/10 ${i === 0 && cat === 'All' ? 'sm:col-span-2 sm:row-span-2' : ''}`}
            >
              <div className="h-full w-full transition duration-700 group-hover:scale-105">
                <MediaSlot hue={m.hue} label={m.title} video={m.video} src={m.src} />
              </div>
              <span className="hud absolute right-3 top-3 bg-black/50 px-2 py-1 text-[0.56rem] text-ink/80 backdrop-blur">{m.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function News() {
  const [lead, ...rest] = NEWS
  return (
    <section id="news" data-shot="news" className="section">
      <div className="container-x">
        <SectionHeader kicker="Development news" title="Dispatches" sub="Dev updates, reveals, and diaries. A reason to check back every week." />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[1.3fr_2fr]">
          <Panel className="flex flex-col overflow-hidden">
            <div className="aspect-video">
              <MediaSlot hue={210} label="Clone armor system" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="hud text-[0.6rem] text-holo">
                {lead.tag} · {lead.date}
              </span>
              <h3 className="display mt-2 text-3xl font-extrabold">{lead.title}</h3>
              <p className="mt-2 flex-1 text-steel">{lead.excerpt}</p>
              <span className="hud mt-5 flex items-center gap-2 text-[0.64rem] text-holo">
                Read the update <Arrow width={14} height={14} />
              </span>
            </div>
          </Panel>
          <div className="no-scrollbar -mx-4 flex min-w-0 snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
            {rest.map((n) => (
              <Panel key={n.title} className="w-[75vw] max-w-[300px] shrink-0 snap-start p-5 transition hover:-translate-y-1 sm:w-auto sm:max-w-none">
                <span className="hud text-[0.58rem] text-holo">
                  {n.tag} · {n.date}
                </span>
                <h3 className="mt-2 font-ui text-base font-semibold uppercase tracking-[0.1em]">{n.title}</h3>
                <p className="mt-1 text-sm text-steel">{n.excerpt}</p>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
