// Tracks section positions so the 3D camera can fly between shots as the page scrolls.
export type Anchor = { id: string; top: number }

export const scroll = {
  y: 0,
  vh: 1,
  anchors: [] as Anchor[],
}

export function measureAnchors() {
  scroll.vh = window.innerHeight
  scroll.y = window.scrollY
  scroll.anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'))
    .map((el) => ({ id: el.dataset.shot!, top: el.getBoundingClientRect().top + window.scrollY }))
    .sort((a, b) => a.top - b.top)
}

/** Current pair of shots and blend amount, based on the viewport centre. */
export function currentBlend(): { from: string; to: string; t: number } {
  const a = scroll.anchors
  if (!a.length) return { from: 'hero', to: 'hero', t: 0 }
  const probe = scroll.y + scroll.vh * 0.5
  let i = 0
  while (i < a.length - 1 && a[i + 1].top <= probe) i++
  const cur = a[i]
  const next = a[Math.min(i + 1, a.length - 1)]
  if (cur === next || probe < cur.top) return { from: cur.id, to: cur.id, t: 0 }
  const raw = (probe - cur.top) / Math.max(1, next.top - cur.top)
  // Hold on each shot for the first part of its section, then glide to the next.
  return { from: cur.id, to: next.id, t: smoothstep(0.3, 1, raw) }
}

function smoothstep(e0: number, e1: number, x: number) {
  const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return k * k * (3 - 2 * k)
}
