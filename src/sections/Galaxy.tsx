import type { ReactNode } from 'react'
import { PLANETS, type Planet } from '../content/planets'
import { selectedPlanet, usePlanetId } from '../lib/hooks'
import { ActHeader, Data, Panel } from '../components/ui'
import { Backdrop } from '../components/Backdrop'

const STATUS_COLOR: Record<Planet['status'], string> = {
  Secure: '#4ba9d8',
  Contested: '#d8b05a',
  'Under Siege': '#c9363e',
  Neutral: '#7c8996',
  Occupied: '#9a8cd8',
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="label">{label}</p>
      <div className="mt-1.5 text-[0.95rem] text-ink/85">{children}</div>
    </div>
  )
}

export function Galaxy() {
  const id = usePlanetId()
  const p = PLANETS.find((x) => x.id === id) ?? PLANETS[0]
  const sc = STATUS_COLOR[p.status]
  return (
    <section id="galaxy" className="act min-h-[100svh] overflow-hidden pt-32 md:pt-48">
      <Backdrop name="galaxy" position="70% 45%" opacity={0.5} className="hidden md:block" />
      <div className="pointer-events-none absolute inset-0 scrim-l hidden md:block" />
      <div className="container-x relative">
        <ActHeader number="03" label="A living galaxy" title="A galaxy at war. Every world has a situation." lede="What happens on one planet ripples across the map. Select a world to see its current state." />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="no-scrollbar -mx-5 flex min-w-0 gap-px overflow-x-auto px-5 lg:col-span-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0" role="tablist" aria-label="Planets">
            {PLANETS.map((x) => {
              const active = x.id === p.id
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectedPlanet.set(x.id)}
                  className={`flex shrink-0 items-center justify-between gap-4 border-l px-4 py-3 text-left transition lg:w-full ${
                    active ? 'border-blue bg-panel/80' : 'border-line bg-space/60 hover:bg-deep/80'
                  }`}
                >
                  <span className="display text-xl text-ink">{x.name}</span>
                  <span className="label text-[0.56rem]" style={{ color: STATUS_COLOR[x.status] }}>
                    {x.status}
                  </span>
                </button>
              )
            })}
          </div>

          <Panel key={p.id} tick className="p-7 md:p-9 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Data k="Sector" v={p.region} />
              <p className="label flex items-center gap-2" style={{ color: sc }}>
                <span className="status-dot" /> {p.status}
              </p>
            </div>
            <h3 className="display title-glow mt-5 break-words text-[clamp(2.4rem,5vw,4.2rem)] text-ink">{p.name}</h3>
            <p className="lede mt-4">{p.description}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <Field label="Current situation">{p.situation}</Field>
              <Field label="Current conflict">{p.conflict}</Field>
              <Field label="Factions present">{p.factions.join(' · ')}</Field>
              <Field label="Available roles">{p.roles.join(' · ')}</Field>
              <Field label="Key locations">{p.locations.join(' · ')}</Field>
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
