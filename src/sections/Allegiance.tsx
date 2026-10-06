import { useState } from 'react'
import { BATTALIONS, FACTIONS } from '../content/factions'
import { ActHeader, Data, Panel } from '../components/ui'

const HUES: Record<string, number> = { republic: 208, separatist: 8, neutral: 36, specops: 250 }

export function Allegiance() {
  const [id, setId] = useState(FACTIONS[0].id)
  const f = FACTIONS.find((x) => x.id === id)!
  return (
    <section id="factions" className="act pt-32 md:pt-48">
      <div className="container-x">
        <ActHeader number="02" label="Choose your allegiance" title="Choose your allegiance. Earn your place. Shape the war." lede="Four paths through the Clone Wars. Each has a role in the story, real gameplay, and a way to rise." />

        {/* Large faction cards */}
        <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4" role="tablist" aria-label="Factions">
          {FACTIONS.map((x, i) => {
            const active = x.id === id
            return (
              <button
                key={x.id}
                role="tab"
                aria-selected={active}
                onClick={() => setId(x.id)}
                className={`group relative flex min-h-[320px] flex-col justify-end overflow-hidden p-7 text-left transition md:min-h-[420px] ${
                  active ? 'bg-panel/90' : 'bg-space/80 hover:bg-deep/90'
                }`}
              >
                <div
                  className="frame-slot absolute inset-0 opacity-70 transition duration-700 group-hover:opacity-100"
                  style={{ '--h': HUES[x.id] } as React.CSSProperties}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space via-space/70 to-space/10" />
                <div className="absolute inset-x-0 top-0 h-px transition" style={{ background: active ? x.color : 'transparent' }} />
                <div className="relative">
                  <Data k={`0${i + 1}`} v="Faction" />
                  <h3 className="display mt-4 text-[2rem] leading-[0.95] text-ink">{x.name}</h3>
                  <p className="display-light mt-3 text-[0.8rem] text-steel">{x.tagline}</p>
                  <ul className="mt-5 space-y-1.5">
                    {x.units.map((u) => (
                      <li key={u} className="text-[0.9rem] text-ink/75">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            )
          })}
        </div>

        {/* Dossier */}
        <Panel key={f.id} tick className="mt-6 grid gap-10 p-7 md:p-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Data k="Dossier" v={f.name} />
            <h3 className="display mt-5 text-4xl text-ink">{f.name}</h3>
            <p className="body-copy mt-5">{f.description}</p>
            <p className="label mt-7">Role within the galaxy</p>
            <p className="body-copy mt-2">{f.role}</p>
            {f.id === 'republic' && (
              <div className="mt-7">
                <p className="label">Battalions</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {BATTALIONS.map((b) => (
                    <span key={b.name} className="label flex items-center gap-2 text-ink/80">
                      <span className="h-2 w-2" style={{ background: b.color }} />
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <p className="label">Gameplay</p>
            <ul className="mt-3 divide-y divide-line">
              {f.gameplay.map((g) => (
                <li key={g} className="py-3 text-[0.95rem] text-ink/85">
                  {g}
                </li>
              ))}
            </ul>
            <p className="label mt-8">How to join</p>
            <p className="body-copy mt-2">{f.howToJoin}</p>
          </div>
          <div className="lg:col-span-4">
            <p className="label">Progression</p>
            <p className="body-copy mt-2">{f.progression}</p>
            <p className="label mt-8">Rank structure</p>
            <ol className="mt-3">
              {f.ranks.map((r, i) => (
                <li key={r} className="flex items-center gap-4 border-b border-line py-2">
                  <span className="label w-6 text-steel/60">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display-light text-[0.9rem] text-ink/90">{r}</span>
                  <span className="ml-auto h-px" style={{ width: `${20 + (i / f.ranks.length) * 60}px`, background: f.color }} />
                </li>
              ))}
            </ol>
          </div>
        </Panel>
      </div>
    </section>
  )
}
