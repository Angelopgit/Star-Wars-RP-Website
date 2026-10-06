// Renders the hero loop frames and section stills from the harness page.
// Usage: node tools/render/render.mjs <outDir> [frames] [width] [height] [mode: loop|stills|both]
// Requires `npx vite --port 5173` running. Needs playwright + a Chromium (uses /opt/pw-browsers or PLAYWRIGHT_CHROMIUM).
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const [out = 'render-out', framesArg = '240', wArg = '1920', hArg = '1080', mode = 'both'] = process.argv.slice(2)
const frames = Number(framesArg)
const width = Number(wArg)
const height = Number(hArg)
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.error('PAGEERROR', e.message))
await page.goto('http://localhost:5173/tools/render/index.html', { waitUntil: 'networkidle' })
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 })
// warm up shaders
await page.evaluate(() => window.__render(0, 'hero'))
await page.evaluate(() => window.__render(0, 'hero'))

if (mode === 'loop' || mode === 'both') {
  const t0 = Date.now()
  for (let i = 0; i < frames; i++) {
    // The dev server reloads the page when config files change; wait until the harness is back.
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 })
    await page.evaluate((t) => window.__render(t, 'hero'), i / frames)
    await page.screenshot({ path: `${out}/frame-${String(i).padStart(4, '0')}.png`, clip: { x: 0, y: 0, width, height } })
    if (i % 24 === 0) console.log(`frame ${i}/${frames} ${((Date.now() - t0) / 1000).toFixed(0)}s`)
  }
}
if (mode === 'stills' || mode === 'both') {
  for (const shot of (process.env.RENDER_SHOTS || 'hero,galaxy,fleet,wide').split(',')) {
    await page.evaluate((s) => window.__render(0.13, s), shot)
    await page.screenshot({ path: `${out}/still-${shot}.png`, clip: { x: 0, y: 0, width, height } })
    console.log('still', shot)
  }
}
await browser.close()
