import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: resolve(projectRoot, 'business'),
  publicDir: resolve(projectRoot, 'public'),
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: resolve(projectRoot, 'tailwind.config.js') }),
        autoprefixer(),
      ],
    },
  },
  build: {
    outDir: resolve(projectRoot, 'dist-business'),
    emptyOutDir: true,
  },
})
