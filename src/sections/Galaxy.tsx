import type { ReactNode } from 'react'
import { PLANETS, type Planet } from '../content/planets'
import { selectedPlanet, usePlanetId } from '../lib/hooks'
import { Panel, SectionHeader } from '../components/ui'

const STATUS_COLOR: Record<Planet['status'], string> = {
  Secure: '#5cc8ff',
  Contested: '#ffc457',
  'Under Siege': '#ff5a4f',
  Neutral: '#a9b6c8',
  Occupied: '#9b8cff',
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="hud text-[0.58rem] text-steel">{label}</h4>
      <div className="mt-1.5 text-sm text-ink/85">{children}</div>
    </div>
  )
}

export function Galaxy() {
  const id = usePlanetId()
  const p = PLANETS.find((x) => x.id === id) ?? PLANETS[0]
  const sc = STATUS_COLOR[p.status]
  return (
    <section id="galaxy" data-shot="galaxy" className="section">
      <div className="container-x">
        <SectionHeader
          kicker="The galaxy"
          title="A living galaxy at war"
          sub="Every world has its own situation, factions, and conflicts. What happens on one planet ripples across the map."
        />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[260px_minmax(0,520px)]">
          <div className="no-scrollbar -mx-4 flex min-w-0 gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0" role="tablist" aria-label="Planets">
            {PLANETS.map((x) => {
              const active = x.id === p.id
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectedPlanet.set(x.id)}
                  className={`flex shrink-0 items-center gap-3 border px-4 py-3 text-left transition ${
                    active ? 'border-holo/60 bg-holo/10' : 'border-white/10 bg-space/50 hover:border-white/30'
                  }`}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${x.colors[2]}, ${x.colors[1]} 45%, ${x.colors[0]})`, boxShadow: `0 0 12px ${x.atmosphere}66` }}
                  />
                  <span>
                    <span className="display block text-base font-bold">{x.name}</span>
                    <span className="hud block text-[0.55rem]" style={{ color: STATUS_COLOR[x.status] }}>
                      {x.status}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <Panel className="scanlines p-6 md:p-8" accent={sc} key={p.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="hud text-[0.6rem] text-steel">{p.region}</p>
              <span className="hud flex items-center gap-2 text-[0.6rem]" style={{ color: sc }}>
                <span className="pulse-dot" /> {p.status}
              </span>
            </div>
            <h3 className="display metal-text mt-2 break-words text-4xl font-extrabold sm:text-5xl md:text-6xl">{p.name}</h3>
            <p className="mt-3 text-ink/85">{p.description}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Current situation">{p.situation}</Field>
              <Field label="Current conflict">{p.conflict}</Field>
              <Field label="Factions present">{p.factions.join(' · ')}</Field>
              <Field label="Available roles">{p.roles.join(' · ')}</Field>
              <Field label="Important locations">
                <ul className="flex flex-wrap gap-1.5">
                  {p.locations.map((l) => (
                    <li key={l} className="border border-white/10 px-2 py-0.5 text-xs">
                      {l}
                    </li>
                  ))}
                </ul>
              </Field>
              <Field label="Active event">
                <span style={{ color: sc }}>{p.event}</span>
              </Field>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  )
}
