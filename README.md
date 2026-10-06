# Squad Gaming Star Wars RP · S&box — Fan Website

Cinematic landing page for the Squad Gaming Community Star Wars Roleplay server, built for S&box.

> **Disclaimer.** This is an unofficial, non-profit **fan project and fan website** made purely for fun and entertainment. It is not affiliated with, endorsed by, sponsored by, or approved by Lucasfilm Ltd., The Walt Disney Company, or Facepunch Studios. Star Wars and all related names and marks are trademarks of Lucasfilm Ltd. and/or Disney; S&box is a trademark of Facepunch Studios. Nothing is sold and no money is made. All visuals are original stylized artwork rendered from primitives; no copyrighted models, logos, or imagery are used.

## Stack

- Vite + React + TypeScript, Tailwind CSS v4
- GSAP ScrollTrigger + Lenis for the smooth scroll, reveals and parallax
- A looping cinematic hero video and section stills, pre-rendered from an original three.js scene (no live 3D in the page, so it stays light on phones)

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
| Hero video, poster and section stills | `public/media/` (see below) |

Media: drop screenshots or clips into `public/media/` and set `src` on the entries in `MEDIA` (`src/content/content.ts`); until then the site shows stylised placeholder slots.

## Hero footage

The hero plays `public/media/hero-loop.webm` / `hero-loop.mp4` (muted, looping, `hero-poster.jpg` as poster and as the reduced-motion still). Section backdrops are `still-galaxy.jpg`, `still-fleet.jpg` and `still-wide.jpg`. To use real in-game footage, replace those files and keep the names; a 10 s seamless loop at 1920×1080 works best.

To re-render the original CG loop (fleet silhouettes over a planet limb) from `tools/render`:

```bash
npm run dev                                 # serves tools/render/index.html on :5173
npm run render -- out 240 1920 1080 loop    # 240 frames -> out/frame-0000.png ...
RENDER_SHOTS=galaxy,fleet,wide npm run render -- out 1 1920 1080 stills
ffmpeg -framerate 24 -i out/frame-%04d.png -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart public/media/hero-loop.mp4
ffmpeg -framerate 24 -i out/frame-%04d.png -c:v libvpx-vp9 -pix_fmt yuv420p -b:v 0 -crf 34 public/media/hero-loop.webm
```

Rendering needs Playwright's Chromium (`npx playwright install chromium`) and runs headless with software GL, so it takes a few minutes. Everything in the scene is a periodic function of the loop phase, which is what makes the last frame hand off cleanly to the first.

## Accessibility and performance

- Dedicated phone layout: hamburger menu, horizontal card scrollers, and an always-visible **Join Discord / Play Now** bar.
- `prefers-reduced-motion` turns off smooth scroll, reveals and parallax, and shows the hero poster instead of the video.
- No WebGL in the page: the footage is plain video and images, so low-end phones get the same look.
