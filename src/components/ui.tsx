import type { CSSProperties, ReactNode } from 'react'
import { SITE } from '../content/site'
import { Discord, Play } from './Icons'

export function SectionHeader({
  kicker,
  title,
  sub,
  align = 'left',
  id,
}: {
  kicker: string
  title: ReactNode
  sub?: ReactNode
  align?: 'left' | 'center'
  id?: string
}) {
  const center = align === 'center'
  return (
    <header className={`mb-10 md:mb-14 ${center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`} data-reveal>
      <div className={`flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-holo" />
        <span className="kicker">{kicker}</span>
      </div>
      <h2 id={id} className="display metal-text mt-4 text-[clamp(2.1rem,5.5vw,4.4rem)] font-bold">
        {title}
      </h2>
      {sub && <p className="mt-5 text-base leading-relaxed text-steel md:text-lg">{sub}</p>}
    </header>
  )
}

export function Panel({
  children,
  className = '',
  accent,
  style,
}: {
  children: ReactNode
  className?: string
  accent?: string
  style?: CSSProperties
}) {
  return (
    <div className={`holo ${className}`} style={{ ...(accent ? ({ '--accent': accent } as CSSProperties) : {}), ...style }}>
      {children}
    </div>
  )
}

export function DiscordButton({ className = '', label = 'Join the Community' }: { className?: string; label?: string }) {
  return (
    <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className={`btn btn-primary ${className}`}>
      <Discord /> {label}
    </a>
  )
}

export function PlayButton({ className = '', label = 'Play Now' }: { className?: string; label?: string }) {
  return (
    <a href={SITE.playUrl} className={`btn btn-red ${className}`}>
      <Play /> {label}
    </a>
  )
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="hud inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-[0.64rem] text-ink/85"
      style={color ? { borderColor: `${color}55` } : undefined}
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />}
      {children}
    </span>
  )
}

/** Placeholder for screenshots and clips. Pass `src` once real media exists. */
export function MediaSlot({
  hue = 210,
  label,
  video,
  src,
  className = '',
}: {
  hue?: number
  label: string
  video?: boolean
  src?: string
  className?: string
}) {
  if (src) {
    return video ? (
      <video className={`h-full w-full object-cover ${className}`} src={src} autoPlay muted loop playsInline />
    ) : (
      <img className={`h-full w-full object-cover ${className}`} src={src} alt={label} loading="lazy" />
    )
  }
  return (
    <div className={`media-slot scanlines relative flex h-full w-full items-end overflow-hidden ${className}`} style={{ '--h': hue } as CSSProperties}>
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute left-3 top-3 hud flex items-center gap-2 text-[0.6rem] text-white/70">
        <span className="pulse-dot text-sep" /> {video ? 'Clip slot' : 'Screenshot slot'}
      </div>
      {video && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-black/30 backdrop-blur">
            <Play />
          </span>
        </div>
      )}
      <p className="relative z-10 p-3 font-ui text-sm font-semibold uppercase tracking-widest text-white/90">{label}</p>
    </div>
  )
}
