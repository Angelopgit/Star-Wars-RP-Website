const BASE = import.meta.env.BASE_URL

/**
 * Pre-rendered still behind a section. The frames come from the offline render harness
 * (`tools/render`), so the page ships plain images instead of a live 3D scene.
 * `data-parallax` lets App drift the image a little slower than the page scroll.
 */
export function Backdrop({
  name,
  position = '50% 50%',
  opacity = 0.85,
  className = '',
}: {
  name: 'galaxy' | 'fleet' | 'wide'
  position?: string
  opacity?: number
  className?: string
}) {
  return (
    <div className={`backdrop ${className}`} aria-hidden>
      <img src={`${BASE}media/still-${name}.jpg`} alt="" loading="lazy" decoding="async" data-parallax style={{ objectPosition: position, opacity }} />
    </div>
  )
}

/** Looping cinematic hero video, with the first frame as poster and a still for reduced motion. */
export function HeroMedia({ reduced }: { reduced: boolean }) {
  const poster = `${BASE}media/hero-poster.jpg`
  return (
    <div className="hero-media" aria-hidden>
      {reduced ? (
        <img src={poster} alt="" />
      ) : (
        <video autoPlay muted loop playsInline preload="auto" poster={poster} data-parallax>
          <source src={`${BASE}media/hero-loop.webm`} type="video/webm" />
          <source src={`${BASE}media/hero-loop.mp4`} type="video/mp4" />
        </video>
      )}
      <div className="scene-grade" />
    </div>
  )
}
