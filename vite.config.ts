import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/devfest/',
  build: { outDir: 'dist/devfest' },
  plugins: [react(), tailwindcss()],
})
