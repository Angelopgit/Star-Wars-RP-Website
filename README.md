# Squad Gaming Star Wars RP · S&box — Fan Website

Cinematic landing page for the Squad Gaming Community Star Wars Roleplay server, built for S&box.

> **Disclaimer.** This is an unofficial, non-profit **fan project and fan website** made purely for fun and entertainment. It is not affiliated with, endorsed by, sponsored by, or approved by Lucasfilm Ltd., The Walt Disney Company, or Facepunch Studios. Star Wars and all related names and marks are trademarks of Lucasfilm Ltd. and/or Disney; S&box is a trademark of Facepunch Studios. Nothing is sold and no money is made. All 3D visuals are original stylized artwork built from primitives; no copyrighted models, logos, or imagery are used.

## Stack

- Vite + React + TypeScript
- three.js via react-three-fiber / drei for the scroll-driven 3D scene (clone battalions, droid line, capital ships, procedural planets, hologram)
- GSAP ScrollTrigger + Lenis for the smooth "3D motion video" scroll
- Tailwind CSS v4 for layout

## Develop

```bash
npm install
npm run dev
```

`npm run build` type-checks and produces a static `dist/` folder. `.github/workflows/deploy.yml` publishes it to GitHub Pages on every push to `main` (enable Pages → "GitHub Actions" in the repo settings once).

## Where to edit

| What | File |
| --- | --- |
| Discord invite, Play / connect link, names | `src/content/site.ts` |
| Factions, battalion colours | `src/content/factions.ts` |
| Planets | `src/content/planets.ts` |
| Everything else (about, features, events, roadmap, news, media slots, how to play, why us) | `src/content/content.ts` |
| Camera shots per section, scene layout | `src/scene/Experience.tsx` (`SHOTS` / `SHOTS_MOBILE`) |

Media: drop screenshots or clips into `public/media/` and set `src` on the entries in `MEDIA` (`src/content/content.ts`); until then the site shows stylised placeholder slots.

## Accessibility and performance

- Dedicated phone layout: hamburger menu, horizontal card scrollers, and an always-visible **Join Discord / Play Now** bar.
- `prefers-reduced-motion` turns off smooth scroll, reveal animations, and the camera flight; the scene renders as a still.
- If WebGL is unavailable the scene falls back to a static gradient backdrop.
