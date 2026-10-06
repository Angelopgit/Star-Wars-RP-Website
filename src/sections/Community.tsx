import type { ComponentType, SVGProps } from 'react'
import { COMMUNITY, PHILOSOPHY } from '../content/content'
import { SITE } from '../content/site'
import { Calendar, Camera, Check, Code, Cross, Discord, Medal, Spark, Users } from '../components/Icons'
import { DiscordButton, Panel, SectionHeader } from '../components/ui'

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  discord: Discord,
  staff: Users,
  events: Calendar,
  medal: Medal,
  camera: Camera,
  spark: Spark,
  code: Code,
}

export function Philosophy() {
  return (
    <section id="philosophy" data-shot="philosophy" className="section">
      <div className="container-x">
        <SectionHeader
          kicker="Roleplay philosophy"
          title="The community you're joining"
          sub="Good roleplay is about the people around you. This is what we stand for, and what we will not tolerate."
        />
        <div className="grid max-w-4xl gap-5 md:grid-cols-2">
          <Panel className="p-6 md:p-8" accent="#5cc8ff">
            <h3 className="display text-2xl font-bold text-holo">We value</h3>
            <ul className="mt-5 space-y-3">
              {PHILOSOPHY.value.map((v) => (
                <li key={v} className="flex items-start gap-3 text-ink/90">
                  <Check className="mt-0.5 shrink-0 text-holo" /> {v}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-6 md:p-8" accent="#ff5a4f">
            <h3 className="display text-2xl font-bold text-sep">We discourage</h3>
            <ul className="mt-5 space-y-3">
              {PHILOSOPHY.discourage.map((v) => (
                <li key={v} className="flex items-start gap-3 text-ink/90">
                  <Cross className="mt-0.5 shrink-0 text-sep" /> {v}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/10 pt-4 text-sm text-steel">Full server rules are posted in Discord before you join.</p>
          </Panel>
        </div>
      </div>
    </section>
  )
}

export function Community() {
  return (
    <section id="community" data-shot="community" className="section">
      <div className="container-x">
        <SectionHeader
          align="center"
          kicker="Community"
          title="Not just a server. A community."
          sub="Meet the players. Follow development. Apply for factions."
        />
        <Panel className="mx-auto max-w-4xl overflow-hidden" accent="#5865f2">
          <div className="grid items-center gap-6 bg-gradient-to-r from-[#5865f2]/25 to-transparent p-6 md:grid-cols-[auto_1fr_auto] md:p-8">
            <div className="grid h-16 w-16 place-items-center bg-[#5865f2] text-white">
              <Discord width={34} height={34} />
            </div>
            <div>
              <h3 className="display text-3xl font-extrabold">Join the community</h3>
              <p className="mt-1 text-steel">
                The {SITE.community} Discord is where applications, events, dev updates, and the people live.
              </p>
            </div>
            <DiscordButton label="Join Discord" />
          </div>
        </Panel>
        <div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY.filter((c) => c.icon !== 'discord').map((c) => {
            const Icon = ICONS[c.icon]
            return (
              <Panel key={c.title} className="flex gap-4 p-5">
                <Icon className="mt-0.5 shrink-0 text-holo" width={22} height={22} />
                <div>
                  <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.14em]">{c.title}</h3>
                  <p className="mt-1 text-sm text-steel">{c.body}</p>
                </div>
              </Panel>
            )
          })}
        </div>
      </div>
    </section>
  )
}
