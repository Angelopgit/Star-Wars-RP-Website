import { ABOUT_POINTS } from '../content/content'
import { DISCLAIMER_FULL, SITE } from '../content/site'
import { Panel, SectionHeader } from '../components/ui'

const DEPLOYMENT = [
  { n: '01', title: 'Stand aboard a Republic Venator', body: 'Your battalion musters in the hangar. Engines hum. The war is waiting.' },
  { n: '02', title: 'Receive your deployment briefing', body: 'Command lays out the objective. Your squad leader assigns your role.' },
  { n: '03', title: 'Land planetside with your squad', body: 'The gunship doors open. Sand, smoke, and blaster fire.' },
  { n: '04', title: 'Fight the Separatist advance', body: 'Hold the line, push the objective, and bring your brothers home.' },
  { n: '05', title: 'Return. Progress. Become legend.', body: 'Debrief, earn your rank, and carry your story into the next campaign.' },
]

export function About() {
  return (
    <section id="about" data-shot="about" className="section">
      <div className="container-x">
        <div className="mb-24 text-center md:mb-36" data-reveal>
          <p className="kicker">Priority broadcast</p>
          <p className="display metal-text text-glow mt-5 text-[clamp(2.6rem,9vw,8rem)] font-extrabold">
            The Republic
            <br />
            needs you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              kicker="About the project"
              title={
                <>
                  The roleplay you loved.
                  <br />
                  Evolved.
                </>
              }
              sub={
                <>
                  We are taking the foundation players loved from Garry&rsquo;s Mod Star Wars RP and rebuilding it from the ground up in S&amp;box. Created
                  and run by {SITE.community}, built and designed by and for the community.
                </>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT_POINTS.map((p) => (
                <Panel key={p.title} className="p-5">
                  <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.2em] text-holo">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{p.body}</p>
                </Panel>
              ))}
            </div>
            <Panel className="mt-4 p-5" accent="#ffc457">
              <p className="hud text-[0.62rem] text-gold">Fan project notice</p>
              <p className="mt-2 text-xs leading-relaxed text-steel">{DISCLAIMER_FULL}</p>
            </Panel>
          </div>

          <div className="lg:pt-24">
            <Panel className="scanlines p-6 md:p-8">
              <p className="kicker">Deployment sequence</p>
              <p className="mt-2 text-sm text-steel">This is the fantasy. This is what a night on the server feels like.</p>
              <ol className="relative mt-8 space-y-7 border-l border-holo/30 pl-6">
                {DEPLOYMENT.map((d) => (
                  <li key={d.n} className="relative" data-reveal>
                    <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rotate-45 bg-holo shadow-[0_0_12px_#5cc8ff]" />
                    <span className="hud text-[0.62rem] text-holo">Step {d.n}</span>
                    <h3 className="display mt-1 text-xl font-bold text-ink md:text-2xl">{d.title}</h3>
                    <p className="mt-1 text-sm text-steel">{d.body}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  )
}
