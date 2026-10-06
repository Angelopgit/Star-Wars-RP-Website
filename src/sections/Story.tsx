import { useState } from 'react'
import { CHARACTER_ROLES, CHARACTER_SYSTEMS, PROGRESSION } from '../content/content'
import { BATTALIONS } from '../content/factions'
import { holoColor, useHoloColor } from '../lib/hooks'
import { ActHeader, Data, Frame, Panel } from '../components/ui'

const SPECS = ['Rifleman', ...PROGRESSION.specialists]

function CharacterSheet() {
  const color = useHoloColor()
  const [spec, setSpec] = useState('Medic')
  const [name, setName] = useState('Rook')
  const battalion = BATTALIONS.find((b) => b.color === color)
  return (
    <Panel tick className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <Data k="Service record" v="Preview" />
        <Data k="ID" v="CT-7741" />
      </div>
      <label className="mt-7 block">
        <span className="label">Callsign</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
          className="display mt-2 w-full border-b border-line bg-transparent pb-2 text-3xl text-ink outline-none focus:border-blue"
        />
      </label>
      <p className="label mt-7">Battalion</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {BATTALIONS.map((b) => (
          <button
            key={b.name}
            onClick={() => holoColor.set(b.color)}
            aria-pressed={b.color === color}
            className={`label flex items-center gap-2 border-b pb-1 transition ${b.color === color ? 'border-ink text-ink' : 'border-transparent text-steel hover:text-ink'}`}
          >
            <span className="h-2 w-2" style={{ background: b.color }} />
            {b.name}
          </button>
        ))}
      </div>
      <p className="label mt-7">Specialization</p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {SPECS.map((s) => (
          <button
            key={s}
            onClick={() => setSpec(s)}
            aria-pressed={s === spec}
            className={`label border-b pb-1 transition ${s === spec ? 'border-blue text-blue' : 'border-transparent text-steel hover:text-ink'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-8 border-t border-line pt-5">
        <p className="display text-xl text-ink">
          &ldquo;{name || 'Unnamed'}&rdquo; <span className="text-steel">/</span> {battalion?.name ?? 'Republic'} <span className="text-steel">/</span> {spec}
        </p>
        <p className="label mt-2">Clone Trooper // 0 deployments // Progression earned in the field</p>
      </div>
    </Panel>
  )
}

export function Story() {
  const [recruit, trooper, , sergeant, command] = PROGRESSION.steps
  return (
    <section id="character" className="act pt-32 md:pt-48">
      <div className="pointer-events-none absolute inset-0 scrim-r hidden md:block" />
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-8">
            <ActHeader
              number="04"
              label="Your story"
              title="You are not another player. You are a character in a living galaxy."
              lede="A name, a face under the helmet, a history. No anonymous soldiers. Your record follows you from your first briefing to your last."
            />
            <div className="mt-10">
              <CharacterSheet />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:pt-40">
            <Frame label="Clone trooper, forward position" caption="Concept frame" hue={30} className="aspect-[3/4] max-h-[640px]" />
          </div>
        </div>

        {/* Who you can become + systems */}
        <div className="mt-28 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="label">Become</p>
            <ul className="mt-4 divide-y divide-line">
              {CHARACTER_ROLES.map((r) => (
                <li key={r.name} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="display text-xl text-ink">{r.name}</span>
                  <span className="label hidden text-right text-[0.56rem] normal-case tracking-normal sm:block">{r.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6" data-reveal>
            <p className="label">Systems</p>
            <div className="mt-4 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {CHARACTER_SYSTEMS.map((s, i) => (
                <div key={s.title} className="border-t border-line pt-3">
                  <Data k={String(i + 1).padStart(2, '0')} v={s.title} />
                  <p className="body-copy mt-2">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progression */}
        <div id="progression" className="mt-28 grid gap-12 scroll-mt-20 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="label">Progression</p>
            <h3 className="display title-glow mt-5 text-[clamp(2rem,4.2vw,3.4rem)] text-ink">Earned in the field. Not ground out.</h3>
            <p className="body-copy mt-5">Rise through roleplay, leadership, participation, and experience, not an experience bar. The exact path will evolve with the server.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {PROGRESSION.earnedBy.map((e) => (
                <Data key={e} k="Earned by" v={e} />
              ))}
            </div>
          </div>
          <ol className="relative lg:col-span-6 lg:col-start-7" data-reveal>
            <span className="absolute bottom-3 left-[3px] top-3 w-px bg-line" />
            {[recruit, trooper, 'Specialist', sergeant, command].map((step, i) => (
              <li key={step} className="relative grid grid-cols-[2rem_1fr] gap-4 py-4">
                <span className={`mt-2 h-[7px] w-[7px] ${i === 4 ? 'bg-blue' : 'bg-ink'}`} />
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="label text-steel/60">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`display text-2xl ${i === 4 ? 'text-blue' : 'text-ink'}`}>{step}</span>
                  </div>
                  {step === 'Specialist' && (
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 pl-10">
                      {PROGRESSION.specialists.map((s) => (
                        <span key={s} className="display-light text-[0.85rem] text-ink/70">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
