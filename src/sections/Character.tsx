import { useState } from 'react'
import { CHARACTER_ROLES, CHARACTER_SYSTEMS, PROGRESSION } from '../content/content'
import { BATTALIONS } from '../content/factions'
import { holoColor, useHoloColor } from '../lib/hooks'
import { Panel, SectionHeader } from '../components/ui'

const SPECS = ['Rifleman', ...PROGRESSION.specialists]

function CharacterCreator() {
  const color = useHoloColor()
  const [spec, setSpec] = useState('Medic')
  const [name, setName] = useState('Rook')
  const battalion = BATTALIONS.find((b) => b.color === color)
  return (
    <Panel className="scanlines p-5 md:p-6" accent={color}>
      <div className="flex items-center justify-between">
        <p className="hud text-[0.62rem]" style={{ color }}>
          Character creation · preview
        </p>
        <span className="hud text-[0.58rem] text-steel">Concept UI</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="hud text-[0.58rem] text-steel">Designation</span>
          <div className="mt-1 border border-white/10 bg-black/30 px-3 py-2 font-ui text-sm tracking-widest">CT-7741</div>
        </label>
        <label className="block">
          <span className="hud text-[0.58rem] text-steel">Callsign</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 16))}
            className="mt-1 w-full border border-white/10 bg-black/30 px-3 py-2 font-ui text-sm tracking-widest text-ink outline-none focus:border-holo"
          />
        </label>
      </div>
      <p className="hud mt-5 text-[0.58rem] text-steel">Battalion markings</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {BATTALIONS.map((b) => (
          <button
            key={b.name}
            onClick={() => holoColor.set(b.color)}
            aria-pressed={b.color === color}
            className={`hud flex items-center gap-2 border px-2.5 py-1.5 text-[0.6rem] transition ${
              b.color === color ? 'border-white/60 bg-white/10 text-ink' : 'border-white/10 text-steel hover:border-white/30'
            }`}
          >
            <span className="h-2.5 w-2.5" style={{ background: b.color }} />
            {b.name}
          </button>
        ))}
      </div>
      <p className="hud mt-5 text-[0.58rem] text-steel">Specialization</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SPECS.map((s) => (
          <button
            key={s}
            onClick={() => setSpec(s)}
            aria-pressed={s === spec}
            className={`hud border px-2.5 py-1.5 text-[0.6rem] transition ${s === spec ? 'border-holo bg-holo/15 text-holo' : 'border-white/10 text-steel hover:border-white/30'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="display text-xl font-bold">
          &ldquo;{name || 'Unnamed'}&rdquo; <span className="text-steel">·</span> <span style={{ color }}>{battalion?.name ?? 'Republic'}</span>
        </p>
        <p className="hud mt-1 text-[0.6rem] text-steel">
          {spec} · Clone Trooper · Service record: 0 deployments
        </p>
      </div>
    </Panel>
  )
}

export function Character() {
  return (
    <section id="character" data-shot="character" className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <SectionHeader
            kicker="Your character, your story"
            title="You're not just another player."
            sub="You're a character in a living galaxy. No anonymous soldiers here: a name, a face under the helmet, a history, and a story only you can write."
          />
          <CharacterCreator />
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTER_ROLES.map((r) => (
            <Panel key={r.name} className="p-4">
              <p className="hud text-[0.58rem] text-holo">Become</p>
              <h3 className="display mt-1 text-lg font-bold">{r.name}</h3>
              <p className="mt-1 text-sm text-steel">{r.note}</p>
            </Panel>
          ))}
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTER_SYSTEMS.map((s, i) => (
            <div key={s.title} className="border-t border-holo/25 pt-4" data-reveal>
              <span className="hud text-[0.6rem] text-holo">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1 font-ui text-base font-semibold uppercase tracking-[0.12em]">{s.title}</h3>
              <p className="mt-1 text-sm text-steel">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Node({ label, gold, small }: { label: string; gold?: boolean; small?: boolean }) {
  return (
    <div
      className={`holo relative z-10 text-center ${small ? 'px-3 py-2' : 'px-5 py-4'}`}
      style={{ ['--accent' as string]: gold ? '#ffc457' : '#5cc8ff' }}
    >
      <span className={`display font-bold ${small ? 'text-sm' : 'text-lg md:text-xl'} ${gold ? 'text-gold' : 'text-ink'}`}>{label}</span>
    </div>
  )
}

export function Progression() {
  const [recruit, trooper, , sergeant, command] = PROGRESSION.steps
  return (
    <section id="progression" data-shot="progression" className="section">
      <div className="container-x">
        <div className="ml-auto max-w-3xl">
          <SectionHeader
            kicker="Progression"
            title="Earned, not ground out"
            sub="Rise through roleplay, leadership, participation, and experience. Not by watching an XP bar fill. The exact path will evolve as the server grows."
          />
          <Panel className="grid-bg p-6 md:p-10">
            <div className="flex flex-col items-center gap-0">
              <Node label={recruit} />
              <span className="prog-line h-8 w-px bg-holo/60" />
              <Node label={trooper} />
              <span className="prog-line h-8 w-px bg-holo/60" />
              <div className="relative w-full">
                <p className="hud mb-3 text-center text-[0.6rem] text-holo">Specialist</p>
                <div className="absolute left-[12.5%] right-[12.5%] top-[2.2rem] h-px bg-holo/60" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PROGRESSION.specialists.map((s) => (
                    <div key={s} className="flex flex-col items-center">
                      <span className="h-4 w-px bg-holo/60" />
                      <Node label={s} small />
                    </div>
                  ))}
                </div>
              </div>
              <span className="prog-line mt-3 h-8 w-px bg-holo/60" />
              <Node label={sergeant} />
              <span className="prog-line h-8 w-px bg-gold/60" />
              <Node label={command} gold />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-6">
              <span className="hud text-[0.6rem] text-steel">Earned through</span>
              {PROGRESSION.earnedBy.map((e) => (
                <span key={e} className="hud border border-holo/40 bg-holo/10 px-3 py-1 text-[0.62rem] text-holo">
                  {e}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </section>
  )
}
