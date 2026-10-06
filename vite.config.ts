import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the static build works on GitHub Pages project URLs and any host.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
