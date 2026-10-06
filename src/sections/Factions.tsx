import { useRef, useState, type MouseEvent } from 'react'
import { BATTALIONS, FACTIONS, type Faction } from '../content/factions'
import { Check } from '../components/Icons'
import { Chip, Panel, SectionHeader } from '../components/ui'

function FactionCard({ f, active, onSelect }: { f: Faction; active: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(0)`
  }
  const reset = () => ref.current && (ref.current.style.transform = '')
  return (
    <button
      ref={ref}
      onClick={onSelect}
      onMouseMove={onMove}
      onMouseLeave={reset}
      aria-pressed={active}
      className={`holo tilt group relative w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden p-5 text-left md:w-auto md:max-w-none ${
        active ? 'ring-1' : 'opacity-75 hover:opacity-100'
      }`}
      style={{ ['--accent' as string]: f.color, boxShadow: active ? `0 0 40px ${f.glow}` : undefined, ['--tw-ring-color' as string]: f.color }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: f.color }} />
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
        style={{ background: f.color }}
      />
      <p className="hud text-[0.6rem]" style={{ color: f.color }}>
        Faction
      </p>
      <h3 className="display mt-2 text-2xl font-bold text-ink">{f.name}</h3>
      <p className="mt-1 text-sm italic text-steel">&ldquo;{f.tagline}&rdquo;</p>
      <ul className="mt-4 space-y-1.5">
        {f.units.map((u) => (
          <li key={u} className="flex items-center gap-2 text-sm text-ink/80">
            <span className="h-1 w-3" style={{ background: f.color }} />
            {u}
          </li>
        ))}
      </ul>
    </button>
  )
}

export function Factions() {
  const [id, setId] = useState(FACTIONS[0].id)
  const f = FACTIONS.find((x) => x.id === id)!
  return (
    <section id="factions" data-shot="factions" className="section">
      <div className="container-x">
        <SectionHeader
          kicker="Factions"
          title="Choose your allegiance"
          sub="Four paths through the Clone Wars. Every faction has a place in the story, real gameplay, and a way to rise."
        />

        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
          {FACTIONS.map((x) => (
            <FactionCard key={x.id} f={x} active={x.id === id} onSelect={() => setId(x.id)} />
          ))}
        </div>

        <Panel className="mt-6 overflow-hidden" accent={f.color} key={f.id}>
          <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
          <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="hud text-[0.62rem]" style={{ color: f.color }}>
                Faction dossier
              </p>
              <h3 className="display mt-2 text-3xl font-bold md:text-4xl">{f.name}</h3>
              <p className="mt-4 leading-relaxed text-ink/85">{f.description}</p>
              <h4 className="hud mt-6 text-[0.62rem] text-steel">Role within the galaxy</h4>
              <p className="mt-2 text-sm text-ink/80">{f.role}</p>
              {f.id === 'republic' && (
                <div className="mt-6">
                  <h4 className="hud text-[0.62rem] text-steel">Battalions</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {BATTALIONS.map((b) => (
                      <Chip key={b.name} color={b.color}>
                        {b.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="hud text-[0.62rem] text-steel">Gameplay opportunities</h4>
              <ul className="mt-3 space-y-3">
                {f.gameplay.map((g) => (
                  <li key={g} className="flex gap-3 text-sm text-ink/85">
                    <Check className="mt-0.5 shrink-0" style={{ color: f.color }} />
                    {g}
                  </li>
                ))}
              </ul>
              <h4 className="hud mt-7 text-[0.62rem] text-steel">How to join</h4>
              <p className="mt-2 text-sm text-ink/80">{f.howToJoin}</p>
            </div>

            <div>
              <h4 className="hud text-[0.62rem] text-steel">Progression</h4>
              <p className="mt-2 text-sm text-ink/80">{f.progression}</p>
              <h4 className="hud mt-7 text-[0.62rem] text-steel">Rank structure</h4>
              <ol className="mt-3 space-y-1.5">
                {f.ranks.map((r, i) => (
                  <li key={r} className="flex items-center gap-3">
                    <span className="hud w-6 text-right text-[0.6rem] text-steel">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className="h-7 flex-1 px-3 font-ui text-xs font-semibold uppercase leading-7 tracking-[0.15em]"
                      style={{
                        background: `linear-gradient(90deg, ${f.color}${Math.round(20 + (i / f.ranks.length) * 60).toString(16)}, transparent)`,
                        borderLeft: `2px solid ${f.color}`,
                      }}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}
