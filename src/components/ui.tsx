import type { CSSProperties, ReactNode } from 'react'
import { SITE } from '../content/site'
import { Arrow } from './Icons'

/** Act header: large faint number, mono label, condensed title. */
export function ActHeader({
  number,
  label,
  title,
  lede,
  align = 'left',
  className = '',
}: {
  number: string
  label: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : align === 'right' ? 'ml-auto text-left' : ''
  return (
    <header className={`relative flex max-w-2xl flex-col ${alignCls} ${className}`} data-reveal>
      <span className={`act-number absolute -top-10 ${align === 'right' ? 'right-0' : '-left-2'} md:-top-16`} aria-hidden>
        {number}
      </span>
      <p className="label relative">
        <span className="label-blue">{number}</span> // {label}
      </p>
      <h2 className="display title-glow relative mt-5 text-[clamp(2.2rem,4.6vw,3.9rem)] text-ink">{title}</h2>
      {lede && <p className="lede relative mt-5 max-w-xl">{lede}</p>}
    </header>
  )
}

/** Mono data line such as "SECTOR // OUTER RIM". */
export function Data({ k, v, className = '' }: { k: string; v: ReactNode; className?: string }) {
  return (
    <p className={`label flex gap-2 ${className}`}>
      <span className="text-steel/70">{k}</span>
      <span className="text-steel/50">//</span>
      <span className="text-ink/85">{v}</span>
    </p>
  )
}

export function Panel({ children, className = '', solid, tick, style }: { children: ReactNode; className?: string; solid?: boolean; tick?: boolean; style?: CSSProperties }) {
  return (
    <div className={`panel ${solid ? 'panel-solid' : ''} ${tick ? 'tick' : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}

export function DiscordButton({ className = '', label = 'Join the Community' }: { className?: string; label?: string }) {
  return (
    <a href={SITE.discordUrl} target="_blank" rel="noreferrer" className={`btn btn-primary ${className}`}>
      {label}
    </a>
  )
}

export function PlayButton({ className = '', label = 'Play Now' }: { className?: string; label?: string }) {
  return (
    <a href={SITE.playUrl} className={`btn btn-red ${className}`}>
      {label}
    </a>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="label label-blue inline-flex items-center gap-2 transition hover:text-ink">
      {children} <Arrow width={14} height={14} />
    </a>
  )
}

/** Placeholder for promotional captures. Pass `src` once real media exists. */
export function Frame({
  hue = 210,
  label,
  video,
  src,
  className = '',
  caption,
}: {
  hue?: number
  label: string
  video?: boolean
  src?: string
  className?: string
  caption?: string
}) {
  const media = src ? (
    video ? (
      <video className="h-full w-full object-cover" src={src} autoPlay muted loop playsInline />
    ) : (
      <img className="h-full w-full object-cover" src={src} alt={label} loading="lazy" />
    )
  ) : (
    <div className="frame-slot h-full w-full" style={{ '--h': hue } as CSSProperties}>
      <div className="absolute inset-0 grid-fine" />
      <p className="label absolute left-4 top-4 text-[0.6rem]">
        {video ? 'Capture // clip pending' : 'Capture // still pending'}
      </p>
    </div>
  )
  return (
    <figure className={`relative overflow-hidden border border-line ${className}`}>
      {media}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-space/90 to-transparent p-4">
        <span className="display text-base text-ink">{label}</span>
        {caption && <span className="label text-[0.58rem]">{caption}</span>}
      </figcaption>
    </figure>
  )
}
