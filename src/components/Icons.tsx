import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({ width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p })

export const Play = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
  </svg>
)
export const Arrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Down = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)
export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)
export const Cross = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
export const Film = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M10 9.5v5l4-2.5z" fill="currentColor" />
  </svg>
)
export const Camera = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)
export const Discord = (p: P) => (
  <svg {...base(p)} viewBox="0 0 24 24" stroke="none" fill="currentColor">
    <path d="M19.6 5.4A16.8 16.8 0 0 0 15.4 4l-.5 1.1a15.6 15.6 0 0 0-5.8 0L8.6 4a16.8 16.8 0 0 0-4.2 1.4C1.7 9.4 1 13.3 1.3 17.1a17 17 0 0 0 5.2 2.6l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a12 12 0 0 0 11.4 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7ZM8.5 14.8c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm7 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
  </svg>
)
export const Star = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.4l-5.6 4.1 2.1-6.7-5.5-4h6.8z" />
  </svg>
)
export const Users = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .6 3.2 2.5 3.5 5.5" />
  </svg>
)
export const Medal = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="15" r="5" />
    <path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8" />
  </svg>
)
export const Spark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
)
export const Code = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </svg>
)
export const Calendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

/** Original emblem for the site (not a canon faction symbol). */
export const Emblem = (p: P) => (
  <svg viewBox="0 0 64 64" width={36} height={36} aria-hidden {...p}>
    <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <path d="M32 9 L36 27 L55 32 L36 37 L32 55 L28 37 L9 32 L28 27 Z" fill="currentColor" />
    <circle cx="32" cy="32" r="4" fill="#d6313b" />
  </svg>
)
